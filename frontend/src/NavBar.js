import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar(props){

    return (
        <div className='nav-container'>
            <Link to="/">
                Agrippa
            </Link>
        </div>
    )
}

export default NavBar;