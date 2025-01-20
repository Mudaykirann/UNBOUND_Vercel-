import { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { EditorContent, useEditor } from '@tiptap/react';
// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
// import Link from '@tiptap/extension-link';
// import MenuBar from '../components/Menubar';



// import { EditorState, convertToRaw } from 'draft-js';
// import { Editor } from 'react-draft-wysiwyg';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

function CreatePost() {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('uncategorized');
    const [desc, setDesc] = useState();
    const [thumbnail, setThumbnail] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { currentuser } = useContext(UserContext);
    const token = currentuser?.token;
    const navigate = useNavigate();

    // Redirect to login page if the user isn't logged in
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ align: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['link', 'image'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'bold', 'italic', 'underline', 'strike',
        'align', 'list', 'indent', 'header',
        'link', 'image',
        'clean',
    ];




    // const editor = useEditor({
    //     extensions: [StarterKit, Image, Link],
    //     content: '',
    //     autofocus: true,
    // });


    // const extensions = [
    //     Color.configure({ types: [TextStyle.name, ListItem.name] }),
    //     TextStyle.configure({ types: [ListItem.name] }),
    //     StarterKit.configure({
    //         bulletList: {
    //             keepMarks: true,
    //             keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    //         },
    //         orderedList: {
    //             keepMarks: true,
    //             keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    //         },
    //     }),
    // ]





    const POST_CATEGORIES = ["Agriculture", "Business", "Education", "Entertainment", "Art", "Investment", "Uncategorized", "Weather"];

    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }
        setThumbnail(file);
    };

    const createPost = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const PostData = new FormData();
        PostData.set('title', title);
        PostData.set('category', category);
        PostData.set('description', desc);
        //PostData.set('description', editor.getHTML());
        PostData.set('thumbnail', thumbnail);

        try {
            const res = await axios.post(`${apiURL}/posts`, PostData, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 201) {
                return navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className='create-post'>
            <div className='container'>
                <h2>Create Post</h2>
                {error && <p className='form__error-message'>{error}</p>}
                <form className='form create-post__form' onSubmit={createPost}>
                    <input
                        type='text'
                        placeholder='Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        autoFocus
                        required
                    />
                    <select
                        name='category'
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        required
                    >
                        {POST_CATEGORIES.map(cat => (
                            <option key={cat}>{cat}</option>
                        ))}
                    </select>

                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        value={desc}
                        onChange={setDesc}
                    />

                    {/* <EditorContent editor={editor} /> */}

                    {/* <EditorProvider slotBefore={<MenuBar />} extensions={extensions} content={content}></EditorProvider> */}


                    {/* <MenuBar editor={editor} />

                    <EditorContent editor={editor} className="editor" /> */}




                    <input
                        type='file'
                        onChange={handleFileChange}
                        accept='image/png, image/jpeg'
                        required
                    />
                    <button type='submit' className='btn primary' disabled={isLoading}>
                        {isLoading ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default CreatePost;


