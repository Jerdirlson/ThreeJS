// import * as THREE from 'three';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
// var ligth = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ligth);


// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function animate() {
// 	requestAnimationFrame( animate );

// 	cube.rotation.x += 0.01;
// 	cube.rotation.y += 0.01;

// 	renderer.render( scene, camera );
// }

// animate();

import * as THREE from 'three';
import "./style.css"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';


/**
 * Para poder mostrar cualquier cosa con three.js, 
 * necesitamos tres cosas: escena, cámara y renderizador, 
 * para poder renderizar la escena con la cámara.
 */

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 64, 64);//radio, segmentos horizontales, segmentos verticales
const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
	roughness: 0.4
    });

//sizes 

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight
}


// la malla o mash es la combinacion de geometria y material

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

//configuracion de la luz
// const light = new THREE.AmbientLight( 0x4040 , 20); // soft white light
// scene.add( light );
const light = new THREE.PointLight( 0xfffff, 1 ,100 );
light.position.set( 0, 10, 10 );
light.intensity = 200;
scene.add( light );




/**
 * La cámara es el punto de vista desde el que 
 * estamos viendo la escena.
 * Existen tipos de camaras, entre ellas PerspectiveCamera y 
 * orthographicCamera, en la ortografica no hay perspectiva y 
 * se ve plano.
 * 
 * @params {Number} param1 - Angulo de la perspectiva
 * @params {Number} param2 - Relación de aspecto ancho de la camara
 * 
 */

const camera = new THREE.PerspectiveCamera( 45 , sizes.width / sizes.width, 0.1 , 100 );
camera.position.z = 20;
scene.add(camera);

//Renderizar la escena en la pantalla
const canvas = document.querySelector(".webgl")
const renderer = new THREE.WebGLRenderer({ canvas })

//definir el tama;o del render

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2)
renderer.render(scene, camera);

//controls 
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;



window.addEventListener('resize', () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
	controls.update();
	renderer.render(scene, camera);
	window.requestAnimationFrame(loop);
}

loop();

//timeline 
const tl = gsap.timeline({defaults: {duration: 1}});
tl.fromTo(mesh.scale, {z: 0, x:0 , y:0},{z: 1, x:1 , y:1} )


//animaciones de color con el mouse
let mouseDown = false;
let rgb = [];

window.addEventListener('mousedown', () => {mouseDown = true});
window.addEventListener('mouseup', () => {mouseDown = false});

window.addEventListener('mousemove', (event) => {
	if(mouseDown){
		rgb = [
			Math.round((event.pageX / sizes.width) * 255),
			Math.round((event.pageY / sizes.height) * 255),
			150
			
		]
		let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
		gsap.to(mesh.material.color, {
			r: newColor.r,
			g: newColor.g,
			b: newColor.b
		})
	}
});