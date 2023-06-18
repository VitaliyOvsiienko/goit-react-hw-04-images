import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Item, Image } from './ImageGalleryItem.styled';
import { Modal } from 'components/modal';

export const ImageGalleryItem = ({ url, alt, largeImage }) => {
  const [isShowModal, setIsShowModal] = useState(false);

  const toggleModal = () => {
    setIsShowModal((prevState) => !prevState);
  };

  return (
    <>
      <Item onClick={toggleModal}>
        <Image src={url} alt={alt} loading="lazy" />
      </Item>
      {isShowModal && (
        <Modal onClose={toggleModal}>
          <img alt={alt} src={largeImage} />
        </Modal>
      )}
    </>
  );
}

ImageGalleryItem.propTypes = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  largeImage: PropTypes.string.isRequired,
};