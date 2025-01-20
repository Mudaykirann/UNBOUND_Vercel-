import { Link } from "react-router-dom"
//import avatar1 from '../assets/avatar1.jpg'
import { useEffect, useState } from "react"
import axios from 'axios'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'


TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)






function PostAuthor({ createdAt, authorID }) {

    const [author, setAuthor] = useState()

    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL

    useEffect(() => {
        const getAuthor = async () => {
            try {
                const response = await axios.get(`${apiURL}/users/${authorID}`)
                setAuthor(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        getAuthor();
    }, [])


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { month: "short", day: "numeric", year: "numeric" }; // Example: "Oct 20"
        return date.toLocaleDateString("en-US", options);
    };


    return (
        <Link to={`/posts/users/${authorID}`} className="post__author">
            <div className="my-post__author-avatar">
                <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`} alt="" />
            </div>
            <div className="post__author-details">
                <h5>{author?.name}</h5>
                <p>{formatDate(createdAt)}</p>
            </div>
        </Link>
    )
}

export default PostAuthor
