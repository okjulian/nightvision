import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import colors from '../utils/colors';
import styleHelpers from '../utils/styleHelpers';
import Logo from '../components/Logo';
import Chevron from '../components/Chevron';
import PreviewModeButton from '../components/PreviewModeButton';
import BuildModeButton from '../components/BuildModeButton';

import 'react-select/dist/react-select.css';

const Corner = () =>
  <div className="Corner">
    <style jsx>{`
      .Corner {
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid ${colors.hotspotBlue};
        transform: rotate(45deg);
      }
    `}</style>
  </div>;

const Hotspot = ({ hotspot, mode, scrollToView, onClick }) => {
  const { x, y, width, height, translate, linkTo } = hotspot;
  const component = <div
    className="Hotspot"
    style={{
      top: y,
      left: x,
      width,
      height,
      transform: translate && `translate(${translate.x}px, ${translate.y}px)`,
      cursor: mode === 'view' ? 'pointer' : 'inherit',
      background: mode === 'view' ? 'transparent' : colors.transparentBlue,
      border: mode === 'view' ? '0' : `1px solid ${colors.hotspotBlue}`
    }}
    onClick={() => mode === 'build' ? onClick : null}
  >
    {mode === 'build' && <Corner />}
    <style jsx>{`
      .Hotspot {
        z-index: 19;
        position: absolute;
      }
      .Hotspot :global(.Corner) {
        position: absolute;
        bottom: 0;
        right: 2px;
      }
    `}</style>
  </div>;
  return (
    mode === 'view' ? <Link to={`/screens/${linkTo}`}>{component}</Link> : component
  );
};

/**
 * Create hotspot with the correct x, y, w and h.
 * This is needed because of the way we render the drawn hotspot by using transform: translate()
 */
const undoTranslation = (hotspot, mousePosition) => {
  const { x, y, width, height } = hotspot;

  if (mousePosition.x > x && mousePosition.y < y) {
    return { x, y: y - height, width, height };
  }
  if (mousePosition.x < x && mousePosition.y > y) {
    return { x: x - width, y, width, height };
  }
  if (mousePosition.x < x && mousePosition.y < y) {
    return { x: x - width, y: y - height, width, height };
  }
  return { x, y, width, height };
};

const Hotspots = ({ hotspots, style, mode }) =>
  <div className="Hotspots" style={style}>
    {hotspots.map((hotspot, index) => <Hotspot mode={mode} key={`${hotspot.x}-${hotspot.y}-${hotspot.width}-${hotspot.height}`} hotspot={hotspot} scrollToView={index === hotspots.length - 1} />)}
    <style jsx>{`
      .Hotspots {
        width: 100%;
        height: 100%;
        position: absolute;
      }
    `}</style>
  </div>;

/**
 * Returns mouse position relative to the current element
 * We need this to get an accurate mouse position even if the user has scrolled
 * http://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
 */
function getMousePosition(e) {
  var rect = e.target.getBoundingClientRect();
  return {
    x: e.pageX - rect.left,
    y: e.pageY - rect.top
  };
}

const Button = ({ children, onClick }) =>
  <div className="Button" onClick={onClick}>
    {children}
    <style jsx>{`
      .Button {
        background-color: ${colors.green};
        color: ${colors.white};
        padding: 10px;
        border-radius: 5px;
        padding-right: 30px;
        padding-left: 30px;
        margin-right: 15px;
        cursor: pointer;
      }
    `}</style>
  </div>;

const LinkText = ({ children, underlined, onClick }) =>
  <div className="LinkText" onClick={onClick} style={{ textDecoration: underlined ? 'underline' : 'inherit' }}>
    {children}
    <style jsx>{`
      .LinkText {
        color: ${colors.lightGrey};
        cursor: pointer;
      }
    `}</style>
  </div>;

