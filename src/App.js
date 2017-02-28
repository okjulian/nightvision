import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Splash from './pages/Splash';
import Project from './pages/Project';
import Screen from './pages/Screen';
import RedirectTimeout from './components/RedirectTimeout';

import '../node_modules/material-design-lite/dist/material.grey-pink.min.css';

const updateScreen = (project, screen, updateFunction) => {
  project.screens = project.screens.map(currentScreen => {
    if (currentScreen.id !== screen) {
      return currentScreen;
    }
    return updateFunction(currentScreen);
  });
  return project;
}

const addHotspot = (project, screen, hotspot) => {
  return updateScreen(project, screen, currentScreen => {
    currentScreen.hotspots.push(hotspot);
    return currentScreen;
  });
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      project: {
        name: 'Innovative Todo App',
        screens: [
          { id: 1, title: 'Todos', filename: '1-Todos.png', createdAt: new Date(), image: '/assets/1-Todos.png', thumbnail: './assets/1-Todos Thumb.png', hotspots: [] },
          { id: 2, title: 'Select todo', filename: '2-Select todo.png', createdAt: new Date(), image: '/assets/2-Select todo.png', thumbnail: './assets/2-Select todo Thumb.png', hotspots: [] },
          { id: 3, title: 'Edit todo', filename: '3-Edit todo.png', createdAt: new Date(), image: '/assets/3-Edit todo.png', thumbnail: './assets/3-Edit todo Thumb.png', hotspots: [] },
          { id: 4, title: 'New todo', filename: '4-New todo.png', createdAt: new Date(), image: '/assets/4-New todo.png', thumbnail: './assets/4-New todo Thumb.png', hotspots: [] },
          { id: 5, title: 'Filter completed todos', filename: '5-Filter completed todos.png', createdAt: new Date(), image: '/assets/5-Filter completed todos.png', thumbnail: './assets/5-Filter completed todos Thumb.png', hotspots: [] },
        ]
      }
    };
    this.addHotspot = this.addHotspot.bind(this);
  }
  addHotspot(screen, hotspot) {
    this.setState({
      project: addHotspot(this.state.project, hotspot.from, hotspot)
    });
  }
  render() {
    const { project } = this.state;
    return (
      <div className="App">
        <Router>
          <div>
            <Route exact path="/" component={props => <RedirectTimeout to="project" timeout={2000}><Splash {...props} /></RedirectTimeout>} />
            <Route path="/project" component={props => <Project {...props} project={project} />} />
            <Route
              path="/screens/:id"
              component={props =>
                <Screen
                  {...props}
                  project={project}
                  onHotspotCreated={(screen, hotspot) => this.addHotspot(screen, hotspot)}
                />
              }
            />
          </div>
        </Router>
        <style jsx global>{`
          html, body {
            width: 100vw;
            height: 100vh;
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
