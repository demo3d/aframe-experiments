import 'aframe';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Sky from './components/Sky';
import Terrain from './components/Terrain';

import randomColor from 'randomcolor'

require('./components/AlongPath')


class BoilerplateScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      poi: null
    }
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
    v2.z += d / 4;
    v2.y += d / 8
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

  render () {

    return (
      <Scene stats={false} inspector="url: https://aframe.io/releases/0.3.0/aframe-inspector.min.js">
        <Camera alongpath="" position="0 15 -10" rotation="0 180 0">
            <a-animation attribute="alongpath.animation"
               dur="5000"
               fill="forwards"
               to="1"
               begin="fly"
               repeat="0"></a-animation>
          <Cursor/>
        </Camera>


        <Entity light={{type: 'ambient', color: '#fff'}}/>
        
        <Terrain />


        <Entity id="markerLeft" geometry="primitive: box" material={{color: randomColor()}}
                  position="12 12 12"
                  onClick={this.flyToPOI} />

        <Entity id="markerTop" geometry="primitive: box" material={{color: randomColor()}}
                  position="0 17 -4"
                  onClick={this.flyToPOI} />

      <Entity id="markerTop2" geometry="primitive: box" material={{color: randomColor()}}
                  position="7 16 5"
                  onClick={this.flyToPOI} />

        <Entity id="markerRight" geometry="primitive: box" material={{color: randomColor()}}
                  position="14 7 -13"
                  onClick={this.flyToPOI} />
      </Scene>
    );
  }
}

ReactDOM.render(<BoilerplateScene/>, document.querySelector('.scene-container'));

/*
<Entity geometry="primitive: box" material={{color: this.state.color}}
                onClick={this.changeColor}
                position="0 0 -5">
          <Animation attribute="rotation" dur="5000" repeat="indefinite" to="0 360 360"/>
        </Entity>
        */