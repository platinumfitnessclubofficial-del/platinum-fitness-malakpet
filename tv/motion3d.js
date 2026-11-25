(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    if (typeof THREE === "undefined") return;
    var cv = document.getElementById("fx3d");
    if (!cv) return;

    var renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 7;

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    }
    resize();
    window.addEventListener("resize", resize);

    // gold particle field
    var count = 900;
    var positions = new Float32Array(count * 3);
    for (var i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    var mat = new THREE.PointsMaterial({
      color: 0xd4af37, size: 0.06, transparent: true, opacity: 0.45,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    var points = new THREE.Points(geo, mat);
    scene.add(points);

    // orange highlight layer
    var count2 = 220;
    var pos2 = new Float32Array(count2 * 3);
    for (var j = 0; j < count2; j++) {
      pos2[j * 3] = (Math.random() - 0.5) * 14;
      pos2[j * 3 + 1] = (Math.random() - 0.5) * 8;
      pos2[j * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    var geo2 = new THREE.BufferGeometry();
    geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
    var mat2 = new THREE.PointsMaterial({
      color: 0xff5c1a, size: 0.08, transparent: true, opacity: 0.35,
      sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
    });
    var points2 = new THREE.Points(geo2, mat2);
    scene.add(points2);

    // rotating dumbbell
    var dumbbell = new THREE.Group();
    var barMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });
    var weightMat = new THREE.MeshStandardMaterial({ color: 0x2a2a32, metalness: 0.5, roughness: 0.4 });
    var bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4, 16), barMat);
    bar.rotation.z = Math.PI / 2;
    dumbbell.add(bar);
    [-1.6, 1.6].forEach(function (x) {
      var w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 24), weightMat);
      w.rotation.z = Math.PI / 2;
      w.position.x = x;
      dumbbell.add(w);
    });
    dumbbell.position.set(0, 0, 0);
    dumbbell.scale.set(0.55, 0.55, 0.55);
    scene.add(dumbbell);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    var dir = new THREE.DirectionalLight(0xd4af37, 1.0);
    dir.position.set(4, 5, 6);
    scene.add(dir);
    var dir2 = new THREE.DirectionalLight(0xff5c1a, 0.5);
    dir2.position.set(-4, -3, 2);
    scene.add(dir2);

    var t = 0;
    function animate() {
      t += 0.0006;
      points.rotation.y = t * 0.4;
      points2.rotation.y = -t * 0.25;
      dumbbell.rotation.y += 0.008;
      dumbbell.rotation.x = Math.sin(t * 0.4) * 0.12;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
})();
