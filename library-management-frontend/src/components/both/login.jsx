import { Link } from "react-router-dom";
import '../../assets/scss/both/login.scss';
import { MdArrowBack } from 'react-icons/md';
import { useEffect, useState } from "react";
import axios from "../../configs/axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import validationUtils from "../../utils/validationUtils";
import { toast } from 'react-toastify';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ACTION, GlobalContext } from "../../context/globalContext";
import { useSessionStorage } from "../../hooks/useStorage";
import _ from 'lodash';
import useToggle from "../../hooks/useToggle";
import { removeIsInvalidClass } from "../../utils/myUtils";


const Login = () => {
    const EMAIL_ADMIN = import.meta.env.VITE_EMAIL_ADMIN;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [isForget, toggleForget] = useToggle(false);
    const navigate = useNavigate();
    const { stateGlobal, dispatch } = useContext(GlobalContext);

    const [user, setUser] = useSessionStorage("user", null)

    const handleClearForm = () => {
        setEmail('');
        setPassword('');
    }


    const handleLoginAndForget = async (e) => {
        e?.preventDefault();
        try {
            let isValid = validationUtils.validate("loginAndForgetForm", isForget ? 'email' : '');
            if (!isValid) return;

            setIsDisabled(true);
            let data = await axios.post(`api/${isForget ? 'forget' : 'login'}`, {
                email,
                password
            });

            if (data && data.EC === 0) {
                if (isForget) {
                    toggleForget(false);
                    handleClearForm();
                    setIsDisabled(false);
                    return toast.success(data.EM);
                }

                window.sessionStorage.setItem("user", JSON.stringify({
                    fullName: data.DT.fullName,
                    email: data.DT.email,
                }))

                window.sessionStorage.setItem("jwt", data.DT.access_token);

                dispatch({
                    type: ACTION.GET_USER, payload: {
                        fullName: data.DT.fullName,
                        email: data.DT.email,
                    }
                })


                toast.success(data.EM);
                handleClearForm();
                // STUDENT
                // let isEmailStartsWithNumber = /^\d/.test(data.DT.email);
                return data.DT.email === EMAIL_ADMIN ? navigate("/admin/books") : navigate("/");
            } else {
                toast.error(data.EM);
            }
            setIsDisabled(false);
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error);
        }
    }

    useEffect(() => {
        if (window.sessionStorage.getItem("token-expired")) {
            window.sessionStorage.removeItem("token-expired")
            toast.error("Phiên login đã hết hạn, hãy login lại !")
        }
    }, [])

    return (
        <>
            {_.isEmpty(stateGlobal.user) &&
                <div className="formLogin container w-50 text-center">
                    <h3 className="my-3">{isForget ? 'FORGET' : 'LOGIN'}</h3>
                    <Form id="loginAndForgetForm" onSubmit={(e) => handleLoginAndForget(e)}>
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
                                onChange={(event) => {
                                    setEmail(event.target.value);
                                    removeIsInvalidClass(event);
                                }}
                            />
                        </FloatingLabel>

                        {!isForget &&
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
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                        removeIsInvalidClass(event);
                                    }}
                                />
                                <span onClick={() => setShowPassword(!showPassword)} className="eye me-3 position-absolute top-50 end-0 translate-middle-y">
                                    {showPassword ?
                                        <FaEyeSlash size={'24px'} />
                                        :
                                        <FaEye size={'24px'} />
                                    }
                                </span>
                            </FloatingLabel>
                        }

                        <Button disabled={isDisabled} className='btn w-100 mb-3' variant="primary" type="submit">
                            {isForget ? 'Confirm' : 'Login'}
                        </Button>
                    </Form>

                    <Button type="button" className="forget border-0 bg-white text-primary"
                        onClick={() => toggleForget()}
                    >{isForget ? 'Have account ?' : 'Forget password ?'}</Button>

                    <div className="goHome mt-4" >
                        <Link to="/"><MdArrowBack />Go to homepage</Link>
                    </div>
                </div>
            }

        </>
    )
}

export default Login;