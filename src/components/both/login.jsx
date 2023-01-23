import { Link } from "react-router-dom";
import '../../assets/scss/both/login.scss';
import { MdArrowBack } from 'react-icons/md';
import { useState } from "react";
import axios from "../../configs/axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import validationUtils from "../../utils/validationUtils";
// import { toast } from 'react-toastify';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const LIST_EMAIL_ADMIN_JSON = import.meta.env.VITE_LIST_EMAIL_ADMIN_JSON;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const navigate = useNavigate();

    const handleClearForm = () => {
        setEmail('');
        setPassword('');
    }


    const handleLogin = async () => {
        try {
            let isValid = validationUtils.validate("loginForm");
            if (isValid) {
                // setIsWaiting(true);
                let data = await axios.post('api/login', {
                    email,
                    password
                });

                if (data && data.EC === 0) {
                    window.sessionStorage.setItem("user", JSON.stringify(data.DT))

                    let isEmailStartsWithNumber = /^\d/.test(data.DT.email);
                    let isAdminAccount = JSON.parse(LIST_EMAIL_ADMIN_JSON).some(item => item === data.DT.email);
                    // ADMIN
                    if (isAdminAccount) {
                        navigate("/admin", { state: {} });
                    }

                    // STUDENT
                    if (isEmailStartsWithNumber && !isAdminAccount) {
                        // navigate("/", { state: { student: data.DT } });
                        navigate("/");
                    }

                    // toast.success(data.EM);
                    handleClearForm();
                } else {
                    // setIsWaiting(false);
                    // toast.error(data.EM);
                }
            }
        } catch (error) {
            // toast.error("Some thing wrongs on client...");
            console.log(error);
        }
    }

    const handleEnter = (event) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    }

    return (
        <>
            <div className="formLogin container w-50 text-center">
                <h3 className="my-3">LOGIN</h3>
                <Form id="loginForm" onKeyUp={(event) => handleEnter(event)}>
                    <FloatingLabel
                        controlId="floatingInput"
                        label="Email"
                        className="mb-3"
                    >
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            name='email'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                        // onChange={(event) => handleOnChange(event)}
                        />
                    </FloatingLabel>

                    <FloatingLabel
                        controlId="floatingInput"
                        label="Password"
                        className="mb-3 position-relative"
                    >
                        <Form.Control
                            type={showPassword ? "password" : "text"}
                            placeholder="name@example.com"
                            name='password'
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        // onChange={(event) => handleOnChange(event)}
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="eye me-3 position-absolute top-50 end-0 translate-middle-y">
                            {showPassword ?
                                <FaEyeSlash size={'24px'} />
                                :
                                <FaEye size={'24px'} />
                            }
                        </span>
                    </FloatingLabel>

                    {/* <button type="button" className="btn btn-primary w-100">Login</button> */}
                    <Button disabled={isWaiting} className='btn w-100 mb-3' variant="primary" type="button" onClick={() => handleLogin()}>
                        Login
                    </Button>
                </Form>
                <Link className="forget" to="/forget">Forget password ?</Link>
                <div className="goHome mt-4" >
                    <Link to="/"><MdArrowBack />Go to homepage</Link>
                </div>
            </div>
        </>
    )
}

export default Login;