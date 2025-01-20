import { useState, useContext, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { UserContext } from '../context/UserContext'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'



function EditPost() {
    const [title, settitle] = useState('')
    const [category, setcategory] = useState('uncategorized')
    const [desc, setDexsc] = useState('')
    const [thumbnail, setthumbnail] = useState('')
    const [error, setError] = useState();


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


    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: [] }],

            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image',],

            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        },
    }

    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'align', 'list', 'indent', 'header',
        'link', 'image',
        'clean',
    ]

    const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"]


    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    useEffect(() => {
        const getPost = async () => {
            try {
                const res = await axios.get(`${apiURL}/posts/${id}`);
                settitle(res.data.post.title)
                setDexsc(res.data.post.description)
                setcategory(res.data.post.category)
                console.log(res)
            } catch (error) {
                console.log(error)
            }
        }

        getPost();
    }, [])

    const EditPost = async (e) => {
        e.preventDefault();

        const PostData = new FormData();
        PostData.set('title', title);
        PostData.set('category', category);
        PostData.set('description', desc);
        PostData.set('thumbnail', thumbnail);

        try {
            const res = await axios.patch(`${apiURL}/posts/${id}`, PostData, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                return navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
            console.log(err);
        }
    }

    return (
        <section className='create-post'>
            <div className='container'>
                <h2>Edit Post</h2>
                {error && <p className='form__error-message'>
                    {error}
                </p>}
                <form className='form create-post__form' onSubmit={EditPost}>
                    <input type='text' placeholder='Title' value={title} onChange={e => settitle(e.target.value)} autoFocus />
                    <select name='category' value={category} onChange={e => setcategory(e.target.value)} className=''>
                        {
                            POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
                        }
                    </select>

                    <ReactQuill modules={modules} formats={formats} value={desc} onChange={setDexsc} />
                    <input type='file' onChange={e => setthumbnail(e.target.files[0])} accept='png,jpg,jpeg' />
                    <button type='submit' className='btn primary'>Update</button>
                </form>
            </div>
        </section>
    )
}

export default EditPost
