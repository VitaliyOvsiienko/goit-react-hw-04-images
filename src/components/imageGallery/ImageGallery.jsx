import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Gallery } from './ImageGallery.styled';
import { ImageGalleryItem } from 'components/imageGalleryItem';
import { Button } from 'components/button';
import { Loader } from 'components/loader';
import { getGalleryImages } from '../../serviceApi';

export const ImageGallery = ({ query }) => {
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [page, setPage] = useState(1);
  const [isShowButton, setIsShowButton] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const fetchGalleryImages = async (inquiry, pageNum) => {
        try {
          const { hits, total } = await getGalleryImages(inquiry, pageNum);

          if (total === 0) {
            const error = new Error('Houston, we have a problem');
            setError(error);
            setStatus('rejected');
            return;
          }

          setGallery(hits);
          setStatus('resolved');
          setIsShowButton(hits.length >= 12);
        } catch (error) {
          setError(error);
          setStatus('rejected');
        }
      };

      if (query) {
        setStatus('pending');
        setPage(1);
        setGallery([]);

        await fetchGalleryImages(query, 1);
      }
    };

    fetchData();
  }, [query]);

  useEffect(() => {
    const fetchMoreData = async () => {
      try {
        const { hits } = await getGalleryImages(query, page);
        setGallery(prevGallery => [...prevGallery, ...hits]);
        setIsShowButton(hits.length >= 12);
      } catch (error) {
        setError(error);
        setStatus('rejected');
      }
    };

    if (page > 1) {
      fetchMoreData();
    }
  }, [query, page]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (status === 'pending') {
    return <Loader />;
  }

  if (status === 'rejected') {
    Notify.failure(`${error.message}`);
    return null;
  }

  if (status === 'resolved') {
    return (
      <>
        <Gallery>
          {gallery.map(({ id, webformatURL, tags, largeImageURL }) => (
            <ImageGalleryItem
              key={id}
              url={webformatURL}
              alt={tags}
              largeImage={largeImageURL}
            />
          ))}
        </Gallery>
        {isShowButton && (
          <Button onClick={handleLoadMore}>Load more</Button>
        )}
      </>
    );
  };

  return null;
};

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};