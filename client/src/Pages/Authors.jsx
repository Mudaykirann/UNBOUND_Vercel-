import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../components/Loader'


function Authors() {
    const [authors, setauthors] = useState([])

    const [isLoading, setIsLoading] = useState(false)


    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    useEffect(() => {
        const getAuthors = async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(`${apiURL}/users`)
                setauthors(res.data)
                console.log(res.data)
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        }

        getAuthors();
    }, [apiURL])


    if (isLoading) {
        return <Loader />
    }
    return (
        <section className='authors'>
            {
                authors.length > 0 ? <div className='container authors__container'>
                    {
                        authors.map((auth) => {
                            return (
                                <Link key={auth._id} className='author' to={`/posts/users/${auth._id}`}>
                                    <div className='author__avatar'>
                                        <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${auth.avatar}`} alt={auth.name} />
                                    </div>
                                    <div className='author__info'>
                                        <h4>{auth.name}</h4>
                                        <p>{auth.post} posts</p>
                                    </div>
                                </Link>
                            )
                        })
                    }
                </div> : <h2 className='center'>NO Authors/Users Found.</h2>
            }
        </section>
    )
}

export default Authors
