import React from "react";

import Fieldset from "../atom/Fieldset";
import Input from "../atom/Input";

export interface InputBoxProps {
  rows?: number;
  onChange?: (text: string) => void;
  title: string;
  initial?: string;
}

const InputBox: React.SFC<InputBoxProps> = ({
  rows,
  onChange,
  title,
  initial
}) => (
  <Fieldset title={title}>
    <Input
      multiline={Number(rows) >= 2 ? rows : false}
      onChange={onChange}
      initial={initial}
    />
  </Fieldset>
);

export default InputBox;
