import React, { Component } from 'react';

import Splash from './pages/Splash';
import '../node_modules/material-design-lite/dist/material.grey-pink.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Splash />
      </div>
    );
  }
}

export default App;
