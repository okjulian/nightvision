import React from 'react';

export default ({ color, hide }) =>
  <div className="TopBar" style={{ backgroundColor: color, display: hide ? 'none' : 'block' }}>
    <style jsx>{`
      .TopBar {
        width: 100%;
        height: 3px;
      }
    `}</style>
  </div>