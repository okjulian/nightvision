import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import colors from '../utils/colors';
import styleHelpers from '../utils/styleHelpers';
import Logo from '../components/Logo';
import Chevron from '../components/Chevron';
import PreviewModeButton from '../components/PreviewModeButton';
import BuildModeButton from '../components/BuildModeButton';

class ScreenImage extends Component {
  constructor() {
    super();
    this.state = {
      width: '100vw',
      height: '100vh'
    };
  }
  render() {
    const { src } = this.props;
    const { width, height } = this.state;
    return (
      <div className="ScreenImage">
        <img
          ref={elem => elem && elem.addEventListener('load', ev => this.setState({ width: ev.srcElement.naturalWidth, height: ev.srcElement.naturalHeight }))}
          src={src}
          alt=''
          style={{ width, height }}
        />
        <style jsx>{`
          .ScreenImage {
            display: flex;
            background-color: ${colors.darkBlue}
          }
          .ScreenImage img {
            ${styleHelpers.centerBlockElement}
          }
        `}</style>
      </div>
    );
  }
}

const Breadcrumb = ({ children }) => <div className="Breadcrumb">
  {children}
  <style jsx>{`
    .Breadcrumb {
      display: flex;
      align-items: center;
      padding: 20px;
      justify-content: space-around;
      color: ${colors.lightGrey};
      height: 100%;
    }
  `}</style>
</div>;

const Modes = ({ mode, onModeChange }) => <div className="Modes">
  <PreviewModeButton active={mode === 'view'} onClick={() => onModeChange('view')} />
  <BuildModeButton active={mode === 'build'}  onClick={() => onModeChange('build')} />
  <style jsx>{`
    .Modes {
      display: flex;
      align-items: center;
      background-color: ${colors.darkBlack};
      height: 100%;
      border-left: 1px solid ${colors.darkestBlack};
      border-right: 1px solid ${colors.darkestBlack};
    }
    .Modes > * {
      flex: 1;
    }
  `}</style>
</div>;

const Toolbar = ({ project, screen, onModeChange, mode }) => <div className="Toolbar">
  <Breadcrumb>
    <div><Link to="/"><Logo color={colors.white} /></Link></div>
    <Chevron />
    <div><Link to="/project">{project}</Link></div>
    <Chevron />
    <div>{screen}</div>
  </Breadcrumb>
  <Modes onModeChange={onModeChange} mode={mode} />
  <div className="Actions" />
  <style jsx>{`
    .Toolbar {
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: ${colors.darkBlue};
    }
    .Toolbar :global(.Breadcrumb) {
      flex: 2;
    }
    .Toolbar :global(.Modes) {
      flex: 1;
    }
    .Toolbar :global(.Actions) {
      flex: 2;
    }
    .Toolbar :global(.Breadcrumb) :global(.Logo) {
      width: 26px;
    }
    .Toolbar :global(a) {
      text-decoration: none;
      color: inherit;
      font-weight: inherit;
    }
  `}</style>
</div>;

const findScreen = (screens, id) => {
  return screens.find(screen => screen.id === parseInt(id, 10));
};

class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'view'
    };
    this.changeMode = this.changeMode.bind(this);
  }
  changeMode(mode) {
    this.setState({ mode });
  }
  render() {
    const { mode } = this.state;
    const { match: { params: { id } }, project } = this.props;
    return (
      <div className="Screen">
        <ScreenImage src={findScreen(project.screens, id).image} />
        <Toolbar mode={mode} project={project.name} screen={findScreen(project.screens, id).title} onModeChange={this.changeMode} />
        <style jsx>{`
          .Screen {
            display: flex;
            flex-direction: column;
            height: 100vh;
          }
          .Screen :global(.ScreenImage) {
            flex: 11;
            overflow-y: scroll;
          }
          .Screen :global(.Toolbar) {
            flex: 1;
          }
        `}</style>
      </div>
    );
  }
}

export default Screen;
