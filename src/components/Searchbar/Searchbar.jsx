import { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import { ImSearch } from 'react-icons/im';
import styles from './Searchbar.module.css';

class Searchbar extends Component {
  state = {
    query: '',
  };

  static propTypes = {
    query: PropTypes.string,
  };

  handleQueryChange = event => {
    this.setState({ query: event.target.value.toLowerCase() });
  };

  handleQuerySubmit = event => {
    event.preventDefault();
    const { query } = this.state;

    if (query.trim() === '') {
      return toast.warn('Please, enter your query');
    }

    this.props.onSubmit(query);

    this.setState({ query: '' });
  };

  render() {
    return (
      <header className={styles.searchbar}>
        <form className={styles.form} onSubmit={this.handleQuerySubmit}>
          <button type="submit" className={styles.button}>
            <ImSearch />
            <span className={styles.buttonLabel}>Search</span>
          </button>
          <input
            className={styles.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.query}
            onChange={this.handleQueryChange}
          />
        </form>
      </header>
    );
  }
}
export default Searchbar;
