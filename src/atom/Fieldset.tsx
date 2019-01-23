/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";

jsx;

export interface FieldsetProps {
  title: string;
}

const Fieldset: React.SFC<FieldsetProps> = ({ children, title }) => (
  <fieldset
    css={{
      padding: "5px",
      margin: "5px"
    }}
  >
    <legend>
      <span>{title}</span>
    </legend>
    {children}
  </fieldset>
);

export default Fieldset;
