import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.scss';

function Login({ login }) {
    const emptyForm = {
        username: '',
        password: ''
    };
    const [formData, setFormData] = useState(emptyForm);
    // const [loginErrors, setloginErrors] = useState([]); //not implemented

    const navigate = useNavigate();
    
    const handleFormChange = (evt) => {
        const {name, value} = evt.target;
        setFormData(formData => ({
            ...formData,
            [name]: value
        }));
    }
    //https://reactjs.org/docs/uncontrolled-components.html

    const onFormSubmit = async (evt) => {
        evt.preventDefault();
        let { 
            username,
            password
        } = evt.target;
        
        username = username.value;
        password = password.value;
        console.log(username, password)
        // currently no err handling for incompletes or invalids
        //no implentation for actual database changes.
        // menus are reset on app resets
        
        const res = await login(username, password)
    
        if (res.success) {
            navigate("/companies"); //navigate to personal page route prob
        } else {
            // setloginErrors(res.errors); //not implemented
            setFormData(emptyForm);
        }
    };

    return (
        <>
            <form className="Login" onSubmit={onFormSubmit}>
                <label htmlFor="username">Username</label><br/>
                <input type="text" id="username" name="username"
                 value={formData.username} onChange={handleFormChange}/><br/>

                <label htmlFor="password">Password</label><br/>
                <input type="password" id="password" name="password"
                 value={formData.password} onChange={handleFormChange}/><br/>
                
                <button type="submit" id="submit" name="submit">Submit</button>
            </form>
        </>
    );
}

export default Login;