//http://stemkoski.github.io/Three.js/Country-Select-Highlight.html

import 'aframe';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import 'aframe-bmfont-text-component'
import 'aframe-look-at-component'
import 'aframe-event-set-component'
import 'aframe-animation-component'

import React from 'react';
import ReactDOM from 'react-dom';

import './components/country-globe';


class BoilerplateScene extends React.Component {

  render () {

    return (
      <Scene>
        <a-assets>
          <img id="earth-texture" src="images/earth2048.jpg" />
          <img id="earth-map" src="images/earth-day.jpg" />
          <img id="earth-index" src="images/earth-index.png" />
          <img id="earth-outline" src="images/earth-outline.png" />
        </a-assets>

        <a-entity camera look-controls>
          <a-cursor  fuse={true}
            id="cursor"
            animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 450"
            animation__fusing="property: fusing; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 2500"
            event-set__1="_event: mouseenter; color: springgreen"
            event-set__2="_event: mouseleave; color: black">
          </a-cursor>
        </a-entity>
        

        <Entity light={{type: 'ambient', color: '#fff'}}/>

        <a-box id="clickBox" visible="true" 
          material="transparent: true; opacity: 0.0;" 
          scale="0.2 0.2 0.2" 
          position="0 0 -2" 
          onClick={_ => console.log("box clicked")}/>
        
        <a-text look-at="[camera]" color="#fff" scale="0.5 0.5 0.5" id="countryText" position="0 0 -2" visible="false" text=""></a-text> 

        <a-entity country-globe="srcMap: #earth-map; srcOutline: #earth-outline; srcIndex: #earth-index; raycaster: #cursor; text: #countryText" > 
        </a-entity>

      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene />, document.querySelector('.scene-container'));
