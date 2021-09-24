import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { GitHubClient } from "../github-client/interfaces";
import { MainPage } from "./main.page";
import { RepositoryDetailsPage } from "./repository-details.page";

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
                <Route path="/repository/:owner/:name" render={(props) => (
                  <RepositoryDetailsPage owner={props.match.params.owner} name={props.match.params.name} githubClient={this.props.githubClient}></RepositoryDetailsPage>
                )}>
                </Route>
                <Route path="/">
                  <MainPage githubClient={this.props.githubClient}></MainPage>
                </Route>
              </Switch>
            </BrowserRouter>
          </div>
        );
    }
}