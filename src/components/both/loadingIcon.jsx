import FadeLoader from "react-spinners/FadeLoader";

const LoadingIcon = (props) => {
    return (
        <div className='d-flex justify-content-center align-items-center flex-column mt-5'>
            <FadeLoader color="#36d7b7" />
            <span>Loading...</span>
        </div>
    )
}


export default LoadingIcon;