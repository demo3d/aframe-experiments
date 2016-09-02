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

import './components/earth'
import WorldCountries from 'world-countries'

import randomColor from 'randomcolor'


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
          <img id="earth-atmosphere" src="images/earth4096.jpg" />
          <img id="earth-clouds" src="images/earth_clouds_2048.png" />
          <img id="earth-normal" src="images/earth_normalmap4096.jpg" />
          <img id="earth-bump" src="images/earth_bumpmap4096.jpg" />
        </a-assets>

        <a-sky id="image-360" radius="10" color="black" ></a-sky>

        <a-entity earth={`
          srcAtmosphere: #earth-atmosphere;
          srcNormal: #earth-normal;
          srcClouds: #earth-clouds;
          srcBump: #earth-bump;
          camera: [camera];
          `}></a-entity>

        <a-entity camera look-controls wasd-controls position="0 0 2">
          <a-cursor id="cursor"
            animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
            animation__fusing="property: fusing; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500"
            event-set__1="_event: mouseenter; color: springgreen"
            event-set__2="_event: mouseleave; color: black"
            raycaster="objects: .link"></a-cursor>
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
