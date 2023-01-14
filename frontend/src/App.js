import './App.css';
import ModelBoard from './ModelBoard'
import Model from './Model';
import NavBar from './NavBar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
            <NavBar />
                <Routes>
                    <Route path="/" element={
                        <ModelBoard />
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
