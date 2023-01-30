import "./Home.css"
import { Link } from 'react-router-dom';
import ModelTable from './ModelTable';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from './Api.js'
import ModelViewer from './ModelViewer'


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

    }, [modelsLoaded, props.isLoggedIn, props.username]);

    let message = (
        <div>
            <div>
                <h1>
                    Agrippa makes understanding, building, and combining AI models easier.
                </h1>
                The <a href="https://github.com/gkamer8/agrippa-pkg"><span className="link">Agrippa Python package</span></a> allows you to define a machine learning architecture using a markup language, which can then be compiled into ONNX, a general format for neural networks. <br/> <br/>
                Below you can see how a Transformer looks in our model visualization tool. <br/><br/>
                You can click on a block to see its attributes or double click to see what's inside. <br/><br/>
            </div>
            <div style={{'width': 'min(50em, 100%)'}}>
                <ModelViewer model_id="5" height="40vh" />
                A Transformer, uploaded to Agrippa.
            </div>
            <br/>
            <div>
                These models can be imported into PyTorch for training, or deployed for inference. <br/> <br/>
                Parameters in every model are explicit and named so that you can easily extract them from the model, freeze them, or share them. <br/><br/>
                In the online workspace, you can visualize the markup you've created and share that markup with others, which they can import into their projects. <br/><br/>
                The Agrippa Python package is available <a href="https://github.com/gkamer8/agrippa-pkg"><span className="link">here</span></a> on GitHub. Check out the <Link to="/zoo" ><span className='link'>Model Zoo</span></Link>, or
                if you'd like to upload models to the zoo, try <Link to="/register" ><span className='link'>registering</span></Link> for an account and/or <Link className="link" to="/login" ><span className="link">logging in</span></Link>.        
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
                        <ModelTable content={origModels} />
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