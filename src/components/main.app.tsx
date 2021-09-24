import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GitHubClient } from "../github-client/interfaces";
import { MainPage } from "./main.page";

interface GitHubSearchAppProps {
  githubClient: GitHubClient;
}

export class GitHubSearchApp extends React.Component<GitHubSearchAppProps> {
    public componentDidMount() {
      this.loadRepos();
    }
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
                  <MainPage></MainPage>
                </Route>
              </Switch>
            </BrowserRouter>
          </div>
        );
    }
    private async loadRepos() {
        const repositories = await this.props.githubClient.searchRepositories();
        console.log("response 2", repositories);
    }
}