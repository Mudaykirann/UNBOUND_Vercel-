import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import DOMPurify from 'dompurify';

function PostItem({ postID, id, thumbnail, createdAt, category, title, desc, authID }) {
    const shortDesc = desc.length > 145 ? desc.substr(0, 155) + "....." : desc;
    const shortTitle = title.length > 30 ? title.substr(0, 50) + "..." : title;

    const sanitizedDesc = DOMPurify.sanitize(shortDesc);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "short", day: "numeric", year: "numeric" };
        return date.toLocaleDateString("en-US", options);
    };

    return (
        <article className="post-card">
            <div className="post-card-body">
                <PostAuthor authorID={authID} createdAt={createdAt} />
                <Link to={`/posts/${postID}`}>
                    <h3 className="post-card-title">{shortTitle}</h3>
                </Link>
                <p className="post-card-description" dangerouslySetInnerHTML={{ __html: sanitizedDesc }} />
                <div className="post-card-footer">
                    <div className="post-card-footer-details">
                        <div className="post-card-footer-details__time">
                            <span>⭐</span>
                            <p>{formatDate(createdAt)}</p>
                        </div>
                    </div>
                    <Link to={`/posts/categories/${category}`} className="btn post-card-category">{category}</Link>
                </div>
            </div>
            <div className="post-card-thumbnail">
                <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
            </div>
        </article>
    );
}

export default PostItem;
