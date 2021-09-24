import React from "react";

export class SearchBarComponent extends React.Component {
  public render() {
    return (
      <div>
        <input type="text" placeholder="Start typing a repositort name here" />
      </div>
    );
  }
}