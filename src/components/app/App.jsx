import { useState, useEffect } from 'react';
import { Container } from './App.styled';
import { Searchbar } from "../searchbar";
import { ImageGallery } from "../imageGallery";
import { Button } from 'components/button';
import { Loader } from 'components/loader';
import { getGalleryImages } from '../../serviceApi';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


export const App = () => {
  const [query, setQuery] = useState('');
  const [gallery, setGallery] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (query) fetchImages();

    async function fetchImages() {
      setIsLoading(true);
      try {
        const { hits, total, totalHits } = await getGalleryImages(query, page);

        if (total === 0) {
          const error = new Error('Houston, we have a problem')
          setError(error);
          return;
        };

        setGallery(prev => [...prev, ...hits]);
        setTotalPages(Math.floor(totalHits / 12));
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      };
    };
  }, [page, query]);

  const searchFormSubmitHandler = (searchQuery) => {
    if (searchQuery === query) {
      Notify.failure('This word has already been searched for. Try another one')
      return;
    }
    setQuery(searchQuery);
    setPage(1);
    setGallery([]);
    setError(null);
  };

  const handleLoadMore = () => setPage(prevPage => prevPage + 1);

  return (
    <>
      <Container>
      <Searchbar onSubmit={searchFormSubmitHandler} />
      {isLoading && <Loader />};
      {error && Notify.failure(`${error.message}`)};
      {gallery.length > 0 && <ImageGallery gallery={gallery} />}
      {gallery.length > 0 && page < totalPages && <Button onClick={handleLoadMore}>Load more</Button>}
    </Container>
    </>
  );

};