import gsap from 'gsap';
import * as THREE from 'three';

// TODO:
// Responsive fullscreen - DONE
// Add an optional gallery feature?

const noise = `

float N21(vec2 p) {
  return fract(sin(p.x * 110. + p.y * 5834.) * 43758.);
}

float SmoothNoise(vec2 uv) {
  vec2 lv = fract(uv);
  vec2 id = floor(uv);

  lv = lv * lv * (3. - 2. * lv);

  float bl = N21(id);
  float br = N21(id + vec2(1. ,0.));
  float b = mix(bl, br, lv.x);

  float tl = N21(id + vec2(0. ,1.));
  float tr = N21(id + vec2(1. ,1.));
  float t = mix(tl, tr, lv.x);

  return mix(b, t, lv.y);
}

float SmoothNoise2(vec2 uv) {
  float c = SmoothNoise(uv * 4.);
  c += SmoothNoise(uv * 8.) * .5;
  // c += SmoothNoise(uv * 16.) * .25;
  // c += SmoothNoise(uv * 32.) * .125;

  return c /= 1.5;
}

`

const vertexShader = `
	uniform float uProgress;
	uniform vec2 uMeshScale;
	uniform vec2 uMeshPosition;
	uniform vec2 uViewSize;
  uniform vec2 uCursor;
	uniform float uTime;
  uniform float uHover;

  varying vec2 vUv;

  ${noise}

	void main(){
		vec3 pos = position;

    float c = SmoothNoise2(uv / 2.);

    // (0 - 1 + 1) / 2 = 0; - Top left
    // (1 - 1 + 1) / 2 = 0.5; - Top right
    // (0 - 0 + 1) / 2 = 0.5; - Bottom left
    // (1 - 0 + 1) / 2 = 1; - Bottom - right
		float activation = (+uv.x + (c * 0.4) - uv.y + (c * 0.4) + 1.)/2.;

		float latestStart = 0.4; // Stagger timing
		float startAt = activation * latestStart;
    // Performs the smooth Hermite interpolation between the values startAt and 1 using time a
		float vertexProgress = smoothstep(startAt,1.,uProgress);

		// // Scale to page view size/page size
		vec2 scaleToViewSize = uViewSize / uMeshScale - 1.;
		vec2 scale = vec2(
		  1. + scaleToViewSize * vertexProgress
		);

		pos.xy *= scale;

    float dist = distance(uv, uCursor);
    pos.z += uHover * (5. * sin(dist * 10. + uTime));

    if (uProgress > 0.) pos.z = 0.;

		// Move towards center
		pos.y += -uMeshPosition.y * vertexProgress;
		pos.x += -uMeshPosition.x * vertexProgress;

    vUv = uv;

		gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
	}
`;

const fragmentShader = `
  uniform sampler2D uImage;
  uniform vec2 uAspectRatio;
  uniform float uTime;
  varying vec2 vUv;

  ${noise}

	void main(){
    vec2 uv = vUv;
    float c = SmoothNoise2(uv);

    vec4 tex = texture2D(uImage, uv);
    gl_FragColor = tex;

    // gl_FragColor.rgb += 0.1*vec3(c);
	}
`;


