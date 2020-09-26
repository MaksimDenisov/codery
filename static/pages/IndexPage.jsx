import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Footer from "../components/Footer.jsx";
import AppBarComponent from "../components/AppBarComponent.jsx";
import PanelAppBarComponent from "../components/PanelAppBarComponent.jsx";

import ProductPage from "./ProductPage.jsx";
import ProductListPage from "./ProductListPage.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import PanelProductsPage from "./PanelProductsPage.jsx";
import PanelProductPage from "./PanelProductPage.jsx";
import PanelLogin from "./PanelLogin.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import {createBrowserHistory} from "history";

const history = createBrowserHistory();

export default class IndexPage extends React.Component {

    render() {
        return <Router history={history}>
            <Switch>
                <Route path="/panel" component={PanelAppBarComponent}/>
                <Route path="*" component={AppBarComponent}/>
            </Switch>
            <Switch>
                <Route exact path="/" component={ProductListPage}/>
                <Route path="/products/:product" component={ProductPage}/>

                <Route exact path="/panel/login" component={PanelLogin}/>
                <ProtectedRoute exact path="/panel" component={PanelProductsPage}/>
                <ProtectedRoute exact path="/panel/product" component={PanelProductPage}/>
                <ProtectedRoute path="/panel/product/:id" component={PanelProductPage}/>

                <Route path="*" component={NotFoundPage}/>
            </Switch>
            < Footer name="@ Codery.camp, 2019"/>
        </Router>;
    }
}