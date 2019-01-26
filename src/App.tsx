import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

import ToolBar from "./atom/ToolBar";
import Icon from "./atom/Icon";
import Tab from "./atom/Tab";
import Pane from "./atom/Pane";
// import InputBox from "./molecule/InputBox";
import Configs from "./modules/Configs";

import { ComponentStore, ComponentEntires } from "./provider/ComponentStore";
import { observer } from "mobx-react";
import { observable, toJS, reaction } from "mobx";
import Builder from "./modules/Builder";

@observer
class App extends Component<{}, { active: number }> {
  @observable config: any = null;

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
              <Configs
                onSubmit={conf => {
                  console.log(conf);
                  this.config = conf;
                }}
              />
            </Pane>
            <Pane visible={active === 1}>
              <ComponentEntires>
                {cmp => <Builder config={toJS(this.config)} components={cmp} />}
              </ComponentEntires>
            </Pane>
          </div>
        </ComponentStore>
      </div>
    );
  }

  private setTab = (id: number) => () => this.setState({ active: id });
}

export default App;
