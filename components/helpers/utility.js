// import Compress from "compress.js";
import { useSelector } from "react-redux";


export const resizeImageFn = async (file) => {
    // const compress = new Compress();

    // const resizedImage = await compress.compress([file], {
    //     size: 1, // the max size in MB, defaults to 2MB
    //     quality: 1, // the quality of the image, max is 1,
    //     maxWidth: 300, // the max width of the output image, defaults to 1920px
    //     maxHeight: 300, // the max height of the output image, defaults to 1920px
    //     resize: true // defaults to true, set false if you do not want to resize the image width and height
    // })
    // const img = resizedImage[0];
    // const base64str = img.data
    // const imgExt = img.ext
    // const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
    // return resizedFiile;
    //return null;
}

export const GetCurrency =() => {
    const restaurantinfo = useSelector(({ restaurant }) => restaurant.restaurantdetail);
    const location = restaurantinfo.defaultLocation;
    
    return location.currencysymbol;
}

export const MonthList = (mname) =>{
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return monthNames[mname];
}