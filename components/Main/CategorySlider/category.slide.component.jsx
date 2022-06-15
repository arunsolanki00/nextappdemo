import Link from "next/link";
import { useRouter } from "next/router";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {  selectedCategory } from "../../../redux/category/category.action";


function CategorySlideComponent({ slides }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const userinfo = useSelector(({ userdetail }) => userdetail.loggedinuser, shallowEqual);
    const {
        query: { dynamic,location,id, category },
    } = router

    const selectedCategoryClick = (item) => {
                if (item != undefined) {
            dispatch(selectedCategory(item));
        }
    }

    if (slides) {
        return (
            <>
                <ul>
                    {slides && slides.map((item, index) => {
                        return (
                            <Link key={Math.random()} href="/[dynamic]/[location]/[category]" as={`/${dynamic}/${location}/${item.catName.toLowerCase().toString().replace(/[^a-zA-Z0-9]/g, " ").replace(/\s{2,}/g, ' ').replace(/ /g, "-")}`}>
                                <a onClick={() => selectedCategoryClick(item)}>
                                    <li key={Math.random()} style={{ background: item.cardBackgroundColor }} >
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
