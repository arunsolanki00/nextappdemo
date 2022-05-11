import React, { useReducer } from "react";
import MenuItemSubOptionsDataComponent from "./menu-item-sub-options-data-component/menu-item-sub-options-data-component";
import { MenuItemSubOptionsParameterData } from "./menu-item-sub-options-parameter.data";

const MenuItemSubOptionsParameter = () => {

	const initialState = {
		dough: {
		  action: "dough",
		  title: "Dough",
		  active: true,
		},
		sauce: {
		  action: "sauce",
		  title: "Sauce",
		  active: false,
		},
		cheese: {
		  action: "cheese",
		  title: "Cheese",
		  active: false,
		},		
	  };

	  const resetState = {
		...initialState,
		dough: {
		  ...initialState.dough,
		  active: false,
		},
	  };

	//   const reducer = (state, action) => {
	// 	switch (action.type) {
	// 	  case "dough":
	// 		return {
	// 		  ...resetState,
	// 		  dough: {
	// 			...resetState.dough,
	// 			active: true,
	// 		  },
	// 		};
	// 	  case "sauce":
	// 		return {
	// 		  ...resetState,
	// 		  sauce: {
	// 			...resetState.sauce,
	// 			active: true,
	// 		  },
	// 		};
	// 	  case "cheese":
	// 		return {
	// 		  ...resetState,
	// 		  cheese: {
	// 			...resetState.cheese,
	// 			active: true,
	// 		  },
	// 		};		  
	  
	// 	  default:
	// 		return { ...initialState };
	// 	}
	//   };

	const titles = [
		"Dough",
		"Sauce",
		"Cheese",		
	];

	//const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<div>
			{/* <div>
			<div className="filters">
        		<div className="title-filters-select">
          			<select onChange={(e) => console.log(e.target.value)}>
            			{Object.entries(state).map(([actionTitle, dataObj]) => (
              			<option>{dataObj.title}</option>
            		))}
          			</select>
        		</div>

        		<hr className="mobile-seperator d-md-none" />

        		<div className="title-filters">
          			{Object.entries(state).map(([actionTitle, dataObj]) => (
            		<h3 onClick={() => dispatch({ type: dataObj.action })}
              			className={`filter
                                ${dataObj.active ? "active" : ""}`}
            		>
              		{dataObj.title}
            		</h3>
          			))}
        		</div>
      		</div>
			</div>			
			<div className="col-lg-12 col-sm-12 col-xs-12"> */}
				{/* <div className="tab-content">
					<div className="tab-pane fade">
						<div className="col-lg-12 col-sm-12 col-xs-12">
						 {state.dough.active && MenuItemSubOptionsParameterData && MenuItemSubOptionsParameterData.Dough.map((item) => {
                            return ( <MenuItemSubOptionsDataComponent data = {item} /> )
						 })}
						 {state.sauce.active && MenuItemSubOptionsParameterData && MenuItemSubOptionsParameterData.Sauce.map((item) => {
                            return ( <MenuItemSubOptionsDataComponent data = {item} /> )
						 })}
						 {state.cheese.active && MenuItemSubOptionsParameterData && MenuItemSubOptionsParameterData.Cheese.map((item) => {
                            return ( <MenuItemSubOptionsDataComponent data = {item} /> )
						 })}																																					
						</div>
					</div>
				</div>
			</div> */}
		</div>
	)
}

export default MenuItemSubOptionsParameter;