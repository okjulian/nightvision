import React from 'react';

import PreviewModeIcon from './PreviewModeIcon';
import TopBar from './TopBar';
import colors from '../utils/colors';

export default ({ active, onClick }) =>
  <div className="PreviewModeButton" onClick={onClick}>
    <TopBar color={active ? colors.green : undefined} />
    <PreviewModeIcon color={active ? colors.green : undefined} />
    <style jsx>{`
      .PreviewModeButton {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
      }
      .PreviewModeButton :global(.TopBar) {
        position: absolute;
        top: 0;
        left: 0;
      }
    `}</style>
  </div>;
