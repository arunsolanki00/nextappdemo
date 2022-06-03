import Link from "next/link";
import { useRouter } from "next/router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getCategoryItemList, selectedCategory } from "../../../redux/category/category.action";


function CategorySlideComponent({ slides }) {
console.log(slides);
    const router = useRouter();
    const dispatch = useDispatch();
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail, shallowEqual);
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const customerId = userinfo ? userinfo.customerId : 0;
    const {
        query: { dynamic, id, category },
    } = router

    const selectedCategoryClick = (item) => {
                if (item != undefined) {
            //item.catSelected = true;
            dispatch(selectedCategory(item));
            // dispatch(getCategoryItemList(restaurantinfo.restaurantId, item.catId, customerId, restaurantinfo.defaultlocationId));
        }
    }

    if (slides) {
        return (
            <>
                <ul>
                    {slides && slides.map((item, index) => {
                        return (
                            <Link key={Math.random()} href="/[dynamic]/[category]" as={`/${dynamic}/${item.catName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}>
                                <a onClick={() => selectedCategoryClick(item)}>
                                    <li key={Math.random()} style={{ background: item.cardBackgroundColor }} >
                                        {/* <span className="">{item.catName}</span> */}
                                        <h4 className="text-overflow">{item.catName}</h4>
                                        {item.thumbimgurl ?
                                            <>
                                                <img src={item.thumbimgurl} alt="" />
                                            </> : ('')}
                                    </li>
                                </a>
                            </Link>
                        )
                    })}
                </ul>
            </>
        )
    }
    else
        return <> </>;
}

export default CategorySlideComponent
