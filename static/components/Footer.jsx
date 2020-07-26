import React from "react";

/**
 * This component shows Footer with text from name attribute.
 */
export default class Footer extends React.Component {
    render() {
        return <footer className="row footer fixed-bottom bg-dark">
            <div className="col-10 offset-1 col-sm-8 offset-sm-2">
                <p className="text-white mt-3 font-weight-bold">{this.props.name}</p>
            </div>
        </footer>;
    }
}
