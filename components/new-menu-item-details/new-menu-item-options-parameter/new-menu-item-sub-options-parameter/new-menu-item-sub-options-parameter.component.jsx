import React, { Suspense, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeMenuItem,
  selectedItemSize,
  updateitemoption,
} from "../../../../redux/menu-item/menu-item.action";
import handleNotify from "../../../helpers/toaster/toaster-notify";
import { ToasterPositions } from "../../../helpers/toaster/toaster-positions";
import { ToasterTypes } from "../../../helpers/toaster/toaster-types";
import { resizeImageFn } from "../../../helpers/utility";

const NewMenuItemSubOptionsParameter = () => {
  let menuItemDetail = useSelector(
    ({ menuitem }) => menuitem.menuitemdetaillist
  );
  let selectedsize =
    menuItemDetail != undefined &&
    menuItemDetail.size != undefined &&
    menuItemDetail.size.find((x) => x.sizeselected == true);
  let selectedtopping =
    menuItemDetail != undefined &&
    menuItemDetail.topping != undefined &&
    menuItemDetail.topping.find(
      (x) => x.subparameterId == selectedsize.subparameterId
    );

  let selectedoption =
    selectedtopping != undefined &&
    selectedtopping.list.length > 0 &&
    selectedtopping.list.filter((x) => x.optionselected == true);

  let lstoption = [];
  let optiontype =
    selectedoption != undefined &&
    selectedoption.length > 0 &&
    selectedoption[0].type.map((data) => {
      if (
        lstoption.length === 0 ||
        lstoption.find(
          (x) => x.suboptioncategoryname === data.suboptioncategoryname
        ) === undefined
      )
        lstoption.push(data);
    });

  let defaultselected =
    selectedoption != undefined &&
    selectedoption.length > 0 &&
    selectedoption[0].type.filter((x) => x.defaultSelection != null);
  let categoryname =
    defaultselected != undefined &&
    defaultselected.length > 0 &&
    defaultselected[0].defaultSelection;

  let lstcategory =
    categoryname != undefined &&
    selectedoption != undefined &&
    selectedoption.length > 0 &&
    selectedoption[0].type.filter(
      (x) => x.suboptioncategoryname === categoryname
    );
  const dispatch = useDispatch();
  const [minQty, setminQty] = useState(0);
  const [toppingremaining, settoppingremaining] = useState(0);
	let updateitemoptionincart = useSelector(({ menuitem }) => menuitem.updateitemoptionincart);

  useEffect(() => {
    let finalcount = 0;
    var toppingcount =
      lstcategory && lstcategory.filter((x) => x.subOptionselected === true);
    toppingcount &&
      toppingcount.map((tc) => {
        var topvalue =
          tc.toppingValue === "" || parseInt(tc.toppingValue) === 0
            ? 1
            : parseInt(tc.toppingValue);
        var calculatedtopvalue =
          selectedoption[0].isHalfPizza === true &&
          (tc.pizzaside === "L" || tc.pizzaside === "R")
            ? topvalue *
              (tc.halfPizzaPriceToppingPercentage === "" ||
              parseInt(tc.halfPizzaPriceToppingPercentage) === 0
                ? 1
                : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
            : topvalue;
        finalcount =
          finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
      });
    if (selectedoption[0] && selectedoption[0].maxSelection)
      settoppingremaining(selectedoption[0].maxSelection - finalcount);
    else settoppingremaining(0);
  },[lstcategory]);

  useEffect(() => {
    let finalcount = 0;
    var toppingcount =
      lstcategory && lstcategory.filter((x) => x.subOptionselected === true);
    toppingcount &&
      toppingcount.map((tc) => {
        var topvalue =
          tc.toppingValue === "" || parseInt(tc.toppingValue) === 0
            ? 1
            : parseInt(tc.toppingValue);
        var calculatedtopvalue =
          selectedoption[0].isHalfPizza === true &&
          (tc.pizzaside === "L" || tc.pizzaside === "R")
            ? topvalue *
              (tc.halfPizzaPriceToppingPercentage === "" ||
              parseInt(tc.halfPizzaPriceToppingPercentage) === 0
                ? 1
                : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
            : topvalue;
        finalcount =
          finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
      });
    if (selectedoption[0] && selectedoption[0].maxSelection)
      settoppingremaining(selectedoption[0].maxSelection - finalcount);
    else settoppingremaining(0);
  }, [
    menuItemDetail,
    selectedoption[0] &&
      selectedoption[0].maxSelection &&
      selectedoption[0].maxSelection,
    lstcategory,updateitemoptionincart
  ]);

  const selectedquantityClick = (quantity, suboptionId) => {
    let lstdefault = [];
    let tdata = selectedoption[0].type;
    const newArray = tdata.map((a) => Object.assign({}, a));
    tdata.map((data) => {
      if (data.suboptionId === suboptionId) {
        //TO DO 
        if(data.subOptionselected === false){
          data.subOptionToppingQuantity = 0;
        }else{
          data.subOptionToppingQuantity = quantity;
        }
        
        if (quantity === 0) data.subOptionselected = false;
      }

      lstdefault.push(data);
    });

    let finalcount = 0;
    var toppingcount = lstdefault.filter((x) => x.subOptionselected === true);
    toppingcount.map((tc) => {
      var topvalue =
        tc.toppingValue === "" || parseInt(tc.toppingValue) === 0
          ? 1
          : parseInt(tc.toppingValue);
      var calculatedtopvalue =
        selectedoption[0].isHalfPizza === true &&
        (tc.pizzaside === "L" || tc.pizzaside === "R")
          ? topvalue *
            (tc.halfPizzaPriceToppingPercentage === "" ||
            parseInt(tc.halfPizzaPriceToppingPercentage) === 0
              ? 1
              : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
          : topvalue;
      finalcount =
        finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
    });

    if (finalcount <= selectedoption[0].maxSelection) {
      settoppingremaining(selectedoption[0].maxSelection - finalcount);
      let lstobj = {
        optionselected: selectedoption[0].optionselected,
        subparameterId: selectedoption[0].subparameterId,
        name: selectedoption[0].name,
        maxSelection: selectedoption[0].maxSelection,
        type: lstdefault,
      };
      selectedtopping.list.map((data) => {
        if (data.optionselected === true) data = lstobj;
        else data = data;
      });
      let objtopping = {
        subparameterId: selectedtopping.subparameterId,
        list: selectedtopping.list,
      };

      menuItemDetail.topping.map((data) => {
        if (data.subparameterId === selectedsize.subparameterId)
          data = objtopping;
        else data = data;
      });
      dispatch(removeMenuItem());
      dispatch(selectedItemSize(menuItemDetail));
      dispatch(updateitemoption());
    } else {
      let lstobj = {
        optionselected: selectedoption[0].optionselected,
        subparameterId: selectedoption[0].subparameterId,
        name: selectedoption[0].name,
        maxSelection: selectedoption[0].maxSelection,
        type: newArray,
      };

      selectedtopping?.list.length > 0 &&
        selectedtopping?.list.map((data) => {
          if (data.optionselected === true) Object.assign(data, lstobj);
          else Object.assign(data, data);
        });

      let objtopping = {
        subparameterId: selectedtopping.subparameterId,
        list: selectedtopping.list,
      };

      menuItemDetail.topping.map((data) => {
        if (data.subparameterId === selectedsize.subparameterId)
          Object.assign(data, objtopping);
        else Object.assign(data, data);
      });

      dispatch(removeMenuItem());
      dispatch(selectedItemSize(menuItemDetail));

      handleNotify(
        "Topping value is exceed " +
          selectedoption[0].maxSelection +
          " toppings",
        ToasterPositions.BottomRight,
        ToasterTypes.Error
      );
    }
  };

  const halfpizzaclick = (item, side, clickidenty) => {

    selectedOptionClick(item, clickidenty);

    let lstdefault = [];
    let tdata = selectedoption[0].type;
    const newArray = tdata.map((a) => Object.assign({}, a));

    tdata.map((data) => {
      if (data.suboptionId === item.suboptionId) {
        data.pizzaside = side;
      }
      lstdefault.push(data);
    });

    let finalcount = 0;
    var toppingcount = lstdefault.filter((x) => x.subOptionselected === true);
    toppingcount.map((tc) => {
      var topvalue =
        tc.toppingValue === "" || parseInt(tc.toppingValue) === 0
          ? 1
          : parseInt(tc.toppingValue);
      var calculatedtopvalue =
        selectedoption[0].isHalfPizza === true &&
        (tc.pizzaside === "L" || tc.pizzaside === "R")
          ? topvalue *
            (tc.halfPizzaPriceToppingPercentage === "" ||
            parseInt(tc.halfPizzaPriceToppingPercentage) === 0
              ? 1
              : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
          : topvalue;
      finalcount =
        finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
    });

    if (finalcount <= selectedoption[0].maxSelection) {
      settoppingremaining(selectedoption[0].maxSelection - finalcount);
      let lstobj = {
        optionselected: selectedoption[0].optionselected,
        subparameterId: selectedoption[0].subparameterId,
        name: selectedoption[0].name,
        maxSelection: selectedoption[0].maxSelection,
        type: lstdefault,
      };
      selectedtopping.list.map((data) => {
        if (data.optionselected === true) data = lstobj;
        else data = data;
      });
      let objtopping = {
        subparameterId: selectedtopping.subparameterId,
        list: selectedtopping.list,
      };

      menuItemDetail.topping.map((data) => {
        if (data.subparameterId === selectedsize.subparameterId)
          data = objtopping;
        else data = data;
      });
      dispatch(removeMenuItem());
      dispatch(selectedItemSize(menuItemDetail));
      dispatch(updateitemoption());

    } else {
      let lstobj = {
        optionselected: selectedoption[0].optionselected,
        subparameterId: selectedoption[0].subparameterId,
        name: selectedoption[0].name,
        maxSelection: selectedoption[0].maxSelection,
        type: newArray,
      };

      selectedtopping.list.map((data) => {
        if (data.optionselected === true) Object.assign(data, lstobj);
        else Object.assign(data, data);
      });

      let objtopping = {
        subparameterId: selectedtopping.subparameterId,
        list: selectedtopping.list,
      };

      menuItemDetail.topping.map((data) => {
        if (data.subparameterId === selectedsize.subparameterId)
          Object.assign(data, objtopping);
        else Object.assign(data, data);
      });

      dispatch(removeMenuItem());
      dispatch(selectedItemSize(menuItemDetail));

      handleNotify(
        "Topping value is exceed " +
          selectedoption[0].maxSelection +
          " toppings",
        ToasterPositions.BottomRight,
        ToasterTypes.Error
      );
    }
  };

  // const selectedOptionClick = (item) => {
  //      
  //     let lstdefault = [];
  //     selectedoption[0].type.map((data) => {
  //         if (item.suboptioncategoryname == data.suboptioncategoryname)
  //             data.defaultSelection = item.suboptioncategoryname;
  //         else
  //             data.defaultSelection = null;

  //         lstdefault.push(data);
  //     })
  //     let lstobj = {
  //         optionselected: selectedoption[0].optionselected, subparameterId: selectedoption[0].subparameterId,
  //         name: selectedoption[0].name, maxSelection: selectedoption[0].maxSelection, type: lstdefault
  //     }
  //     selectedtopping.list.map((data) => {
  //         if (data.optionselected === true)
  //             data = lstobj;
  //         else
  //             data = data;
  //     })
  //     let objtopping = { subparameterId: selectedtopping.subparameterId, list: selectedtopping.list }

  //     menuItemDetail.topping.map((data) => {
  //         if (data.subparameterId === selectedsize.subparameterId)
  //             data = objtopping;
  //         else
  //             data = data;
  //     })
  //     dispatch(removeMenuItem());
  //     dispatch(selectedItemSize(menuItemDetail));
  // }

  // const unselectedOption = () => {
  //         
  //         // data.subOptionselected = false;
  //         // data.pizzaside = "";
  //         dispatch(removeMenuItem());
  //         //dispatch(selectedItemSize(menuItemDetail));

  // }
  const selectedOptionClick = (item, selection) => {
    let lstdefault = [];
    let tdata = selectedoption[0].type;

    const newArray = tdata.map((a) => Object.assign({}, a));
    //const cloneSheeps = Array.from(ddata);
    //const deepCopyObj = JSON.parse(JSON.stringify(ddata));
    //   if(clickidenty === "pizza"){
// UPDATE THE OPTIONSELECTED ON CLICKED SUBOPTIONPARAMETER IN THE TYPE ARRAY 
    tdata.map((data) => {
      if (item.name === data.name && item.subOptionselected === true) {
        //select or deselect topping from the card area
        if (selection === "deselect") {
          data.subOptionselected = false;
          data.subOptionToppingQuantity = 0;
          data.pizzaside = "";
        } else {
          data.subOptionselected =
            selectedoption[0].isHalfPizza === true ? true : false;
          data.subOptionToppingQuantity = 0;
          data.pizzaside = "";

          //if pizza side selected then set quantity 1
          if (selectedoption[0].isHalfPizza === true) {
            data.subOptionToppingQuantity = 1;
          }
        }
      } else if (item.name === data.name && item.subOptionselected === false) {
        data.subOptionselected = true;
        data.subOptionToppingQuantity = 1;
        data.pizzaside = "F";
      } else if (
        item.name !== data.name &&
        selectedoption[0].maxSelection <= 1
      ) {
        data.subOptionselected = false;
        data.pizzaside = "";
      }

      lstdefault.push(data);
    });
     console.log("lstdefault",lstdefault)
    let finalcount = 0;
    var toppingcount = lstdefault.filter((x) => x.subOptionselected === true);
    toppingcount.map((tc) => {
       
      var topvalue =
        tc.toppingValue === "" || parseInt(tc.toppingValue) === 0
          ? 1
          : parseInt(tc.toppingValue);
      var calculatedtopvalue =
        selectedoption[0].isHalfPizza === true &&
        (tc.pizzaside === "L" || tc.pizzaside === "R")
          ? topvalue *
            (tc.halfPizzaPriceToppingPercentage === "" ||
            parseInt(tc.halfPizzaPriceToppingPercentage) === 0
              ? 1
              : parseInt(tc.halfPizzaPriceToppingPercentage) / 100)
          : topvalue;
      finalcount =
        finalcount + tc.subOptionToppingQuantity * calculatedtopvalue;
    });

    //Add last 1/2 (half) topping changes
    if (
      finalcount - parseInt(selectedoption[0].maxSelection) > 0 &&
      finalcount - parseInt(selectedoption[0].maxSelection) < 1
    ) {
      lstdefault = [];
      tdata.map((data) => {
        if (item.name === data.name) {
          data.subOptionselected = true;
          data.subOptionToppingQuantity = 1;
          data.pizzaside = "L";
        }
        lstdefault.push(data);
      });
    }
//TO DO
    if (
      (item.subOptionselected === true &&
        parseInt(selectedoption[0].maxSelection) === 1) ||
      parseInt(selectedoption[0].maxSelection) === 1 ||
      (finalcount <= parseInt(selectedoption[0].maxSelection) &&
        parseInt(selectedoption[0].maxSelection) > 1) ||
      (finalcount - parseInt(selectedoption[0].maxSelection) > 0 &&
        finalcount - parseInt(selectedoption[0].maxSelection) < 1)
    ) {
      let lstobj = {
        optionselected: selectedoption[0].optionselected,
        subparameterId: selectedoption[0].subparameterId,
        name: selectedoption[0].name,
        maxSelection: selectedoption[0].maxSelection,
        type: lstdefault,
      };
      //UPDATE THE LIST
      selectedtopping.list.map((data) => {
        if (data.optionselected === true) data = lstobj;
        else data = data;
      });
      let objtopping = {
        subparameterId: selectedtopping.subparameterId,
        list: selectedtopping.list,
      };

      menuItemDetail.topping.map((data) => {
        if (data.subparameterId === selectedsize.subparameterId)
          data = objtopping;
        else data = data;
      });
      dispatch(removeMenuItem());
      dispatch(selectedItemSize(menuItemDetail));
      dispatch(updateitemoption());
    } else {
      let lstobj = {
        optionselected: selectedoption[0].optionselected,
        subparameterId: selectedoption[0].subparameterId,
        name: selectedoption[0].name,
        maxSelection: selectedoption[0].maxSelection,
        type: newArray,
      };

      selectedtopping.list.map((data) => {
        if (data.optionselected === true) Object.assign(data, lstobj);
        else Object.assign(data, data);
      });

      let objtopping = {
        subparameterId: selectedtopping.subparameterId,
        list: selectedtopping.list,
      };
      menuItemDetail.topping.map((data) => {
        if (data.subparameterId === selectedsize.subparameterId)
          Object.assign(data, objtopping);
        else Object.assign(data, data);
      });

      dispatch(removeMenuItem());
      dispatch(selectedItemSize(menuItemDetail));

      handleNotify(
        "Please choose only " + selectedoption[0].maxSelection + " toppings",
        ToasterPositions.BottomRight,
        ToasterTypes.Error
      );
    }
  };

  // topping increment decrement
  const increment = (data) => {
      const plusState = data.subOptionToppingQuantity + 1;
      selectedquantityClick(plusState, data.suboptionId);
      if (data.subOptionselected !== true) selectedOptionClick(data);

  };

  const decrement = (data) => {
    if (minQty === data.subOptionToppingQuantity) {
      selectedquantityClick(minQty, data.suboptionId);
      return;
    }
    const minusState = data.subOptionToppingQuantity - 1;
    selectedquantityClick(minusState, data.suboptionId);
  };
  // let optiontype = selectedoption != undefined && selectedoption.length > 0 &&
  //     selectedoption[0].type.map((data) => {
  //         if (lstoption.length === 0 || lstoption.find(x => x.suboptioncategoryname === data.suboptioncategoryname) === undefined)

  //             lstoption.push(data);
  //     })

  function gcd(a, b) {
    if (a == 0) return b;
    else if (b == 0) return a;
    if (a < b) return gcd(a, b % a);
    else return gcd(b, a % b);
  }

  function improperFractionToMixedNumber(n, d) {
     
    let i = parseInt(n / d);
    n -= i * d;
    return [i, n, d];
  }

  function decimalToFraction(number) {  
     ;
    let letVal = Math.floor(number); //1
    let fVal = number - letVal; //0

    // let pVal = 1000000000;
    let pVal = 10;
    let gcdVal = gcd(Math.round(fVal * pVal), pVal);

    let num = Math.round(fVal * pVal) / gcdVal;
    let deno = pVal / gcdVal;
    let numberVal = letVal * deno + num;
    let result = improperFractionToMixedNumber(numberVal, deno);
    if (result[1] > 0) {
      return (
        <>
          {result[0] > 0 ? result[0] : ""}&nbsp;
          <sup>{result[1]}</sup>/<sub>{result[2]}</sub>
        </>
      );
    } else {
      return result[0];
    }
  }

  const RemainingToppingCount = () => {
    console.log("rendered counte compo")
    return (
      <div className="col-lg-6 text-right free pull-right col-sm-6 col-xs-12 flush">
        <p className="mt-0 mb-0">
          Free toppings remaining:{" "}
          <span className="active">
            {toppingremaining && decimalToFraction(toppingremaining)}
          </span>
        </p>
      </div>
    );
  };

  const DisplaySubOption = () => {

    return(
      lstcategory != undefined &&
        lstcategory.length > 0 &&
        lstcategory.map((data, index) => (
          <div key={index} className="col-lg-3 col-sm-3 col-xs-12">
            <div
              className={`card ${
                data.subOptionselected === true ? "selectedoption" : ""
              }`}
              style={{ backgroundImage: `url(${data.image})` }}
              onClick={() =>
                selectedoption[0].isHalfPizza === true ||
                selectedoption[0].maxSelection > 1
                  ? ""
                  : selectedOptionClick(data)
              }
            >
              <div
                onClick={() =>
                  data.subOptionselected === true
                    ? selectedOptionClick(data, "deselect")
                    : selectedOptionClick(data, "select")
                }
              >
                <h6>{data.name}</h6>
                <h6>
                  {data.price > 0 ? (
                    <em>
                      {" "}
                      {data.currency}
                      {data.price.toFixed(2)}{" "}
                    </em>
                  ) : (
                    ""
                  )}
                </h6>
                <p>{data.cals > 0 ? data.cals + " cals" : ""} </p>
              </div>
              {selectedoption[0].isHalfPizza === true && (
                <div className="sun">
                  <a
                    className={
                      data.pizzaside === "L" &&
                      data.subOptionselected === true
                        ? "ft active"
                        : "ft"
                    }
                    onClick={() => halfpizzaclick(data, "L", "pizza")}
                  ></a>
                  <a
                    className={
                      (data.pizzaside === "F" || data.pizzaside === "") &&
                      data.subOptionselected === true
                        ? "sd active"
                        : "sd"
                    }
                    onClick={() => halfpizzaclick(data, "F", "pizza")}
                  ></a>
                  <a
                    className={
                      data.pizzaside === "R" &&
                      data.subOptionselected === true
                        ? "td active"
                        : "td"
                    }
                    onClick={() => halfpizzaclick(data, "R", "pizza")}
                  ></a>
                </div>
              )}
              {selectedoption[0].maxSelection > 1 && (
                <div className="quantity">
                  <button
                    onClick={() => decrement(data)}
                    className={
                      data.subOptionToppingQuantity > 0 ||
                      data.subOptionselected === true
                        ? "active"
                        : "disabled"
                    }
                  >
                    -
                  </button>
                  <input
                    data-value
                    readOnly
                    value={data.subOptionToppingQuantity}
                  />
                  <button
                    onClick={() => increment(data)}
                    className={
                      data.subOptionselected === true
                        ? "active"
                        : "lightgrey"
                    }
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
       
    )
  }

  const LoadingComponent = () => {
    return(
      <div>Loading...</div>
    )
  }
  return (

    <div className="tab-content">
      <div id="meat-dough" className="tab-pane fade in active">
        {/* {(selectedtopping && selectedtopping.list && selectedtopping.list.length > 0) ?
                    <div className="col-lg-6 text-right free pull-right col-sm-6 col-xs-12 flush">
                        <p className="mt-0 mb-0">Free toppings remaining: <span className="active">{toppingremaining && decimalToFraction(toppingremaining)}</span></p>
                    </div>
                     :
                    <></>
                }  */}
        <RemainingToppingCount />
        <div className="col-lg-12 col-sm-12 col-xs-12">
          <div className="row">
          {/* <Suspense fallback={<LoadingComponent />}> */}
            <DisplaySubOption />
          {/* </Suspense> */}
            {/* {lstcategory != undefined &&
              lstcategory.length > 0 &&
              lstcategory.map((data, index) => (
                <div key={index} className="col-lg-3 col-sm-3 col-xs-12">
                  <div
                    className={`card ${
                      data.subOptionselected === true ? "selectedoption" : ""
                    }`}
                    style={{ backgroundImage: `url(${data.image})` }}
                    onClick={() =>
                      selectedoption[0].isHalfPizza === true ||
                      selectedoption[0].maxSelection > 1
                        ? ""
                        : selectedOptionClick(data)
                    }
                  >
                    <div
                      onClick={() =>
                        data.subOptionselected === true
                          ? selectedOptionClick(data, "deselect")
                          : selectedOptionClick(data, "select")
                      }
                    >
                      <h6>{data.name}</h6>
                      <h6>
                        {data.price > 0 ? (
                          <em>
                            {" "}
                            {data.currency}
                            {data.price.toFixed(2)}{" "}
                          </em>
                        ) : (
                          ""
                        )}
                      </h6>
                      <p>{data.cals > 0 ? data.cals + " cals" : ""} </p>
                    </div>
                    {selectedoption[0].isHalfPizza === true && (
                      <div className="sun">
                        <a
                          className={
                            data.pizzaside === "L" &&
                            data.subOptionselected === true
                              ? "ft active"
                              : "ft"
                          }
                          onClick={() => halfpizzaclick(data, "L", "pizza")}
                        ></a>
                        <a
                          className={
                            (data.pizzaside === "F" || data.pizzaside === "") &&
                            data.subOptionselected === true
                              ? "sd active"
                              : "sd"
                          }
                          onClick={() => halfpizzaclick(data, "F", "pizza")}
                        ></a>
                        <a
                          className={
                            data.pizzaside === "R" &&
                            data.subOptionselected === true
                              ? "td active"
                              : "td"
                          }
                          onClick={() => halfpizzaclick(data, "R", "pizza")}
                        ></a>
                      </div>
                    )}
                    {selectedoption[0].maxSelection > 1 && (
                      <div className="quantity">
                        <button
                          onClick={() => decrement(data)}
                          className={
                            data.subOptionToppingQuantity > 0 ||
                            data.subOptionselected === true
                              ? "active"
                              : "disabled"
                          }
                        >
                          -
                        </button>
                        <input
                          data-value
                          readOnly
                          value={data.subOptionToppingQuantity}
                        />
                        <button
                          onClick={() => increment(data)}
                          className={
                            data.subOptionselected === true
                              ? "active"
                              : "lightgrey"
                          }
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMenuItemSubOptionsParameter;
