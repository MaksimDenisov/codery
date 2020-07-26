import React from "react";

/**
 *  This component shows navigation view with items included in "tabs" attribute.
 */
export default class Nav extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0
        }
    }

    render() {
        const tabs = this.props.tabs.map((item, index) => {
            return <a data-index={index}
                      className={this.state.activeIndex === index ? "nav-item nav-link active" : " nav-item nav-link"}
                      href="#">{item}</a>;
        });

        return <div className={this.props.className}>
            {tabs}
        </div>;
    }
};