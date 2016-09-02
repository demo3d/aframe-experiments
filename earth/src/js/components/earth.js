const parallel = require('run-parallel')

const RADIUS = 1

const FS = `
        uniform float glowIntensity;
        uniform vec3 uColor;
        varying vec3 vNormal;

        void main() {
          float intensity = pow( 0.8 - dot( vNormal, vec3( 0, 0, 1.0 ) ), glowIntensity * 5. );
          vec3 color = uColor;
          gl_FragColor = vec4( color, 1.0 ) * intensity ;
        }
`

const VS = `
        varying vec3 vNormal;
        void main() {

          vNormal = normalize( normalMatrix * normal );
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
`

const LAT = 48.2082,
    LNG = 16.3738

AFRAME.registerComponent('earth', {
    schema: {
        srcAtmosphere: {
            type: 'src'
        },
        srcClouds: {
            type: 'src'
        },
        srcNormal: {
            type: 'src'
        },
        srcBump: {
            type: 'src'
        },
        camera: {
          type: 'selector', default: '[camera]'
        }
    },

    init: function() {
        this.loader = new THREE.TextureLoader()
        console.log(this.data.camera)
    },

    _doUpdate: function(atmosphereTexture, cloudsTexture, normalTexture, bumpTexture) {

        const textureLoader = this.loader


        const tilt = 0.41,
            cloudsScale = 1.005,
            atmoScale = 1.2


        const materialNormalMap = new THREE.MeshPhongMaterial({
            specular: 0x333333,
            shininess: 15,
            map: atmosphereTexture,
            //specularMap: textureLoader.load("/dist/assets/Drones/earth_specularmap4096.png"),
            normalMap: normalTexture,
            normalScale: new THREE.Vector2(0.85, 0.85),
            bumpMap: bumpTexture,
            bumpScale: new THREE.Vector2(0.05, 0.05)

        })

        // planet
        const geometry = new THREE.SphereGeometry(RADIUS, 100, 50);

        const meshPlanet = new THREE.Mesh(geometry, materialNormalMap);
        meshPlanet.rotation.y = 0;
        meshPlanet.rotation.z = tilt;
        this.el.setObject3D('mesh', meshPlanet)

        // clouds
        const materialClouds = new THREE.MeshStandardMaterial({
            alphaMap: cloudsTexture,
            transparent: true,
        })
        const meshClouds = new THREE.Mesh(geometry, materialClouds);
        meshClouds.scale.set(cloudsScale, cloudsScale, cloudsScale);
        meshClouds.rotation.z = tilt;
        //this.el.object3D.add(meshClouds)

        // atmosphere
        const atmoMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowIntensity: {
                    value: 1
                },
                uColor: {
                    value: new THREE.Color().setHSL(204, 67, 55)
                }
            },
            fragmentShader: FS,
            vertexShader: VS,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        })

        const atmoMesh = new THREE.Mesh(geometry, atmoMaterial)
        atmoMesh.scale.set(atmoScale, atmoScale, atmoScale)
        this.el.object3D.add(atmoMesh)

    },

    update: function(oldData) {

        parallel([
            (next) => {
                this.loader.load(this.data.srcAtmosphere, tex => next(null, tex), undefined, err => next(err))
            }, (next) => {
                this.loader.load(this.data.srcClouds, tex => next(null, tex), undefined, err => next(err))
            }, (next) => {
                this.loader.load(this.data.srcNormal, tex => next(null, tex), undefined, err => next(err))
            }, (next) => {
                this.loader.load(this.data.srcBump, tex => next(null, tex), undefined, err => next(err))
            }
        ], (err, [atmosphereTexture, cloudsTexture, normalTexture, bumpTexture]) => {
            if (err) console.log(err) //return fatal(err)

            this._doUpdate(atmosphereTexture, cloudsTexture, normalTexture, bumpTexture)
        })

    },

    _latLngOnSphere: function(lat, lng) {
        const phi = (90 - lat) * Math.PI / 180,
            theta = (lng + 180) * Math.PI / 180

        const v = new THREE.Vector3(
            RADIUS * Math.sin(phi) * Math.cos(theta),
            RADIUS * Math.cos(phi),
            RADIUS * Math.sin(phi) * Math.sin(theta))

        return v
    },


    tick: function(time, timeDelta) {

    },

    play: function() {},

    pause: function() {},

    remove: function() {}
})
