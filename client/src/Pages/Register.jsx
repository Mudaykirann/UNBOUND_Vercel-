import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function Register() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    const [isShowPass, setisShowPass] = useState(false);

    const HandleShowPass = (pass) => {
        setisShowPass(!isShowPass)
    }

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const changeInputHandler = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };


    const apiUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiUrl}/users/register`, userData);
            const newUser = response.data;
            console.log(response.data);

            if (!newUser) {
                setError("Couldn't register the user. Please try again.");
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during registration.");
        }
    };

    return (
        <section className="register">
            <div className="login-container">
                <h1>Sign Up</h1>
                <form className="form register__form" onSubmit={registerUser}>
                    {error && <p className="form__error-message">{error}</p>}
                    <div className="input-group" >
                        <label htmlFor="email">FULL NAME</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={changeInputHandler}
                            autoFocus
                            required />
                        <hr />
                    </div>
                    <div className="input-group" >
                        <label htmlFor="email">EMAIL</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={changeInputHandler}
                            required />
                        <hr />
                    </div>
                    <div className="input-group" >
                        <label htmlFor="email">PASSWORD</label>
                        <input
                            type={isShowPass ? 'text' : 'password'}
                            name="password"
                            value={userData.password}
                            onChange={changeInputHandler}
                            required />
                        <hr />
                        <div className="show-pass" onClick={HandleShowPass}>{isShowPass ? <IoMdEyeOff /> : <IoMdEye />}</div>
                    </div>

                    <div className="input-group" >
                        <label htmlFor="email">CONFIRM PASSWORD</label>
                        <input
                            type={isShowPass ? 'text' : 'password'}
                            name="password2"
                            value={userData.password2}
                            onChange={changeInputHandler}
                            required />
                        <hr />
                        <div className="show-pass" onClick={HandleShowPass}>{isShowPass ? <IoMdEyeOff /> : <IoMdEye />}</div>
                    </div>

                    <button type="submit" className="register-btn">Register</button>
                </form>
                <small>Already have an account? <Link to='/login'>Login</Link></small>
            </div>
        </section>
    );
}

export default Register;
