import React from 'react'
import {GitHubSearchApp} from './main.app';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import '@testing-library/dom';
import { GitHubCommit, GitHubFork, GitHubRepository, GitHubSearchResult } from '../github-client/interfaces';

export const buildExampleGitHubRepository: (id: number) => GitHubRepository = (id: number) => {
  return {
    id: id,
    name: `repo-${id}`,
    fullName: '',
    owner: {login: `owner-${id}`, url: '', bio: ''},
    stargazersCount: 0,
    htmlURL: '',
    commitsURL: '',
    forksURL: ''
  }
};

describe('GitHubSearchApp', () => {
  test('should implement scenario: listing repositories and clicking on details', async () => {
    const MockedGitHubClient = jest.fn().mockImplementation(() => {
      return {
        searchRepositories(): Promise<GitHubSearchResult> {
          return Promise.resolve({
            totalCount: 215,
            resultsPerPage: 10,
            items: Array.from({length: 10}, (x, i) => buildExampleGitHubRepository(i))
          });
        },
        getRepository(): Promise<GitHubRepository> {
          return Promise.resolve({
            ...buildExampleGitHubRepository(6)
          });
        },
        getCommits(): Promise<GitHubCommit[]> {
          return Promise.resolve([
            
          ]);
        },
        getForks(): Promise<GitHubFork[]> {
          return Promise.resolve([
            
          ]);
        }
      }
    });
    const mockedClient = new MockedGitHubClient();

    localStorage.setItem('searchTerm', 'apache spark');

    render(<GitHubSearchApp githubClient={mockedClient} />);
    expect(screen.getByRole('heading').innerHTML).toMatch('GitHub repository list');

    await waitFor(() => screen.getByText('Show details', {selector: 'a[href="/repository/owner-6/repo-6"]'}));
    fireEvent.click(screen.getByText('Show details', {selector: 'a[href="/repository/owner-6/repo-6"]'}));
    
    await waitFor(() => screen.getByText('owner-6/repo-6', {selector: 'h3'}));
    expect(screen.getByText('owner-6/repo-6', {selector: 'h3'}).innerHTML).toMatch('owner-6/repo-6');
  });
});