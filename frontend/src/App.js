import './App.css';
import ModelBoard from './ModelBoard'
import Model from './Model';
import NavBar from './NavBar';
import Footer from './Footer';
import Upload from './Upload';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element = {
                        "My home :)"
                    } />
                    <Route path="/zoo" element={
                        <ModelBoard />
                    } />
                    <Route path="/model/:id" element={
                        <Model />
                    } />
                    <Route path="/upload" element={
                        <Upload />
                    } />
                    <Route path="*" element = {
                        <div>NOT FOUND</div>
                    } />
                </Routes>
            </BrowserRouter>
            <Footer />
        </div>
    );
}

export default App;
