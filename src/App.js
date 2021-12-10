import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import API from './services/api';
import Searchbar from './components/Searchbar/Searchbar.jsx';
import ImageGallery from './components/ImageGallery/ImageGallery';
import Button from './components/Button/Button';
import Spinner from './components/Loader.jsx';
import Modal from './components/Modal/Modal';
import styles from './App.module.css';

class App extends Component {
  state = {
    query: '',
    images: [],
    page: 1,
    isLoading: false,
    openModal: false,
    modalImage: '',
    alt: '',
    error: '',
  };

  static propTypes = {
    query: PropTypes.string,
    images: PropTypes.array,
    page: PropTypes.number,
    isLoading: PropTypes.bool,
    openModal: PropTypes.bool,
    modalImage: PropTypes.string,
    alt: PropTypes.string,
    error: PropTypes.string,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.fetchImage();
    }
  }

  onSearch = query => {
    this.setState({ query, images: [], page: 1, error: null });
  };

  fetchImage = () => {
    const { query, page } = this.state;
    this.setState({ isLoading: true });

    API.fetchImages(query, page)
      .then(({ hits }) => {
        if (hits.length === 0) {
          return toast.error(`We did not find ${query}!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
        this.setState(({ images, page }) => ({
          images: [...images, ...hits],
          page: page,
        }));
      })
      .catch(error => this.setState({ error: 'Please, try again' }))
      .finally(() => this.setState({ isLoading: false }));
  };

  onLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
    this.onScroll();
  };

  onScroll = () => {
    setTimeout(() => {
      window.scrollBy({
        top: document.documentElement.clientHeight,
        behavior: 'smooth',
      });
    }, 1000);
  };

  onOpenModal = e => {
    e.preventDefault();
    this.setState({
      openModal: true,
      modalImage: e.target.dataset.largeimg,
      alt: e.target.alt,
    });
  };

  onCloseModal = () => {
    this.setState({ openModal: false });
  };

  render() {
    const { images, isLoading, openModal, modalImage, alt, error } = this.state;

    return (
      <div className={styles.App}>
        <Searchbar onSubmit={this.onSearch} />
        {isLoading && <Spinner />}
        {images.length > 0 && !error && (
          <>
            <ImageGallery openModal={this.onOpenModal} images={images} />
            <Button fetchImages={this.onLoadMore} />
          </>
        )}
        {openModal && (
          <Modal onClose={this.onCloseModal} src={modalImage} alt={alt} />
        )}
        {error && <p className={styles.error}>{error}</p>}
        <ToastContainer autoClose={3000} theme={'colored'} />
      </div>
    );
  }
}
export default App;
