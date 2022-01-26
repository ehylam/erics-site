import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';


export default class Scroll {
  constructor() {
    this.scrollable = document.querySelector('.scrollable');
    this.container = document.querySelector('main');
    this.images = [...document.querySelectorAll('img')];
    this.current = 0;
    this.target = 0;
    this.ease = 0.075;
    this.meshItems = []; // used to store all meshes we will be creating

    this.init();
    this.setupCamera();
    this.createMeshItems();
    this.render();
  }


  get viewport() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspectRatio = width / height;

    return {
      width,
      height,
      aspectRatio
    }
  }



  setupCamera() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);

    this.scene = new THREE.Scene();

    let perspective = 1000;
    const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000);
    this.camera.position.set(0,0, perspective);

    this.renderer = new THREE.WebGL1Renderer({antialias: true, alpha: true});
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.container.appendChild(this.renderer.domElement);
  }


  onWindowResize() {
    this.init();
    this.camera.aspect = this.viewport.aspectRatio;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.viewport.width, this.viewport.height);
  }


  createMeshItems() {
    this.images.forEach(image => {
      let meshItem = new MeshItem(image, this.scene);
      this.meshItems.push(meshItem);
    })
  }


  render() {
    this.smoothScroll();
    // Update mesh item's values
    for(let i = 0; i < this.meshItems.length; i++) {
      this.meshItems[i].render();
    }


    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }


  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  }

  init() {
    document.body.style.height = `${this.scrollable.getBoundingClientRect().height}px`;
  }

  smoothScroll() {
    this.target = window.scrollY;
    this.current = this.lerp(this.current, this.target, this.ease);
    this.scrollable.style.transform = `translate3d(0, ${-this.current}px,0)`;
  }

}


class MeshItem {
  constructor(element, scene) {
    this.element = element;
    this.scene = scene;
    this.offset = new THREE.Vector2(0,0);
    this.sizes = new THREE.Vector2(0,0);
    this.createMesh();
  }

  getDimensions() {
    const { width, height, top, left } = this.element.getBoundingClientRect();
    this.sizes.set(width, height);
    this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
  }

  createMesh() {
    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 30, 30);
    this.imageTexture = new THREE.TextureLoader().load(this.element.src)

    this.uniforms = {
      uTexture: {value: this.imageTexture},
      uOffset: {value: new THREE.Vector2(0.0, 0.0)},
      uAlpha: {value: 1.0}
    }
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.getDimensions();
    this.mesh.position.set(this.offset.x,this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x,this.sizes.y, 1);

    this.scene.add(this.mesh);
  }


  render() {
    this.getDimensions();
    this.mesh.position.set(this.offset.x,this.offset.y, 0);
    this.mesh.scale.set(this.sizes.x,this.sizes.y, 1);
    this.uniforms.uOffset.value.set(this.offset.x * 0.0, -(this.target - this.current) * 0.0002);
  }
}
