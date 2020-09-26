import React from "react";

export default class PanelLogin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "idle",
            credentials: {
                login: "",
                password: ""
            }
        }
    }

    render() {
        return <React.Fragment>
            {
                this.state.status !== "logged" && this.renderForm()
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
                    <label htmlFor="title">Login:</label>
                    <input className="form-control" id="login"
                           name="login"
                           onChange={this.onChange.bind(this)}
                           value={this.state.credentials.login}/>

                    <label htmlFor="description">Password:</label>
                    <input className="form-control" id="password" type="password"
                           name="password"
                           onChange={this.onChange.bind(this)}
                           value={this.state.credentials.password}/>
                    <button className="btn btn-danger font-weight-bold mt-3"
                            onClick={this.onSave.bind(this)}>
                        Login
                    </button>
                </div>
            </div>
        </form>
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
            if (response.status === 200) {
                this.state.status = "logged";
            }
            if (response.status === 403) {
                this.state.status = "error";
            }
            this.forceUpdate();
        }.bind(this)).catch(function (response) {
            this.state.status = "error";
            this.forceUpdate();
        }.bind(this));

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
                message = 'Sending credentials';
                break;
            case 'error':
                className = "alert alert-danger";
                message = 'Error';
                break;
            case 'logged':
                className = "alert alert-success";
                message = 'Logged';
                break;
            default:
                return false;
        }
        return <div className={className} role="alert">
            {message}
        </div>;
    }
}

