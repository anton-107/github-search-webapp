import React from "react";
import { Link } from "react-router-dom";
import { GitHubRepository } from "../github-client/interfaces";

interface SearchResultsComponentProps {
  repositories: GitHubRepository[];
}

export class SearchResultsComponent extends React.Component<SearchResultsComponentProps> {
  public render() {
    return (
      <div>
        <table className="table is-striped is-hoverable is-fullwidth">
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