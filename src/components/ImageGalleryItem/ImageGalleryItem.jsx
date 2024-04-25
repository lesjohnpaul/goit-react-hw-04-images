import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ColorThief from 'colorthief';
import Modal from '../Modal/Modal';
import styles from './ImageGalleryItem.module.css';
import { useToggle } from 'hooks/useToggle'; // Ensure your useToggle hook is exported from 'hooks/useToggle'

const ImageGalleryItem = ({ image }) => {
  const { isOpen, toggle } = useToggle();
  const [bgColor, setBgColor] = useState('#f0f8ff'); // Default background color
  const imgRef = useRef(null);
  const { webformatURL, largeImageURL, tags } = image;

  useEffect(() => {
    const extractColor = () => {
      const colorThief = new ColorThief();
      if (imgRef.current && imgRef.current.complete) {
        try {
          const dominantColor = colorThief.getColor(imgRef.current);
          const bgColor = `rgba(${dominantColor.join(', ')}, 0.6)`;
          setBgColor(bgColor);
        } catch (error) {
          console.error('Error extracting color:', error);
        }
      }
    };

    imgRef.current.addEventListener('load', extractColor);
    return () => imgRef.current.removeEventListener('load', extractColor);
  }, [webformatURL]); // Dependency on webformatURL to rerun if the image URL changes

  return (
    <li
      className={styles.galleryItem}
      onClick={toggle}
      style={{ backgroundColor: bgColor }}
    >
      <img ref={imgRef} src={webformatURL} alt={tags} />
      {isOpen && <Modal image={largeImageURL} tags={tags} onClose={toggle} />}
    </li>
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string,
  }).isRequired,
};

export default ImageGalleryItem;
