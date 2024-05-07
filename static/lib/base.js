import * as THREE from 'three'
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
const GUI = window.lil.GUI;


const gui = new GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

export {gui, canvas, scene, DRACOLoader, GLTFLoader, OrbitControls}