import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Nav from "../components/Nav.jsx";
import ProductPage from "./ProductPage.jsx";
import ProductListPage from "./ProductListPage.jsx";
import Footer from "../components/Footer.jsx";

import {createBrowserHistory} from "history";

const history = createBrowserHistory();

export default class IndexPage extends React.Component {
    render() {
        return <Router history={history}>
            <header className="row bg-primary font-weight-bold">
                <div className="col-10 offset-1 col-sm-8 offset-sm-2 navbar navbar-expand-lg navbar-dark bg-primary">
                    <Nav tabs={["Каталог", "Доставка", "Гарантии", "Контакты"]} className="navbar-nav"/>
                </div>
            </header>
            <Switch>
                <Route exact path="/" component={ProductListPage}/>
                <Route path="/products/:product" component={ProductPage}/>
            </Switch>
            < Footer name="@ Codery.camp, 2019"/>
        </Router>;
    }
}