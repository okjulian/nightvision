import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Splash from './pages/Splash';
import Project from './pages/Project';
import RedirectTimeout from './components/RedirectTimeout';

import '../node_modules/material-design-lite/dist/material.grey-pink.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={() => <RedirectTimeout to="project" timeout={2000}><Splash /></RedirectTimeout>} />
            <Route path="/project" component={Project} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
