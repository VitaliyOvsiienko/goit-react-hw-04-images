import { Component } from "react";
import { Container } from './App.styled';
import { Searchbar } from "../searchbar";
import { ImageGallery } from "../imageGallery";


export class App extends Component {
  state = {
    query: '',
  }
  
  onSearchFormSubmit = (query) => {
    this.setState({ query, gallery: [] });
  };

  render() {
    return(
      <Container>
        <Searchbar onSubmit={this.onSearchFormSubmit} />
        <ImageGallery query={this.state.query} />
      </Container>
    );
  };
};