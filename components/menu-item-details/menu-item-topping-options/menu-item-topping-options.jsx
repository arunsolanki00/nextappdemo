import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMenuItem, selectedItemSize } from "../../../redux/menu-item/menu-item.action";

const MenuItemToppingOptions = () => {
    const dispatch = useDispatch();
    let menuItemDetail = useSelector(({ menuitem }) => menuitem.menuitemdetaillist);
    let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size.filter(x => x.sizeselected == true);
    let selectedtopping = menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.filter(x => x.subparameterId == selectedsize[0].subparameterId);
    let selectedoption = selectedtopping != undefined && selectedtopping.length > 0 && selectedtopping[0].list.filter(x => x.optionselected == true);
    let lstoption = [];
    let optiontype = selectedoption != undefined && selectedoption.length > 0 &&
        selectedoption[0].type.map((data) => {
            if (lstoption.length === 0 || lstoption.find(x => x.suboptioncategoryname === data.suboptioncategoryname) === undefined)
                lstoption.push(data);
        })

    const selectedOptionClick = (item) => {
        let lstdefault = [];
        selectedoption[0].type.map((data) => {
            if (item.suboptioncategoryname == data.suboptioncategoryname)
                data.defaultSelection = item.suboptioncategoryname;
            else
                data.defaultSelection = null;

            lstdefault.push(data);
        })
        let lstobj = {
            optionselected: selectedoption[0].optionselected, subparameterId: selectedoption[0].subparameterId,
            name: selectedoption[0].name, maxSelection: selectedoption[0].maxSelection, type: lstdefault
        }
        selectedtopping[0].list.map((data) => {
            if (data.optionselected === true)
                data = lstobj;
            else
                data = data;
        })
        let objtopping = { subparameterId: selectedtopping[0].subparameterId, list: selectedtopping[0].list }

        menuItemDetail.topping.map((data) => {
            if (data.subparameterId === selectedsize[0].subparameterId)
                data = objtopping;
            else
                data = data;
        })
        dispatch(removeMenuItem());
        dispatch(selectedItemSize(menuItemDetail));
    }

    return (
        <>
            <ul className="nav nav-pills">
                {lstoption != undefined && lstoption.length > 0 && lstoption.map((data, index) => {
                    return (
                        <li key={Math.random()} className={data.defaultSelection != null && data.defaultSelection != false ? "active" : ""}>
                            <a data-toggle="pill" onClick={() => selectedOptionClick(data)}>{data.suboptioncategoryname}</a>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default MenuItemToppingOptions;