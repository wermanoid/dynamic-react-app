import React from "react";

import Button from "../atom/Button";
import InputBox from "../molecule/InputBox";
import { observable, IObservableObject, extendObservable } from "mobx";
import defaultComponents from "./sample.json";

export interface ConfigsParserProps {
  onSubmit?: (configs: { components: any; configurations: any }) => void;
}

class ConfigsParser extends React.Component<ConfigsParserProps> {
  config = {
    components: JSON.stringify(defaultComponents, null, 2),
    configurations: ""
  };

  render() {
    return (
      <>
        <InputBox
          title="Components"
          rows={4}
          onChange={this.updateComponent}
          initial={JSON.stringify(defaultComponents, null, 2)}
        />
        <InputBox
          title="Configurations"
          rows={4}
          onChange={this.updateConfigurations}
        />
        <Button onClick={this.submit}>Parse</Button>
      </>
    );
  }

  private submit = () => {
    const { onSubmit } = this.props;
    onSubmit &&
      onSubmit({
        components: JSON.parse(String(this.config.components)),
        configurations: null
      });
  };

  private updateComponent = (value: string) => {
    this.config.components = value;
  };
  private updateConfigurations = (value: string) => {
    this.config.configurations = value;
  };
}

export default ConfigsParser;
