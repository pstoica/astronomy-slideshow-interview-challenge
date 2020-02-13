import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
  ${reset}

  body {
    font-family: 'Space Mono', monospace;
    background: black;
    color: white;
  }


  * {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  padding: 1rem;
  min-height: 100vh;
`;

const Layout = ({ children }) => (
  <Container>
    <GlobalStyle />
    {children}
  </Container>
);

export default Layout;
