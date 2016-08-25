import {Entity} from 'aframe-react';
import React from 'react';


const RADIUS = 10

export default props => {

	const text=`text: ${props.country.translations.deu.common};` 
//  		fnt:../../fonts/DejaVu-sdf.fnt; 
  		//fntImage:../../fonts/DejaVu-sdf.png`

  	const position = AFRAME.utils.coordinates.stringify(props.position.divideScalar(6))

  return <Entity 
  look-at="[camera]"
  position={position} 
  bmfont-text={text}/>
}
