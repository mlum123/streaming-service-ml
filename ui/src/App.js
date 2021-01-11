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
        releaseyear: "",
        runtime: "",
        minage: "",
        country: "United States",
        language: "English",
        genres: [],
      },
      result: "",
    };
  }

  // onChange event handler for form input boxes
  handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    var formData = this.state.formData;
    formData[name] = value;
    this.setState({
      formData,
    });
    console.log(this.state);
  };

  // onChange event handler for genre checkboxes
  handleCheck = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    const checked = event.target.checked;
    var formData = this.state.formData;
    if (checked) {
      formData[name].push(value);
      this.setState({
        formData,
      });
    } else {
      formData[name] = formData[name].filter((genre) => genre !== value);
      this.setState({
        formData,
      });
    }
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
    const countries = [
      "United States",
      "United Kingdom",
      "Australia",
      "Canada",
      "Japan",
      "South Korea",
      "China",
      "Taiwan",
      "Hong Kong",
      "Thailand",
      "Indonesia",
      "Philippines",
      "India",
      "Italy",
      "France",
      "Belgium",
      "Spain",
      "Germany",
      "Netherlands",
      "Greece",
      "Mexico",
      "Brazil",
      "Argentina",
      "Turkey",
      "Israel",
      "Egypt",
    ];
    const languages = [
      "English",
      "Spanish",
      "French",
      "Italian",
      "German",
      "Portuguese",
      "Russian",
      "Danish",
      "Dutch",
      "Polish",
      "Hindi",
      "Tamil",
      "Telugu",
      "Punjabi",
      "Marathi",
      "Malayalam",
      "Japanese",
      "Korean",
      "Mandarin",
      "Cantonese",
      "Filipino",
      "Tagalog",
      "Thai",
      "Vietnamese",
      "Indonesian",
      "Turkish",
      "Arabic",
      "Hebrew",
      "Latin",
      "Yiddish",
    ];
    const genres_popular = [
      "Drama",
      "Comedy",
      "Documentary",
      "Family",
      "Animation",
      "Action",
      "Thriller",
      "Horror",
    ];

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
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.country}
                    name="country"
                    onChange={this.handleChange}
                  >
                    {countries.map((country) => (
                      <option key={country}>{country}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Language</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.language}
                    name="language"
                    onChange={this.handleChange}
                  >
                    {languages.map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Genre(s)</Form.Label>
                  <br></br>
                  {genres_popular.map((genre) => {
                    return (
                      <Form.Check
                        inline
                        label={genre}
                        name="genres"
                        value={genre}
                        type="checkbox"
                        key={genres_popular.indexOf(genre)}
                        id={`inline-checkbox-${genres_popular.indexOf(genre)}`}
                        checked={formData.genres[genre]}
                        onChange={this.handleCheck}
                      />
                    );
                  })}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col}>
                  <Form.Label>Release Year</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Release Year"
                    name="releaseyear"
                    value={formData.releaseyear}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Runtime (min)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Runtime"
                    name="runtime"
                    value={formData.runtime}
                    onChange={this.handleChange}
                  />
                </Form.Group>
                <Form.Group as={Col}>
                  <Form.Label>Min Age</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Min Age"
                    name="minage"
                    value={formData.minage}
                    onChange={this.handleChange}
                  />
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
