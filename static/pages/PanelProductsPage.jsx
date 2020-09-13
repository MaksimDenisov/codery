import React from "react";
import {Link} from "react-router-dom";

/**
 * Page shows list of product.
 */
export default class ProductListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 'idle'
        };
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
                console.log("Error in catch");
                this.setState({
                    status: 'error'
                });
            }.bind(this));
    }

    render() {
        return <React.Fragment>
            <main>
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
                    <h3>{item.description}</h3>
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
            default:
                return false;
        }
        return <div className={className} role="alert">
            {message}
        </div>;
    }
}
