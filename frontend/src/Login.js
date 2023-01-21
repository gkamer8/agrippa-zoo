import { useEffect, useState } from "react";
import { TextInput, PasswordInput, Button } from "./Form";
import { BACKEND_URL } from "./Api";
import "./Login.css"
import { useNavigate } from "react-router-dom";

function Login(props){

    // 0 = not submitted
    // 1 = response loading
    // 2 = success
    // 3 = failed
    const [loginStatus, setLoginStatus] = useState(0);
    const [regStatus, setRegStatus] = useState(0);
    const [regNotes, setRegNotes] = useState("");
    const [notes, setNotes] = useState("");

    const navigate = useNavigate();

    async function sendReq() {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        console.log("Sending login request...")
        let url = BACKEND_URL + "auth/login"
        try {
            let loginData = new FormData();
            loginData.append("username", username);
            loginData.append("password", password);
            const response = await fetch(url, {
                method: 'POST',
                body: loginData
            });
            const myJson = await response.json(); //extract JSON from the http response
        
            if(myJson.response === 'succeeded'){
                setLoginStatus(2);
                localStorage.setItem("auth_token", myJson.token);
                localStorage.setItem("username", username);
                navigate("/");
            }
            else {
                setLoginStatus(3);
            }
        } 
        catch (error) {
            console.error(error);
            setLoginStatus(3);
        }
    }

    async function sendReqReg() {
        let username = document.getElementById("reg-username").value;
        let password = document.getElementById("reg-password").value;

        console.log("Sending register request...")
        let url = BACKEND_URL + "auth/register"
        try {
            let loginData = new FormData();
            loginData.append("username", username);
            loginData.append("password", password);
            const response = await fetch(url, {
                method: 'POST',
                body: loginData
            });
            const myJson = await response.json(); //extract JSON from the http response
            if(myJson.response === 'succeeded'){
                setRegStatus(2);
            }
            else if (myJson.why === 'username_taken'){
                setRegStatus(4);
            }
            else {
                setRegStatus(3);
            }
        } 
        catch (error) {
            console.error(error);
            setRegStatus(3);
        }
    }

    function submit(){
        setLoginStatus(1);  // loading
        sendReq();
    }

    function submitReg(){
        setRegStatus(1);  // loading
        sendReqReg();
    }

    useEffect(() => {
        if (loginStatus === 0){
            setNotes("");
        }
        else if (loginStatus === 1){
            setNotes("Loading...");
        }
        else if (loginStatus === 2){
            setNotes("Login successful; redirecting...");
        }
        else if (loginStatus === 3){
            setNotes("Login failed; try again.");
        }
    }, [loginStatus]);

    useEffect(() => {
        if (regStatus === 0){
            setRegNotes("");
        }
        else if (regStatus === 1){
            setRegNotes("Loading...");
        }
        else if (regStatus === 2){
            setRegNotes("Registration successful; try logging in.");
        }
        else if (regStatus === 3){
            setRegNotes("Registration failed; try again.");
        }
        else if (regStatus === 4){
            setRegNotes("Username already taken; try again.");
        }
    }, [regStatus]);

    function handleKeyDown(e){
        if (e.keyCode === 13){  // enter key
            submit();
        }
    }

    function handleKeyDownReg(e){
        if (e.keyCode === 13){  // enter key
            submitReg();
        }
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            <div className="form-row">
                <TextInput id="username" placeholder="Username" />
            </div>
            <div className="form-row">
                <PasswordInput onKeyDown={handleKeyDown} id="password" placeholder="Password" />
            </div>
            <div className="form-row">
                <Button onClick={submit} value="Submit" />
            </div>
            {notes}
            <hr />
            <h1>Register</h1>
            <div className="form-row">
                <TextInput id="reg-username" placeholder="Username" />
            </div>
            <div className="form-row">
                <PasswordInput onKeyDown={handleKeyDownReg} id="reg-password" placeholder="Password" />
            </div>
            <div className="form-row">
                <Button onClick={submitReg} value="Submit" />
            </div>
            {regNotes}
        </div>
    );
}

export default Login;