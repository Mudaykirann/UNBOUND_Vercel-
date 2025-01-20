import { useEffect, useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';

function DeletePost({ postId: id }) {
    const { currentuser } = useContext(UserContext);
    const token = currentuser?.token;
    const navigate = useNavigate();
    const location = useLocation();

    const [isloading, setIsLoading] = useState();


    // Redirect to login page if the user isn't logged in
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    const removePost = async () => {
        setIsLoading(true)
        try {
            const res = await axios.delete(`${apiURL}/posts/${id}`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.status === 200) {
                if (location.pathname === `/myposts/${currentuser.id}`) {
                    navigate(0);
                } else {
                    navigate('/');
                }
            }
            setIsLoading(false)
        } catch (error) {
            console.error("Failed to delete post:", error.response || error.message);
        }
    };


    if (isloading) {
        return <Loader />
    }


    return (
        <Link className='btn sm danger' onClick={removePost}>Delete</Link>
    );
}

export default DeletePost;
