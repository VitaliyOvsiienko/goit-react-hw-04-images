import { useState } from 'react';
import { Container } from './App.styled';
import { Searchbar } from "../searchbar";
import { ImageGallery } from "../imageGallery";


export const App = () => {
  const [query, setQuery] = useState('');

  const handleSearchFormSubmit = (query) => {
    setQuery(query);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSearchFormSubmit} />
      <ImageGallery query={query} />
    </Container>
  );
};