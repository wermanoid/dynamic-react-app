import styled from "@emotion/styled";
import { css } from "@emotion/core";
import React from "react";

const Tab = styled.button<{ active?: boolean }>`
  min-width: 100px;
  height: 50px;
  position: relative;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;

  ${({ active }) =>
    active
      ? css`
          background: rgba(255, 255, 255, 0.1);
          color: white;
          &::after {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: red;
            content: "";
          }
        `
      : css`
          color: rgba(255, 255, 255, 0.6);
          &:hover {
            background: rgba(0, 0, 0, 0.15);
          }
        `}
`;

export default Tab;
