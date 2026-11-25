import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/* ==========================================================================
   PLATINUM Fitness Club — 3D motion layer (Three.js + GSAP ScrollTrigger)
   ========================================================================== */
(function () {
  "use strict";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  ready(function () {
    var hasThree = typeof THREE !== "undefined";
    var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

    /* ---------- 3D particle field + rotating dumbbell in the hero -------- */
    if (hasThree) {
      var hero = document.querySelector(".hero");
      if (hero) {
        var canvas = document.createElement("canvas");
        canvas.className = "hero-3d";
        canvas.setAttribute("aria-hidden", "true");
        hero.insertBefore(canvas, hero.firstChild);

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 6;

        // particle layer 1 (gold)
        var count = window.innerWidth < 768 ? 600 : 1400;
        var positions = new Float32Array(count * 3);
        var sizes = new Float32Array(count);
        for (var i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 14;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
          sizes[i] = Math.random() * 1.6 + 0.4;
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        var mat = new THREE.PointsMaterial({
          color: 0xd4af37, size: 0.05, transparent: true, opacity: 0.55,
          sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        var points = new THREE.Points(geo, mat);
        scene.add(points);

        // particle layer 2 (orange highlight)
        var count2 = Math.round(count * 0.25);
        var pos2 = new Float32Array(count2 * 3);
        for (var j = 0; j < count2; j++) {
          pos2[j * 3] = (Math.random() - 0.5) * 12;
          pos2[j * 3 + 1] = (Math.random() - 0.5) * 7;
          pos2[j * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        var geo2 = new THREE.BufferGeometry();
        geo2.setAttribute("position", new THREE.BufferAttribute(pos2, 3));
        var mat2 = new THREE.PointsMaterial({
          color: 0xff5c1a, size: 0.07, transparent: true, opacity: 0.4,
          sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        var points2 = new THREE.Points(geo2, mat2);
        scene.add(points2);

        // 3D dumbbell (rotating equipment)
        var dumbbell = new THREE.Group();
        var barMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });
        var weightMat = new THREE.MeshStandardMaterial({ color: 0x2a2a32, metalness: 0.5, roughness: 0.4 });
        var bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 3.2, 16), barMat);
        bar.rotation.z = Math.PI / 2;
        dumbbell.add(bar);
        [-1.35, 1.35].forEach(function (x) {
          var w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.18, 24), weightMat);
          w.rotation.z = Math.PI / 2;
          w.position.x = x;
          dumbbell.add(w);
          var ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 8, 24), barMat);
          ring.rotation.y = Math.PI / 2;
          ring.position.x = x;
          dumbbell.add(ring);
        });
        dumbbell.position.set(2.6, -0.6, 0);
        dumbbell.scale.set(0.7, 0.7, 0.7);
        scene.add(dumbbell);

        // lighting
        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        var dir = new THREE.DirectionalLight(0xd4af37, 1.2);
        dir.position.set(3, 4, 5);
        scene.add(dir);
        var dir2 = new THREE.DirectionalLight(0xff5c1a, 0.6);
        dir2.position.set(-3, -2, 2);
        scene.add(dir2);

        function resize3d() {
          var w = hero.clientWidth || window.innerWidth;
          var h = hero.clientHeight || window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h, false);
        }
        resize3d();
        window.addEventListener("resize", resize3d);

        var t = 0;
        function animate() {
          t += 0.0008;
          points.rotation.y = t * 0.6;
          points.rotation.x = Math.sin(t * 0.4) * 0.15;
          points2.rotation.y = -t * 0.4;
          points2.rotation.x = Math.cos(t * 0.3) * 0.1;
          dumbbell.rotation.y += 0.012;
          dumbbell.rotation.x = Math.sin(t * 0.5) * 0.15;
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
        }
        animate();

        // mouse parallax
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          hero.addEventListener("pointermove", function (e) {
            var r = hero.getBoundingClientRect();
            var x = (e.clientX - r.left) / r.width - 0.5;
            var y = (e.clientY - r.top) / r.height - 0.5;
            points.rotation.y = t * 0.6 + x * 0.4;
            points.rotation.x = Math.sin(t * 0.4) * 0.15 + y * 0.3;
            dumbbell.rotation.y += x * 0.02;
          });
        }
      }
    }

    /* ---------- GSAP ScrollTrigger 3D reveals ----------------------------- */
    if (hasGsap) {
      gsap.utils.toArray("section h2, section .hero-copy h1").forEach(function (el) {
        gsap.fromTo(el,
          { opacity: 0, rotationX: 12, y: 40, transformPerspective: 900 },
          {
            opacity: 1, rotationX: 0, y: 0, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" }
          }
        );
      });
      gsap.utils.toArray(".rate, .offer-card, .why-card, .info-card").forEach(function (el, i) {
        gsap.fromTo(el,
          { opacity: 0, rotationX: 8, y: 30, transformPerspective: 900 },
          {
            opacity: 1, rotationX: 0, y: 0, duration: 0.9, ease: "power2.out",
            delay: (i % 4) * 0.08,
            scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
          }
        );
      });
      var heroBg = document.querySelector(".hero__bg img");
      if (heroBg) {
        gsap.to(heroBg, {
          yPercent: 18, ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
      }
      gsap.utils.toArray(".shot").forEach(function (el, i) {
        gsap.to(el, {
          y: (i % 2 === 0 ? -24 : 24), ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
      });
    }
  });
})();
