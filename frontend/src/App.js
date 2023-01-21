import './App.css';
import ModelBoard from './ModelBoard'
import Model from './Model';
import NavBar from './NavBar';
import Footer from './Footer';
import Upload from './Upload';
import Login from './Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
                        <RequireAuth>
                            <Upload />
                        </RequireAuth>
                    } />
                    <Route path="/login" element={
                        <Login />
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

function getToken() {
    const tokenString = localStorage.getItem('auth_token');
    return tokenString
}
  
function RequireAuth ({children}) {
    const userIsLogged = getToken(); // Your hook to get login status
    if (!userIsLogged) {
       return <Navigate to="/login" replace />;
    }
    return children;
}

export default App;
