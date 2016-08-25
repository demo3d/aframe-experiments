//http://stemkoski.github.io/Three.js/Country-Select-Highlight.html

import 'aframe';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import 'aframe-bmfont-text-component'
import 'aframe-look-at-component'

import React from 'react';
import ReactDOM from 'react-dom';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Sky from './components/Sky';
import Info from './components/Info';

import Countries from 'world-countries'

const LAT = 48.2082,
    LNG = 16.3738

const RADIUS = 10

const COLORS = ['red', 'orange', 'yellow', 'green', 'blue'];

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
          geometry="primitive: box; width: 0.5; height: 0.5" 
          material={{color: COLORS[Math.floor(Math.random() * COLORS.length)],
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
          <img id="earth-texture" src="images/earth4096.jpg" />
        </a-assets>

        <Camera><Cursor/></Camera>

        <Sky />


        <Entity light={{type: 'ambient', color: '#888'}}/>
        <Entity light={{type: 'directional', intensity: 0.5}} position={[-1, 1, 0]}/>
        <Entity light={{type: 'directional', intensity: 1}} position={[1, 1, 0]}/>

        {this.countries}

        {country && <Info 
          position={this._latLngOnSphere(country.latlng[0], country.latlng[1])} 
          country={country} />}
      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene countries={Countries}/>, document.querySelector('.scene-container'));

/*
<Entity geometry="primitive: box" material={{color: this.state.color}}
                onClick={this.changeColor}
                position="0 0 -5">
          <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
        </Entity>
  */      