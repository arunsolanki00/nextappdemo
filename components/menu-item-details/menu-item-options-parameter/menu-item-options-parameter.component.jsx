import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { removeMenuItem, selectedItemSize } from "../../../redux/menu-item/menu-item.action";
import { MenuItemOptionsParameterData } from "./menu-item-options-parameter.data";

const MenuItemOptionsParameter = () => {
    const dispatch = useDispatch();
    let menuItemDetail = useSelector(({ menuitem }) => menuitem.menuitemdetaillist);
    let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size.find(x => x.sizeselected == true);
    let selectedtopping = menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.find(x => x.subparameterId == selectedsize.subparameterId);

    const selectedToppingClick = (item) => {
        let lstoptiondata = [];
        let topdata = selectedtopping.list.map((data) => {
            if (item.name == data.name) data.optionselected = true;
            else data.optionselected = false;

            lstoptiondata.push(data);
        })
        let lsttopdata = [];
        let updatedata = menuItemDetail.topping.map((data) => {
            if (data.subparameterId == item.subparameterId) {
                let obj = { subparameterId: item.subparameterId, list: lstoptiondata }
                lsttopdata.push(obj);
            }
            else {
                lsttopdata.push(data);
            }
        })
        menuItemDetail.topping = lsttopdata;
        dispatch(removeMenuItem());
        dispatch(selectedItemSize(menuItemDetail));
    }

    return (
        <>
            <div className="col-lg-12 col-sm-12 col-xs-12">
                {selectedtopping != undefined && selectedtopping.list != undefined && selectedtopping.list.filter(x => x.displayStatus === true).map((item, index) => {
                    return (
                <a key={Math.random()} style={{ borderColor: item.isCompulsory === true ? "none" : "gainsboro" }}
                    className={item.optionselected ? "orange_price_btn orange_side_btn active" : "orange_price_btn orange_side_btn"}
                    onClick={() => selectedToppingClick(item)}>
                    {item.isCompulsory === true ? item.name + ' *' : item.name}
                </a>
                )
                })}
            </div>
        </>
    )
}

export default MenuItemOptionsParameter;
