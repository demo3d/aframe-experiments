import 'aframe';
import 'babel-polyfill';
import {Animation, Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';

import Camera from './components/Camera';
import Cursor from './components/Cursor';
import Sky from './components/Sky';
import Terrain from './components/Terrain';


//require('./components/AlongPath')


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
    var points = curve.getPoints(5) //50

    // walk back and trim the spline until a specified number of units out from the destination
    /*
    for (var i = points.length - 1; i > 0; i-- ) {
        if (points[i].distanceTo(v3) > 58) {
            break;
        } else {
            points.splice(i, 1);
        }
    }
    */

    return points;
}
_getBezierMidpoint(v1, v3) {
    var d = v1.distanceTo(v3);
    var v2 = new THREE.Vector3();
    v2.x = (v1.x + v3.x) / 2;
    v2.y = (v1.y + v3.y) / 2;
    v2.z = (v1.z + v3.z) / 2;

    // Add a value to z, determined by distance, to give a nice curve shape
    v2.z = v2.z + d / 4;
    return v2;
}

  flyToPOI = (e) => {
    console.log("cl")
    this.setState({
      poi: e.target
    });
  };

  render () {

    let path = null

    if (this.state.poi) {

      const camera = document.querySelector('[camera]')
      const startPos = AFRAME.utils.coordinates.parse(camera.getAttribute('position'))
      const poi = this.state.poi
      const endPos = AFRAME.utils.coordinates.parse(poi.getAttribute('position'))
      console.log("bef")
      path = this._makeBezierCurve(startPos, endPos)
      

      console.log(path)
      console.log(path.map(coordinates.stringify).join(' '))

      //"path:-10,0,10 -5,5,5 0,0,0 5,-5,5 10,0,10; closed:true; dur:2000
    }

    

    return (
      <Scene stats={false} inspector="url: https://aframe.io/releases/0.3.0/aframe-inspector.min.js">
        <Camera position="0 15 -10" rotation="0 180 0">
          <Cursor/>
        </Camera>


        <Entity light={{type: 'ambient', color: '#fff'}}/>
        
        <Terrain />

        <Entity id="markerLeft" geometry="primitive: box" material={{color: "red"}}
                  position="12 11 12"
                  onClick={this.flyToPOI} />

        <Entity id="markerTop" geometry="primitive: box" material={{color: "red"}}
                  position="0 16 -4"
                  onClick={this.flyToPOI} />

        <Entity id="markerRight" geometry="primitive: box" material={{color: "red"}}
                  position="14 6 -13"
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