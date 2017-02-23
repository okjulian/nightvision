import React from 'react';
import moment from 'moment';
import { withRouter } from 'react-router';

import Logo from '../components/Logo';
import colors from '../utils/colors';
import media from '../utils/media';

const Header = ({ title, onClick }) => <div className="Header" style={{ backgroundColor: colors.darkBlue }}>
  <Logo />
  <h2 className="Title">{title}</h2>
  <style jsx>{`
    .Header {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-left: 50px;
      padding-right: 50px;
      padding-top: 25px;
      padding-bottom: 25px;
    }
    .Header :global(.Logo) {
      height: 15%;
    }
    .Header :global(.Title) {
      font-size: 32px;
      font-weight: 300;
      line-height: 34px;
    }
    .Header :global(.Button) {
      position: absolute;
      bottom: -25px;
      right: 50px;
    }
    .Title {
      color: ${colors.white}
    }
  `}</style>
</div>;

const Content = ({ children }) => <div className="Content">
  {children}
  <style jsx>{`
    .Content {
      padding-top: 50px;
      padding-left: 25px;
      padding-right: 25px;
    }
  `}</style>
</div>;

const ScreenPreview = ({ screen, push }) => <div
  onClick={ev => { ev.preventDefault(); push(`/screens/${screen.id}`); }}
  className="Screen mdl-card mdl-shadow--2dp"
>
  <img className="Image" src={screen.thumbnail} alt={`${screen.title}`} />
  <div className="Title mdl-card__title">
    <h2 className="mdl-card__title-text">{screen.title}</h2>
  </div>
  <div className="CreatedAt mdl-card__supporting-text">{moment(screen.createdAt).calendar()}</div>
  <div className="Filename mdl-card__supporting-text" style={{ display: 'none' }}>{screen.filename}</div>
  <style jsx>{`
    .Screen {
      display: flex;
      justify-content: center;
      text-align: center;
      cursor: pointer;
    }
    .Image {
      background-color: ${colors.black};
      object-fit: contain;
      flex: 3;
    }
    .Title {
      flex: 1;
    }
    .Title h2 {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      width: 100%;
    }
    .CreatedAt {
      flex: 1;
    }
    .Filename {
      flex: 1;
    }
  `}</style>
</div>;

const LinkScreen = withRouter(ScreenPreview);

const Screens = ({ screens = []}) => <div className="Screens">
  {screens.map(screen => <LinkScreen key={screen.id} screen={screen} />)}
  <style jsx>{`
    .Screens {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-basis: 25%;
    }
    .Screens:after {
      content: "";
      flex-basis: 25%;
    }
    .Screens :global(.Screen) {
      margin: 2%;
      width: 21%;
    }
    @media(${media.laptop}) {
      .Screens {
        flex-basis: 33%;
      }
      .Screens:after {
        content: "";
        flex-basis: 33%;
      }
      .Screens :global(.Screen) {
        margin: 2%;
        width: 29%;
      }
    }
    @media(${media.tablet}) {
      .Screens {
        flex-basis: 50%;
      }
      .Screens:after {
        content: "";
        flex-basis: 50%;
      }
      .Screens :global(.Screen) {
        margin: 2%;
        width: 46%;
      }
    }
    @media(${media.mobile}) {
      .Screens {
        flex-basis: 100%;
      }
      .Screens:after {
        content: "";
        flex-basis: 100%;
      }
      .Screens :global(.Screen) {
        margin: 2%;
        width: 98%;
      }
    }
  `}</style>
</div>;

export default ({ project }) => <div className="Project">
  <Header title={project.name} />
  <Content>
    <Screens screens={project.screens} />
  </Content>
  <style jsx>{`
    .Project :global(.Header) {
      width: 100%;
      height: 15rem;
    }
    .Project :global(.Content) {
    }
  `}</style>
</div>;
