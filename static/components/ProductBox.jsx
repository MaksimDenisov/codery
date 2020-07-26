import React from "react";
import Breadcrumb from "./Breadcrumb.jsx";
import Nav from "./Nav.jsx";


/**
 *  This component shows product card with image and order button.
 *
 *  Uses attributes.
 *  ---------------
 *  Tabs - parent categories of product.
 *  Title - short  name of product.
 *  Image  - Image of product.
 *  Inner text for detail information of product.
 */
export default class ProductBox extends React.Component {
    render() {
        return <main className="row mt-3">
            <div className="col-10 offset-1 col-sm-8 offset-sm-2">
                <Breadcrumb tabs={this.props.tabs}/>
                <div className="row">
                    <div className="col-12">
                        <h1 className="font-weight-bold"> {this.props.title}</h1>
                    </div>
                </div>
                <Nav tabs={["Описание", "Характеристики", "Отзывы"]} className="nav nav-tabs"/>
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="row">
                            <img className="col-3 img-fluid"
                                 src={this.props.image}/>
                            <div className="col-9 font-weight-bold border-bottom pl-0">
                                {this.props.children}
                            </div>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col-3 offset-3  pl-0">
                                <button className="btn btn-primary font-weight-bold">Заказать</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    }
}