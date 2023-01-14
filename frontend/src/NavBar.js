import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar(props){

    return (
        <div className='nav-container'>
            <Link to="/">
                <span className='big-text'>Agrippa</span>
            </Link>
            <Link to="/login">
                <span className='little-text'>Login</span>
            </Link>
            <Link to="/zoo">
                <span className='little-text'>Zoo</span>
            </Link>
            <Link to="/editor">
                <span className='little-text'>Editor</span>
            </Link>
        </div>
    )
}

export default NavBar;