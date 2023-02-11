import * as THREE from 'three';
import './style.css';
import gsap from 'gsap';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

//1. set up a scene
const scene = new THREE.Scene();

//2. create a shape - like a clay/ What it is
const geometry = new THREE.SphereGeometry(3, 64,64);
//3. Create material - this is how it looks like
const material = new THREE.MeshStandardMaterial({
  color: '#24a37b',
  roughness: 0.5
})
//4. Create a Mesh - combination of geometry and material
const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);

//8. Create a lightt
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
light.intensity = 1.25;
scene.add(light);

//5. Add a camera 
//9. We then create some sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 100);
// 7.adjust camera position
camera.position.z = 20;
scene.add(camera);

// 6.render the scene - paint it into the canvas
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGL1Renderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// 11. Now we are going to utulise orbit controlling
const controls = new OrbitControls(camera,canvas);
controls.enableDamping = true; //this is where you can rotate the item
controls.enablePan = false;  // this is where you can move the item
controls.enableZoom = false //this is where you can scrolll through the item
controls.autoRotate = true;
controls.autoRotateSpeed = 6;

// 10A. Now we are going to ensure that the page 
// resizes based on the users changes
window.addEventListener('resize', () => {
  // console.log(window.innerHeight, window.innerWidth);
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // when the resizing is done, we need to update the camera
  // then update the projection matrics
  // then set the sizes for the render
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);

})

/*10B. We need to make a loop to ensure
 that the resizing is constantly done for each change of the window sizng
 */
 const loop = () => {
  controls.update();
  renderer.render(scene,camera);
  window.requestAnimationFrame(loop);
 }

 loop();

// 12. timeline magic
 const tl = gsap.timeline({ defaults: { duration: 1 }  })
 tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y:1})
 tl.fromTo('nav', {y: "-100%"}, {y:"0%"})
 tl.fromTo('.title', { opacity: 0 } , { opacity: 1 })
 

//  12. Mouse Animation Colour
// Only change the colour when the mouse is down and i am dragging
let mouseDown = false;
let rgb = [12,23,55];
window.addEventListener('mousedown', () => (mouseDown = true) )
window.addEventListener('mouseup', () => (mouseDown = false) )

window.addEventListener('mousemove', (e) => {
  if (mouseDown){
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    // let's animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`)
    gsap.to(mesh.material.color, { 
      r: newColor.r,
      g: newColor.g, 
      b: newColor.b,
    })
  }
})