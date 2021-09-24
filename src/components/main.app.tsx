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
            <div className="container px-1 pb-6">
              <div className="columns is-gapless">
                <div className="column">
                  <section className="hero is-primary mb-6">
                    <div className="block px-4 pt-2">
                      <figure className="image" style={{width: '300px', height: '120px'}}><img src="https://dummyimage.com/300x120/00d1b2/fefefe.png" alt="Logo" /></figure>
                      <div className="content"><h2 className="title">GitHub repository list</h2></div>
                    </div>
                  </section>
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
            </div>
          </div>
        );
    }
}