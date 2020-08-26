import React from "react";
import ProductBox from "../components/ProductBox.jsx";
import Redirect from "react-router-dom/es/Redirect";

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
                console.log(response.status);
                if (response.status != 200) {
                    throw new Error("Error!");
                }
                return response.json();
            })
            .then(function (json) {
                console.log(json);
                const slug = json[0].slug;
                if (slug != keyAndSlug.slug) {
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
            {
                this.renderAlert(this.state.status)
            }
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