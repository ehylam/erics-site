import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export default class Scene {
  canvas
  renderer
  scene
  camera
  controls
  width
  height

  constructor(el) {
    this.clock = new THREE.Clock();
    this.previousTime = 0;


    this.canvas = el;
    this.cameraPos = 600;
    this.mouse = new THREE.Vector2();
    this.cursor = new THREE.Vector2();
    this.time = 0;
    this.parameters = {
      count: 100000,
      size: 0.01,
      radius: 5,
      branches: 3
    };
    this.width = this.canvas.parentNode.offsetWidth;
    this.height = this.canvas.parentNode.offsetHeight;
    this.particleMaterial = null;
    this.particleGeometry = null;
    this.raycaster = new THREE.Raycaster();
    this.scrollY = window.scrollY;

    this.bounds = this.canvas.getBoundingClientRect();

    this.setScene();
    this.setRender();
    this.setCamera();

    // this.setParticles();
    this.setSphere();
    // this.setModel();
    this.setPosition();
    this.handleMouse();
    this.handlePostProcessing();

    this.handleResize();
    this.events();

    this.renderer.render(this.scene, this.camera);

  }

  /**
   * This is our scene, we'll add any object
   * https://threejs.org/docs/?q=scene#api/en/scenes/Scene
   */
  setScene() {
    this.scene = new THREE.Scene()
    // this.scene.background = new THREE.Color(0xffffff)
  }

  /**
   * Our Webgl renderer, an object that will draw everything in our canvas
   * https://threejs.org/docs/?q=rend#api/en/renderers/WebGLRenderer
   */
  setRender() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    })

    this.renderer.setSize( this.width, this.height );
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)); //perforamnce optimisations
  }

  /**
   * Our Perspective camera, this is the point of view that we'll have
   * of our scene.
   * A perscpective camera is mimicing the human eyes so something far we'll
   * look smaller than something close
   * https://threejs.org/docs/?q=pers#api/en/cameras/PerspectiveCamera
   */
  setCamera() {
    const aspectRatio = this.width / this.height;
    const fieldOfView = 70;
    const nearPlane = 0.1;
    const farPlane = 2000;

    this.camera = new THREE.PerspectiveCamera( fieldOfView, aspectRatio, nearPlane, farPlane );
    this.camera.position.set(0, 0, this.cameraPos);
    this.camera.fov = 2 * Math.atan((this.height / 2) / this.cameraPos ) * (180 / Math.PI);
    this.scene.add(this.camera)
  }

  setParticles() {
    if(this.particlePoints != null) {
      this.particleGeometry.dispose();
      this.particleMaterial.dispose();
      this.scene.remove(this.particlePoints);
    }


    this.particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.parameters.count * 3);

    for(let i = 0; i < this.parameters.count; i++) {
      const i3 = i * 3;

      positions[i3 + 0] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

    }

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('/images/sun.png');

    this.particleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    )

    this.particleMaterial = new THREE.PointsMaterial({
      size: this.parameters.size,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      map: particleTexture
    });


    this.points = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.points.scale.set(this.width, this.height);

    this.scene.add(this.points);
  }


  setSphere() {
    const bounds = document.querySelector('.hero__image img').getBoundingClientRect();
    const textureLoader = new THREE.TextureLoader().load('/images/pic4.jpg');
    const geometry = new THREE.PlaneBufferGeometry(1, 1, bounds.width / 2, bounds.height / 2);
    // const count = geometry.attributes.position.count;
    // const randoms = new Float32Array(count);

    // for(let i = 0; i < count; i++) {
    //   randoms[i] = Math.random();
    // }

    // geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: {value: 0},
        t: {type: 't', value: textureLoader},
        uImage: {value: 0},
        hover: {value: new THREE.Vector2(0.5,0.5)},
        hoverPos: {value: new THREE.Vector2(0,0)},
        hoverState: {value: 0}
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      // transparent: true
    });


    this.mesh = new THREE.Points(geometry, this.shaderMaterial);
    this.mesh.scale.set(bounds.width, bounds.height);
    this.scene.add(this.mesh);
  }

  setModel() {
    const loader = new GLTFLoader();
    const scene = this.scene;
    loader.load( '/renders/rocket.glb', function ( gltf ) {
      gltf.scene.scale.set(200, 200);
      gltf.scene.position.set(0, 0, 0);
      scene.add( gltf.scene );



    }, undefined, function ( error ) {

      console.error( error );

    } );
  }

  handlePostProcessing() {
    const composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( this.width, this.height), 1.5, 0.4, 0.85);
    bloomPass.threshold = 10;
    bloomPass.strength = 10;
    bloomPass.radius = 0.8;

    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    this.composer = composer;
  }

  updateSphere() {
    // const bounds = this.canvas.getBoundingClientRect();
    const bounds = document.querySelector('.hero__image img').getBoundingClientRect();
    this.mesh.scale.set(bounds.width, bounds.height);
  }

  setPosition() {
    // const bounds = this.canvas.getBoundingClientRect();
    const bounds = document.querySelector('.hero__image img').getBoundingClientRect();
    this.mesh.position.set(bounds.left - window.innerWidth / 2 + bounds.width / 2, - bounds.top  + window.innerHeight / 2 - bounds.height / 2, 0);
    // this.points.rotation.set(0, 0, this.points.rotation.z += 0.0005);
    // if (this.points.position.y < this.height) {
    //   this.points.position.set(0, this.points.position.y -= 0.16, 0);
    // }

  }


  handleMouse() {
    window.addEventListener( 'mousemove', (event) => {
      // update this.shaderMaterial.uniforms.hoverPos
      this.shaderMaterial.uniforms.hoverPos.value.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.shaderMaterial.uniforms.hoverPos.value.y = - (event.clientY / window.innerHeight) * 2 + 1;

      // this.mouse.x = ( event.clientX / this.width ) * 2 - 1;
      // this.mouse.y = - ( event.clientY / this.height ) * 2 + 1;
      // this.cursor.x = event.clientX;
      // this.cursor.y = event.clientY;
      // this.raycaster.setFromCamera( this.mouse, this.camera );
      // const intersects = this.raycaster.intersectObjects( this.scene.children );
      // if(intersects.length > 0) {
      //     const obj = intersects[0].object;
      //     if(obj.type === 'Mesh') {
      //       obj.material.uniforms.hover.value = intersects[0].uv;
      //     } else {

      //     }
      // }

    }, false );
  }


  /**
   * List of events
   */
  events() {
    window.addEventListener('resize', this.handleResize, { passive: true })
    this.draw(0)
  }

  // EVENTS

  /**
   * Request animation frame function
   * This function is called 60/time per seconds with no performance issue
   * Everything that happens in the scene is drawed here
   * @param {Number} now
   */
  draw = (now) => {
    this.elapsedTime = this.clock.getElapsedTime();
    this.deltaTime = this.elapsedTime - this.previousTime;
    this.previousTime = this.elapsedTime;

    this.time = now;
    this.shaderMaterial.uniforms.time.value += 0.1;
    // this.renderer.render(this.scene, this.camera);
    this.setPosition();
    this.scrollY = window.scrollY;
    this.raf = window.requestAnimationFrame(this.draw);
    this.camera.position.y = -this.scrollY / window.innerHeight * 50;

    this.composer.render();

    // const parallaxX = this.cursor.x * 0.5;
    // const parallaxY = - this.cursor.y * 0.5;

    // this.camera.position.x += (parallaxX - this.camera.position.x) * 5 * this.deltaTime;
    // this.camera.position.y += (parallaxY - this.camera.position.y) * 5 * this.deltaTime;
  }

  // EVENTS

  /**
   * On resize, we need to adapt our camera based
   * on the new window width and height and the renderer
   */
  handleResize = () => {
    this.width = this.canvas.parentNode.offsetWidth;
    this.height = this.canvas.parentNode.offsetHeight;

    // Update camera
    this.camera.aspect = this.width / this.height;
    this.camera.fov = 2 * Math.atan((window.innerHeight / 2) / this.cameraPos) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);

    this.updateSphere();


  }
}
