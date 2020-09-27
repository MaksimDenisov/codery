import React from "react";

const messages = require('../config/Messages.js');

export default class Alert extends React.Component {
    render() {
        let className;
        let message;
        switch (this.props.status) {
            case 'ready':
                className = "alert alert-primary";
                message = messages.alert.READY;
                break;
            case 'error':
                className = "alert alert-danger";
                message = messages.alert.ERROR;
                break;
            case 'saved':
                className = "alert  alert-success";
                message = messages.alert.SAVED;
                break;
            case this.props.successStatus:
                className = "alert  alert-success";
                message = this.props.successMessage;
                break;
            default:
                return false;
        }
        return <div className={className} role="alert">
            {message}
        </div>;
    }
}
