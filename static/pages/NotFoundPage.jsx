import React from "react";

export default class NotFoundPage extends React.Component {
    render() {
        return <React.Fragment>
            <main>
                <div className="row mt-3">
                    <h1> Введенная вами страница на сайте не обнаружена.</h1>
                </div>
            </main>
        </React.Fragment>;
    }
}