import { useParams } from 'react-router-dom';
import Flow from './Flow';
import "./Workspace.css"


function Workspace(props){

    let { id } = useParams();

    return (
        <div id="workspace-container">
            {id}
            <div id="flow-container">
                <Flow />
            </div>
        </div>

    );
}

export default Workspace;