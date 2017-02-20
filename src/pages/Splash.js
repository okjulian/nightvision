import React from 'react';

import Logo from '../components/Logo';
import colors from '../utils/colors';

export default () =>
  <div className='Splash'>
    <div className='Logo-wrapper'>
      <Logo color={colors.lightGrey} />
    </div>
    <style jsx>{`
      .Splash {
        width: 100vw;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: hidden;
        background-color: ${colors.darkBlue};
      }
      .Logo-wrapper {
        width: 10%;
        height: 10%;
      }
    `}</style>
  </div>;
