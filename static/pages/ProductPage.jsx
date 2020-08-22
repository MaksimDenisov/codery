import React from "react";
import ProductBox from "../components/ProductBox.jsx";

/**
 * Page shows detail information of product.
 */
export default class ProductPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        console.log('componentDidMount');
        console.log(this.props.match.params);
                fetch("/api/products?key=" + this.props.match.params.product)
                    .then(function (response) {
                        console.log(response.status);
                        if (response.status != 200) {
                            throw new Error("Error!");
                        }
                        return response.json();
                    })
                    .then(function (json) {
                        this.setState({
                            product: json[0],
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
            <div>
                {
                    this.state.product && this.renderProduct()
                }
            </div>
        </React.Fragment>;
    }

    renderProduct() {
        return <ProductBox tabs={["Каталог", "Вентиляция", "ПВУ"]}
                           title={this.state.product.title}
                           image={'../public/' + this.state.product.img}>
            {this.state.product.description}
        </ProductBox>
    }
}