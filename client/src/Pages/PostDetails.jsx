import { Link, useParams } from "react-router-dom";
import PostAuthor from "../components/PostAuthor";
import { UserContext } from '../context/UserContext';
import { useState, useEffect, useContext } from "react";
import Loader from "../components/Loader";
import DeletePost from './DeletePost';
import axios from 'axios';

function PostDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [creatorID, setCreatorID] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    const { currentuser } = useContext(UserContext);

    useEffect(() => {
        const getPost = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${apiURL}/posts/${id}`);
                setPost(res.data.post);
                setCreatorID(res.data.creator);
            } catch (error) {
                setError("Failed to load the post. Please try again.");
                console.log(error);
            }
            setIsLoading(false);
        };
        getPost();
    }, [id, apiURL]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <section className="post-detail">
            {error && <p className="error">{error}</p>}
            {post && (
                <div className="container post-detail__container">
                    <h1 className="post_detail_title">{post.title}</h1>
                    <div className="post-detail__header">
                        <PostAuthor authorID={post.creator} createdAt={post.createdAt} creatorID={creatorID} />
                        {currentuser?.id === post?.creator && (
                            <div className="post-detail__buttons">
                                <Link to={`/posts/${post._id}/edit`} className="btn sm primary">Edit</Link>
                                <DeletePost postId={post._id} />
                            </div>
                        )}
                    </div>
                    <div className="post-detail__thumbnail">
                        <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt={post.title} />
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
                </div>
            )}
        </section>
    );
}

export default PostDetails;
