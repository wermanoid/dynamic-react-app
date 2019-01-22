import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import ToolBar from "./atom/ToolBar";
import Icon from "./atom/Icon";
import Tab from "./atom/Tab";
import Pane from "./atom/Pane";

import {
  ComponentStore,
  ComponentEntires,
  PredefinedComponents
} from "./provider/ComponentStore";

class App extends Component<{}, { active: number }> {
  constructor(props: {}) {
    super(props);
    this.state = { active: 0 };
  }

  render() {
    const { active } = this.state;
    return (
      <div className="App">
        <ToolBar>
          <Icon src={logo} />
          <Tab onClick={this.setTab(0)} active={active === 0}>
            Structure
          </Tab>
          <Tab onClick={this.setTab(1)} active={active === 1}>
            View
          </Tab>
        </ToolBar>
        <ComponentStore>
          <div className="App__Content">
            <Pane visible={active === 0}>
              <ComponentEntires>
                {components => {
                  console.log(components);
                  const Ico = components.atom[PredefinedComponents.Icon];
                  return (
                    <div>
                      test with <Ico src={logo} />
                    </div>
                  );
                }}
              </ComponentEntires>
            </Pane>
            <Pane visible={active === 1}>Content 2</Pane>
          </div>
        </ComponentStore>
      </div>
    );
  }

  private setTab = (id: number) => () => this.setState({ active: id });
}

export default App;
