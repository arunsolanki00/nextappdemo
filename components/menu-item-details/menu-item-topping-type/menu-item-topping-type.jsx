import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { removeMenuItem, selectedItemSize } from "../../../redux/menu-item/menu-item.action";
import handleNotify from "../../helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../helpers/toaster/toaster-types";

function isEven(x) {
    return x % 2 == 0;
}

function isOdd(x) {
    return !isEven(x);
}

const MenuItemToppingType = () => {
    const dispatch = useDispatch();
    let menuItemDetail = useSelector(({ menuitem }) => menuitem.menuitemdetaillist);
    let selectedsize = menuItemDetail != undefined && menuItemDetail.size != undefined && menuItemDetail.size.filter(x => x.sizeselected == true);
    let selectedtopping = menuItemDetail != undefined && menuItemDetail.topping != undefined && menuItemDetail.topping.filter(x => x.subparameterId == selectedsize[0].subparameterId);
    let selectedoption = selectedtopping != undefined && selectedtopping.length > 0 && selectedtopping[0].list.filter(x => x.optionselected == true);
    let defaultselected = selectedoption != undefined && selectedoption.length > 0 && selectedoption[0].type.filter(x => x.defaultSelection != null);
    let categoryname = defaultselected != undefined && defaultselected.length > 0 && defaultselected[0].defaultSelection;
    let lstcategory = categoryname != undefined && selectedoption != undefined && selectedoption.length > 0 && selectedoption[0].type.filter(x => x.suboptioncategoryname === categoryname);

    const [minQty, setminQty] = useState(0);

    const [toppingremaining, settoppingremaining] = useState(0);

    useEffect(() => {
        let finalcount = 0;
        var toppingcount = lstcategory && lstcategory.filter(x => x.subOptionselected === true);
        toppingcount && toppingcount.map((tc) => {
            var topvalue = (tc.toppingValue === "" || parseInt(tc.toppingValue) === 0 ? 1 : parseInt(tc.toppingValue));
            var calculatedtopvalue = selectedoption[0].isHalfPizza === true && (tc.pizzaside === "L" || tc.pizzaside === "R") ?
                topvalue * (tc.halfPizzaPriceToppingPercentage === "" || parseInt(tc.halfPizzaPriceToppingPercentage) === 0 ? 1 : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
                : topvalue;
            finalcount = finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
        });
        if (selectedoption[0] && selectedoption[0].maxSelection)
            settoppingremaining(selectedoption[0].maxSelection - finalcount);
        else
            settoppingremaining(0);
    }, [lstcategory])

    useEffect(() => {
        let finalcount = 0;
        var toppingcount = lstcategory && lstcategory.filter(x => x.subOptionselected === true);
        toppingcount && toppingcount.map((tc) => {
            var topvalue = (tc.toppingValue === "" || parseInt(tc.toppingValue) === 0 ? 1 : parseInt(tc.toppingValue));
            var calculatedtopvalue = selectedoption[0].isHalfPizza === true && (tc.pizzaside === "L" || tc.pizzaside === "R") ?
                topvalue * (tc.halfPizzaPriceToppingPercentage === "" || parseInt(tc.halfPizzaPriceToppingPercentage) === 0 ? 1 : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
                : topvalue;
            finalcount = finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
        });
        if (selectedoption[0] && selectedoption[0].maxSelection)
            settoppingremaining(selectedoption[0].maxSelection - finalcount);
        else
            settoppingremaining(0);
    }, [menuItemDetail, selectedoption[0] && selectedoption[0].maxSelection && selectedoption[0].maxSelection, lstcategory]);

    const increment = (data) => {
        const plusState = data.subOptionToppingQuantity + 1;
        selectedquantityClick(plusState, data.suboptionId);

        if(data.subOptionselected !== true)
            selectedOptionClick(data);
    };

    const decrement = (data) => {
        if (minQty === data.subOptionToppingQuantity) {
            selectedquantityClick(minQty, data.suboptionId);
            return;
        }
        const minusState = data.subOptionToppingQuantity - 1;
        selectedquantityClick(minusState, data.suboptionId);
    };

    const selectedquantityClick = (quantity, suboptionId) => {
        let lstdefault = [];
        let tdata = selectedoption[0].type;
        const newArray = tdata.map(a => Object.assign({}, a));

        tdata.map((data) => {
            if (data.suboptionId === suboptionId) {
                data.subOptionToppingQuantity = quantity;
                if (quantity === 0)
                    data.subOptionselected = false;
            }

            lstdefault.push(data);
        })

        let finalcount = 0;
        var toppingcount = lstdefault.filter(x => x.subOptionselected === true);
        toppingcount.map((tc) => {
            var topvalue = (tc.toppingValue === "" || parseInt(tc.toppingValue) === 0 ? 1 : parseInt(tc.toppingValue));
            var calculatedtopvalue = selectedoption[0].isHalfPizza === true && (tc.pizzaside === "L" || tc.pizzaside === "R") ?
                topvalue * (tc.halfPizzaPriceToppingPercentage === "" || parseInt(tc.halfPizzaPriceToppingPercentage) === 0 ? 1 : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
                : topvalue;
            finalcount = finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
        });

        if (finalcount <= selectedoption[0].maxSelection) {
            settoppingremaining(selectedoption[0].maxSelection - finalcount);
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
        else {
            let lstobj = {
                optionselected: selectedoption[0].optionselected, subparameterId: selectedoption[0].subparameterId,
                name: selectedoption[0].name, maxSelection: selectedoption[0].maxSelection, type: newArray
            }

            selectedtopping[0].list.map((data) => {
                if (data.optionselected === true)
                    Object.assign(data, lstobj);
                else
                    Object.assign(data, data);
            })

            let objtopping = { subparameterId: selectedtopping[0].subparameterId, list: selectedtopping[0].list }

            menuItemDetail.topping.map((data) => {
                if (data.subparameterId === selectedsize[0].subparameterId)
                    Object.assign(data, objtopping);
                else
                    Object.assign(data, data);
            })

            dispatch(removeMenuItem());
            dispatch(selectedItemSize(menuItemDetail));

            handleNotify('Topping value is exceed ' + selectedoption[0].maxSelection + ' toppings', ToasterPositions.BottomRight, ToasterTypes.Error);
        }
    }

    const selectedOptionClick = (item) => {
        let lstdefault = [];
        let tdata = selectedoption[0].type;

        const newArray = tdata.map(a => Object.assign({}, a));
        //const cloneSheeps = Array.from(ddata);
        //const deepCopyObj = JSON.parse(JSON.stringify(ddata));

        tdata.map((data) => {
            if (item.name === data.name && item.subOptionselected === true) {
                data.subOptionselected = false;
                data.subOptionToppingQuantity = 0;
                data.pizzaside = "";
            }
            else if (item.name === data.name && item.subOptionselected === false) {
                data.subOptionselected = true;
                data.subOptionToppingQuantity = 1;
                data.pizzaside = "F";
            }
            else if (item.name !== data.name && selectedoption[0].maxSelection <= 1) {
                data.subOptionselected = false;
                data.pizzaside = "";
            }

            lstdefault.push(data);
        })

        let finalcount = 0;
        var toppingcount = lstdefault.filter(x => x.subOptionselected === true);
        toppingcount.map((tc) => {
            var topvalue = (tc.toppingValue === "" || parseInt(tc.toppingValue) === 0 ? 1 : parseInt(tc.toppingValue));
            var calculatedtopvalue = selectedoption[0].isHalfPizza === true && (tc.pizzaside === "L" || tc.pizzaside === "R") ?
                topvalue * (tc.halfPizzaPriceToppingPercentage === "" || parseInt(tc.halfPizzaPriceToppingPercentage) === 0 ? 1 : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
                : topvalue;
            finalcount = finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
        });

        //Add last 1/2 (half) topping changes
        if ((finalcount - parseInt(selectedoption[0].maxSelection)) > 0 && (finalcount - parseInt(selectedoption[0].maxSelection)) < 1) {
            lstdefault = [];
            tdata.map((data) => {
                if (item.name === data.name) {
                    data.subOptionselected = true;
                    data.subOptionToppingQuantity = 1;
                    data.pizzaside = "L";
                }
                lstdefault.push(data);
            })
        }

        if (item.subOptionselected === true && parseInt(selectedoption[0].maxSelection) === 1 ||
            parseInt(selectedoption[0].maxSelection) === 1 ||
            (finalcount <= parseInt(selectedoption[0].maxSelection) && parseInt(selectedoption[0].maxSelection) > 1) || ((finalcount - parseInt(selectedoption[0].maxSelection)) > 0 && (finalcount - parseInt(selectedoption[0].maxSelection)) < 1)) {

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
        else {
            let lstobj = {
                optionselected: selectedoption[0].optionselected, subparameterId: selectedoption[0].subparameterId,
                name: selectedoption[0].name, maxSelection: selectedoption[0].maxSelection, type: newArray
            }

            selectedtopping[0].list.map((data) => {
                if (data.optionselected === true)
                    Object.assign(data, lstobj);
                else
                    Object.assign(data, data);
            })

            let objtopping = { subparameterId: selectedtopping[0].subparameterId, list: selectedtopping[0].list }

            menuItemDetail.topping.map((data) => {
                if (data.subparameterId === selectedsize[0].subparameterId)
                    Object.assign(data, objtopping);
                else
                    Object.assign(data, data);
            })

            dispatch(removeMenuItem());
            dispatch(selectedItemSize(menuItemDetail));

            handleNotify('Please choose only ' + selectedoption[0].maxSelection + ' toppings', ToasterPositions.BottomRight, ToasterTypes.Error);
        }
    }

    const halfpizzaclick = (item, side) => {
        let lstdefault = [];
        let tdata = selectedoption[0].type;
        const newArray = tdata.map(a => Object.assign({}, a));

        tdata.map((data) => {
            if (data.suboptionId === item.suboptionId) {
                data.pizzaside = side;
            }
            lstdefault.push(data);
        })

        let finalcount = 0;
        var toppingcount = lstdefault.filter(x => x.subOptionselected === true);
        toppingcount.map((tc) => {
            var topvalue = (tc.toppingValue === "" || parseInt(tc.toppingValue) === 0 ? 1 : parseInt(tc.toppingValue));
            var calculatedtopvalue = selectedoption[0].isHalfPizza === true && (tc.pizzaside === "L" || tc.pizzaside === "R") ?
                topvalue * (tc.halfPizzaPriceToppingPercentage === "" || parseInt(tc.halfPizzaPriceToppingPercentage) === 0 ? 1 : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
                : topvalue;
            finalcount = finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
        });

        if (finalcount <= selectedoption[0].maxSelection) {
            settoppingremaining(selectedoption[0].maxSelection - finalcount);
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
        else {
            let lstobj = {
                optionselected: selectedoption[0].optionselected, subparameterId: selectedoption[0].subparameterId,
                name: selectedoption[0].name, maxSelection: selectedoption[0].maxSelection, type: newArray
            }

            selectedtopping[0].list.map((data) => {
                if (data.optionselected === true)
                    Object.assign(data, lstobj);
                else
                    Object.assign(data, data);
            })

            let objtopping = { subparameterId: selectedtopping[0].subparameterId, list: selectedtopping[0].list }

            menuItemDetail.topping.map((data) => {
                if (data.subparameterId === selectedsize[0].subparameterId)
                    Object.assign(data, objtopping);
                else
                    Object.assign(data, data);
            })

            dispatch(removeMenuItem());
            dispatch(selectedItemSize(menuItemDetail));

            handleNotify('Topping value is exceed ' + selectedoption[0].maxSelection + ' toppings', ToasterPositions.BottomRight, ToasterTypes.Error);
        }
    }

    function gcd(a, b) {
        if (a == 0)
            return b;
        else if (b == 0)
            return a;
        if (a < b)
            return gcd(a, b % a);
        else
            return gcd(b, a % b);
    }

    function improperFractionToMixedNumber(n, d) {
        let i = parseInt(n / d);
        n -= i * d;
        return [i, n, d];
    }

    function decimalToFraction(number) {

        let letVal = Math.floor(number);
        let fVal = number - letVal;

        let pVal = 1000000000;
        let gcdVal = gcd(Math.round(fVal * pVal), pVal);

        let num = Math.round(fVal * pVal) / gcdVal;
        let deno = pVal / gcdVal;
        let numberVal = (letVal * deno) + num;
        let result = improperFractionToMixedNumber(numberVal, deno);
        if (result[1] > 0) {
            return (<>{result[0] > 0 ? result[0] : ""}&nbsp;
                <sup>{result[1]}</sup>/<sub>{result[2]}</sub>
            </>);
        }
        else {
            return result[0];
        }
    }

    return (
        <>
            {selectedtopping && selectedtopping?.length > 0 && selectedtopping[0].list && selectedtopping[0].list.length > 0 &&
                <div className="col-lg-6 text-right free pull-right col-sm-6 col-xs-12">
                    <div className="col-lg-12  col-sm-12 col-xs-12">
                        <p className="padding_right_12">Free toppings remaining: <span className="active">{toppingremaining && decimalToFraction(toppingremaining)}</span></p>
                    </div>
                </div>}
            <div className="col-lg-12 p-3 col-sm-12 col-xs-12">
                <div className="tab-content">
                    <div className="col-lg-12 col-sm-12 col-xs-12">
                        <div className="row">
                            <div className="col-lg-6 col-sm-12 col-xs-12">
                                {lstcategory != undefined && lstcategory.length > 0 && lstcategory.map(
                                    (data, index) =>
                                        isEven(index) && (
                                            <div key={index} className="row row-eq-height">
                                                <div className="col-lg-2 flush-right col-sm-2 col-xs-12 margin_bottom_10">
                                                    <div className="tablerow">
                                                        <div className="tablecell">
                                                            <img src={data.image} alt="" className="toppingImage" />
                                                            {/* <img src="/images/meat-2.png" className="toppingImage" alt="" /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-10 pull-right col-sm-10 col-xs-12">
                                                    <div className="tablerow">
                                                        <div className="tablecell">
                                                            <div style={{ cursor: "pointer" }} onClick={() => selectedOptionClick(data)} className={data.subOptionselected == true ? "inf active" : "inf"}>
                                                                {/* <div className="inf active"> */}
                                                                <div className="row">
                                                                    <div className="col-lg-9 col-sm-9 col-xs-12 text-left">
                                                                        <h6>{data.name}</h6>
                                                                    </div>
                                                                    <div className="col-lg-3 col-sm-3 col-xs-12 text-right">
                                                                        <h6><em>{data.price > 0 ?
                                                                            (
                                                                                <em>
                                                                                    {data.currency}{data.price.toFixed(2)}
                                                                                </em>
                                                                            ) : ('')}</em></h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 flush	 steak-blue sun-q col-sm-12 col-xs-12">
                                                                {selectedoption[0].isHalfPizza === true &&
                                                                    <div className="sun">
                                                                        <a className={data.pizzaside === "L" && data.subOptionselected === true ? "ft active" : "ft"} onClick={() => halfpizzaclick(data, "L")}></a>
                                                                        <a className={(data.pizzaside === "F" || data.pizzaside === "") && data.subOptionselected === true ? "sd active" : "sd"} onClick={() => halfpizzaclick(data, "F")}></a>
                                                                        <a className={data.pizzaside === "R" && data.subOptionselected === true ? "td active" : "td"} onClick={() => halfpizzaclick(data, "R")}></a>
                                                                    </div>}
                                                                {selectedoption[0].maxSelection > 1 &&
                                                                    <div className="quantity">
                                                                        <button onClick={() => decrement(data)} className={data.subOptionToppingQuantity > 0 || data.subOptionselected === true ? "active" : "disabled"} >-</button>
                                                                        <input data-value readOnly value={data.subOptionToppingQuantity} />
                                                                        <button onClick={() => increment(data)} className={data.subOptionselected === true ? "active" : "lightgrey"} >+</button>
                                                                    </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        )
                                )}
                            </div>
                            <div className="col-lg-6 col-sm-12 col-xs-12">
                                {lstcategory != undefined && lstcategory.length > 0 && lstcategory.map(
                                    (data, index) =>
                                        isOdd(index) && (
                                            <div key={index} className="row row-eq-height">
                                                <div className="col-lg-2 flush-right col-sm-2 col-xs-12 margin_bottom_10">
                                                    <div className="tablerow">
                                                        <div className="tablecell">
                                                            <img src={data.image} alt="" className="toppingImage" />
                                                            {/* <img src="/images/meat-2.png" className="toppingImage" alt="" /> */}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-10 pull-right col-sm-10 col-xs-12">
                                                    <div className="tablerow">
                                                        <div className="tablecell">
                                                            <div style={{ cursor: "pointer" }} onClick={() => selectedOptionClick(data)} className={data.subOptionselected == true ? "inf active" : "inf"}>
                                                                {/* <div className="inf active"> */}
                                                                <div className="row">
                                                                    <div className="col-lg-9 col-sm-9 col-xs-12 text-left">
                                                                        <h6>{data.name}</h6>
                                                                    </div>
                                                                    <div className="col-lg-3 col-sm-3 col-xs-12 text-right">
                                                                        <h6><em>{data.price > 0 ?
                                                                            (
                                                                                <em>
                                                                                    {data.currency}{data.price.toFixed(2)}
                                                                                </em>
                                                                            ) : ('')}</em></h6>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-12 flush	 steak-blue sun-q col-sm-12 col-xs-12">
                                                                {selectedoption[0].isHalfPizza === true &&
                                                                    <div className="sun">
                                                                        <a className={data.pizzaside === "L" && data.subOptionselected === true ? "ft active" : "ft"} onClick={() => halfpizzaclick(data, "L")}></a>
                                                                        <a className={(data.pizzaside === "F" || data.pizzaside === "") && data.subOptionselected === true ? "sd active" : "sd"} onClick={() => halfpizzaclick(data, "F")}></a>
                                                                        <a className={data.pizzaside === "R" && data.subOptionselected === true ? "td active" : "td"} onClick={() => halfpizzaclick(data, "R")}></a>
                                                                    </div>}
                                                                {selectedoption[0].maxSelection > 1 &&
                                                                    <div className="quantity">
                                                                        <button onClick={() => decrement(data)} className={data.subOptionToppingQuantity > 0 || data.subOptionselected === true ? "active" : "disabled"} >-</button>
                                                                        <input data-value readOnly value={data.subOptionToppingQuantity} />
                                                                        <button onClick={() => increment(data)} className={data.subOptionselected === true ? "active" : "lightgrey"} >+</button>
                                                                    </div>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MenuItemToppingType;