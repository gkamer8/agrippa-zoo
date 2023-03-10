import "./Home.css"
import { Link } from 'react-router-dom';
import ModelTable from './ModelTable';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './Api.js'
import ModelViewer from './ModelViewer'
import { Button } from "./Form";


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
            
                if (myJson['response'] !== 'succeeded'){
                    throw new Error("Server returned failed")
                }

                // "Cannot modify state directly", hence setState
                setModelsLoaded(true);
                setOrigModels(myJson['content']);
            } 
            catch (error) {
                console.error(error);
                setModelsLoadFailed(true);
            }
        }

        if (props.isLoggedIn && modelsLoaded === false){
            getModels();
        }

    }, [modelsLoaded, props.isLoggedIn, props.username]);

    let message = (
        <div id="landing-message">
            <div>
                <h3>
                    About
                </h3>
                <h1>
                    Easily understand, combine, and build AI models.
                </h1>
                <p className="p-text">
                    <br/>
                    The <a href="https://github.com/gkamer8/agrippa-pkg"><span className="link">Agrippa Python package</span></a> allows you to define a machine learning architecture using a markup language, which can then be compiled into other frameworks, like PyTorch.
                    This website lets you share and visualize your models. Check out the <Link to="/zoo"><span className="link">Zoo</span></Link> to see what others have built, or check out our Getting Started page for information on how to begin using Agrippa.
                    <br/><br/>
                    <Link to="/Docs/getting-started">
                        <Button value="Get Started" />
                    </Link>
                    <br/><br/>
                    Below you can see a preview of how a Transformer looks in our model visualization tool. You can click on a block to see its attributes or double click to see what's inside. <br/><br/>
                </p>
            </div>
            <div style={{'width': 'min(55em, 100%)'}}>
                <ModelViewer model_id="5" height="40vh" />
            </div>
            <br/>
            <div>
                <br/><br/>
                <h3>
                    Python Package
                </h3>
                <h1>
                    A Markup for ML Architectures
                </h1>
                <p className="p-text">
                    <br/>
                    By combining everything that's relevant about a model's architecture into a markup, the model becomes more portable and explicit — all of the important details, like weight initialization, weight sharing, and more are plainly available. <br/> <br/>
                    These models are first exported into the ONNX format, a general specification for neural networks that can be deployed efficiently. The package contains a utility to import the ONNX into PyTorch for training. <br/> <br/>
                    Parameters in every model are explicit and named so that you can easily extract them from the model, freeze them, or share them. <br/><br/>
                    The Agrippa Python package is available <a href="https://github.com/gkamer8/agrippa-pkg"><span className="link">here</span></a> on GitHub.
                </p>
                <br/><br/><br/>
                <h3>
                    Online Workspace
                </h3>
                <h1>
                    Visualize Complex Architectures
                </h1>
                <p className="p-text">
                    <br/>
                    In the online workspace, you can visualize the markup you've created and share that markup with others, which they can import into their projects. <br/><br/>
                    Check out the <Link to="/zoo" ><span className='link'>Model Zoo</span></Link>, or
                    if you'd like to upload models to the zoo, try <Link to="/register" ><span className='link'>registering</span></Link> for an account and/or <Link className="link" to="/login" ><span className="link">logging in</span></Link>.        
                </p>
            </div>
        </div>

    );

    if (props.isLoggedIn){
        let modelTable = "";
        if (modelsLoaded){
            if (modelsLoadFailed){
                modelTable = (
                    <div>
                        <br />
                        <h2>
                            Your Models
                        </h2>
                        Models could not be loaded.
                    </div>
                )  
            }
            else {
                modelTable = (
                    <div>
                        <br />
                        <h2>
                            Your Models
                        </h2>
                        <ModelTable content={origModels} maxRows={5} />
                    </div>
                )   
            }
        }
        message = (
            <div>
                <h1>Welcome</h1>
                Hello, {props.username}. <br/><br/>
                Check out the <Link to="/zoo" ><span className='link'>Model Zoo</span></Link>, or try <Link to="/upload" ><span className='link'>uploading</span></Link> a model.
                {modelTable}
            </div>
        );
    }

    return (
        <div id="home-container">
            {message}
        </div>
    )
}

export default Home;