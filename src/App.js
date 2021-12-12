import './App.scss';
import JoblyApi from './api';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, NavLink } from 'react-router-dom';
import NavBar from './NavBar';
import './NavBar.scss';
import UserContext from "./auth/UserContext";
import useLocalStorage from "./hooks/useLocalStorage";

import Login from './homepage/Login';
import CompaniesList from './companies/CompaniesList';
import CompanyDetail from './companies/CompanyDetail';

import SignUpForm from './homepage/SignUpForm';
import jwt from "jsonwebtoken";

import JobList from './jobs/JobList';
import JobCard from './jobs/JobCard';

import ProfilePage from './profiles/ProfilePage';

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "jobly-token";

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // ^store credentials in state
  const [jobIds, setJobIds] = useState([]);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  /** Handles site-wide login.
   *
   * Make sure you await this function and check its return value!
   */
  async function login(username, password) {
    try {
      let token = await JoblyApi.login(username, password);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  /**
   * How to signUp:
   * example userObj:
   * { "username":"Fname1", "password":"passy1", "firstName":"Adam", "lastName":"Ant", "email":"Adam@smolboi.net" }
   * 
   */
  async function signUp(userObj) {
    try {
      console.log('in signup', userObj)
      let token = await JoblyApi.signUp(userObj);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** Function to logout */
  function logout(){
    setCurrentUser(null);
    setToken(null);
  }


    // might need to make a f() to set the current user
  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          // put the token on the Api class so it can use it to call the API.
          JoblyApi.token = token;
          let currentUser = await JoblyApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          
          setJobIds(currentUser.applications);
          
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
      console.log(`hi`)
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false to control whether to display.
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  if(!infoLoaded) return (<>{`WE LOADING`}</>)

  return (
    <div className="App">
      <BrowserRouter>
        <UserContext.Provider
            value={{ currentUser, setCurrentUser, setJobIds, jobIds }}>
        <NavBar logout={logout}/>
        
        <Routes> {/* replaces <Switch> in v6*/ }
          <Route exact="true" path="/" element={
            <>
            { !currentUser ?
              <div className="App-home">
                <h1>Jobly</h1>
                <p>All the jobs in one, convenient place.</p>
                <p>
                  <NavLink to="/login">Login</NavLink>
                  <NavLink to="/signup">Sign Up</NavLink>
                </p>
              </div> :
              <Navigate replace to="/user/profile" />
            }
            </>
          }/>
          <Route exact="true" path="/login" element={
            <>
             <Login login={login}/>
            </>
          }/>
          <Route exact="true" path="/signup" element={
            <>
             <SignUpForm signUp={signUp}/>
            </>
          }/>
          <Route exact="true" path="/companies" element={
            currentUser ? <CompaniesList /> : <Navigate replace to="/" />
          }/>
          <Route exact="true" path="/jobs" element={
            currentUser ? <JobList /> : <Navigate replace to="/" />
          }/>
          <Route path="/companies/:companyHandle" element={
            currentUser ? <CompanyDetail /> : <Navigate replace to="/" />
          } />
          <Route path="/jobs/:id" element={
            currentUser ? <JobCard /> : <Navigate replace to="/" />
          } />
          <Route path="/user/profile" element={
            currentUser ? <ProfilePage /> : <Navigate replace to="/" />
          } />
          <Route path="*" element={<Navigate replace to="/" />} />
          {/*
            When no other route matches the URL, you can render a "not found"
            route using path="*". This route will match any URL, but
            will have the weakest precedence so the router will only pick it
            if no other routes match.
          */}
        </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;