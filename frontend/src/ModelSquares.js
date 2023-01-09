import './ModelSquare.css';
import { Component } from 'react';
import { Link } from 'react-router-dom'
import { BACKEND_URL } from './Api.js'

class ModelSquares extends Component {
    constructor(props) {
        super(props);
        this.state = {
            squares_load_failed: false,
            squares: [],
        };
        this.getSquares();
    }

    async getSquares() {
        let url = BACKEND_URL + "/info/manifest"
        console.log(url)
        try {
            const response = await fetch(url);
            const myJson = await response.json(); //extract JSON from the http response
        
            // "Cannot modify state directly", hence setState
            this.setState({ squares: myJson });
        } 
        catch (error) {
            console.error(error);
            this.setState({ squares_load_failed: true });
        }
    }

    makeSquare(item) {
        let url = "/model/" + item.id
        // Note that the link is used instead of some onclick because props/state is hard
        return (
            <Link to={url} key={item.id}>
                <div className="Square" key={item.id}>
                    {item.name}
                </div>
            </Link>
        );
    }

    render() {
        if (this.state.squares.length === 0 && this.state.squares_load_failed === false){
            return (
                <div>Loading squares...</div>
            )
        }
        else if (this.state.squares_load_failed === true){
            return (
                <div>Squares failed to load. Try again.</div>
            )
        }
        else{
            const listItems = this.state.squares.map(this.makeSquare);
            return (
                <div className="SquareGridContainer">{listItems}</div>
            )
        }
    }

}

export default ModelSquares;
