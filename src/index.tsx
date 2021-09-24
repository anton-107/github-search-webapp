import React from "react";
import ReactDOM from "react-dom";
import { GitHubSearchApp } from "./components/main.app";
import { GitHubClientImpl } from "./github-client/github-client";
import { FetchWrapper } from "./web-api/fetch-wrapper";

const fetchWrapper = new FetchWrapper();
const gitHubClient = new GitHubClientImpl(fetchWrapper);
const App = () => <GitHubSearchApp githubClient={gitHubClient} />;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app-root")
);
