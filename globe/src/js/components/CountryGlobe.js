import './country-globe'

import {Entity} from 'aframe-react';
import React from 'react';

export default props => {

	const prop = `srcMap: ${props.srcMap}; srcOutline: ${props.srcOutline}; srcIndex: ${props.srcIndex};` 

  return <Entity country-globe={prop} />
}
