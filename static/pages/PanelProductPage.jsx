import React from "react";
import ProductBox from "../components/ProductBox.jsx";

/**
 * Page shows detail information of product.
 */
export default class ProductPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch("/api/products/" + this.props.match.params.id)
            .then(function (response) {
                console.log(response.status);
                if (response.status != 200) {
                    throw new Error("Error!");
                }
                return response.json();
            })
            .then(function (json) {
                console.log(json);
                this.setState({
                    product: json,
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
            <div>
                {
                    this.state.product && this.renderProduct()
                }


            </div>
            {
                this.renderAlert(this.state.status)
            }
        </React.Fragment>;
    }

    renderProduct() {
        console.log("renderProduct");
        return <ProductBox tabs={["Каталог", "Вентиляция", "ПВУ"]}
                           title={this.state.product.title}
                           image={'/public/' + this.state.product.img}>

            {this.state.product && this.renderForm()}
        </ProductBox>
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

    renderForm() {
        return <form>
            <label htmlFor="description">Описание:</label>
            <textarea className="form-control" rows="5" id="description"
                      placeholder="Описание товара"
                      onChange={this.onChange.bind(this)}
                      value={this.state.product.description}/>
        </form>;
    }

    onChange(event) {
        this.state.product.description = event.target.value;
        this.forceUpdate();
    }
}