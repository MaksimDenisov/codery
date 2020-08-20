import React from "react";
import {Link} from "react-router-dom";

/**
 * Page shows list of product.
 */
export default class ProductListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch("/api/products")
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                this.setState({products: json});
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
                        <Link className="btn btn-primary font-weight-bold" to="/products/1">Заказать</Link>
                    </div>
                </div>
            </div>;
        });
    }
}
