import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import logoImg from '../img/logo.png'
import searchSvg from '../img/search.svg'
import caretSvg from '../img/caret-down.svg'
import { AuthContext } from '../context';

const Navbar = ({...props}) => {
    
    const {username, setUsername} = useContext(AuthContext)
    const [dropdown, setDropdown] = useState(false)

    const onSignOutHandler = () => {
        localStorage.removeItem('username')
        setUsername(undefined)
    }

    return (
        <div className='header'>
            <div className='nav'>
                <img className="nav_logo" src={logoImg} alt="logo"/> 
                <div className='nav_cmp'>
                    { username ? 
                    <div className="contact">
                        <div className="contact_name">{username}</div>
                        <img className={dropdown ? "contact_caret  contact_caret_active" : "contact_caret"} src={caretSvg} alt="caret" onClick={() => setDropdown(!dropdown)}/>
                        <div className={dropdown ? 'dropdown dropdown_active' : 'dropdown'} onMouseLeave={() => setDropdown(false)}>
                            <ul>
                                <li><Link className='dropdown_item' to={'kanban'}>Profile</Link></li>
                                <li><Link className='dropdown_item' to={'kanban'}>KanBan</Link></li>
                                <li onClick={() => onSignOutHandler()}><Link className='dropdown_item' to={'kanban'}>Sign out</Link></li>
                            </ul>
                        </div>
                    </div>
                    :
                    <div className="contact">
                        <Link to='login'>Sign in</Link>
                    </div>
                    }
                </div>
            </div>
        </div>
    );
};

Navbar.propTypes = {
    links : PropTypes.array,
}

export default Navbar;