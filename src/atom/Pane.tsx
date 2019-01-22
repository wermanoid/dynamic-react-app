/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";

jsx;

const Pane: React.SFC<{ visible: boolean }> = ({ children, visible }) => (
  <div
    css={{
      position: "absolute",
      top: "0",
      width: "100%",
      height: "100%",
      opacity: visible ? 1 : 0
    }}
  >
    {children}
  </div>
);

export default Pane;
