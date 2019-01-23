import styled from "@emotion/styled";

const Button = styled.button`
  min-width: 100px;
  height: 28px;
  position: relative;
  background: #2196f3;
  border: none;
  outline: none;
  cursor: pointer;
  color: white;
  border-radius: 3px;

  &:hover:after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: "";
    background-color: rgba(0, 0, 0, 0.15);
  }
`;

export default Button;
