
import { TextField, FormHelperText } from "@mui/material"
import { useState } from "react"
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { isEmpty, isPasswordValid, isEmailValid, passwordcheck } from "../../helper/validation";
import axios from "axios";
import { setUSerData } from "../../redux/store";

export const SignUp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userdata = useSelector((state) => state.userData)
    
    const [error, setError] = useState({
        emailred: false,
        namered: false,
        passwordred: false,
        confirmpasswordred: false,
    })
    const [errordef, seterrordef] = useState({
        emailerr: "",
        nameerr: "",
        passworderr: "",
        confirmpassworderr: ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        Password: "",
        confirmpassword: ""
    })


    const handleChange = (event) => {
        setUserData({
            ...userData,
            [event.target.name]: event.target.value
        });
    }




    const handleSubmission = () => {
        let errors = {
            emailred: false,
            namered: false,
            passwordred: false,
            confirmpasswordred: false,
        };

        let errorMessages = {
            emailerr: "",
            nameerr: "",
            passworderr: "",
            confirmpassworderr: ""
        };

        // Validate email
        if (isEmpty(userData.email)) {
            errors.emailred = true;
            errorMessages.emailerr = "Email can't be empty";
        } else if (isEmailValid(userData.email)) {
            errors.emailred = true;
            errorMessages.emailerr = "Enter a valid email";
        }

        // Validate name
        if (isEmpty(userData.name)) {
            errors.namered = true;
            errorMessages.nameerr = "Name can't be empty";
        }

        // Validate password
        if (isEmpty(userData.Password)) {
            errors.passwordred = true;
            errorMessages.passworderr = "Password can't be empty";
        } else if (isPasswordValid(userData.Password)) {
            errors.passwordred = true;
            errorMessages.passworderr = "Password is too weak";
        }

        // Validate confirm password
        if (isEmpty(userData.confirmpassword)) {
            errors.confirmpasswordred = true;
            errorMessages.confirmpassworderr = "Confirm password can't be empty";
        } else if (passwordcheck(userData.Password, userData.confirmpassword)) {
            errors.confirmpasswordred = true;
            errorMessages.confirmpassworderr = "Passwords don't match";
        }

        setError(errors);
        seterrordef(errorMessages);


        if (!errors.emailred && !errors.namered && !errors.passwordred && !errors.confirmpasswordred) {
            async function register() {
                try {

                    await axios.post('http://localhost:4014/signup/', userData)
                        .then((response) => {
                            if (response.data.success) {
                                axios.get('http://localhost:4014/fetchuserdata/').then((response) => {
                                    dispatch(setUSerData(response.data))
                                })
                                navigate('/home')

                            } else if (response.data.error) {
                                setError((previous) => ({
                                    ...previous,
                                    emailred: true
                                }))
                                seterrordef((previous) => ({
                                    ...previous,
                                    emailerr: response.data.error
                                }))
                            }
                        })

                } catch (error) {
                    console.log(error);
                }
            }
            register()
        }
    };


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };



    return (
        <>
            <div className="h-screen w-screen bg-blue-950 flex justify-center items-center">
                <div className="w-[70%] md:w-[28%] h-[90%] border border-gray-500 rounded flex flex-col items-center justify-center gap-8 pt-4">
                    <span className="text-white text-3xl font-bold">SignUp</span>
                    <TextField
                        onChange={handleChange}
                        name="name"
                        className="w-[80%] "
                        id="outlined-basic"
                        InputLabelProps={{ style: { color: 'white' } }}
                        inputProps={{ style: { color: 'white' } }}
                        error={error.namered}
                        label="Name"
                        variant="outlined"
                        helperText={errordef.nameerr}
                    />
                    <TextField
                        onChange={handleChange}
                        name="email"
                        className="w-[80%]"
                        id="outlined-basic"
                        inputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: 'white' } }}

                        error={error.emailred}
                        label="Email"
                        variant="outlined"
                        helperText={errordef.emailerr}
                    />

                    <FormControl sx={{ mt: 2, width: '80%' }} variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password" sx={{ color: 'white' }}>
                            Password
                        </InputLabel>
                        <OutlinedInput

                            onChange={handleChange}
                            name="Password"
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            error={error.passwordred}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"

                            sx={{ color: 'white', borderColor: '#ff5733' }}
                        />
                        <FormHelperText sx={{ color: 'red' }}>{errordef.passworderr}</FormHelperText>
                    </FormControl>
                    <TextField
                        onChange={handleChange}
                        name="confirmpassword"
                        className="w-[80%]"
                        id="outlined-basic"
                        InputLabelProps={{ style: { color: 'white' } }}
                        InputProps={{ style: { borderColor: '#ff5733' } }}
                        error={error.confirmpasswordred}
                        type="password"
                        inputProps={{ style: { color: 'white' } }}
                        label="Confirm Password"
                        variant="outlined"
                        helperText={errordef.confirmpassworderr}
                    />
                    <button onClick={handleSubmission} className=" w-[80%] h-[8%] rounded bg-blue-900 text-white hover:bg-blue-800">Signup</button>
                    <span onClick={() => navigate('/login')} className="text-white text-sm w-full flex justify-end pr-12 cursor-pointer">Already signup? login</span>
                </div>

            </div>
        </>
    )

}