import { toast, Slide } from "react-toastify";
import { ToasterPositions } from "./toaster-positions";
import { ToasterTypes } from "./toaster-types";

const handleNotify = (messagetext, position, action) => {
    let toasterposition = ToasterPositions.BottomRight;

    switch (position) {
        case ToasterPositions.TopLeft:
            toasterposition = ToasterPositions.TopLeft;
            break;
        case ToasterPositions.TopRight:
            toasterposition = ToasterPositions.TopRight;
            break;
        case ToasterPositions.TopCenter:
            toasterposition = ToasterPositions.TopCenter;
            break;
        case ToasterPositions.BottomLeft:
            toasterposition = ToasterPositions.BottomLeft;
            break;
        case ToasterPositions.BottomRight:
            toasterposition = ToasterPositions.BottomRight;
            break;
        case ToasterPositions.BottomCenter:
            toasterposition = ToasterPositions.BottomCenter;
            break;
        default:
            break;
    }

    toast.dismiss();    

    switch (action) {
        case ToasterTypes.Success:
        toast.success(messagetext, {
                position: toasterposition,
                autoClose: 5000,
                hideProgressBar: true,
                limit: 1,
                transition: Slide,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            break;
        case ToasterTypes.Info:
            toast.info(messagetext, {
                position: toasterposition,
                autoClose: 5000,
                hideProgressBar: true,
                limit: 1,
                transition: Slide,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            break;
        case ToasterTypes.Warning:
            toast.warning(messagetext, {
                position: toasterposition,
                autoClose: 5000,
                hideProgressBar: true,
                limit: 1,
                transition: Slide,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            break;
        case ToasterTypes.Error:
            toast.error(messagetext, {
                position: toasterposition,
                autoClose: 5000,
                hideProgressBar: true,
                limit: 1,
                transition: Slide,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            break;
        case ToasterTypes.Dark:
            toast.dark(messagetext, {
                position: toasterposition,
                autoClose: 5000,
                hideProgressBar: true,
                limit: 1,
                transition: Slide,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            break;
        case ToasterTypes.Default:
            toast.default(messagetext, {
                position: toasterposition,
                autoClose: 5000,
                hideProgressBar: true,
                limit: 1,
                transition: Slide,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            break;

        default:
            toast.default(messagetext, {
                position: toasterposition,
                autoClose: 5000,
                hideProgressBar: true,
                limit: 1,
                transition: Slide,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            break;

    }
}

export default handleNotify;