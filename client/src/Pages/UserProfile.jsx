// import { Link } from "react-router-dom"
// import { FaCheck, FaEdit } from "react-icons/fa";
// import { useState, useEffect, useContext } from "react";
// import { UserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";



// function UserProfile() {

//     const [Avatar, setAvatar] = useState()

//     const [name, setname] = useState('')
//     const [email, setemail] = useState('')
//     const [Currentpassword, setCurrentpassword] = useState('')
//     const [NewPassword, setNewPassword] = useState('')
//     const [ConfirmNewPassword, setConfirmNewPassword] = useState('')
//     const [Error, setError] = useState()
//     const [isAvatarTouched, setisAvatarTouched] = useState(false)



//     const { currentuser } = useContext(UserContext)
//     const token = currentuser?.token;
//     const navigate = useNavigate()



//     //redirect to login page if the user isn't logged in
//     useEffect(() => {
//         if (!token) {

//             navigate('/login')
//         }
//     }, [])


//     useEffect(() => {
//         const getUser = async () => {
//             try {
//                 const res = await axios.get(`${apiURL}/users/${currentuser.id}`, {
//                     withCredentials: true,
//                     headers: { Authorization: `Bearer ${token}` }
//                 });

//                 const { name, email, avatar } = res.data;
//                 console.log(res.data)
//                 setname(name);
//                 setAvatar(avatar)
//                 setemail(email)
//             } catch (error) {
//                 console.log(error)
//             }
//         }

//         getUser();
//     }, [])



//     const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

//     const changeAvatarHandler = async () => {
//         setisAvatarTouched(false);
//         try {
//             const PostData = new FormData();
//             PostData.set('avatar', Avatar);
//             const res = await axios.post(`${apiURL}/users/change-avatar`, PostData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
//             console.log(res.data)
//             setAvatar(res?.data.avatar);
//         } catch (error) {
//             setError(error)
//         }
//     }


//     const updateuserDetails = async (e) => {
//         e.preventDefault();

//         const userData = new FormData()
//         userData.set('name', name)
//         userData.set('email', name)
//         userData.set('currentPassword', Currentpassword)
//         userData.set('newPassword', NewPassword)
//         userData.set('NewconfirmPassword', ConfirmNewPassword)
//         try {
//             const res = await axios.patch(`${apiURL}/users/edit-user`, userData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
//             if (res.status == 200) {
//                 //logoout the user
//                 return navigate('/logout')
//             }
//         } catch (error) {
//             setError(error)
//             console.log(error)
//         }
//     }
//     return (
//         <section>
//             <div className="container profile__container">
//                 <Link className="btn" to={`/myposts/${currentuser.id}`}>My Posts</Link>

//                 <div className="profile__details">
//                     <div className="avatar__wrapper">
//                         <div className="profile_avatar">
//                             <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${Avatar}`} alt="" />
//                         </div>
//                         <form className="avatar__form">
//                             <input type="file" name="avatar" id="avatar" onChange={(e) => setAvatar(e.target.files[0])} accept="png,jpg,jpeg" />
//                             <label htmlFor="avatar" onClick={() => { setisAvatarTouched(true) }}><FaEdit /></label>
//                         </form>
//                         {isAvatarTouched && <button className="profile__avatar-btn" onClick={changeAvatarHandler}><FaCheck /></button>}
//                     </div>
//                     <h1>{currentuser.name}</h1>


//                     <form className="form profile__form" onSubmit={updateuserDetails}>
//                         {Error && <p className="form__error-message">{Error}</p>}
//                         <input type="text" placeholder="Full Name" value={name} onChange={e => setname(e.target.value)} />
//                         <input type="email" placeholder="Email" value={email} onChange={e => setemail(e.target.value)} />
//                         <input type="password" placeholder="Current Password" value={Currentpassword} onChange={e => setCurrentpassword(e.target.value)} />
//                         <input type="password" placeholder="New Password" value={NewPassword} onChange={e => setNewPassword(e.target.value)} />
//                         <input type="password" placeholder="Confirm New Password" value={ConfirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
//                         <button className="btn primary">Update details</button>
//                     </form>
//                 </div>
//             </div>
//         </section>
//     )
// }
// export default UserProfile



import { Link } from "react-router-dom";
import { FaCheck, FaEdit } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UserProfile() {
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [NewconfirmPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isAvatarTouched, setIsAvatarTouched] = useState(false);

    const { currentuser, setCurrentUser } = useContext(UserContext); // Use setCurrentUser to update context
    const token = currentuser?.token;
    const navigate = useNavigate();

    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    useEffect(() => {
        if (!token) {
            navigate('/login');
        } else {
            setAvatar(currentuser.avatar);
            setName(currentuser.name);
            setEmail(currentuser.email);
        }
    }, [token, navigate, currentuser]);

    const changeAvatarHandler = async () => {
        if (!avatar) {
            setError('Please select an avatar image.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('avatar', avatar);
            const res = await axios.post(`${apiURL}/users/change-avatar`, formData, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(res);
            setAvatar(res.data.avatar);
            setCurrentUser((prev) => ({ ...prev, avatar: res.data.avatar }));
            setIsAvatarTouched(false);
        } catch (error) {
            setError('Failed to update avatar. Please try again later.');
        }
    };

    const updateUserDetails = async (e) => {
        e.preventDefault();

        const userData = {
            name,
            email,
            currentPassword,
            newPassword,
            NewconfirmPassword,
        };

        try {
            const res = await axios.patch(`${apiURL}/users/edit-user`, userData, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(res)

            if (res.status === 200) {
                return navigate('/logout');
            }
        } catch (error) {
            setError('Failed to update user details. Please check your inputs.');
        }
    };

    return (
        <section>
            <div className="container profile__container">
                <Link className="btn" to={`/myposts/${currentuser.id}`}>My Posts</Link>
                <div className="profile__details">
                    <div className="avatar__wrapper">
                        <div className="profile_avatar">
                            <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="" />
                        </div>
                        <form className="avatar__form">
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                onChange={(e) => {
                                    setAvatar(e.target.files[0]);
                                    setIsAvatarTouched(!isAvatarTouched);
                                }}
                                accept="image/png, image/jpeg"
                            />
                            <label htmlFor="avatar">
                                {isAvatarTouched ? <FaCheck /> : <FaEdit />}
                            </label>
                        </form>
                        {isAvatarTouched && (
                            <button className="profile__avatar-btn" onClick={changeAvatarHandler}>
                                <FaCheck />
                            </button>
                        )}
                    </div>
                    <h1>{currentuser.name}</h1>
                    <form className="form profile__form" onSubmit={updateUserDetails}>
                        {error && <p className="form__error-message">{error}</p>}
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={NewconfirmPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <button className="btn primary">Update details</button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default UserProfile;















