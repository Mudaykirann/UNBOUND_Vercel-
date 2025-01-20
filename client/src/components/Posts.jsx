import { useEffect, useState } from 'react';
import PostItem from './PostItem';
import Loader from './Loader';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/posts.css';

function Posts() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);



    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;
    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiURL}/posts`);
                setPosts(response.data.posts);
                console.log(response.data.posts);
            } catch (error) {
                console.log(apiURL)
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
        <div className="home">
            <div className="home__left">
                <section className='posts'>
                    {Array.isArray(posts) && posts.length > 0 ? (
                        <div className='posts-grid'>
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
                        <h2 className='no-posts'>NO Posts Found.. 😔</h2>
                    )}
                </section>
            </div>
            {Array.isArray(posts) && posts.length > 0 &&
                <div className="sidebar">
                    <h3 className="sidebar__title">Categories of Blog Posts</h3>
                    <div className="categories-grid">
                        <span><Link className="category-link" to="posts/categories/Agriculture">Agriculture</Link></span>
                        <span><Link className="category-link" to="posts/categories/Business">Business</Link></span>
                        <span><Link className="category-link" to="posts/categories/Education">Education</Link></span>
                        <span><Link className="category-link" to="posts/categories/Entertainment">Entertainment</Link></span>
                        <span><Link className="category-link" to="posts/categories/Art">Art</Link></span>
                        <span><Link className="category-link" to="posts/categories/Investment">Investment</Link></span>
                        <span><Link className="category-link" to="posts/categories/Uncategorized">Uncategorized</Link></span>
                        <span><Link className="category-link" to="posts/categories/Weather">Weather</Link></span>
                    </div>
                </div>
            }
        </div>
    );

}

export default Posts;
