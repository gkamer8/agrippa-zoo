import "./Home.css"
import { Link } from 'react-router-dom';

function Home(props){

    let message = (
        <div>
            Check out the <Link to="/zoo" ><span className='link'>Model Zoo</span></Link> or,
            if you'd like to upload models to the zoo, try <Link to="/register" ><span className='link'>registering</span></Link> for an account or <Link className="link" to="/login" ><span className="link">logging in</span></Link>.
        </div>
    );

    if (props.isLoggedIn){
        message = (
            <div>
                Hello, {props.username}. <br/><br/>
                Check out the <Link to="/zoo" ><span className='link'>Model Zoo</span></Link>, or try <Link to="/upload" ><span className='link'>uploading</span></Link> a model.
            </div>
        );
    }

    return (
        <div id="home-container">
            <h1>Welcome</h1>
            {message}
        </div>
    )
}

export default Home;