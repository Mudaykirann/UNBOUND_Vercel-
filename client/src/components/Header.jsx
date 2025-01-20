import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { FiEdit } from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import { MdOutlineDashboard } from "react-icons/md";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { RiPagesLine } from "react-icons/ri";
import { LuUser2 } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { FiPlusCircle } from "react-icons/fi";
import { TbLogin } from "react-icons/tb";
import { useContext, useEffect, useState } from "react";
import { UserContext } from '../context/UserContext';
import axios from "axios";
import '../styles/posts.css';

function Header() {
    const [isNavOpen, setIsNavOpen] = useState(window.innerWidth > 800);
    const [avatar, setAvatar] = useState(null);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const { currentuser } = useContext(UserContext);

    const apiURL = import.meta.env.VITE_REACT_APP_BASE_URL;

    useEffect(() => {
        const getUser = async () => {
            if (!currentuser?.id) return;
            try {
                const res = await axios.get(`${apiURL}/users/${currentuser.id}`);
                setAvatar(res.data.avatar);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        getUser();
    }, [currentuser, apiURL]);

    useEffect(() => {
        const handleResize = () => {
            setIsNavOpen(window.innerWidth > 800);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const closeNav = () => {
        if (window.innerWidth < 800) {
            setIsNavOpen(false);
        }
    };

    const handleSubmenuOpen = () => {
        setSubmenuOpen(!submenuOpen);
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        setShowDropdown(!showDropdown);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const closeDropdown = () => setShowDropdown(false);
        document.addEventListener('click', closeDropdown);

        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, []);

    return (
        <nav>
            <div className="container nav__container">
                <Link to='/' className="nav__logo" onClick={closeNav} title="Home">
                    <p>ᑌᑎᗷOᑌᑎᗪ..</p>
                </Link>
                {currentuser?.id && isNavOpen &&
                    <ul className="nav__menu">
                        <li><Link className="nav__menu-link" to='/create' onClick={closeNav} title="Write a Post">
                            <FiEdit size={18} /> Write
                        </Link></li>
                        <li><Link className="nav__menu-link" to='/authors' onClick={closeNav} title="Authors">
                            <LuUsers size={18} />
                        </Link></li>
                        <li className="nav__menu-link" id="nav__menu-profile" onClick={toggleDropdown} title="Profile">
                            {avatar ? (
                                <img src={`${import.meta.env.VITE_REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="User Avatar" />
                            ) : (
                                <LuUser2 size={22} />
                            )}
                            <div className={`nav__profile-dropdown ${showDropdown ? 'show' : ''}`}>
                                <Link to={`/profile/${currentuser?.id}`} className="dropdown-item" onClick={closeNav}>
                                    <MdOutlineDashboard size={18} />
                                    Dashboard
                                </Link>
                                <Link to={`/myposts/${currentuser?.id}`} className="dropdown-item" onClick={closeNav}>
                                    <RiPagesLine size={18} />
                                    My Posts
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link to="/logout" className="dropdown-item" onClick={closeNav}>
                                    <IoIosLogOut size={18} />
                                    Logout
                                </Link>
                            </div>
                        </li>
                    </ul>
                }
                {currentuser?.id &&
                    <ul className="mobile-nav__menu">
                        <li><Link className="nav__menu-link pb-2" to={`/profile/${currentuser?.id}`} onClick={closeNav} title="Dashboard"><MdOutlineDashboard /></Link></li>
                        <li><Link className="nav__menu-link pb-2" to={`/myposts/${currentuser?.id}`} onClick={closeNav} title="My Posts"><RiPagesLine /></Link></li>
                        <li><Link className="nav__menu-link" to='/create' onClick={closeNav} title="Create Post"><FiPlusCircle size={20} /></Link></li>
                        <li><Link className="nav__menu-link" to='/authors' onClick={closeNav} title="Authors"><LuUsers size={16} /></Link></li>
                        <li><Link className="nav__menu-link" to='/logout' onClick={closeNav} title="Logout"><IoIosLogOut size={16} /></Link></li>
                    </ul>
                }
                {!currentuser?.id && isNavOpen &&
                    <ul className="nav__menu">
                        <li><Link className="nav__menu-link" to='/authors' onClick={closeNav} title="Authors">Authors</Link></li>
                        <li><Link className="nav__menu-link" to='/login' onClick={closeNav} title="Login">Login</Link></li>
                    </ul>
                }
                {!currentuser?.id &&
                    <ul className="mobile-nav__menu">
                        <li><Link className="nav__menu-link" title="Authors" to='/authors' onClick={closeNav}><LuUsers size={16} /></Link></li>
                        <li><Link className="nav__menu-link" title="Login" to='/login' onClick={closeNav}><TbLogin size={16} /></Link></li>
                    </ul>
                }
            </div>
        </nav>
    );
}

export default Header;
