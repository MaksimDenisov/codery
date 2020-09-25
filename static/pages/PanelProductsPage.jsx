import React from "react";
import {Link} from "react-router-dom";

/**
 * Page shows list of product.
 */
export default class ProductListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'idle',
            newProduct: {
                title: '',
                img: 'no_image.png',
                slug: '',
                key: '0',
                description: '',
                price: 100
            }
        }
    }

    componentDidMount() {
        this.setState({status: 'pending'});
        fetch("/api/products")
            .then(function (response) {
                console.log(response.status);
                if (response.status != 200) {
                    throw new Error("Error!");
                }
                return response.json();
            })
            .then(function (json) {
                this.setState({
                    products: json,
                    status: 'ready'
                });
            }.bind(this))
            .catch(function (ex) {
                this.setState({
                    status: 'error'
                });
            }.bind(this));
    }

    render() {
        return <React.Fragment>
            <main>
                {
                    this.renderForm()
                }
                <div className="row mt-3">
                    {
                        this.state.products && this.renderProducts()
                    }
                </div>
            </main>
            {
                this.renderAlert(this.state.status)
            }
        </React.Fragment>;
    }

    renderProducts() {
        return this.state.products.map((item, index) => {
            return <div className={'col-5 col-sm-4 mt-3' + ((index % 2 == 0) ? ' offset-1 offset-sm-2' : '')}>
                <div className="row">
                    <h3>{item.title}</h3>
                    <img className="col-6 offset-3 img-fluid" src={'/public/' + item.img}/>
                </div>
                <div className="row mt-3 mb-3">
                    <div className="col-3 offset-3  pl-0">
                        <Link className="btn btn-primary font-weight-bold"
                              to={'/panel/product/' + item._id}>Заказать</Link>
                    </div>
                </div>
            </div>;
        });
    }


    renderForm() {
        return <form>
            <div className="row mt-3">
                <div className='col-5 col-sm-4 mt-3  offset-1 offset-sm-2'>
                    <label htmlFor="title">Название:</label>
                    <input className="form-control" id="title"
                           name="title"
                           onChange={this.onChange.bind(this)}
                           value={this.state.newProduct.title}/>

                    <label htmlFor="description">Описание:</label>
                    <textarea className="form-control" rows="5" id="description"
                              name="description"
                              onChange={this.onChange.bind(this)}
                              value={this.state.newProduct.description}/>
                </div>
                <div className='col-5 col-sm-4 mt-3'>
                    <label htmlFor="key">Key:</label>
                    <input className="form-control" id="key"
                           name="key"
                           type="number"
                           onChange={this.onChange.bind(this)}
                           value={this.state.newProduct.key}/>

                    <label htmlFor="slug">Slug:</label>
                    <input className="form-control" id="slug"
                           name="slug"
                           onChange={this.onChange.bind(this)}
                           value={this.state.newProduct.slug}/>

                    <button className="btn btn-danger font-weight-bold mt-3"
                            onClick={this.onSave.bind(this)}>
                        Сохранить
                    </button>
                </div>
            </div>
        </form>;
    }


    onSave(event) {
        event.preventDefault();
        fetch(`/api/products`, {
            method: "POST",
            body: JSON.stringify(this.state.newProduct),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            if (response.status != 200) {
                throw new Error("Error!");
            }
            return response.json();
        })
            .then(function (insertedProduct) {
                this.setState({
                    status: 'saved'
                });
                this.state.newProduct = {
                    title: '',
                    img: '',
                    slug: '',
                    key: '0',
                    description: '',
                    price: 100
                };
                this.state.products.push(insertedProduct);
                this.forceUpdate();
            }.bind(this))
            .catch(function (result) {

                this.setState({
                    status: 'error'
                });
            }.bind(this));
    }

    onChange(event) {
        const name = event.target.name;
        this.state.newProduct[name] = event.target.value;
        this.forceUpdate();
    }

    renderAlert(status) {
        let className;
        let message;
        switch (status) {
            case 'ready':
                className = "alert alert-primary";
                message = 'Success';
                break;
            case 'error':
                className = "alert alert-danger";
                message = 'Error';
                break;
            case 'saved':
                className = "alert  alert-success";
                message = 'Saved';
                break;
            default:
                return false;
        }
        return <div className={className} role="alert">
            {message}
        </div>;
    }
}
