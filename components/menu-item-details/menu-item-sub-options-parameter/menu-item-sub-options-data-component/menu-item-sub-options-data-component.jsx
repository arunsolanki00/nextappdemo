import React from "react";

const MenuItemSubOptionsDataComponent = ({image,name,calories,price}) => {
    return(
        <div>
            <div className="col-lg-6 col-sm-12 col-xs-12">
				<div className="row row-eq-height">
					<div className="col-lg-3 flush-right col-sm-3 col-xs-12">
						<div className="tablerow">
							<div className="tablecell">
								<img src={image} alt="" />
							</div>
						</div>
					</div>
		<div className="col-lg-9 pull-right col-sm-9 col-xs-12">
			<div className="col-lg-12 inf col-sm-12 col-xs-12">
	    	    <div className="tablerow">
				    <div className="tablecell">
				        {/* <h6>{name}<br /><span>~ {calories} Cals</span>{price} </h6> */}
						<h6>{name}<br /> {calories && <span> {`~ ${calories} Cals`} </span>}{price} </h6>
				    </div>
			    </div>
			</div>
		</div>
	   </div>
      </div>
     </div>
   )
}

export default MenuItemSubOptionsDataComponent;