import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "../../configs/axios";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MdArrowBack } from 'react-icons/md';
import '../../assets/scss/both/register.scss';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import validationUtils from "../../utils/validationUtils";
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { ACTION, GlobalContext } from "../../context/globalContext";
import { fetchData, removeIsInvalidClass } from "../../utils/myUtils";
import _ from 'lodash';
import { toast } from "react-toastify";

const Register = (props) => {

    const [fullName, setFullName] = useState("");
    const [classRoom, setClassRoom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();

    const handleClearForm = () => {
        setFullName('');
        setClassRoom('');
        setEmail('');
        setPassword('');
    }


    const handleRegister = async (e) => {
        e?.preventDefault();
        try {
            let isValid = validationUtils.validate("registerForm");
            if (isValid) {
                setIsDisabled(true);
                let data = await fetchData('POST', 'api/register', {
                    fullName,
                    classRoom,
                    email,
                    password
                })

                if (data && data.EC === 0) {
                    handleClearForm();
                    navigate('/login');
                    toast.success(data.EM);
                } else {
                    toast.error(data.EM);
                }
                setIsDisabled(false);
            }
        } catch (error) {
            toast.error("Some thing wrongs on client...");
            console.log(error);
        }
    }


    return (
        <>
            <div className="formRegister container w-50 text-center">
                <h3 className="my-3">REGISTER</h3>
                <Form id="registerForm" onSubmit={(e) => handleRegister(e)}>
                    <span className="d-flex gap-3 mb-3">
                        <FloatingLabel
                            controlId="floatingInput"
                            label="Full Name"
                            className="w-75"
                        >
                            <Form.Control
                                type="text"
                                placeholder="name@example.com"
                                name='fullName'
                                value={fullName}
                                onChange={(event) => {
                                    setFullName(event.target.value);
                                    removeIsInvalidClass(event);
                                }}
                            />
                        </FloatingLabel>

                        <Form.Select value={classRoom} name="classRoom"
                            className="w-25" aria-label="Default select example"
                            onChange={(event) => {
                                setClassRoom(event.target.value);
                                removeIsInvalidClass(event);
                            }}
                        >
                            <option hidden value=''>ClassRoom</option>
                            <option value="CD21CT2">CD21CT2</option>
                            <option value="CD21LM2">CD21LM2</option>
                            <option value="CD21DH2">CD21DH2</option>
                        </Form.Select>
                    </span>


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

                    <Button disabled={isDisabled} className='btn w-100 mb-3' variant="primary" type="submit">
                        Register
                    </Button>
                </Form>
                <div className="goHome mt-3 " >
                    <Link to="/"><MdArrowBack />Go to homepage</Link>
                </div>
            </div>


        </>
    )
}

export default Register;