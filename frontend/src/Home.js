import "./Home.css"
import { Link } from 'react-router-dom';
import ModelTable from './ModelTable';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './Api.js'


function Home(props){

    // This business is used to see the user's models when logged in
    const [origModels, setOrigModels] = useState([]);
    const [modelsLoadFailed, setModelsLoadFailed] = useState(false);
    const [modelsLoaded, setModelsLoaded] = useState(false);

    useEffect(() => {

        async function getModels() {
            console.log("Getting models")
            let url = BACKEND_URL + "info/manifest?username=" + props.username;
            try {
                const response = await fetch(url);
                const myJson = await response.json(); //extract JSON from the http response
            
                // "Cannot modify state directly", hence setState
                setModelsLoaded(true);
                setOrigModels(myJson);
            } 
            catch (error) {
                console.error(error);
                setModelsLoadFailed(true);
            }
        }

        if (props.isLoggedIn && modelsLoaded === false){
            getModels();
        }

    }, [modelsLoaded, props.isLoggedIn]);

    let message = (
        <div>
            Check out the <Link to="/zoo" ><span className='link'>Model Zoo</span></Link>, or
            if you'd like to upload models to the zoo, try <Link to="/register" ><span className='link'>registering</span></Link> for an account and/or <Link className="link" to="/login" ><span className="link">logging in</span></Link>.
        </div>
    );

    if (props.isLoggedIn){
        let modelTable = "";
        if (modelsLoaded){
            modelTable = (
                <div>
                    <br />
                    <h2>
                        Your Models
                    </h2>
                    <ModelTable content={origModels} />
                </div>
            )
        }
        message = (
            <div>
                Hello, {props.username}. <br/><br/>
                Check out the <Link to="/zoo" ><span className='link'>Model Zoo</span></Link>, or try <Link to="/upload" ><span className='link'>uploading</span></Link> a model.
                {modelTable}
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