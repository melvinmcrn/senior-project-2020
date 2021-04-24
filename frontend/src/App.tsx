import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Validation from "./views/Validation";
import Admin from "./views/Admin";
import Result from "./views/Result";

import "./styles/main.scss";

function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">Prohibited Product Detection</Navbar.Brand>
        <Nav className="mr-auto" activeKey={window.location.pathname}>
          <Nav.Link key="/" href="/">
            Validation
          </Nav.Link>
          <Nav.Link key="/result" href="/result">
            Result
          </Nav.Link>
          <Nav.Link key="/admin" href="/admin">
            Admin
          </Nav.Link>
        </Nav>
      </Navbar>
      <Container fluid>
        <Router>
          <Switch>
            <Route exact path="/" component={Validation} />
            <Route exact path="/result" component={Result} />
            <Route exact path="/admin" component={Admin} />
          </Switch>
        </Router>
      </Container>
    </>
  );
}

export default App;
