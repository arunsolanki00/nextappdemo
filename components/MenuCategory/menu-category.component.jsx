import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getCategoryItemList, selectedCategory } from "../../redux/category/category.action";

function MenuCategoryComponent({ categories, selectedCat }) {
  
    const router = useRouter();
    const dispatch = useDispatch();
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);

    const [slides, setslides] = useState([]);

    const {
        query: { dynamic, id, category, index },
    } = router

    console.log("category :"+category);
    function selectedCategoryClick(item) {
        if (item != undefined) {
            dispatch(selectedCategory(item));
            dispatch(getCategoryItemList(restaurantinfo.restaurantId, item.catId, userinfo ? userinfo.customerId : 0, restaurantinfo.defaultlocationId));
           // selecetdChange(Math.random());
        }
    }

     useEffect(() => {
        const slide=[];
      if(categories.length > 0){
        categories.map((categoryObj)=>{
            let categoryRow =categoryObj; 
            if (category.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-") === categoryRow.catName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")) {
                categoryRow.catSelected = true;
                dispatch(selectedCategory(categoryRow));
                dispatch(getCategoryItemList(restaurantinfo.restaurantId, categoryRow.catId, userinfo ? userinfo.customerId : 0, restaurantinfo.defaultlocationId));
            }
            else {
                categoryRow.catSelected = false;
            }
            slide.push(
                <li key={Math.random()}>
                    <Link
                        shallow={false}
                        key={Math.random()} href="/[dynamic]/[category]"
                        as={`/${dynamic}/${categoryRow.catName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}>
                        <a onClick={() => selectedCategoryClick(categoryRow)} className={categoryRow.catSelected ? "active" : ""}>
                            {categoryRow.catName}
                        </a>
                    </Link>
                </li>
            );
        });
      }

      slide.length > 0 && setslides(slide);
  }, [category])

    return (
        <div className="col-lg-12 categories-ul b-right col-sm-12 col-xs-12">
            <ul>
                {slides}
            </ul>
        </div>
    )
}

export default MenuCategoryComponent