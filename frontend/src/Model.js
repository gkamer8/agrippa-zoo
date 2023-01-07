import { useParams } from 'react-router-dom';

function Model(){
    const { id } = useParams();

    return (
        <div>My model id: {id}</div>
    )
}

export default Model;