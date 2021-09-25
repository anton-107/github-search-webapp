import React from "react";
import ReactDOM from "react-dom";
import { GitHubSearchApp } from "./components/main.app";
import { GitHubClientImpl } from "./github-client/github-client";
import { GitHubClientWithInMemoryCache } from "./github-client/github-client-inmemory-cache";
import { FetchWrapper } from "./web-api/fetch-wrapper";

const fetchWrapper = new FetchWrapper();
const gitHubClient = new GitHubClientImpl(
  { numberOfRepositoriesPerPage: 10 },
  fetchWrapper
);
const gitHubClientInMemoryCache = new GitHubClientWithInMemoryCache(
  gitHubClient
);
const App = () => <GitHubSearchApp githubClient={gitHubClientInMemoryCache} />;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app-root")
);
