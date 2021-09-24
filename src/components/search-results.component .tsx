import React from "react";
import { Link } from "react-router-dom";
import { GitHubRepository } from "../github-client/interfaces";

interface SearchResultsComponentProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
  isAtLeastOneSearchDone: boolean;
}

export class SearchResultsComponent extends React.Component<SearchResultsComponentProps> {
  public render() {
    return (
      <div>
        <progress className="progress is-small is-info" max="100" style={{visibility: this.props.isLoading ? 'visible' : 'hidden'}}></progress>
        {this.props.isAtLeastOneSearchDone && this.props.repositories.length === 0 && (
        <div className="box">
          <div className="content" style={{textAlign: 'center'}}>
            <big>No repositories found</big>
          </div>
        </div>
        )}
        <table className="table is-striped is-hoverable is-fullwidth" style={{opacity: this.props.isLoading ? '0.4' : '1.0', visibility: this.props.repositories.length > 0 ? 'visible' : 'hidden' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Owner</th>
              <th>Stars</th>
              <th>Link</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {this.props.repositories.map(repository => (
              <tr key={repository.id}>
                <td>{repository.name}</td>
                <td>{repository.owner.login}</td>
                <td>{repository.stargazersCount}</td>
                <td><a target='_blank' href={repository.htmlURL}>{repository.fullName}</a></td>
                <td><Link to={`/repository/${repository.owner.login}/${repository.name}`}>Show details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}