/*
  Rui Santos
  Complete project details at https://RandomNerdTutorials.com/esp32-mpu-6050-web-server/

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

let scene, camera, rendered, cube;

// Função para formatar milissegundos para HH:MM:SS
function formatTime(milliseconds) {
  let totalSeconds = Math.floor(milliseconds / 1000);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  // Adiciona um zero à esquerda se for menor que 10
  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}


function parentWidth(elem) {
  return elem.parentElement.clientWidth;
}

function parentHeight(elem) {
  return elem.parentElement.clientHeight;
}

function init3D() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(75, parentWidth(document.getElementById("3Dcube")) / parentHeight(document.getElementById("3Dcube")), 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentWidth(document.getElementById("3Dcube")), parentHeight(document.getElementById("3Dcube")));

  document.getElementById('3Dcube').appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(5, 1, 4);

  var cubeMaterials = [
    new THREE.MeshBasicMaterial({ color: 0x03045e }), new THREE.MeshBasicMaterial({ color: 0x023e8a }),
    new THREE.MeshBasicMaterial({ color: 0x0077b6 }), new THREE.MeshBasicMaterial({ color: 0x03045e }),
    new THREE.MeshBasicMaterial({ color: 0x023e8a }), new THREE.MeshBasicMaterial({ color: 0x0077b6 }),
  ];

  const material = new THREE.MeshFaceMaterial(cubeMaterials);
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = parentWidth(document.getElementById("3Dcube")) / parentHeight(document.getElementById("3Dcube"));
  camera.updateProjectionMatrix();
  renderer.setSize(parentWidth(document.getElementById("3Dcube")), parentHeight(document.getElementById("3Dcube")));
}

window.addEventListener('resize', onWindowResize, false);
init3D();

if (!!window.EventSource) {
  var source = new EventSource('/events');

  source.addEventListener('open', function (e) { console.log("Events Connected"); }, false);

  source.addEventListener('error', function (e) {
    if (e.target.readyState != EventSource.OPEN) { console.log("Events Disconnected"); }
  }, false);

  source.addEventListener('gyro_readings', function (e) {
    var obj = JSON.parse(e.data);
    // Mostra os valores em graus na tela
    document.getElementById("gyroX").innerHTML = obj.gyroX;
    document.getElementById("gyroY").innerHTML = obj.gyroY;
    document.getElementById("gyroZ").innerHTML = obj.gyroZ;

    // --- INÍCIO DA CORREÇÃO ---
    // Converte os graus recebidos para radianos (que é o que o three.js espera)
    // A fórmula é: radianos = graus * PI / 180
    var gyroX_rad = obj.gyroX * Math.PI / 180;
    var gyroY_rad = obj.gyroY * Math.PI / 180;
    var gyroZ_rad = obj.gyroZ * Math.PI / 180;

    // Aplica a rotação em radianos, mantendo o mapeamento original dos eixos
    cube.rotation.x = gyroY_rad;
    cube.rotation.z = gyroX_rad;
    cube.rotation.y = gyroZ_rad;
    // --- FIM DA CORREÇÃO ---
    
    renderer.render(scene, camera);
  }, false);

  source.addEventListener('temperature_reading', function (e) {
    document.getElementById("temp").innerHTML = e.data;
  }, false);

  source.addEventListener('accelerometer_readings', function (e) {
    var obj = JSON.parse(e.data);
    document.getElementById("accX").innerHTML = obj.accX;
    document.getElementById("accY").innerHTML = obj.accY;
    document.getElementById("accZ").innerHTML = obj.accZ;
  }, false);

  source.addEventListener('storage_info', function (e) {
    var obj = JSON.parse(e.data);
    document.getElementById("timer").innerHTML = formatTime(obj.elapsed);
    document.getElementById("storagePercent").innerHTML = obj.percent;
    document.getElementById("progressBarFill").style.width = obj.percent + '%';
  }, false);
}

function resetPosition(element) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/" + element.id, true);
  xhr.send();
}

function clearData() {
  if (confirm("Você tem certeza que deseja apagar permanentemente todos os dados gravados?")) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/clear", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        alert("Dados apagados com sucesso!");
      } else {
        alert("Ocorreu um erro ao apagar os dados.");
      }
    };
    xhr.send();
  }
}