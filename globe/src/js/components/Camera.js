import {Entity} from 'aframe-react';
import React from 'react';

export default props => (
  <Entity>
    <Entity camera="" 
    	look-controls={true} 
    	{...props}/>
  </Entity>
);