const HotspotCreationModal = ({x, y, screens, onLinkCreated, onHotspotCreated, closeModal, linkTo}) =>
  <div className="HotspotCreationModal" style={{ left: x, top: y }} onMouseDown={ev => { ev.preventDefault(); ev.stopPropagation(); }}>
    <div className="Row">
      Link to:
      <LinkText onClick={closeModal}>X</LinkText>
    </div>
    <div className="Row">
      <Select
        name="form-field-name"
        value={linkTo}
        options={screens.map(({ id, title }) => ({ value: id, label: title }))}
        onChange={selection => onLinkCreated(selection.value)}
      />
    </div>
    <div className="Row Actions">
      <Button onClick={onHotspotCreated}>Save</Button>
      <LinkText underlined onClick={closeModal}>Cancel</LinkText>
    </div>
    <style jsx>{`
      .HotspotCreationModal {
        z-index: 5;
        position: relative;
        width: 380px;
        border-radius: 5px;
        background-color: ${colors.white};
        color: ${colors.lightGrey};
        padding: 15px;
        border: 1px solid ${colors.lightBlack};
        display: flex;
        flex-direction: column;
      }
      .HotspotCreationModal .Row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
      }
      .HotspotCreationModal .Row.Actions {
        justify-content: flex-start;
      }
      .HotspotCreationModal .Row :global(.Select) {
        flex: 1;
      }
    `}</style>
  </div>;

