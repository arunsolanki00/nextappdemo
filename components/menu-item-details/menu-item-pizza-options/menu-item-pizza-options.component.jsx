
import { MenuItemPizzaOptionsData } from "./menu-item-pizza-options.data";
//import Correctimage from "../../../public/images/correct.svg";

const MenuItemPizzaOptions = () => {
    return (
        <>
            <div className="col-lg-12 col-sm-12 col-xs-12">
                {MenuItemPizzaOptionsData && MenuItemPizzaOptionsData.response.map((item) => {
                    return (
                        <a className={item.active ? "orange_price_btn orange_side_btn active" : "orange_price_btn orange_side_btn"} href="#"><img src={"/images/correct.svg"} alt="" /> {item.name}</a>
                    )
                })}
            </div>
        </>
    )
}

export default MenuItemPizzaOptions;