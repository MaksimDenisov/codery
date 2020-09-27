import React from "react";
import ProductBox from "../components/ProductBox.jsx";
import Redirect from "react-router-dom/es/Redirect";
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
        const keyAndSlug = this.parseKeyAndSlug(this.props.match.params.product);
        fetch("/api/products?key=" + keyAndSlug.key)
            .then(function (response) {
                if (response.status !== HttpStatus.OK) {
                    throw new Error(messages.alert.ERROR);
                }
                return response.json();
            })
            .then(function (json) {
                const slug = json[0].slug;
                if (slug !== keyAndSlug.slug) {
                    this.setState({
                        redirect: json[0].key + '-' + json[0].slug
                    });
                }
                this.setState({
                    product: json[0],
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
                    this.state.redirect && this.renderRedirect()
                }
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
                           image={'../public/' + this.state.product.img}>
            {this.state.product.description}
        </ProductBox>
    }


    /**
     * Get key and slug of product.
     * @param keyAndSlug from url
     * @returns {{key: string, slug: string}}  Key and slug of product.
     */
    parseKeyAndSlug(keyAndSlug) {
        const parts = keyAndSlug.split('-');
        const key = parts[0];
        const slug = keyAndSlug.slice(key.length + 1);
        return {
            key: key,
            slug: slug
        };
    }

    renderRedirect() {
        return <Redirect to={this.state.redirect}/>
    }
}