class HotspotDrawer extends Component {
  constructor() {
    super();
    this.state = {
      hotspot: {
        x: 0,
        y: 0,
        width: 0,
        height: 0
      },
      isDrawing: false,
      shouldShowHotspotCreationModal: false
    };
    this.createHotspot = this.createHotspot.bind(this);
    this.setXY = this.setXY.bind(this);
    this.calculateHotspotPosition = this.calculateHotspotPosition.bind(this);
    this.onHotspotDrawn = this.onHotspotDrawn.bind(this);
    this.setLinkTo = this.setLinkTo.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  calculateHotspotPosition(mousePosition, ev) {
    ev.preventDefault();
    if (this.state.isDrawing && !this.state.shouldShowHotspotCreationModal) {
      const { x, y } = this.state.hotspot;
      const width = Math.abs(mousePosition.x - x);
      const height = Math.abs(mousePosition.y - y);
      if (mousePosition.x > x && mousePosition.y < y) {
        return this.setState({ hotspot: { x, y, width, height, translate: { x: 0, y: -height } } });
      }
      if (mousePosition.x < x && mousePosition.y > y) {
        return this.setState({ hotspot: { x, y, width, height, translate: { x: -width, y: 0 } } });
      }
      if (mousePosition.x < x && mousePosition.y < y) {
        return this.setState({ hotspot: { x, y, width, height, translate: { x: -width, y: -height } } });
      }
      return this.setState({ hotspot: { x, y, width, height } });
    }
  }
  onHotspotDrawn(ev) {
    ev.preventDefault();
    if (!this.state.shouldShowHotspotCreationModal) {
      const { hotspot } = this.state;
      const shouldShowHotspotCreationModal = !!(hotspot.width && hotspot.height);
      this.setState({
        hotspot: undoTranslation(hotspot, getMousePosition(ev)),
        isDrawing: false,
        shouldShowHotspotCreationModal
      });
    }
  }
  createHotspot() {
    this.props.onHotspotCreated(this.state.hotspot);
    this.setState({
      hotspot: { x: 0, y: 0, width: 0, height: 0 },
      isDrawing: false,
      shouldShowHotspotCreationModal: false
    });
  }
  setXY(ev) {
    ev.preventDefault();
    const { x, y } = getMousePosition(ev);
    this.setState({
      isDrawing: true,
      hotspot: {
        x,
        y
      },
      shouldShowHotspotCreationModal: false
    });
  }
  setLinkTo(linkTo) {
    const hotspot = this.state.hotspot;
    hotspot.linkTo = linkTo;
    this.setState({ hotspot });
  }
  closeModal() {
    this.setState({
      hotspot: { x: 0, y: 0, width: 0, height: 0 },
      shouldShowHotspotCreationModal: false
    });
  }
  render() {
    const { style, screens } = this.props;
    const { hotspot, shouldShowHotspotCreationModal } = this.state;
    return (
      <div
        className="HotspotDrawer"
        onMouseDown={this.setXY}
        onMouseMove={ev => this.calculateHotspotPosition(getMousePosition(ev), ev)}
        onMouseUp={this.onHotspotDrawn}
        style={style}
      >
        <Hotspot hotspot={hotspot} mode="build" />
        {shouldShowHotspotCreationModal && <HotspotCreationModal
          linkTo={hotspot.linkTo}
          onLinkCreated={this.setLinkTo}
          onHotspotCreated={this.createHotspot}
          closeModal={this.closeModal}
          screens={screens}
          x={hotspot.x + hotspot.width + 10}
          y={hotspot.y + hotspot.height / 2 - 10}
        />}
        <style jsx>{`
          .HotspotDrawer {
            width: 100%;
            height: 100%;
            position: absolute;
          }
        `}</style>
      </div>
    );
  }
};

class ScreenImage extends Component {
  constructor() {
    super();
    this.state = {
      width: 0,
      height: 0,
      newHotspots: []
    };
    this.createHotspot = this.createHotspot.bind(this);
  }
  createHotspot(hotspot) {
    hotspot.from = this.props.id;
    const newHotspots = this.state.newHotspots.concat([hotspot]);
    this.setState({ newHotspots });
  }
  /**
   * Create hotspots in componentWillUnmount because if we create each hotspot as it gets drawn, the UI gets rerendered.
   * This rerender seems ugly because the screen flashes for a micro second and it also scrolls to top.
   * The scrolling to top seems solvable by keeping track of scroll position and then restoring it, but it feels like too much of a hack.
   */
  componentWillUnmount() {
    this.state.newHotspots.forEach(hotspot => this.props.onHotspotCreated(hotspot));
  }
  render() {
    const { src, hotspots, mode, screens, id } = this.props;
    const { width, height, newHotspots } = this.state;
    const screenNewHotspots = newHotspots.filter(hotspot => hotspot.from === id);
    return (
      <div className="ScreenImage">
        {/**
          * Set Hotspot and HotspotDrawer style to make them have the same width and height of ScreenImage.
          * This happens because only setting width and height to 100% is not enough due to the recalculation of width and height.
          */}
        <Hotspots style={{ width, height }} mode={mode} hotspots={hotspots.concat(screenNewHotspots)} />
        {mode === 'build' && <HotspotDrawer style={{ width, height }} screens={screens} onHotspotCreated={this.createHotspot} />}
        <img
          ref={elem => elem && elem.addEventListener('load', ev => { ev.preventDefault(); this.setState({ width: ev.srcElement.naturalWidth, height: ev.srcElement.naturalHeight }) })}
          src={src}
          alt=''
          style={{ width, height }}
        />
        <style jsx>{`
          .ScreenImage {
            position: relative;
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
  <PreviewModeButton active={mode === 'view'} onClick={ev => { ev.preventDefault(); onModeChange('view') }} />
  <BuildModeButton active={mode === 'build'} onClick={ev => { ev.preventDefault(); onModeChange('build') }} />
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
    .Modes :global(a) {
      width: 100%;
      height: 100%;
    }
  `}</style>
</div>;

const Actions = () => <div className="Actions">
  <style jsx>{`
    .Actions {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      height: 100%;
    }
  `}</style>
</div>;

const Toolbar = ({ project, screen, onModeChange, mode }) => <div className="Toolbar">
  <Breadcrumb>
    <Link to="/"><Logo color={colors.white} /></Link>
    <Chevron />
    <Link to="/project">{project}</Link>
    <Chevron />
    <div>{screen}</div>
  </Breadcrumb>
  <Modes onModeChange={onModeChange} mode={mode} />
  <Actions />
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
    const { project, match, onHotspotCreated } = this.props;
    const id = parseInt(match.params.id, 10);
    const screen = findScreen(project.screens, id);
    return (
      <div className="Screen">
        <ScreenImage id={id} mode={mode} hotspots={screen.hotspots} screens={project.screens.map(({ title, id }) => ({ title, id }))} src={screen.image} onHotspotCreated={hotspot => onHotspotCreated(id, hotspot)} />
        <Toolbar mode={mode} onModeChange={this.changeMode} project={project.name} screen={screen.title} />
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
