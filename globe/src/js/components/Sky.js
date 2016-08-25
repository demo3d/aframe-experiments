//https://www.npmjs.com/package/country-data

import {Entity} from 'aframe-react';
import React from 'react';

const RADIUS = 10

export default props => (
  <Entity geometry={{primitive: 'sphere', radius: RADIUS}}
          material={{src: "#earth-texture", shader: 'flat'}}
          scale="1 1 -1"
          rotation="0 180 0"/>
);
