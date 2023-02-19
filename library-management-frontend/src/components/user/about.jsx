import { useContext, useEffect } from "react";
import { ACTION, GlobalContext } from "../../context/globalContext";
import { useSessionStorage } from '../../hooks/useStorage';


const About = (props) => {
    const { stateGlobal, dispatch } = useContext(GlobalContext);

    return (
        <p>This is about</p>
    )
}

export default About;