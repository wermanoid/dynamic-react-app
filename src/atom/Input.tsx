/** @jsx jsx */
import { observer } from "mobx-react";
import { observable } from "mobx";
import { jsx } from "@emotion/core";
import React from "react";

jsx;

export interface InputProp {
  multiline?: number | boolean;
  onChange?: (text: string) => void;
  initial?: string;
}

@observer
class Input extends React.Component<InputProp> {
  @observable value: string = "";

  constructor(props: InputProp) {
    super(props);
    if (props.initial) {
      this.value = props.initial;
    }
  }

  render() {
    const { multiline } = this.props;
    const Control = ((multiline
      ? "textarea"
      : "input") as unknown) as React.ComponentType<any>;
    const rows = multiline ? (multiline >= 2 ? multiline : 4) : undefined;

    return (
      <Control
        css={{
          width: "100%",
          background: "transparent",
          boxSizing: "border-box",
          outline: "none"
        }}
        rows={rows}
        type="text"
        value={this.value}
        onChange={this.handle}
      />
    );
  }

  private handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    onChange && onChange(e.target.value);
    this.value = e.target.value;
  };
}

export default Input;
