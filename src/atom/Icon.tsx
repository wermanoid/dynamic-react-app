/** @jsx jsx */
import { jsx } from "@emotion/core";
import React from "react";

jsx;

const Icon: React.SFC<{ src: string }> = ({ src }) => (
  <img
    src={src}
    css={{
      width: "28px",
      height: "28px"
    }}
  />
);

export default Icon;
