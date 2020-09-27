import React from "react";
import ProductBox from "../components/ProductBox.jsx";
import Alert from "../components/Alert.jsx";

const messages = require('../config/Messages.js');
const HttpStatus = require('../config/HttpStatus.js');

/**
 * Page shows detail information of product.
 */
export default class ProductPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        fetch("/api/products/" + this.props.match.params.id, {
            method: "GET",
            credentials: "same-origin"
        })
            .then(function (response) {
                console.log(response.status);
                if (response.status === 401 || response.status === 403) {
                    this.gotoLoginPage();
                }
                if (response.status !== 200) {
                    throw new Error("Error!");
                }
                return response.json();
            }.bind(this))
            .then(function (json) {
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
            <Alert status={this.state.status}/>
        </React.Fragment>;
    }

    renderProduct() {
        return <ProductBox tabs={["Каталог", "Вентиляция", "ПВУ"]}
                           title={this.state.product.title}
                           image={'/public/' + this.state.product.img}
                           buttonText={messages.products.EDIT}>
            {this.state.product && this.renderForm()}
        </ProductBox>
    }

    renderForm() {
        return <form>
            <label htmlFor="title">{messages.products.TITLE_NAME} </label>
            <input className="form-control" id="title"
                   name="title"
                   onChange={this.onChange.bind(this)}
                   value={this.state.product.title}/>

            <label htmlFor="description">{messages.products.TITLE_DESCRIPTION}</label>
            <textarea className="form-control" rows="5" id="description"
                      name="description"
                      onChange={this.onChange.bind(this)}
                      value={this.state.product.description}/>

            <label htmlFor="key">{messages.products.TITLE_KEY}</label>
            <input className="form-control" id="key"
                   name="key"
                   type="number"
                   onChange={this.onChange.bind(this)}
                   value={this.state.product.key}/>

            <label htmlFor="slug">{messages.products.TITLE_SLUG}</label>
            <input className="form-control" id="slug"
                   name="slug"
                   onChange={this.onChange.bind(this)}
                   value={this.state.product.slug}/>

            <button className="btn btn-danger font-weight-bold"
                    onClick={this.onSave.bind(this)}>
                {messages.products.BUTTON_SAVE}
            </button>
        </form>;
    }

    onSave(event) {
        event.preventDefault();
        fetch(`/api/products/` + this.props.match.params.id, {
            credentials: "same-origin",
            method: "PUT",
            body: JSON.stringify(this.state.product),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(function (response) {
                if (response.status === HttpStatus.UNAUTHORIZED || response.status === HttpStatus.FORBIDDEN) {
                    this.gotoLoginPage();
                }
                this.setState({
                    status: 'saved'
                })
            }.bind(this))
            .catch(function (result) {
                this.setState({
                    status: 'error'
                });
            }.bind(this));
    }

    onChange(event) {
        const name = event.target.name;
        this.state.product[name] = event.target.value;
        this.forceUpdate();
    }

    gotoLoginPage() {
        window.location = "/panel/login";
    }
}