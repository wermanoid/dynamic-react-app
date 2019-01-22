/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";

jsx;

const ToolBar: React.SFC = ({ children }) => (
  <div
    css={{
      backgroundColor: "#2196f3",
      display: "flex",
      alignItems: "center",
      position: "relative",
      minHeight: "50px",
      padding: "0 20px"
    }}
  >
    {children}
  </div>
);

export default ToolBar;
