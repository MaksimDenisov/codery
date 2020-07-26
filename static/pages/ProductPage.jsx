import React from "react";
import Nav from "../components/Nav.jsx";
import ProductBox from "../components/ProductBox.jsx";
import Footer from "../components/Footer.jsx";

/**
 * Page shows detail information of product.
 */
export default class ProductPage extends React.Component {

    render() {
        return <React.Fragment>
            <header className="row bg-primary font-weight-bold">
                <div className="col-10 offset-1 col-sm-8 offset-sm-2 navbar navbar-expand-lg navbar-dark bg-primary">
                    <Nav tabs={["Каталог", "Доставка", "Гарантии", "Контакты"]} className="navbar-nav"/>
                </div>
            </header>
            <ProductBox tabs={["Каталог", "Вентиляция", "ПВУ"]}
                        title="ПВУ Turkov ZENIT 350 HECO"
                        image="https://www.codery.school/content/course/lesson3-task-img.png">
                Вентиляционная установка с рекуперацией тепла и влаги в легком м универсальном
                корпусе
                из вспененного
                полипропилена предназначена для поддержания климата в жилых помещениях, или
                небольших
                офисах, магазинах.
            </ProductBox>
            <Footer name="@ Codery.camp, 2019"/>
        </React.Fragment>;
    }
}