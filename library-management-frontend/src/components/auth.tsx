import * as React from "react";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Link from "@mui/material/Link";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { fetchData, mySessionStorage } from "../utils/myUtils";
import { HTTPMethods, ResAxios, User } from "../types/types";
import { useAppDispatch } from "../redux/hooks";
import { useSessionStorage } from "../hooks/useStorage";
import { toast } from "react-toastify";

export default function Auth() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [isRegister, setIsRegister] = React.useState(false);
    const { page } = useParams();
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = (await fetchData(
            HTTPMethods.POST,
            isRegister ? "/register" : "/login",
            {
                email,
                password,
                fullName,
            },
        )) as ResAxios;

        if (data.EC === 0) {
            if (isRegister) {
                setFullName("");
                setIsRegister(false);
                toast.success(data.EM);
                return;
            }

            setEmail("");
            setPassword("");
            navigate("/", { state: { user: data.DT } });
            toast.success(data.EM);
        } else {
            toast.error(data.EM);
        }
    };

    React.useEffect(() => {
        setIsRegister(page === "register" ? true : false);
    }, [page]);

    return (
        <>
            <div className="container text-center">
                <h3>{isRegister ? "Register" : "Login"}</h3>
                <Box
                    component="form"
                    // noValidate
                    autoComplete="off"
                    className="d-flex flex-column align-items-center"
                    onSubmit={handleSubmit}
                >
                    {isRegister ? (
                        <TextField
                            id="outlined-required"
                            label="Full Name"
                            className="w-50 mb-3"
                            value={fullName}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setFullName(event.target.value);
                            }}
                        />
                    ) : (
                        <></>
                    )}

                    <TextField
                        type="email"
                        required
                        id="outlined-required"
                        label="Email"
                        className="w-50 mb-3"
                        value={email}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <FormControl
                        required
                        variant="outlined"
                        className="w-50 mb-3"
                    >
                        <InputLabel htmlFor="outlined-adornment-password">
                            Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            value={password}
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                                setPassword(event.target.value);
                            }}
                        />
                    </FormControl>

                    <Button
                        color={isRegister ? "secondary" : "inherit"}
                        className="w-50 mb-3"
                        type="submit"
                        variant="contained"
                        endIcon={<SendIcon />}
                    >
                        Submit
                    </Button>

                    <NavLink to={isRegister ? "/auth/login" : "/auth/register"}>
                        {isRegister
                            ? "Login with account"
                            : "Dont't have account ?"}
                    </NavLink>

                    <div className="">
                        <Button>
                            <FacebookIcon fontSize="large" />
                        </Button>

                        <Button>
                            <GoogleIcon color={"success"} fontSize="large" />
                        </Button>
                    </div>
                </Box>
            </div>
        </>
    );
}
