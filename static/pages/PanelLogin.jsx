import React from "react";

const Cookie = require('cookie');
const jwt = require('jsonwebtoken');
const messages = require('../config/Messages.js');
const HttpStatus = require('../config/HttpStatus.js');

export default class PanelLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "idle",
            credentials: {
                login: "",
                password: ""
            }
        };
        try {
            const cookies = Cookie.parse(document.cookie);
            const payload = jwt.decode(cookies.token);
            const timestampInSeconds = new Date().getTime();
            if ((payload.exp * 1000) > timestampInSeconds) {
                this.state.status = 'logged';
            }
        } catch (err) {
        }
    }


    render() {
        return <React.Fragment>
            {
                this.state.status !== "logged" && this.renderForm()
            }
            {
                this.state.status === "logged" && this.renderLogout()
            }
            {
                this.state.status !== "idle" && this.renderAlert(this.state.status)

            }
        </React.Fragment>;
    }

    renderForm() {
        return <form>
            <div className="row mt-3">
                <div className='col-5 col-sm-4 mt-3  offset-1 offset-sm-2'>
                    <label htmlFor="title">{messages.login.LOGIN_TITLE}</label>
                    <input className="form-control" id="login"
                           name="login"
                           onChange={this.onChange.bind(this)}
                           value={this.state.credentials.login}/>

                    <label htmlFor="description">{messages.login.PASSWORD_TITLE}</label>
                    <input className="form-control" id="password" type="password"
                           name="password"
                           onChange={this.onChange.bind(this)}
                           value={this.state.credentials.password}/>
                    <button className="btn btn-danger font-weight-bold mt-3"
                            onClick={this.onSave.bind(this)}>
                        {messages.login.LOGIN_BUTTON}
                    </button>
                </div>
            </div>
        </form>
    }

    renderLogout() {
        return <button className="btn btn-danger font-weight-bold mt-3"
                       onClick={this.logout.bind(this)}>
            {messages.login.LOGOUT_BUTTON}
        </button>
    }

    onSave(event) {
        event.preventDefault();
        this.state.status = "pending";
        this.forceUpdate();
        fetch(`/api/login`, {
            method: "POST",
            credentials: "same-origin",
            body: JSON.stringify(this.state.credentials),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            console.log(response);
            if (response.status === HttpStatus.OK) {
                this.state.status = "logged";
            }
            if (response.status === HttpStatus.FORBIDDEN) {
                this.state.status = "error";
            }
            this.forceUpdate();
        }.bind(this)).catch(function (response) {
            this.state.status = "error";
            this.forceUpdate();
        }.bind(this));

    }

    logout() {
        document.cookie = 'token=; Path=/; Max-Age=0;';
        this.state.status = "idle";
        this.forceUpdate();
    }

    onChange(event) {
        const name = event.target.name;
        this.state.credentials[name] = event.target.value;
        this.forceUpdate();
    }

    renderAlert(status) {
        let className;
        let message;
        switch (status) {
            case 'pending':
                className = "alert alert-primary";
                message = messages.login.SENDING_CREDENTIALS;
                break;
            case 'error':
                className = "alert alert-danger";
                message = messages.common.INCORRECT_LOGIN_OR_PASSWORD;
                break;
            case 'logged':
                className = "alert alert-success";
                message = messages.login.LOGIN_SUCCESS;
                break;
            default:
                return false;
        }
        return <div className={className} role="alert">
            {message}
        </div>;
    }
}

