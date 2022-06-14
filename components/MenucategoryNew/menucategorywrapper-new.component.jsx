import { shallowEqual, useSelector } from "react-redux";
import MenuCategoryComponent from "../MenuCategory/menu-category.component";
import MenuItemIntroComponentNew from "./menuitemintro-new.component";

function MenuCategoryWrapperNew() {
    const selectedCategory = useSelector(({ category }) => category.selectedcategorydetail, shallowEqual);
    const mainCategory = useSelector(({ main }) => main.maincategoryList, shallowEqual);
     
    return (
        <>
            <div className="col-lg-3 cate col-sm-12 col-xs-12">
                <div className="col-lg-12 col-sm-12 col-xs-12">
                    <h3 className="margin_top_20 margin_bottom_25">Categories:</h3>
                </div>
                {mainCategory && <MenuCategoryComponent categories={mainCategory} selectedCat={selectedCategory} />}
            </div>
            <>
                    <MenuItemIntroComponentNew />
            </>
        </>
    )
}

export default MenuCategoryWrapperNew
