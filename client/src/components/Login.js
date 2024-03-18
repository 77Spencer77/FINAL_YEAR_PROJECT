// Login.js
import "./Login.css";
import React from "react";
import "../App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import App from "../App";

function Login() {
  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();
  return (
    <div className="App">
      <header>
        {isAuthenticated ? (
          <App />
        ) : (
          <div class="authenticate">
            <div class="nine">
              <h1>
                Secure Chat Application<span>ENCRYPTED</span>
              </h1>
            </div>
            <div>
              <button onClick={(e) => loginWithRedirect()}>LOG IN</button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default Login;
