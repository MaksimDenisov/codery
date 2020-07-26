import React from "react";


/**
 *  This component shows breadcrumb with items included in "tabs" attribute.
 */
export default class Breadcrumb extends React.Component {
    render() {
        const tabs = this.props.tabs.map((item, index) => {
            return <li className="breadcrumb-item"><a href="#">{item}</a></li>
        });
        return <div className="row">
            <nav className="col-12" aria-label="breadcrumb">
                <ol className="breadcrumb  font-weight-bold">
                    {tabs}
                </ol>
            </nav>
        </div>
    }
}
