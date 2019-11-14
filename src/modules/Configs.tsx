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

import { parse } from "../parser_old/syntax";
import { compose } from "../parser_old/composer";

export interface ConfigsParserProps {
  onSubmit?: (configs: { components: any; configurations: any }) => void;
}

export interface Configs {
  components: any;
  configurations: string;
}

const autoSubmitGate = (callback: ConfigsParserProps["onSubmit"]) => (
  config: Configs
) => {
  try {
    callback!({
      components: config.components,
      configurations: JSON.parse(config.configurations || "null")
    });
  } catch {}
};

const temp = `atom Icon($src, $alt)
atom Tab($id)
atom ToolBar

component Tabs($tabs) is ToolBar($className) {
  Icon($src)
  { $header }
  @map $tabs to Tab($url) {
    Icon($src)
    { $title }
  }
}`;

class ConfigsParser extends React.Component<ConfigsParserProps> {
  @observable config = {
    components: temp,
    configurations: ""
  };

  constructor(props: ConfigsParserProps) {
    super(props);
    const submit = autoSubmitGate(this.props.onSubmit);

    autorun(() => {
      const sytax = parse(this.config.components);
      try {
        const result = compose(sytax);
        console.log({ result });
        submit({ components: result, configurations: "" });
      } catch {}
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
