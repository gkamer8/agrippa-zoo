import './App.css';
import ModelBoard from './ModelBoard'
import Model from './Model';
import NavBar from './NavBar';
import Footer from './Footer';
import Upload from './Upload';
import Login from './Login';
import Workspace from './Workspace';
import Home from './Home';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


function getLoggedIn(){
    let auth_token = localStorage['auth_token'];
    if (auth_token){
        return true;
    }
    return false;
}


function RequireAuth ({children}) {
    if (!getLoggedIn()) {
       return <Navigate to="/login" replace />;
    }
    return children;
}


function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);

    function handleLogout() {
        localStorage.clear();
        setUsername(null);
        setIsLoggedIn(false);
    }

    function handleLogin(){
        setIsLoggedIn(true);
        let username = localStorage['username'];
        setUsername(username);
    }

    function setLogin(){
        let trueLogin = getLoggedIn();
        if (trueLogin){
            let username = localStorage['username'];
            setUsername(username);
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
    }

    useEffect(() => {
        setLogin();
    }, [])

    return (
        <div className="App">
            <BrowserRouter>
                <NavBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                <Routes>
                    <Route path="/" element = {
                        <Home isLoggedIn={isLoggedIn} username={username} />
                    } />
                    <Route path="/zoo" element={
                        <ModelBoard />
                    } />
                    <Route path="/model/:id" element={
                        <Model />
                    } />
                    <Route path="/upload" element={
                        <RequireAuth>
                            <Upload />
                        </RequireAuth>
                    } />
                    <Route path="/login" element={
                        <Login handleLogin={handleLogin} />
                    } />
                    <Route path="/register" element={
                        <Login handleLogin={handleLogin} />
                    } />
                    <Route path="/workspace/:id" element={
                        <Workspace />
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
