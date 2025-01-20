import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostItem from "../components/PostItem";
import axios from "axios";
import Loader from "../components/Loader";

function Category() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { category } = useParams();
    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiURL}/posts/categories/${category}`);
                setPosts(response.data.posts);
                console.log(response.data.posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [category, apiURL]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <section className='posts'>
            {Array.isArray(posts) && posts.length > 0 ? (
                <div className='my-container'>
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

export default Category;
