import './ModelSquare.css';
import { useNavigate } from "react-router-dom";


function ModelSquares(props) {

    const navigate = useNavigate();

    function goToModel(mod_id){
        navigate("/model/" + mod_id);
    }

    function makeSquare(item){
        return (
            <div className="Square"
                onClick={() => goToModel(item.id)}>
                {item.name}
            </div>
        );
    }

    const listItems = props.items.map(makeSquare);
    return (
        <div className="SquareGridContainer">{listItems}</div>
    )
}

export default ModelSquares;
