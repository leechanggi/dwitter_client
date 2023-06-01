import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthService from "./service/auth";
import TweetService from "./service/tweet";
import { BrowserRouter } from "react-router-dom";
import { AuthErrorEventBus, AuthProvider, fetchToken, fetchCsrfToken } from "./context/AuthContext";
import HttpClient from "./network/http";
import Socket from "./network/socket";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const authErrorEventBus = new AuthErrorEventBus();
const httpClient = new HttpClient(BASE_URL, authErrorEventBus, () => fetchCsrfToken());
const authService = new AuthService(httpClient);
const socketClient = new Socket(BASE_URL, () => fetchToken());
const tweetService = new TweetService(httpClient, socketClient);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider authService={authService} authErrorEventBus={authErrorEventBus}>
        <App tweetService={tweetService} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
