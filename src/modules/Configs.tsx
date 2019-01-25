import React from "react";

import Button from "../atom/Button";
import InputBox from "../molecule/InputBox";
import {
  observable,
  IObservableObject,
  extendObservable,
  autorun,
  action
} from "mobx";

import { parse } from "../parser/syntax";

export interface ConfigsParserProps {
  onSubmit?: (configs: { components: any; configurations: any }) => void;
}

export interface Configs {
  components: string;
  configurations: string;
}

const autoSubmitGate = (callback: ConfigsParserProps["onSubmit"]) => (
  config: Configs
) => {
  try {
    callback!({
      components: JSON.parse(config.components),
      configurations: JSON.parse(config.configurations || "null")
    });
  } catch {}
};

const temp = `
@unit Icon($src)
@unit Tab($id)
@unit ToolBar

component Tabs($tabs) is ToolBar {
  @map $tabs to Tab({ url }) {
    Icon({ src })
    { title }
  }
}
`;

class ConfigsParser extends React.Component<ConfigsParserProps> {
  @observable config = {
    components: temp,
    configurations: ""
  };

  constructor(props: ConfigsParserProps) {
    super(props);
    const submit = autoSubmitGate(this.props.onSubmit);

    autorun(() => {
      // submit(this.config);
      console.log(parse(this.config.components));
    });
  }

  render() {
    return (
      <>
        <InputBox
          title="Components"
          rows={20}
          onChange={this.updateComponent}
          initial={temp}
        />
        <InputBox
          title="Configurations"
          rows={4}
          onChange={this.updateConfigurations}
        />
      </>
    );
  }

  @action.bound
  private updateComponent = (value: string) => {
    this.config.components = value;
  };

  @action.bound
  private updateConfigurations = (value: string) => {
    this.config.configurations = value;
  };
}

export default ConfigsParser;