export default class ImageTransition {
  constructor(canvas) {
    // DOM Elements
    this.canvas = document.querySelector(canvas);
    this.images = [...document.querySelectorAll('img.interactable')];
    this.imageArr = [];

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.cameraPos = 600;
    this.fieldOfView = 70;
    this.nearPlane = 0.1;
    this.farPlane = 2000;

    // Reference - https://i7x7p5b7.stackpathcdn.com/codrops/wp-content/uploads/2019/10/g.png
    this.camera = new THREE.PerspectiveCamera( this.fieldOfView, window.innerWidth / window.innerHeight, this.nearPlane, this.farPlane );
    this.camera.position.set(0, 0, this.cameraPos);
    this.camera.fov = 2 * Math.atan((window.innerHeight / 2) / this.cameraPos ) * (180 / Math.PI);
    this.scene.add(this.camera);

    // Variables
    this.clock = new THREE.Clock();
    this.elapsedTime = 0;
    this.viewSizeValues = this.getViewSize();
    this.materials = [];
    this.uniforms = {
      uProgress: new THREE.Uniform(0),
      uMeshScale: new THREE.Uniform(new THREE.Vector2(1, 1)),
      uMeshPosition: new THREE.Uniform(new THREE.Vector2(0, 0)),
      uViewSize: new THREE.Uniform(new THREE.Vector2(this.viewSizeValues.width, this.viewSizeValues.height)),
      uAspectRatio: new THREE.Uniform(new THREE.Vector2(1, 16 / 9)),
      uCursor: new THREE.Uniform(new THREE.Vector2(0.5, 0.5)),
      uImage: {value: 0},
      uTime: {value: 0},
      uHover: {value: 0}
    };
    this.currentItem = -1;
    this.animating = false;

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Functions
    this.getImages();
    this.updateImages();
    this.mouseMovement();
    this.render();

    window.addEventListener('resize', this.resize.bind(this));


    this.imageArr.forEach((obj, i) => {
      obj.img.addEventListener("mousedown", () => this.meshClick(obj));
      document.querySelector('.fullscreen').addEventListener("mousedown", () => this.toDefault(obj.id, obj.mesh));
    });

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  resize() {
    this.updateImages();
    this.updateFullscreen(this.currentItem);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.fov = 2 * Math.atan((window.innerHeight / 2) / this.cameraPos ) * (180 / Math.PI);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  getImages() {
    // Material template
    const materialRef = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: this.uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,

    });

    this.materials = [];
    let id = -1;
    // Update uniforms with image

    this.imageArr = this.images.map(img => {
      id++; // doing this first because we are returning the ID

      const bounds = img.getBoundingClientRect();

      const geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10);
      const texture = new THREE.TextureLoader().load(img.src);

      const material = materialRef.clone();

      const mesh = new THREE.Mesh(geometry, material);

      // texture.needsUpdate = true;
      material.uniforms.uImage.value = texture;
      material.uniforms.uAspectRatio.value.x = 1;
      material.uniforms.uAspectRatio.value.y = bounds.width / bounds.height;
      mesh.scale.set(bounds.width, bounds.height);

      mesh.isPickable = true;
      mesh.matrixAutoUpdate = true;

      this.materials.push(material);
      this.scene.add(mesh);

      img.addEventListener('mouseenter', () => {
        gsap.to(material.uniforms.uHover, {
            duration: 1,
            value: 1
        });
      });

      img.addEventListener('mouseleave', () => {
        gsap.to(material.uniforms.uHover, {
            duration: 1,
            value: 0
        });
      });

      return {
          id: id,
          img: img,
          mesh: mesh,
          bounds: bounds
      }
    });


  }

  updateImages() {
    this.imageArr.forEach((plane, i) => {
      const bounds = plane.img.getBoundingClientRect();
      plane.mesh.scale.set(bounds.width, bounds.height, 1);
    });
  }

  setPosition() {
    this.imageArr.forEach(img => {
      const bb = this.images[img.id].getBoundingClientRect();
      img.mesh.position.x = bb.left - window.innerWidth / 2 + bb.width / 2;
      img.mesh.position.y = - bb.top + window.innerHeight / 2 - bb.height / 2;
    });
  }

  mouseMovement() {
    window.addEventListener( 'mousemove', (event) => {
      this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera( this.mouse, this.camera );

      const intersects = this.raycaster.intersectObjects( this.scene.children );
        if(intersects.length > 0) {
            let obj = intersects[0].object;
            obj.material.uniforms.uCursor.value = intersects[0].uv;
        }
      }, false );
  }

  meshClick(obj) {
    const { img, id, mesh } = obj;
    const rect = img.getBoundingClientRect();
    mesh.position.z = 1;

    const viewSize = this.getViewSize();

    // 1. Transform pixel units to camera's view units
    let widthViewUnit = (rect.width * viewSize.width) / window.innerWidth;
    let heightViewUnit = (rect.height * viewSize.height) / window.innerHeight;

    let xViewUnit = (rect.left * viewSize.width) / window.innerWidth;
    let yViewUnit = (rect.top * viewSize.height) / window.innerHeight;

    // 2. Make units relative to center instead of the top left.
    xViewUnit = xViewUnit - viewSize.width / 2;
    yViewUnit = yViewUnit - viewSize.height / 2;

    // 3. Make the origin of the plane's position to be the center instead of top Left.
    let x = xViewUnit + widthViewUnit / 2;
    let y = -yViewUnit - heightViewUnit / 2;

    // Divide by scale because on the fragment shader we need values before the scale
		this.materials[id].uniforms.uMeshPosition.value.x = x / widthViewUnit;
		this.materials[id].uniforms.uMeshPosition.value.y = y / heightViewUnit;
		this.materials[id].uniforms.uMeshScale.value.x = (rect.width * viewSize.width) / window.innerWidth;
		this.materials[id].uniforms.uMeshScale.value.y = (rect.height * viewSize.height) / window.innerHeight;
    this.materials[id].uniforms.uViewSize.value.x = this.getViewSize().width;
    this.materials[id].uniforms.uViewSize.value.y = this.getViewSize().width / (16 / 9);

    this.currentItem = {img, id};

    this.toFullscreen(id);
  }

  updateFullscreen(obj) {
    if(obj === -1) return;
    const { img, id } = obj;
    const rect = img.getBoundingClientRect();
    const viewSize = this.getViewSize();

    // 1. Transform pixel units to camera's view units
    const widthViewUnit = (rect.width * viewSize.width) / window.innerWidth;
    const heightViewUnit = (rect.height * viewSize.height) / window.innerHeight;

    let xViewUnit = (rect.left * viewSize.width) / window.innerWidth;
    let yViewUnit = (rect.top * viewSize.height) / window.innerHeight;

    // 2. Make units relative to center instead of the top left.
    xViewUnit = xViewUnit - viewSize.width / 2;
    yViewUnit = yViewUnit - viewSize.height / 2;

    // 3. Make the origin of the plane's position to be the center instead of top Left.
    let x = xViewUnit + widthViewUnit / 2;
    let y = -yViewUnit - heightViewUnit / 2;

    this.materials[id].uniforms.uMeshScale.value.x = widthViewUnit;
    this.materials[id].uniforms.uMeshScale.value.y = heightViewUnit;
    this.materials[id].uniforms.uViewSize.value.x = this.getViewSize().width;
    this.materials[id].uniforms.uViewSize.value.y = this.getViewSize().width / (16 / 9);

    // // Divide by scale because on the fragment shader we need values before the scale
		this.materials[id].uniforms.uMeshPosition.value.x = x / widthViewUnit;
		this.materials[id].uniforms.uMeshPosition.value.y = y / heightViewUnit;
  }

  toFullscreen(id) {
    if(this.animating) return;
    gsap.to(this.materials[id].uniforms.uProgress, 1, {
        value: 1,
        onStart: () => {
          this.animating = true;
        },
        onUpdate: () => {
            this.render();
        },
        onComplete: () => {
          document.querySelector('.fullscreen').style.zIndex = 2;
          this.animating = false;
        }
    });
  }

  toDefault(id, mesh) {
    if(this.animating) return;

    gsap.to(this.materials[id].uniforms.uProgress, 1, {
        value: 0,
        onStart: () => {
          this.animating = true;
        },
        onUpdate: () => {
          this.render();
        },
        onComplete: () => {
            document.querySelector('.fullscreen').style.zIndex = -1;
            mesh.position.z = 0;
            this.animating = false;
        }
    });
  }

  getViewSize() {
    const fovInRadians = (this.camera.fov * Math.PI) / 180;
    const height = Math.abs(this.camera.position.z * Math.tan(fovInRadians / 2) * 2);

    return { width: height * this.camera.aspect, height };
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera)

    this.setPosition();

    this.materials.forEach( m => {
        m.uniforms.uTime.value = this.elapsedTime;
    });

    window.requestAnimationFrame(this.render.bind(this));
  }
}