import CountryColorMap from './CountryColorMap'

const parallel = require('run-parallel')

const VS = `
varying vec3 vNormal;
varying vec2 vUv;
void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0);
    vNormal = normalize( normalMatrix * normal );
    vUv = uv;
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

    
    //gl_FragColor = 0.5 * outlineColor + 1.0 * lookupColor + 0.5 * blendColor;
    gl_FragColor = vec4(1.,0.,0.,1.);
}
`
const RADIUS = 100

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




        /*
            this.el.addEventListener('click', function () {
      var randomIndex = Math.floor(Math.random() * COLORS.length);
      this.setAttribute('material', 'color', COLORS[randomIndex]);
      console.log('I was clicked!');
    });
    */
    },

    _doUpdate: function(mapTexture, outlineTexture, indexTexture) {

        const planeMaterial = new THREE.ShaderMaterial({
            uniforms: {
                width: {
                    type: "f",
                    value: window.innerWidth
                },
                height: {
                    type: "f",
                    value: window.innerHeight
                },
                mapIndex: {
                    type: "t",
                    value: indexTexture
                },
                outline: {
                    type: "t",
                    value: outlineTexture
                },
                lookup: {
                    type: "t",
                    value: this.lookupTexture
                },
                blendImage: {
                    type: "t",
                    value: mapTexture
                }
            },
            vertexShader: VS,
            fragmentShader: FS
        });

        const geometry = new THREE.SphereGeometry(RADIUS, 64, 32);

        const mesh = new THREE.Mesh(geometry, planeMaterial);
        mesh.position.set(0, 0, 0);

        this.el.setObject3D('mesh', mesh)
        console.log(mesh)

        const mapCanvas = document.createElement('canvas');
        mapCanvas.width = 4096;
        mapCanvas.height = 2048;
        this.mapContext = mapCanvas.getContext('2d');
        const imageObj = new Image();
        imageObj.onload = () => {
            this.mapContext.drawImage(imageObj, 0, 0);
            console.log("onload")
        };
        imageObj.src = this.data.srcIndex //'images/earth-index-shifted-gray.png';

        //this.lookupTexture.needsUpdate = true;

    },

    update: function(oldData) {

        parallel([
            (next) => {
                this.loader.load(this.data.srcMap, tex => next(null, tex), undefined, err => next(err))
            }, 
            (next) => {
                //next = once(next)
                this.loader.load(this.data.srcOutline, tex => next(null, tex), undefined, err => next(err))
            },
            (next) => {
                //next = once(next)
                this.loader.load(this.data.srcIndex, tex => next(null, tex), undefined, err => next(err))
            }
        ], (err, [mapTexture, outlineTexture, indexTexture]) => {
            if (err) console.log(err) //return fatal(err)

            mapTexture.magFilter = THREE.NearestFilter;
            mapTexture.minFilter = THREE.NearestFilter;
            mapTexture.needsUpdate = true;

            outlineTexture.needsUpdate = true;

            this._doUpdate(mapTexture, outlineTexture, indexTexture)
        })

        
    },

    tick: function(time, timeDelta) {


    },

    play: function() {},

    pause: function() {},

    remove: function() {}
})