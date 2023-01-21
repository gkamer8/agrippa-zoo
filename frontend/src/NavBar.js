import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';

function NavBar(props){

    const navigate = useNavigate();
    function logout(){
        localStorage.clear();
        navigate("/");
    }

    function isLoggedIn(){
        return localStorage.getItem("auth_token");
    }

    let loginSensitive = (
        <div className='login-sensitive'>
            <Link to="/login">
                <span className='little-text'>Login</span>
            </Link>
        </div>
    );

    if (isLoggedIn()){
        loginSensitive = (
            <div className='login-sensitive'>
                <Link to="/upload">
                    <span className='little-text'>Upload</span>
                </Link>
                <span className='little-text logout' onClick={logout}>Logout</span>
            </div>
        )
    }

    return (
        <div className='nav-container'>
            <Link to="/">
                <span className='big-text'>Agrippa</span>
            </Link>
            <Link to="/zoo">
                <span className='little-text'>Zoo</span>
            </Link>
            <Link to="/editor">
                <span className='little-text'>Editor</span>
            </Link>
            {loginSensitive}
        </div>
    )
}

export default NavBar;