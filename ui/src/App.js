import React, { Component } from "react";
import "./App.css";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      formData: {
        textfield1: "",
        textfield2: "",
        select1: 1,
        select2: 1,
        select3: 1,
      },
      result: "",
    };
  }

  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData,
    });
  };

  handlePredictClick = (event) => {
    const formData = this.state.formData;
    this.setState({ isLoading: true });
    fetch("http://127.0.0.1:5000/prediction/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          result: response.result,
          isLoading: false,
        });
      });
  };

  handleCancelClick = (event) => {
    this.setState({ result: "" });
  };

  render() {
    const isLoading = this.state.isLoading;
    const formData = this.state.formData;
    const result = this.state.result;

    return (
      <div id="page">
        <Container>
          <div>
            <h1 className="title">the streaming wars</h1>
            <h2 className="subtitle">
              which streaming service should you subscribe to?
            </h2>
          </div>
          <div className="content">
            <Form>
              <Form.Row>
                <h3 id="form-title" className="highlight mx-auto">
                  tell us about the movies you want to watch
                </h3>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Text Field 1</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Text Field 1"
                    name="textfield1"
                    value={formData.textfield1}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Text Field 2</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Text Field 2"
                    name="textfield2"
                    value={formData.textfield2}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Select 1</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.select1}
                    name="select1"
                    onChange={this.handleChange}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Select 2</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.select2}
                    name="select2"
                    onChange={this.handleChange}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Select 3</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.select3}
                    name="select3"
                    onChange={this.handleChange}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <Row>
                <Col>
                  <Button
                    block
                    disabled={isLoading}
                    onClick={!isLoading ? this.handlePredictClick : null}
                    id="predict-btn"
                  >
                    {isLoading ? "Choosing service" : "Pick Service"}
                  </Button>
                </Col>
                <Col>
                  <Button
                    block
                    disabled={isLoading}
                    onClick={this.handleCancelClick}
                    id="reset-btn"
                  >
                    Reset
                  </Button>
                </Col>
              </Row>
            </Form>
            {result === "" ? null : (
              <Row>
                <Col className="result-container">
                  <h5 id="result">{result}</h5>
                  {result.includes("Prime") ? (
                    <i class="fab fa-amazon"></i>
                  ) : null}
                </Col>
              </Row>
            )}
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
