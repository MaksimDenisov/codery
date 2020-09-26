import React from "react";
import Route from "react-router-dom/es/Route";
import Redirect from "react-router-dom/es/Redirect";

const Cookie = require('cookie');
const jwt = require('jsonwebtoken');

export default class ProtectedRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.isAuthorized = false;
        try {
            const cookies = Cookie.parse(document.cookie);
            const payload = jwt.decode(cookies.token);
            const timestampInSeconds = new Date().getTime();
            if ((payload.exp * 1000) > timestampInSeconds) {
                this.state.isAuthorized = true;
            }
        } catch (err) {
        }
    }

    render() {
        if (this.state.isAuthorized) {
            return <Route {...this.props} />;
        } else {
            return <Redirect to="/panel/login" from={this.props.path}/>;
        }
    }
}