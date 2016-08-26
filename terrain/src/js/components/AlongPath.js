AFRAME.registerComponent('alongpath', {
  schema: {
    path     : { default: ''    },
    closed   : { default: false },
    dur      : { default: 1000  }
  },

  init: function() {

      var d = this.data;
      var points = d.path.split(' ').map(function(p) {
          p = p.split(',');
          return new THREE.Vector3(
              parseFloat(p[0]),
              parseFloat(p[1]),
              parseFloat(p[2])
          );
      });
      var ctor = d.closed ? 'ClosedSplineCurve3' : 'SplineCurve3';
      var curve = new THREE[ctor](points);

      const onFrame = (t) => {
        window.requestAnimationFrame(onFrame);
        t = t % d.dur;
        var i = t / d.dur;
        try {
          var p = curve.getPoint(i);
          
          this.el.setAttribute('position', p);
        } catch (ex) {
          console.log(ex)
        }
      };

      onFrame();
  },

  update: function(oldData) {},

  remove: function() {}
})
