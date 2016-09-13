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
import './components/along-path'
import WorldCountries from 'world-countries'

import randomColor from 'randomcolor'


const RADIUS = 3

class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      country: null
    }

    this.countries = this.props.countries.map((c,i) => {

        const position = AFRAME.utils.coordinates.stringify(
          this._latLngOnSphere(c.latlng[0], c.latlng[1]))

        return <a-box
          key={i}
          width={0.01 * RADIUS}
          height={0.01 * RADIUS}
          depth={0.03 * RADIUS}
          position={position}
          onClick={this.flyToPOI} 
          >
        </a-box>
    })
  }

    _makeBezierCurve(_v1, _v3) {

    const v1 = new THREE.Vector3(_v1.x, _v1.y, _v1.z),
      v3 = new THREE.Vector3(_v3.x, _v3.y, _v3.z)
    
    var v2 = this._getBezierMidpoint(v1, v3);

    var curve = new THREE.QuadraticBezierCurve3(v1, v2, v3);
    var points = curve.getPoints(3) //50

    //return points;
    return [v1, v2, v3]
}
_getBezierMidpoint(v1, v3) {
    var d = v1.distanceTo(v3);
    var v2 = new THREE.Vector3();
    v2.x = (v1.x + v3.x) / 2;
    v2.y = (v1.y + v3.y) / 2;
    v2.z = (v1.z + v3.z) / 2;

    // Add a value to z, determined by distance, to give a nice curve shape
    //v2.z += d / 4;
    v2.y += d / 2
    return v2;
}

  flyToPOI= (e) => {

    const camera = document.querySelector('[camera]')
    console.log(camera.components)

      const startPos = AFRAME.utils.coordinates.parse(camera.getAttribute('position'))
      const poi = e.target
      const endPos = AFRAME.utils.coordinates.parse(poi.getAttribute('position'))
      let path = this._makeBezierCurve(startPos, endPos)
      path = path.map(AFRAME.utils.coordinates.stringify).join(',')

    camera.setAttribute('alongpath', 'path', path)
    camera.components.alongpath.play()
    camera.emit('fly')
  }


  _latLngOnSphere = (lat, lng) => {
        const phi = (90 - lat) * Math.PI / 180,
            theta = (lng + 180) * Math.PI / 180

        const v = new THREE.Vector3(
            RADIUS * Math.sin(phi) * Math.cos(theta),
            RADIUS * Math.cos(phi),
            RADIUS * Math.sin(phi) * Math.sin(theta))

        return v.multiplyScalar(1.05)
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

        <a-entity id="earth" position="0 0 0" earth={`
          srcAtmosphere: #earth-atmosphere;
          srcNormal: #earth-normal;
          srcClouds: #earth-clouds;
          srcBump: #earth-bump;
          camera: [camera];
          cameraEntity: #cameraEntity;
          `}
          ></a-entity>

        {this.countries}

          <a-camera user-height="0">
            <a-animation attribute="alongpath.animation"
               dur="5000"
               fill="forwards"
               to="1"
               begin="fly"
               repeat="0"></a-animation>
            <a-cursor
              fuse={true}
              animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150"
              animation__fusing="property: fusing; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500"
              event-set__1="_event: mouseenter; color: springgreen"
              event-set__2="_event: mouseleave; color: black"
              >
            </a-cursor>
          </a-camera>

      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene countries={WorldCountries}/>, document.querySelector('.scene-container'));

