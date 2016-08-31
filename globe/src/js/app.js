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

import Info from './components/Info';
import './components/country-globe';

import WorldCountries from 'world-countries'

import randomColor from 'randomcolor'

const LAT = 48.2082,
    LNG = 16.3738

const RADIUS = 1

class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: null
    }


    this.countries = this.props.countries.map((c,i) => {

        const position = AFRAME.utils.coordinates.stringify(
          this._latLngOnSphere(c.latlng[0], c.latlng[1]))

        return <Entity 
          key={i}
          look-at="[camera]"
          geometry="primitive: box; width: 0.6; height: 0.6" 
          material={{
            color: randomColor(),
            transparent: 0.5
          }}
          onClick={() => this.showInfo(c)}
          position={position}>
        </Entity>
    })
  }

  showInfo = (country) => {
    this.setState({country})
  }

  _latLngOnSphere = (lat, lng) => {
        const phi = (90 - lat) * Math.PI / 180,
            theta = (lng + 180) * Math.PI / 180

        const v = new THREE.Vector3(
            RADIUS * Math.sin(phi) * Math.cos(theta),
            RADIUS * Math.cos(phi),
            RADIUS * Math.sin(phi) * Math.sin(theta))

        return v
    }


  render () {
    const country = this.state.country

    return (
      <Scene>
        <a-assets>
          <img id="earth-texture" src="images/earth2048.jpg" />
          <img id="earth-map" src="images/earth-day.jpg" />
          <img id="earth-index" src="images/earth-index.png" />
          <img id="earth-outline" src="images/earth-outline.png" />
        </a-assets>

        <a-entity camera look-controls>
          <a-cursor 
            id="cursor"
            animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
            animation__fusing="property: fusing; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500"
            event-set__1="_event: mouseenter; color: springgreen"
            event-set__2="_event: mouseleave; color: black">
          </a-cursor>
        </a-entity>
        

        <Entity light={{type: 'ambient', color: '#fff'}}/>

        
        
        <a-entity country-globe="srcMap: #earth-map; srcOutline: #earth-outline; srcIndex: #earth-index; raycaster: #cursor" > 
        </a-entity>

      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene countries={WorldCountries}/>, document.querySelector('.scene-container'));

/*
<Sky />
        {this.countries}

        {country && <Info 
          position={this._latLngOnSphere(country.latlng[0], country.latlng[1])} 
          country={country} />}
          */