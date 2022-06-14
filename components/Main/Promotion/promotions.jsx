import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Controller, Thumbs } from 'swiper';
import 'swiper/swiper-bundle.css';
import PromotionCSS from './promotions.module.css'
SwiperCore.use([Navigation, Pagination, Controller, Thumbs]);

function PromotionComponent({ promotionslides }) {
    const slides = [];
    for (let i = 0; i < promotionslides.length; i += 1) {
        const promotion = promotionslides[i];
        slides.push(
            <SwiperSlide key={`slide-${i}`} tag="div">
                <h3 className="color_white margin_0">{promotion.menuItemName}<br />
                    <span className="color_grey size_18 weight_300">{promotion.description}</span>
                </h3>
            </SwiperSlide>
        );
    }

    return (
        <>
            <Swiper
                tag="section"
                wrapperTag="div"
                navigation
                pagination
                spaceBetween={30}
                slidesPerView={3}
                onInit={(swiper) => console.log('Swiper initialized!', swiper)}
                onSlideChange={(swiper) => {
                    console.log('Slide index changed to: ', swiper.activeIndex);
                }}
                onReachEnd={() => console.log('Swiper end reached')}
            >
                {slides}
            </Swiper>
        </>
    )
}

export default PromotionComponent