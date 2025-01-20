import { useState, useEffect } from "react";
import axios from 'axios'
import Loader from "../components/Loader";
import PostItem from "../components/PostItem";
import { useParams } from "react-router-dom";
function AuthorPosts() {

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams()



    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiURL}/posts/users/${id}`);
                setPosts(response.data.posts);
                console.log(response.data.posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }


        };

        setIsLoading(false)

        fetchPosts();
    }, []);


    if (!isLoading) {
        return <Loader />;
    }

    return (
        <section className='posts'>
            {Array.isArray(posts) && posts.length > 0 ? (
                <div className='container'>
                    {posts.map((post) => (
                        <PostItem
                            key={post._id}
                            postID={post._id}
                            thumbnail={post.thumbnail}
                            category={post.category}
                            title={post.title}
                            desc={post.description}
                            authID={post.creator}
                            createdAt={post.createdAt}
                        />
                    ))}
                </div>
            ) : (
                <h2 className='center'>NO Posts Found</h2>
            )}
        </section>
    );

}

export default AuthorPosts
