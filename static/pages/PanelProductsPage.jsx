import React from "react";
import {Link} from "react-router-dom";
import Alert from "../components/Alert.jsx";

const messages = require('../config/Messages.js');
const HttpStatus = require('../config/HttpStatus.js');
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
        fetch("/api/products", {
            method: "GET",
            credentials: "same-origin"
        })
            .then(function (response) {
                console.log(response.status);
                if (response.status === HttpStatus.UNAUTHORIZED || response.status === HttpStatus.FORBIDDEN) {
                    this.gotoLoginPage();
                }
                if (response.status !== 200) {
                    throw new Error(messages.alert.ERROR);
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
            <Alert status={this.state.status}/>
        </React.Fragment>;
    }

    renderProducts() {
        return this.state.products.map((item, index) => {
            return <div className={'col-5 col-sm-4 mt-3' + ((index % 2 === 0) ? ' offset-1 offset-sm-2' : '')}>
                <div className="row">
                    <h3>{item.title}</h3>
                    <img className="col-6 offset-3 img-fluid" src={'/public/' + item.img}/>
                </div>
                <div className="row mt-3 mb-3">
                    <div className="col-3 offset-3  pl-0">
                        <Link className="btn btn-primary font-weight-bold"
                              to={'/panel/product/' + item._id}>{messages.products.BUTTON_ORDER} </Link>
                    </div>
                </div>
            </div>;
        });
    }


    renderForm() {
        return <form>
            <div className="row mt-3">
                <div className='col-5 col-sm-4 mt-3  offset-1 offset-sm-2'>
                    <label htmlFor="title">{messages.products.TITLE_NAME} </label>
                    <input className="form-control" id="title"
                           name="title"
                           onChange={this.onChange.bind(this)}
                           value={this.state.newProduct.title}/>

                    <label htmlFor="description">{messages.products.TITLE_DESCRIPTION} </label>
                    <textarea className="form-control" rows="5" id="description"
                              name="description"
                              onChange={this.onChange.bind(this)}
                              value={this.state.newProduct.description}/>
                </div>
                <div className='col-5 col-sm-4 mt-3'>
                    <label htmlFor="key">{messages.products.TITLE_KEY} </label>
                    <input className="form-control" id="key"
                           name="key"
                           type="number"
                           onChange={this.onChange.bind(this)}
                           value={this.state.newProduct.key}/>

                    <label htmlFor="slug">{messages.products.TITLE_KEY} </label>
                    <input className="form-control" id="slug"
                           name="slug"
                           onChange={this.onChange.bind(this)}
                           value={this.state.newProduct.slug}/>

                    <button className="btn btn-danger font-weight-bold mt-3"
                            onClick={this.onSave.bind(this)}>
                        {messages.products.BUTTON_SAVE}
                    </button>
                </div>
            </div>
        </form>;
    }


    onSave(event) {
        event.preventDefault();
        fetch(`/api/products`, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(this.state.newProduct),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            if (response.status === HttpStatus.UNAUTHORIZED || response.status === HttpStatus.FORBIDDEN) {
                this.gotoLoginPage();
            }
            if (response.status !== HttpStatus.OK) {
                throw new Error(messages.alert.ERROR);
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

    gotoLoginPage() {
        window.location = "/panel/login";
    }
}
