# GitHub repositories search
This is a web application that allows users to search for a GitHub repository and check the details of the selected repository

## Tech stack
This application is built with React + TypeScript. It is bundled for web use with Webpack.

# How to run
There are two ways to run this application: 

1) run a pre-built version (distributed in the `dist` folder)
2) run a development server
3) build your own version

## Pre-built version:
Pre-built version is located in the `dist/` folder and consists of one HTML file and one JavaScript file.
It is recommended to serve the HTML file via a simple web server. For example, on the systems where Python is installed, 
you can run:
```
$ cd dist
$ python -m SimpleHTTPServer 8000
```
And then open your browser at http://localhost:8000

Opening `index.html` via a `file:` protocol would also work, but there will be limitations in the app functionality 
(for example, no details page would be open, since this functionality is using History API).

## Development server:
To use the development server you would need to install project development dependencies first and then run the server.
```
$ npm install
$ npm run start
```

And then open your browser at the address that is noted in the logs (ie., http://localhost:8080)

## Build your own version:
To build your own version you would need to install project dependencies first and then run the build.
```
$ npm install
$ npm run build
```

After the build the `dist/` folder would contain the updated bundle, which you can run following instructions 
from the `Pre-built version` section of this README.

# How to test
The application is covered with automated tests written using Jest testing framework. There are two types of tests:
1) scenario test in `src/components/main.app.test.tsx` file that imitates the user workflow
2) unit tests in the rest of `**/*.test.ts(x)` file that covers the gap in the coverage of the scenario test

To run the automated tests you would need to install project dependencies first and then run the test
```
$ npm install
$ npm run test
```

# How to lint and format source code 
## ESLint
This project is set up to use `eslint` tool to statically analyze the source code and quickly find most common errors.
To run the static analysis you would need to install project development dependencies first and then run the `lint` command.
```
$ npm install
$ npm run lint
```

To try to automatically fix linting errors you can run
```
$ npm run lint:fix
```

## Prettier
This project is set up to use `prettier` tool to automatically format the source code.
To format the source code you would need to install project development dependencies first and then run the `format` command.

```
$ npm install
$ npm run format
```

# How to read the code
- `src/index.tsx` is the entrypoint of the application is , which creates a GitHub client and bootstraps a React application.
- `src/components/main.app.tsx` is the React application which sets routes and basic layout of the page
- `src/components/main.page.tsx` is the main page of the application that orchestrates the following components:
- - `src/components/search-bar.component.tsx`
- - `src/components/navigation-buttons.component.tsx`
- - `src/components/search-results.component.tsx`
- `src/components/repository-details.page.tsx` is the details page, that doesn't use additional components
- `src/pagination/pagination-details.ts` is the helper used to calculate pagination states for navigation buttons
- `src/github-client.ts/github-client.ts` is the custom client that makes necessary requests to GitHub API
- `src/github-client.ts/github-client-inmemory-cache.ts` is the wrapper around customer client that stores received results from GitHub in cache
- `src/fetch-wrapper.ts` is a thin wrapper around web browsers' [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

# Known issues
Due to time constraints set for this exercise project, some items that would improve this application are not implemented:

- Search results page stores the last query in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) instead of using a route for each query
- Error handly is only implemented for search results' errors and not for the details page
- "Results are taking longer than usual" message that would improve user experience for users on slow connections, or in case GitHub is taking longer to respond, is not implemented
- Cache layer does not clear itself up and cache grows indefinitely along new requests are made via the application
- Cache layer only caches the results of a request when this request succeeds. Thus when two instances of the same queries are started, both would result in a request done to the backing service
- Using Authorization token to make GitHub requests is not supported
- The page layout is not optimized for mobile view