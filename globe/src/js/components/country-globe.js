import CountryColorMap from './CountryColorMap'

import WorldCountries from 'world-countries'

const parallel = require('run-parallel')

const VS = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vfUv;
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
    vNormal = normalize( normalMatrix * normal );
    vUv = vec2(1.-uv.s, uv.t);
    //vUv = uv;
}
`

const FS = `
uniform sampler2D mapIndex;
uniform sampler2D lookup;
uniform sampler2D outline;
uniform sampler2D blendImage;
varying vec3 vNormal;
varying vec2 vUv;
void main() 
{
    vec4 mapColor = texture2D( mapIndex, vUv );    
    float indexedColor = mapColor.y;       
    vec2 lookupUV = vec2( indexedColor, 0.0 );
    vec4 lookupColor = texture2D( lookup, lookupUV );                              

    vec4 outlineColor = texture2D( outline, vUv );
    vec4 blendColor = texture2D( blendImage, vUv );
    // if (outlineColor.x > 0.1) outlineColor = vec4(1.0,1.0,1.0,1.0);

    gl_FragColor = 0.5 * outlineColor + 1.0 * lookupColor + 0.5 * blendColor;
}
`
const RADIUS = 3

AFRAME.registerComponent('country-globe', {
    schema: {
        srcMap: {
            type: 'src'
        },
        srcOutline: {
            type: 'src'
        },
        srcIndex: {
            type: 'src'
        },
        raycaster: {
            type: 'selector'
        },
        text: {
            type: 'selector'
        }
    },

    init: function() {
        this.loader = new THREE.TextureLoader()
        const lookupCanvas = document.createElement('canvas');
        lookupCanvas.width = 256;
        lookupCanvas.height = 1;
        this.lookupContext = lookupCanvas.getContext('2d');
        this.lookupTexture = new THREE.Texture(lookupCanvas);
        this.lookupTexture.magFilter = THREE.NearestFilter;
        this.lookupTexture.minFilter = THREE.NearestFilter;
        this.lookupTexture.needsUpdate = true;

    },

    _doUpdate: function(mapTexture, outlineTexture, indexTexture) {

        const planeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                width: {
                    value: window.innerWidth
                },
                height: {
                    value: window.innerHeight
                },
                mapIndex: {
                    value: indexTexture
                },
                outline: {
                    value: outlineTexture
                },
                lookup: {
                    value: this.lookupTexture
                },
                blendImage: {
                    value: mapTexture
                }
            },
            vertexShader: VS,
            fragmentShader: FS,
            side: THREE.BackSide
        });

        const geometry = new THREE.SphereGeometry(RADIUS, 64, 32)

        const mesh = new THREE.Mesh(geometry, planeMaterial);
        mesh.position.set(0, 0, 0)
        mesh.scale.set(1, 1, 1)

        mesh.material.needsUpdate = true

        this.el.setObject3D('mesh', mesh)

        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = 4096;
        mapCanvas.height = 2048;
        this.mapContext = mapCanvas.getContext('2d');
        const imageObj = new Image();
        imageObj.onload = () => {
            // flip drawing texture along x axis
            this.mapContext.translate(4096, 0);
            this.mapContext.scale(-1,1)
            // end flip
            this.mapContext.drawImage(imageObj, 0, 0);

        };
        imageObj.src = this.data.srcIndex


        this.el.addEventListener('click', e => this._clicked(e))

        //this.data.raycaster.components.raycaster.addEventListener
    },

    update: function(oldData) {

        parallel([
            (next) => {
                this.loader.load(this.data.srcMap, tex => next(null, tex), undefined, err => next(err))
            }, (next) => {
                this.loader.load(this.data.srcOutline, tex => next(null, tex), undefined, err => next(err))
            }, (next) => {
                this.loader.load(this.data.srcIndex, tex => next(null, tex), undefined, err => next(err))
            }
        ], (err, [mapTexture, outlineTexture, indexTexture]) => {
            if (err) console.log(err) //return fatal(err)

            this._doUpdate(mapTexture, outlineTexture, indexTexture)
        })


    },

      _latLngOnSphere: function(lat, lng)  {
        const phi = (90 - lat) * Math.PI / 180,
            //theta = (lng + 180) * Math.PI / 180
            theta = (lng) * Math.PI / 180

        const v = new THREE.Vector3(
            RADIUS * Math.sin(phi) * Math.cos(theta),
            RADIUS * Math.cos(phi),
            RADIUS * Math.sin(phi) * Math.sin(theta))

        return v.divideScalar(3)
    },


    _clicked: function(event) {
        console.log("clicked")
        event.preventDefault()
        


        const raycaster = this.data.raycaster.components.raycaster
        const threeRaycaster = raycaster.raycaster

        var countryCode = -1;

        var intersectionList = threeRaycaster.intersectObject(this.el.object3DMap.mesh)
        //console.log(intersectionList)
        if (intersectionList.length > 0) {
            const data = intersectionList[0];

            //if (raycaster.intersectedEls.length > 0) {
            //const data = raycaster.intersectedEls[0]
            var d = data.point.clone().normalize();
            var u = Math.round(4096 * (1 - (0.5 + Math.atan2(d.z, d.x) / (2 * Math.PI))));
            var v = Math.round(2048 * (0.5 - Math.asin(d.y) / Math.PI));
            var p = this.mapContext.getImageData(u, v, 1, 1).data;
            countryCode = p[0];

            for (var prop in CountryColorMap) {
                if (CountryColorMap.hasOwnProperty(prop)) {
                    if (CountryColorMap[prop] === countryCode) {
                        console.log(prop)
                        const _countries = WorldCountries.filter((c) => {
                            return c.cca2 === prop
                        })
                        if (_countries.length == 1) {
                            const country = _countries[0]
                            console.log(country)
                            console.log(this.data.text)
                            this.data.text.setAttribute('text', country.name.common)
                            this.data.text.setAttribute('visible', true)
                            this.data.text.setAttribute('position', 
                                this._latLngOnSphere(country.latlng[0], country.latlng[1]))
                            
                        }


                    }
                        
                }
            } // end for loop

            this.lookupContext.clearRect(0, 0, 256, 1);

            for (var i = 0; i < 228; i++) {
                if (i == 0)
                    this.lookupContext.fillStyle = "rgba(0,0,0,1.0)"
                else if (i == countryCode)
                    this.lookupContext.fillStyle = "rgba(50,50,0,0.5)"
                else
                    this.lookupContext.fillStyle = "rgba(0,0,0,1.0)"

                this.lookupContext.fillRect(i, 0, 1, 1);
            }

            this.lookupTexture.needsUpdate = true
        }

    },

    tick: function(time, timeDelta) {


    },

    play: function() {},

    pause: function() {},

    remove: function() {}
})
