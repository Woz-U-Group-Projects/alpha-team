
import React from 'react';
import ReactDOM from 'react-dom';
import styles from './styles.module.css';


class Car extends React.Component {
  render() {
    return <h2>Music Queue</h2>;
  }
}

class Garage extends React.Component {
  render() {
    return (
      <div>
      <h1 className={styles.musicPlayerText}>Music Player</h1>
      <button className={styles.playButton}>Play  </button>
      <button className={styles.pauseButton}>Pause  </button>
      <button className={styles.stopButton}>Stop  </button>
      <button className={styles.deleteButton}>Delete </button>
      <Car />
      </div>
    );
  }
}

class Tower extends React.Component {
  render() {
    return (
      <div>
      <h2 className={styles.title}>Alpha Queue</h2>
      <a href="http://localhost/api/login?request=twitchauthlink" className={styles.loginButton}>Login with twitch.tv</a>
      <Garage />
      </div>
    );
  }
}

ReactDOM.render(<Tower />, document.getElementById('root'));