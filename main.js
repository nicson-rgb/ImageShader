import img from './images/1.jpg'
import * as THREE from 'three'
import frag from './shader/main.frag?raw'
import vert from './shader/main.vert?raw'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import gsap from 'gsap'


export default class main {
  constructor(webgl) {
    this.webgl = webgl
    this.scene = new THREE.Scene()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    this.renderer.setClearColor( new THREE.Color( 0xffffff ))
    this.renderer.setSize(this.width,this.height)
    this.clock = new THREE.Clock()
    this.loader =  new THREE.TextureLoader()
    this.img = this.loader.load(img, () => {
      this.init()
    })

    this.gui = new dat.GUI();
  }

  init() {
    this._setting()
    this.onRaf()
    gsap.to(this.material.uniforms.uAnimation, {
      value: 1,
      duration: 10,
    })
  }

  _setting() {
    this.webgl.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.width / this.height,
      0.1,
      1000
    )

    this.camera.position.set(0, 0, 2)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true
    
    this._setMesh()

    this._gui();

  }

  _setMesh() {
    this.geometry = new THREE.PlaneBufferGeometry(1,1,1,1);
    this.material = new THREE.ShaderMaterial({
      vertexShader:vert,
      fragmentShader:frag,
      side:THREE.DoubleSide,
      transparent:true,
      uniforms: {
        uTexture: {
          value: this.img
        },
        uProgress: {
          value: 0
        },
        uTime: {
          value: 0
        },
        uAnimation: {
          value: 0
        }
      }
    })
    this.mesh = new THREE.Mesh(this.geometry,this.material);
    this.scene.add(this.mesh);

  }

  _gui() {
    this.gui.add(this.material.uniforms.uProgress,'value',0,1,0.01).name('progress');
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth,window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  }

  onRaf() {
    this.material.uniforms.uTime.value = this.clock.getElapsedTime()
    this.renderer.render(this.scene, this.camera);
    this.controls.update()
    window.requestAnimationFrame(() => {
      this.onRaf();
    })
  }
}

window.addEventListener('load', () => {
    const gl = new main(document.querySelector('#canvas'));

    window.addEventListener('resize',() => {
      gl.onResize();
    })
});