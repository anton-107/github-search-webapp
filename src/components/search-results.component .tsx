import React from "react";
import { GitHubRepository } from "../github-client/interfaces";

interface SearchResultsComponentProps {
  repositories: GitHubRepository[];
}

export class SearchResultsComponent extends React.Component<SearchResultsComponentProps> {
  public render() {
    return (
      <div>
        <table>
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
                <td>{repository.fullName}</td>
                <td>Show details</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}