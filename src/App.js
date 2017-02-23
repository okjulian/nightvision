import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Splash from './pages/Splash';
import Project from './pages/Project';
import Screen from './pages/Screen';
import RedirectTimeout from './components/RedirectTimeout';

import '../node_modules/material-design-lite/dist/material.grey-pink.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {
        name: 'Innovative Todo App',
        screens: [
          { id: 1, title: 'Todos', filename: '1-Todos.png', createdAt: new Date(), image: '/assets/1-Todos.png', thumbnail: './assets/1-Todos Thumb.png' },
          { id: 2, title: 'Select todo', filename: '2-Select todo.png', createdAt: new Date(), image: '/assets/2-Select todo.png', thumbnail: './assets/2-Select todo Thumb.png' },
          { id: 3, title: 'Edit todo', filename: '3-Edit todo.png', createdAt: new Date(), image: '/assets/3-Edit todo.png', thumbnail: './assets/3-Edit todo Thumb.png' },
          { id: 4, title: 'New todo', filename: '4-New todo.png', createdAt: new Date(), image: '/assets/4-New todo.png', thumbnail: './assets/4-New todo Thumb.png' },
          { id: 5, title: 'Filter completed todos', filename: '5-Filter completed todos.png', createdAt: new Date(), image: '/assets/5-Filter completed todos.png', thumbnail: './assets/5-Filter completed todos Thumb.png' },
        ]
      }
    };
  }
  render() {
    const { project } = this.state;
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={() => <RedirectTimeout to="project" timeout={2000}><Splash /></RedirectTimeout>} />
            <Route path="/project" component={() => <Project project={project} />} />
            <Route path="/screens/:id" component={props => <Screen {...props} project={project} />} />
          </div>
        </Router>
        <style jsx global>{`
          html, body {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: sans-serif;
          }
          *, *:before, *:after {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    );
  }
}

export default App;
