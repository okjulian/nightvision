import React from 'react';

import BuildModeIcon from './BuildModeIcon';
import TopBar from './TopBar';
import colors from '../utils/colors';

export default ({ active, onClick }) =>
  <div className="BuildModeButton" onClick={onClick}>
    <TopBar color={active ? colors.blue : undefined} />
    <BuildModeIcon color={active ? colors.blue : undefined} />
    <style jsx>{`
      .BuildModeButton {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
      }
      .BuildModeButton :global(.TopBar) {
        position: absolute;
        top: 0;
        left: 0;
      }
    `}</style>
  </div>;