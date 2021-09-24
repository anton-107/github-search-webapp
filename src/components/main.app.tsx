import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GitHubClient } from "../github-client/interfaces";
import { MainPage } from "./main.page";

interface GitHubSearchAppProps {
  githubClient: GitHubClient;
}

export class GitHubSearchApp extends React.Component<GitHubSearchAppProps> {
    public render() {
        return (
            <div>
            <div>
              <h1>Logo</h1>
              <h2>GitHub repositories list</h2>
            </div>
            <BrowserRouter>
              <Switch>
                <Route path="/">
                  <MainPage githubClient={this.props.githubClient}></MainPage>
                </Route>
              </Switch>
            </BrowserRouter>
          </div>
        );
    }
}