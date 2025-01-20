import { useState, useContext, useEffect } from "react"
import { Link, useParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import axios from "axios";
import DeletePost from "./DeletePost";


function Dashboard() {
    const [posts, setposts] = useState([])
    const [isloading, setIsLoading] = useState(false)



    const { currentuser } = useContext(UserContext)
    const token = currentuser?.token;
    const navigate = useNavigate()
    const { id } = useParams();


    //redirect to login page if the user isn't logged in
    useEffect(() => {
        if (!token) {

            navigate('/login')
        }
    }, [])


    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`${apiURL}/posts/users/${id}`,
                    { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
                )
                setposts(res.data.posts)
                console.log(res.data.posts)
            } catch (error) {
                console.log(error)
            }

            setIsLoading(false)
        }
        fetchPosts();
    }, [])

    if (isloading) {
        return <Loader />
    }



    return (
        <section>
            {
                posts.length > 0 ? <div className="container dashboard__container">
                    {
                        posts.map(post => {
                            return (
                                <Link key={post._id} to={`/posts/${post._id}`}>
                                    <article key={post.id} className="dashboard__post">
                                        <div className="dashboard__post-info">
                                            <div className="dashboard__post-thumbnail">
                                                <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                                            </div>
                                            <h5>{post.title}</h5>
                                        </div>
                                        <div className="dashboard__post-actions">
                                            <Link to={`/posts/${post._id}/edit`} className="btn sm primary">Edit</Link>
                                            <DeletePost postId={post._id} />
                                        </div>
                                    </article>
                                </Link>
                            )
                        })
                    }
                </div> : <h2 className="center">You have no posts yet.</h2>
            }
        </section>
    )
}

export default Dashboard
