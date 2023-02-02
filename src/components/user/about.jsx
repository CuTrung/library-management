import { useContext, useEffect } from "react";
import { ACTION, GlobalContext } from "../../context/globalContext";

const About = (props) => {

    const { stateGlobal, dispatch } = useContext(GlobalContext);


    useEffect(() => {
        dispatch({ type: ACTION.SET_CATEGORY_IDS_CONTENT_LIBRARY, payload: null })
    }, [])
    return (
        <p>This is about</p>
    )
}

export default About;