import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Scene {
  canvas
  renderer
  scene
  camera
  controls
  width
  height

  constructor(el) {
    this.canvas = el;
    this.cameraPos = 600;
    this.mouse = new THREE.Vector2();
    this.time = 0;

    this.setScene();
    this.setRender();
    this.setCamera();

    this.setParticles();
    this.setSphere();
    this.setModel();
    this.setPosition();
    this.handleMouse();

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
    this.scene.background = new THREE.Color(0xffffff)
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
    const vertices = []

    for (let i = 0; i < 10000; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000)
      const y = THREE.MathUtils.randFloatSpread(2000)
      const z = THREE.MathUtils.randFloatSpread(2000)

      vertices.push(x, y, z)
    }

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('/images/sun.png');



    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )

    const material = new THREE.PointsMaterial({
      color: 'white',
      size: 5,
      transparent: true,
      sizeAttenuation: true,
      map: particleTexture,
    });

    this.points = new THREE.Points(this.particleGeometry, material)

    this.scene.add(this.points)
  }


  setSphere() {
    const bounds = this.canvas.getBoundingClientRect();
    const geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10);
    const material = new THREE.MeshBasicMaterial({
      color: 'black',
      // wireframe: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
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

  updateSphere() {
    const bounds = this.canvas.getBoundingClientRect();
    this.mesh.scale.set(bounds.width, bounds.height);
  }

  setPosition() {
    const bounds = this.canvas.getBoundingClientRect();
    this.mesh.position.set(bounds.left - window.innerWidth / 2 + bounds.width / 2, - bounds.top  + window.innerHeight / 2 - bounds.height / 2, 0);
    if (this.camera.position.z > this.points.position.z) {
      this.points.position.set(Math.sin(this.time * 0.001), Math.tan(this.time * 0.0001), this.points.position.z +=0.16);
    } else {
      gsap.to(this.points.position, {
        duration: 1,
        z: -this.camera.position.z,
      });
      // this.points.position.set(Math.sin(this.time * 0.001), Math.tan(this.time * 0.0001), this.points.position.z = 0);
    }

  }


  handleMouse() {
    window.addEventListener( 'mousemove', (event) => {
      this.mouse.x = ( event.clientX / this.width ) * 2 - 1;
      this.mouse.y = - ( event.clientY / this.height ) * 2 + 1;

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
    this.time = now;
    this.renderer.render(this.scene, this.camera)
    this.setPosition();
    this.raf = window.requestAnimationFrame(this.draw)
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

    this.updateSphere();


  }
}
