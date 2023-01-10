import './App.css';
import ModelSquares from './ModelSquares';
import Model from './Model';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const topText = "The following is a collection of architectures for use in Agrippa projects."

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <a href="/">
                    Agrippa Model Zoo
                </a>
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={
                        <div>
                            <div className='desc'>{topText}</div>
                            <ModelSquares />
                        </div>
                    } />
                    <Route path="/model/:id" element={
                        <Model />
                    } />
                    <Route path="*" element = {
                        <div>NOT FOUND</div>
                    } />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
