import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { shallowEqual, useSelector } from "react-redux";
import Loader from "../Common/loader/loader.component";
import { MenuItemIntroSkeleton } from "../Common/Skeleton/menuitemintro-skeleton.component";
import MenuCategoryComponent from "./menu-category.component";
import MenuItemIntroComponent from "./menuitemintro.component";
import { useRouter } from "next/router";

function MenuCategoryWrapper() {

    const selectedCategory = useSelector(({ category }) => category.selectedcategorydetail, shallowEqual);
    const categoryItemList = useSelector(({ category }) => category.categoryitemlist, shallowEqual);
    const mainCategory = useSelector(({ main }) => main.maincategoryList, shallowEqual);
    const [loader, setloader] = useState(true);
    const [loadingstate, setloadingstate] = useState(false)

    const router = useRouter();
    const {
        query: { dynamic, id, category, index },
    } = router;

    console.log("category name: " + category);

    useEffect(() => {
        setloader(true);
        setloadingstate(true)
        const timer = setTimeout(() => {
            setloader(false);
            setloadingstate(false)
        }, 1000);
        return () => clearTimeout(timer);
    }, [categoryItemList.length])

    return (
        <>
            {
                <div className="row eq_none_medium row-eq-height">
                    <div className="col-lg-3 cate col-sm-12 col-xs-12 categoryBox">
                        <div className="col-lg-12 col-sm-12 col-xs-12">
                            <h3 className="margin_top_20 margin_bottom_25">Categories:</h3>
                        </div>
                        {mainCategory && <MenuCategoryComponent categories={mainCategory} selectedCat={selectedCategory} />}
                    </div>
                    {category.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-") === selectedCategory.catName.toString().toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-") &&
                        <div className="col-lg-9 pull-right pizza-in col-sm-12 col-xs-12">
                            <div className="row">
                                <div className="col-lg-12 col-sm-12 col-xs-12 small-text-center">
                                    <h2><b>{selectedCategory.catName}</b></h2>
                                </div>
                            </div>
                            {categoryItemList && !loader || !loadingstate ?
                                <MenuItemIntroComponent menuitems={categoryItemList} /> :
                                <MenuItemIntroSkeleton />
                            }
                        </div>

                    }
                </div>
            }

        </>
    )
}

export default MenuCategoryWrapper
