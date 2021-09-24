import React from "react";
import { NavigationButtonsComponent } from "./navigation-buttons.components";
import { SearchBarComponent } from "./search-bar.component";
import { SearchResultsComponent } from "./search-results.component ";

export class MainPage extends React.Component {
  public render() {
    return (
      <div>
        <div><SearchBarComponent /></div>
        <div><NavigationButtonsComponent /></div>
        <div><SearchResultsComponent /></div>
      </div>
    )
  }
}