import { Component } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default class Modal extends Component {
  state = {
    loading: false,
  };

  static propTypes = {
    loading: PropTypes.bool,
  };

  componentDidMount() {
    this.setState({ loading: true });
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = e => {
    if (e.code !== 'Escape') {
      return;
    }

    this.props.onClose();
  };

  handleBackdropClick = event => {
    if (event.currentTarget === event.target) {
      this.props.onClose();
    }
  };

  handleImageLoaded = () => {
    this.setState({ loading: false });
  };

  render() {
    const { src, alt } = this.props;

    return createPortal(
      <div onClick={this.handleBackdropClick} className={styles.overlay}>
        <div className={styles.modal} onLoad={this.handleImageLoaded}>
          <img className={styles.image} src={src} alt={alt}></img>
        </div>
      </div>,
      modalRoot,
    );
  }
}
