import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar(props){

    function logout(){
        props.handleLogout();
    }

    let loginSensitive = (
        <div className='login-sensitive'>
            <Link to="/login">
                <span className='little-text'>Login</span>
            </Link>
        </div>
    );

    if (props.isLoggedIn){
        loginSensitive = (
            <div className='login-sensitive'>
                <Link to="/upload">
                    <span className='little-text'>Upload</span>
                </Link>
                <Link to="/">
                    <span className='little-text' onClick={logout}>Logout</span>
                </Link>
            </div>
        )
    }

    return (
        <div className='nav-container'>
            <div>
                <Link to="/">
                    <span className='big-text'>Agrippa</span>
                </Link>
            </div>
            <div>
                <Link to="/zoo">
                    <span className='little-text'>Zoo</span>
                </Link>
                <Link to="/docs">
                    <span className='little-text'>Docs</span>
                </Link>
                {loginSensitive}
            </div>
        </div>
    )
}

export default NavBar;