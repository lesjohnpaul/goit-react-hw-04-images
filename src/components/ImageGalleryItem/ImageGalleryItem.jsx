import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ColorThief from 'colorthief'; // Import ColorThief
import Modal from '../Modal/Modal';
import styles from './ImageGalleryItem.module.css';

class ImageGalleryItem extends Component {
  static propTypes = {
    image: PropTypes.shape({
      webformatURL: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
      tags: PropTypes.string,
    }).isRequired,
  };

  state = {
    showModal: false,
    bgColor: '#f0f8ff', // Default background color
  };

  imgRef = React.createRef(); // Create a ref for the image

  componentDidMount() {
    this.setColor();
  }

  setColor = () => {
    if (this.imgRef.current.complete) {
      // Ensure the image is loaded
      this.extractColor();
    } else {
      this.imgRef.current.addEventListener('load', this.extractColor); // Extract color once the image is loaded
    }
  };

  extractColor = () => {
    const colorThief = new ColorThief();
    const img = this.imgRef.current;
    // Make sure the image is not from a different origin to avoid CORS issues
    if (img && img.src && img.src.startsWith('http')) {
      try {
        const dominantColor = colorThief.getColor(img);
        const bgColor = `rgba(${dominantColor.join(', ')}, 0.6)`; // Set background color with some transparency
        this.setState({ bgColor });
      } catch (error) {
        console.error('Error extracting color:', error);
      }
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal,
    }));
  };

  render() {
    const { webformatURL, largeImageURL, tags } = this.props.image;
    const { showModal, bgColor } = this.state;

    return (
      <li
        className={styles.galleryItem}
        onClick={this.toggleModal}
        style={{ backgroundColor: bgColor }}
      >
        <img ref={this.imgRef} src={webformatURL} alt={tags} />
        {showModal && (
          <Modal image={largeImageURL} tags={tags} onClose={this.toggleModal} />
        )}
      </li>
    );
  }
}

export default ImageGalleryItem;
