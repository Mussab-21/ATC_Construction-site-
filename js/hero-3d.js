/* hero-3d.js — Loads the Tripo3D-generated building model into the hero
   card and keeps it slowly auto-rotating. Exposes window.ATCHero3D so
   hero-animation.js can show/hide it as part of the blueprint -> 3D cycle.

   HOW TO PLUG IN YOUR TRIPO3D MODEL:
   1. In Tripo3D Studio, export your generated building as GLB
      (Export -> GLB — not OBJ/FBX, GLB keeps materials in one file).
   2. Save it as: assests/models/atc-building.glb
   3. Reload the page. That's it — no code changes needed.

   Until that file exists, a simple procedural placeholder building is
   drawn instead, so the site never shows a broken/empty panel while
   you're still working in Tripo3D.
*/
(function () {
  'use strict';

  var MODEL_URL = 'assests/models/atc-building.glb';

  var ATCHero3D = {
    _ready: false,
    _readyPromise: null,
    _renderer: null,
    _scene: null,
    _camera: null,
    _model: null,
    _rafId: null,
    _rotating: false,
    _usedPlaceholder: false,

    init: function (canvas) {
      if (this._readyPromise) return this._readyPromise;
      var self = this;

      this._readyPromise = new Promise(function (resolve) {
        if (typeof THREE === 'undefined') {
          console.warn('[ATCHero3D] three.js did not load — 3D view disabled.');
          resolve(false);
          return;
        }

        var renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          alpha: true,
          antialias: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        // r0.128 uses outputEncoding; later three.js versions renamed this
        // to outputColorSpace. Set whichever this build actually has.
        if ('outputColorSpace' in renderer && THREE.SRGBColorSpace) {
          renderer.outputColorSpace = THREE.SRGBColorSpace;
        } else if ('outputEncoding' in renderer && THREE.sRGBEncoding) {
          renderer.outputEncoding = THREE.sRGBEncoding;
        }

        var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(4.2, 3.2, 5.4);
        camera.lookAt(0, 0.6, 0);

        // Lighting — warm key light + cool fill, matches the brand's
        // orange/dark palette instead of a flat default studio look.
        var hemi = new THREE.HemisphereLight(0xffffff, 0x1a1a1f, 0.9);
        scene.add(hemi);

        var key = new THREE.DirectionalLight(0xffffff, 1.6);
        key.position.set(5, 8, 4);
        scene.add(key);

        var rim = new THREE.DirectionalLight(0xe85d2a, 1.1);
        rim.position.set(-6, 3, -4);
        scene.add(rim);

        self._renderer = renderer;
        self._scene = scene;
        self._camera = camera;
        self._canvas = canvas;

        self._resize();
        window.addEventListener('resize', function () { self._resize(); });

        var loaderTargetGroup = new THREE.Group();
        scene.add(loaderTargetGroup);
        self._modelGroup = loaderTargetGroup;

        function finish(usedPlaceholder) {
          self._usedPlaceholder = usedPlaceholder;
          self._ready = true;
          self._renderFrame();
          resolve(true);
        }

        if (typeof THREE.GLTFLoader === 'function') {
          var gltfLoader = new THREE.GLTFLoader();
          gltfLoader.load(
            MODEL_URL,
            function (gltf) {
              var model = gltf.scene;
              self._fitModel(model);
              loaderTargetGroup.add(model);
              self._model = model;
              finish(false);
            },
            undefined,
            function () {
              console.info('[ATCHero3D] No GLB found at ' + MODEL_URL + ' yet — showing placeholder building. Export from Tripo3D and drop it in that path to replace this automatically.');
              var placeholder = self._buildPlaceholder();
              loaderTargetGroup.add(placeholder);
              self._model = placeholder;
              finish(true);
            }
          );
        } else {
          console.warn('[ATCHero3D] GLTFLoader not available — showing placeholder building.');
          var placeholder2 = self._buildPlaceholder();
          loaderTargetGroup.add(placeholder2);
          self._model = placeholder2;
          finish(true);
        }
      });

      return this._readyPromise;
    },

    // A simple massed-volume "building" — main block, roof, side wing,
    // entrance canopy — built from primitives so there is always a
    // reasonable 3D object on screen even before a real GLB exists.
    _buildPlaceholder: function () {
      var group = new THREE.Group();
      var orange = 0xe85d2a;
      var wallMat = new THREE.MeshStandardMaterial({ color: 0xd9d9dc, roughness: 0.75, metalness: 0.08 });
      var glassMat = new THREE.MeshStandardMaterial({ color: 0x2a3742, roughness: 0.25, metalness: 0.6, emissive: 0x0d1216 });
      var accentMat = new THREE.MeshStandardMaterial({ color: orange, roughness: 0.4, metalness: 0.2 });

      var main = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.5, 1.6), wallMat);
      main.position.set(0, 0.75, 0);
      group.add(main);

      var roof = new THREE.Mesh(new THREE.ConeGeometry(2.35, 0.75, 4), wallMat);
      roof.rotation.y = Math.PI / 4;
      roof.position.set(0, 1.5 + 0.37, 0);
      group.add(roof);

      var wingGeo = new THREE.BoxGeometry(0.55, 1.05, 1.6);
      var leftWing = new THREE.Mesh(wingGeo, wallMat);
      leftWing.position.set(-1.97, 0.52, 0);
      group.add(leftWing);
      var rightWing = new THREE.Mesh(wingGeo, wallMat);
      rightWing.position.set(1.97, 0.52, 0);
      group.add(rightWing);

      var rowY = [0.95, 0.55];
      var cols = [-1.15, -0.6, -0.05, 0.5, 1.05];
      rowY.forEach(function (y) {
        cols.forEach(function (x) {
          var win = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.24, 0.06), glassMat);
          win.position.set(x, y, 0.81);
          group.add(win);
        });
      });

      var entrance = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.08), accentMat);
      entrance.position.set(-0.05, 0.31, 0.82);
      group.add(entrance);

      var canopy = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.05, 0.35), accentMat);
      canopy.position.set(-0.05, 0.66, 1.0);
      group.add(canopy);

      var ground = new THREE.Mesh(
        new THREE.CircleGeometry(3.6, 48),
        new THREE.MeshStandardMaterial({ color: 0x121216, roughness: 1 })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.02;
      group.add(ground);

      return group;
    },

    _fitModel: function (model) {
      var box = new THREE.Box3().setFromObject(model);
      var size = new THREE.Vector3();
      box.getSize(size);
      var center = new THREE.Vector3();
      box.getCenter(center);

      var maxDim = Math.max(size.x, size.y, size.z) || 1;
      var scale = 3.2 / maxDim;
      model.scale.setScalar(scale);

      box.setFromObject(model);
      box.getCenter(center);
      model.position.sub(center);
      model.position.y += (size.y * scale) / 2;
    },

    _resize: function () {
      if (!this._renderer || !this._canvas) return;
      var w = this._canvas.clientWidth || this._canvas.parentElement.clientWidth || 400;
      var h = this._canvas.clientHeight || w * 0.66;
      this._renderer.setSize(w, h, false);
      this._camera.aspect = w / h;
      this._camera.updateProjectionMatrix();
    },

    _renderFrame: function () {
      if (this._renderer) this._renderer.render(this._scene, this._camera);
    },

    _tick: function () {
      if (!this._rotating) return;
      if (this._modelGroup) this._modelGroup.rotation.y += 0.0065;
      this._renderFrame();
      this._rafId = requestAnimationFrame(this._tick.bind(this));
    },

    setRotating: function (on) {
      this._rotating = on;
      if (on && !this._rafId) {
        this._tick();
      } else if (!on && this._rafId) {
        cancelAnimationFrame(this._rafId);
        this._rafId = null;
      }
    },

    usedPlaceholder: function () {
      return this._usedPlaceholder;
    },
  };

  window.ATCHero3D = ATCHero3D;
})();
