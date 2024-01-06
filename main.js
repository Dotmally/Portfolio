import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1 ,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true, 
});


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry( 10 , 3, 16 , 100)
const material = new THREE.MeshStandardMaterial({ color: 0x044389});
const torus  =  new THREE.Mesh(geometry , material);

scene.add(torus)

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight , ambientLight)

const lightHelper = new THREE.PointLightHelper( pointLight)
const gridHelper = new THREE.GridHelper(200 , 50);

// scene.add(lightHelper, gridHelper)

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.8,
    emissive: 0xBBBBBB,
    emissiveIntensity: 0.1
  });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}



Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('2.jpeg', function (texture) {
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
});
scene.background = spaceTexture;

const aliTexture = new THREE.TextureLoader().load('photo.jpg');

const ali = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( {map: aliTexture})
);

scene.add(ali);

const moonTexture = new THREE.TextureLoader().load('bub.jpeg');
const normalTexture = new THREE.TextureLoader().load('shiny.jpeg')

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

function moveCamera() {
const t = document.body.getBoundingClientRect().top;
moon.rotation.x += 0.05;
moon.rotation.y += 0.075;
moon.rotation.z += 0.05;

ali.rotation.y += 0.01;
ali.rotation.z += 0.01;

camera.position.z = t * -0.01;
camera.position.y = t * -0.0002;
camera.position.x = t * -0.0002;

}

document.body.onscroll = moveCamera

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}



function animate(){
  requestAnimationFrame(animate);
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render( scene, camera );
}

animate()