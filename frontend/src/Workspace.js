import './Workspace.css'
import ModelViewer from './ModelViewer';
import { useParams } from 'react-router-dom';

function Workspace(props){

    let { id } = useParams()

    return (
        <div id="workspace-container">
            <ModelViewer model_id={id} />
        </div>
    );
}

export default Workspace;
