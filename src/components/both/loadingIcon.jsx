import { useEffect } from "react";
import { useState } from "react";
import FadeLoader from "react-spinners/FadeLoader";
import { TfiFaceSad } from 'react-icons/tfi';
import { useMemo } from "react";

const LoadingIcon = ({ classCss, timeSeconds }) => {
    timeSeconds = +import.meta.env.VITE_TIME_HIDE_LOADING_ICON_COMPONENT;

    const time = useMemo(() => timeSeconds ?? +import.meta.env.VITE_TIME_HIDE_LOADING_ICON_COMPONENT, [timeSeconds]);

    const [isOverTime, setIsOverTime] = useState(false);

    useEffect(() => {
        if (time > 0)
            setTimeout(() => {
                setIsOverTime(true)
            }, time * 1000)
    }, [])

    return (
        <div className={`d-flex justify-content-center align-items-center flex-column mt-5 ${classCss}`}>
            {isOverTime ?
                <>
                    <h4 className="text-center text-secondary">Not found! <TfiFaceSad /></h4>
                </>
                :
                <>
                    <FadeLoader color="#36d7b7" />
                    <span>Loading...</span>
                </>
            }

        </div>
    )
}


export default LoadingIcon;