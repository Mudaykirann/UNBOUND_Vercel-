import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { UserContext } from '../context/UserContext.jsx';
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function Login() {
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });


    const [isShowPass, setisShowPass] = useState(false);

    const HandleShowPass = () => {
        setisShowPass(!isShowPass)
    }


    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { setcurrentuser } = useContext(UserContext);

    const changeInputHandler = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            if (!apiURL) {
                throw new Error("API base URL is not defined. Please check your environment variables.");
            }
            const response = await axios.post(`${apiURL}/users/login`, userData);
            const user = response.data;
            setcurrentuser(user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred during login. Please try again.");
        }
    };

    return (
        <section className="login">
            <div className="login-container">
                <h1>Log into ᑌᑎᗷOᑌᑎᗪ..</h1>
                <div className="main">
                    <div className="left-side">
                        <form onSubmit={loginUser}>
                            {error && <p className="form__error-message">{error}</p>}
                            <div className="input-group" >
                                <label htmlFor="email">EMAIL ADDRESS</label>
                                <input
                                    type="text"
                                    name="email"
                                    value={userData.email}
                                    onChange={changeInputHandler}
                                    autoFocus
                                    required />
                                <hr />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">PASSWORD</label>
                                <input
                                    type={isShowPass ? 'text' : 'password'}
                                    name="password"
                                    value={userData.password}
                                    onChange={changeInputHandler}
                                    required />
                                <hr />

                                <div className="show-pass" onClick={HandleShowPass}>{isShowPass ? <IoMdEyeOff /> : <IoMdEye />}</div>
                            </div>
                            <button type="submit" className="login-button">LOG IN</button>
                        </form>
                    </div>
                </div>
                <div className="footer-text">
                    <p>Dont have an account ?</p><Link to='/register'>Register</Link>
                </div>
            </div>
        </section>
    );
}

export default Login;
