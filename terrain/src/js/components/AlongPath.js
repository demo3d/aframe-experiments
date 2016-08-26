AFRAME.registerComponent('alongpath', {
    schema: {
        path: {
            default: [],
            // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
            parse: function(value) {
                return value.split(',').map(AFRAME.utils.coordinates.parse)
            },
            stringify: function(data) {
                return data.map(AFRAME.utils.coordinates.stringify).join(',');
            }
        },
        animation: {
            default: 0
        }
    },



    init: function() {


    },

    update: function(oldData) {
        console.log("update")
        console.log(this.data.animation)
        var d = this.data;
        var points = d.path.map(vec3 => {
            return new THREE.Vector3(
                parseFloat(vec3.x),
                parseFloat(vec3.y),
                parseFloat(vec3.z)
            );
        });
        if (points.length > 1) {
            this.el._curve = new THREE.CatmullRomCurve3(points)
        }
    },

    tick: function(time, timeDelta) {

        if (this.el.isPlaying) {
            if (this.el._curve) {
                var p = this.el._curve.getPoint(this.data.animation)
                this.el.setAttribute('position', p);
            }
        }
    },

    play: function() {
        console.log("play")
    },

    pause: function() {},

    remove: function() {}
})