import React from "react";
import {Link} from "react-router-dom";

/**
 * Page shows list of product.
 */
export default class ProductListPage extends React.Component {

    render() {
        return <React.Fragment>
            <main>
                <div className="row mt-3">
                    <div className="col-5 col-sm-4 mt-3 offset-1 offset-sm-2">
                        <div className="row">
                            <h3>ПВУ Turkov ZENIT 350 HECO</h3>
                            <img className="col-6 offset-3 img-fluid" src="public/product1.png"/>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col-3 offset-3  pl-0">
                                <Link className="btn btn-primary font-weight-bold" to="/products/1">Заказать</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-5 col-sm-4 mt-3">
                        <div className="row">
                            <h3>ПВУ Turkov ZENIT 350 HECO ИСП.2</h3>
                            <img className="col-6 offset-3  img-fluid" src="public/product2.png"/>
                        </div>
                        <div className="row mt-3 mb-3">
                            <div className="col-3 offset-3  pl-0">
                                <Link to="/products/2">
                                    <button className="btn btn-primary font-weight-bold">Заказать</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </React.Fragment>;
    }
}
