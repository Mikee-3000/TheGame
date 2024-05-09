import * as THREE from 'three'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
const GUI = window.lil.GUI;
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';


const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()
const cssRenderer = new CSS2DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = 0;

export {gui, canvas, scene, DRACOLoader, GLTFLoader, OrbitControls, cssRenderer}