import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Gallery } from './ImageGallery.styled';
import { ImageGalleryItem } from 'components/imageGalleryItem';
import { Button } from 'components/button';
import { Loader } from 'components/loader';
import { getGalleryImages } from '../../serviceApi';

export class ImageGallery extends Component {
  state = {
    gallery: [],
    error: null,
    status: 'idle',
    page: 1,
    isShowButton: false,
  };

  async componentDidUpdate(prevProps, prevState) {
    const { query: previousInquiry } = prevProps;
    const { query: nextInquiry } = this.props;
    const { page } = this.state;

    if (previousInquiry !== nextInquiry ) {
      this.setState({ status: 'pending', page: 1, gallery: [] });

      try {
        const { hits, total } = await getGalleryImages(nextInquiry, 1);

        if (total === 0) {
          const error = new Error('Houston, we have a problem');
          this.setState({ error, status: 'rejected' });
          return;
        }

        this.setState({
          gallery: hits,
          status: 'resolved',
          loadingPictures: true,
          isShowButton: hits.length >= 12,
        });
      } catch (error) {
        this.setState({ error, status: 'rejected' });
      }
    } else if (prevState.page !== page) {
      try {
        const { hits } = await getGalleryImages(nextInquiry, page);
        this.setState(prevState => ({
          gallery: [...prevState.gallery, ...hits],
          isShowButton: hits.length >= 12,
        }));
      } catch (error) {
        this.setState({ error, status: 'rejected' });
      }
    }
  }

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  render() {
    const { gallery, error, status, loadingPictures, isShowButton } = this.state;

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
          {loadingPictures && isShowButton && (
            <Button onClick={this.handleLoadMore}>Load more</Button>
          )}
        </>
      );
    }

    return null;
  }
}

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
};