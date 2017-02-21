import React, { Component } from 'react';

import Project from './pages/Project';
import '../node_modules/material-design-lite/dist/material.grey-pink.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Project />
      </div>
    );
  }
}

export default App;
