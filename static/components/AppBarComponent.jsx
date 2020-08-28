import Nav from "./Nav.jsx";
import React from "react";


export default class AppBarComponent extends React.Component {
    render() {
        return <header className="row bg-primary font-weight-bold">
            <div className="col-10 offset-1 col-sm-8 offset-sm-2 navbar navbar-expand-lg navbar-dark bg-primary">
                <Nav tabs={["Каталог", "Доставка", "Гарантии", "Контакты"]} className="navbar-nav"/>
            </div>
        </header>
    }
};