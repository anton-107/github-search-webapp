import React from "react";
import ReactDOM from "react-dom";

class AppContainer extends React.Component {
    public render() {
        return (
            'Hello World'
        );
    }
}
const App = () => <AppContainer />;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app-root")
);
