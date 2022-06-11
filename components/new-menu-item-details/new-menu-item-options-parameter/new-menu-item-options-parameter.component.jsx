import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMenuItemDetailes, removeMenuItem, selectedItemSize, updateitemoption } from '../../../redux/menu-item/menu-item.action';
import NewMenuItemSubOptionsParameter from './new-menu-item-sub-options-parameter/new-menu-item-sub-options-parameter.component';

const NewMenuItemOptionsParameter = (props) => {
    const dispatch = useDispatch();
    const [count, setCount] = useState(Math.random);
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    let menuItemDetail = useSelector(({ menuitem }) => menuitem.menuitemdetaillist);
    let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size.find(x => x.sizeselected == true);
    let selectedtopping = menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.find(x => x.subparameterId == selectedsize.subparameterId);
    let selectedmenuitemdetail = useSelector(({ menuitem }) => menuitem.selectedmenuitemdetail)
    let selectedoption = selectedtopping != undefined && selectedtopping.list?.length > 0 && selectedtopping?.list.filter(x => x.optionselected == true);
    let lstoption = [];
    let optiontype = selectedoption != undefined && selectedoption.length > 0 &&
        selectedoption[0].type.map((data) => {
            if (lstoption.length === 0 || lstoption.find(x => x.suboptioncategoryname === data.suboptioncategoryname) === undefined)
                lstoption.push(data);
        })
    let sessionid = useSelector(({ session }) => session?.sessionid);
    let defaultselected = selectedoption != undefined && selectedoption.length > 0 && selectedoption[0].type.filter(x => x.defaultSelection != null);
    useEffect(() => {
        if (Object.keys(menuItemDetail).length === 0) {
            debugger
            console.log("length is 0")
            dispatch(getMenuItemDetailes(restaurantinfo.restaurantId, restaurantinfo.defaultlocationId, 0, selectedmenuitemdetail.menuitemId, sessionid, 0));
        }
    }, [])

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
        selectedtopping.list.map((data) => {
            if (data.optionselected === true)
                data = lstobj;
            else
                data = data;
        })
        let objtopping = { subparameterId: selectedtopping.subparameterId, list: selectedtopping.list }

        menuItemDetail.topping.map((data) => {
            if (data.subparameterId === selectedsize.subparameterId)
                data = objtopping;
            else
                data = data;
        })
        dispatch(removeMenuItem());
        dispatch(selectedItemSize(menuItemDetail));
        dispatch(updateitemoption());
    }

    const selectedToppingClick = (item) => {
        let lstoptiondata = [];
        selectedtopping.list.map((data) => {
            if (item.name === data.name) data.optionselected = true;
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
        dispatch(updateitemoption());
    }

    return (
        <><div className="col-lg-12 col-sm-12 col-xs-12">
            <hr className="gr" />
        </div>
            <div className="col-lg-12 col-sm-12 col-xs-12">
                <ul className="nav nav-tabs">
                    {/* menu item option parameter */}
                    {selectedtopping != undefined && selectedtopping.list != undefined && selectedtopping.list.filter(x => x.displayStatus === true).map((item, index) => {
                        return (
                            <li key={index} className={item.optionselected ? " active" : ""}>
                                <a data-toggle="tab" onClick={() => selectedToppingClick(item)}>{item.isCompulsory === true ? item.name + ' *' : item.name}
                                </a>
                            </li>
                        )
                    })}
                </ul>
                <div className="tab-content">
                    <div id="dough" className="tab-pane fade in active">
                        <div className="col-lg-6 col-sm-6 col-xs-12">
                            <ul className="nav nav-pills">
                                {lstoption != undefined && lstoption.length > 0 && lstoption.map((data, index) => {
                                    return (
                                        <>
                                            <li key={index} className={data.defaultSelection != null && data.defaultSelection != false ? "active" : ""} ><a data-toggle="pill" onClick={() => selectedOptionClick(data)}>{data.suboptioncategoryname}</a></li>
                                        </>
                                    )
                                })}
                            </ul>
                        </div>
                        {
                            Object.keys(menuItemDetail).length > 0 &&<NewMenuItemSubOptionsParameter />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewMenuItemOptionsParameter