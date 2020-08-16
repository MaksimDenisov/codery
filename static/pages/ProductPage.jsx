import React from "react";
import ProductBox from "../components/ProductBox.jsx";

/**
 * Page shows detail information of product.
 */
export default class ProductPage extends React.Component {

    render() {
        let fakes = [{name: 'ПВУ Turkov ZENIT 350 HECO', image: '/public/product1.png'},
            {name: 'ПВУ Turkov ZENIT 350 HECO ИСП.2', image: '/public/product2.png'}];
        let index = this.props.match.params.product - 1;
        return <React.Fragment>
            <ProductBox tabs={["Каталог", "Вентиляция", "ПВУ"]}
                        title={fakes[index].name}
                        image={fakes[index].image}>
                Вентиляционная установка с рекуперацией тепла и влаги в легком м универсальном
                корпусе
                из вспененного
                полипропилена предназначена для поддержания климата в жилых помещениях, или
                небольших
                офисах, магазинах.
            </ProductBox>
        </React.Fragment>;
    }
}