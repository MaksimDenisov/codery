import React from "react";
const messages = require('./config/Messages.js');

export default class NotFoundPage extends React.Component {
    render() {
        return <React.Fragment>
            <main>
                <div className="row mt-3">
                    <h1>{messages.common.PAGE_NOT_FOUND}</h1>
                </div>
            </main>
        </React.Fragment>;
    }
}