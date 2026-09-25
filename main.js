// Lista de animales con nombre común, descripción y foto
const animalsData = [
{ name: "Rana esmeralda", question: "Piel suave. Extremidades muy largas y delgadas. Su color es verde esmeralda, con manchas cobrizas irregulares", scientific: "(Hylorina sylvatica)", photo: "Rana esmeralda.jpg" },
{ name: "Rana de antifaz", question: "Piel lisa. Su color varía entre café, terracota y beige. Un rasgo característico es la franja de pigmento a cada lado del rostro, desde las narinas hasta el tímpano, a modo de antifaz", scientific: "(Batrachyla taeniata)", photo: "Rana de antifaz.jpg" },
{ name: "Rana moteada", question: "Piel suavemente granulosa. Extremidades delgadas, con dedos finos y de punta ensanchadas en forma de paleta. Su color varía entre grises, terracotas y cafés oscuros sobre un fondo claro", scientific: "(Batrachyla taeniata)", photo: "Rana moteada.jpg" },
{ name: "Rana jaspeada", question: "Piel suave, con pocas granulaciones. Extremidades delgadas con dedos finos que terminan en forma espatulada. Su color contiene un fondo amarillo con numerosas manchas oscuras irregulares", scientific: "(Batrachyla leptopus)", photo: "Rana jaspeada.jpg" },
{ name: "Rana de hojarasca austral", question: "Piel con pocas granulaciones. Extremidades posteriores robustas, las anteriores delgadas. Su color es variable, fondo claro con manchas oscuras. Sobre su cabeza presenta una mancha con forma de 'reloj de arena'", scientific: "(Eupsophus calcaratus)", photo: "Rana de hojarasca austral.jpg" },
{ name: "Rana grande de hojarasca", question: "Piel lisa. Cuerpo robusto y extremidades fuertes. Su color es café grisáceo. Posee mancha de color verde oliváceo sobre los ojos", scientific: "(Eupsophus emiliopugini)", photo: "Rana grande de hojarasca.jpg" },
{ name: "Ranita de Darwin", question: "Piel suave, posee un relieve cutáneo en ambos flancos formado de pequeños relieves glandulares. Su color es variable, con tonos rojizos, cafés y verdes. Posee un apéndice nasal cilínrico de 2 mm de largo", scientific: "(Rhinoderma darwinii)", photo: "Ranita de Darwin.jpg" },
{ name: "Sapito de cuatro ojos", question: "Piel con algunas granulaciones irregulares. Cuerpo rechoncho con extremidades cortas y delgadas. Su color es muy variable, siendo gris, café, beige o verde, con manchas irregulares oscuras", scientific: "(Pleurodema thaul)", photo: "Sapito de cuatro ojos.jpg" },

];

const animalDescriptions = {
"Rana esmeralda": "Tamaño grande. Habita ambientes frecuentemente anegados con presencia de helechos y juncos",
"Rana de antifaz": "Tamaño mediano. Se encuentra en zonas húmedas y sombrías, cerca de cuerpos de agua lénticas con abundante vegetación",
"Rana moteada": "Tamaño mediano. Se encuentra bajo troncos caídos y hojarasca húmeda en bosques húmedos",
"Rana jaspeada": "Tamaño mediano. Se encuentra bajo troncos caídos en bosques húmedos y zonas anegadas",
"Rana de hojarasca austral": "Tamaño mediano. Se encuentra bajo rocas o troncos caídos en bosques húmedos",
"Rana grande de hojarasca": "Tamaño mediano. Se encuentra en cavidades anegadas, bajo troncos podridos. También habita en turberas ocupando cavidades en cúmulos de musgos Sphagnum",
"Ranita de Darwin": "Tamaño pequeño. Se encuentren sobre la hojarasca húmeda de los bosques. También ocupa los hábitats de turberas entre juncos y musgos",
"Sapito de cuatro ojos": "Tamaño mediano. Se encuentra bajo troncos en bosques como también en sectores aledaños a zonas urbanas",

};

let score = 0;
let errors = 0;
let current = 0;
let answerLocked = false;
const MAX_ANIMALS_PER_GAME = 10;

const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const photoModal = document.getElementById("photo-modal");
const zoomedPhoto = document.getElementById("zoomed-photo");
const photoHelp = document.getElementById("photo-help");
const photoViewport = document.getElementById("photo-viewport");
let photoZoom = 1;
let photoOffsetX = 0;
let photoOffsetY = 0;
let dragStartX = 0;
let dragStartY = 0;
let photoPointerStartX = 0;
let photoPointerStartY = 0;
let photoWasDragged = false;
const photoPanSpeed = 1;

function updatePhotoTransform() {
  zoomedPhoto.style.transform = `translate(${photoOffsetX}px, ${photoOffsetY}px) scale(${photoZoom})`;
  photoViewport.classList.toggle("is-zoomed", photoZoom > 1);
}

function resetPhotoZoom() {
  photoZoom = 1;
  photoOffsetX = 0;
  photoOffsetY = 0;
  updatePhotoTransform();
}

function changePhotoZoom(amount) {
  photoZoom = Math.min(5, Math.max(1, photoZoom + amount));
  updatePhotoTransform();
}

function zoomPhotoAtPoint(event) {
  if (photoWasDragged) {
    photoWasDragged = false;
    return;
  }

  const viewportRect = photoViewport.getBoundingClientRect();
  const centerX = viewportRect.width / 2;
  const centerY = viewportRect.height / 2;
  const clickX = event.clientX - viewportRect.left;
  const clickY = event.clientY - viewportRect.top;
  const imageX = (clickX - centerX - photoOffsetX) / photoZoom;
  const imageY = (clickY - centerY - photoOffsetY) / photoZoom;
  const nextZoom = Math.min(5, photoZoom + 0.75);

  photoOffsetX = clickX - centerX - imageX * nextZoom;
  photoOffsetY = clickY - centerY - imageY * nextZoom;
  photoZoom = nextZoom;
  updatePhotoTransform();
}

function closePhotoZoom() {
  photoModal.classList.add("hidden");
}

document.getElementById("correct-photo-btn").onclick = () => {
  zoomedPhoto.src = document.getElementById("correct-img").src;
  zoomedPhoto.alt = document.getElementById("correct-img").alt;
  resetPhotoZoom();
  photoModal.classList.remove("hidden");
  document.getElementById("close-photo-btn").focus();
};

document.getElementById("close-photo-btn").onclick = closePhotoZoom;

photoModal.onclick = event => {
  if (event.target === photoModal) closePhotoZoom();
};

document.getElementById("zoom-in-btn").onclick = () => changePhotoZoom(0.5);
document.getElementById("zoom-out-btn").onclick = () => changePhotoZoom(-0.5);
document.getElementById("reset-zoom-btn").onclick = resetPhotoZoom;

photoViewport.addEventListener("click", zoomPhotoAtPoint);

photoViewport.addEventListener("pointerdown", event => {
  photoViewport.setPointerCapture(event.pointerId);
  photoPointerStartX = event.clientX;
  photoPointerStartY = event.clientY;
  photoWasDragged = false;
  dragStartX = event.clientX - photoOffsetX;
  dragStartY = event.clientY - photoOffsetY;
});

photoViewport.addEventListener("pointermove", event => {
  if (!photoViewport.hasPointerCapture(event.pointerId)) return;
  if (Math.abs(event.clientX - photoPointerStartX) > 4 ||
      Math.abs(event.clientY - photoPointerStartY) > 4) {
    photoWasDragged = true;
  }
  photoOffsetX = (event.clientX - photoPointerStartX) * photoPanSpeed +
    (photoPointerStartX - dragStartX);
  photoOffsetY = (event.clientY - photoPointerStartY) * photoPanSpeed +
    (photoPointerStartY - dragStartY);
  updatePhotoTransform();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePhotoZoom();
});

document.getElementById("startBtn").onclick = () => {
  welcomeScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  loadAnimal();
};

// Genera animales con distractores
function generateAnimals() {
  return animalsData
    .sort(() => Math.random() - 0.5)
    .slice(0, MAX_ANIMALS_PER_GAME)
    .map(animal => {
    const correct = `fotos/${animal.photo}`;

    const distractors = animalsData
      .filter(a => a.name !== animal.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(a => ({ name: a.name, scientific: a.scientific, photo: `fotos/${a.photo}` }));

    return {
      name: animal.name,
      question: animal.question,
      scientific: animal.scientific,
      correct,
      options: [{ name: animal.name, scientific: animal.scientific, photo: correct }, ...distractors].sort(() => Math.random() - 0.5)
    };
    });
}

let animals = generateAnimals();

// Barra de progreso
function updateProgress() {
  const total = animals.length;
  const progress = (current + 0.25) / total * 100;
  document.getElementById("progress-bar").style.width = progress + "%";
}

// Ocultar UI del juego
function hideGameUI() {
  document.querySelector(".game-eyebrow").classList.add("hidden");
  document.getElementById("Title").classList.add("hidden");
  document.getElementById("question").classList.add("hidden");
  document.getElementById("options").style.display = "none";
  document.getElementById("message").style.display = "none";
  document.getElementById("correct-animal").classList.add("hidden");
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("progress-container").style.display = "none";
}

// Mostrar UI del juego
function showGameUI() {
  document.querySelector(".game-eyebrow").classList.remove("hidden");
  document.getElementById("Title").classList.remove("hidden");
  document.getElementById("question").classList.remove("hidden");
  document.getElementById("options").style.display = "flex";
  document.getElementById("message").style.display = "block";
  document.getElementById("progress-container").style.display = "block";
}

// Cargar animal
function loadAnimal() {
  if (current >= animals.length) {
    showFinalScreen();
    return;
  }

  const animal = animals[current];
  answerLocked = false;
  closePhotoZoom();

  document.getElementById("question").innerText = animal.question;

  document.getElementById("correct-animal").classList.add("hidden");
  document.getElementById("correct-img").classList.remove("correct-zoom");
  document.getElementById("correct-scientific").innerText = "";

  document.getElementById("options").style.display = "flex";

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  animal.options.forEach(option => {
    const label = document.createElement("label");
    label.classList.add("option");
    label.style.setProperty("--option-bg", `url("${option.photo}")`);

    const img = document.createElement("img");
    img.src = option.photo;
    img.alt = option.name;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.setAttribute("aria-label", `Elegir ${option.name}`);
    checkbox.addEventListener("change", () => checkAnswer(option.name));

    const name = document.createElement("span");
    name.innerText = option.name;

    const scientific = document.createElement("small");
    scientific.innerText = option.scientific || "";
    scientific.classList.add("option-scientific");

    const textWrap = document.createElement("div");
    textWrap.classList.add("option-text");
    textWrap.append(name, scientific);

    label.append(img, textWrap, checkbox);
    optionsDiv.appendChild(label);
  });

  const message = document.getElementById("message");
  message.innerText = "";
  message.classList.remove("status-correct", "status-incorrect");
  document.getElementById("nextBtn").style.display = "none";

  updateProgress();
}

// Verificar respuesta
function checkAnswer(selected) {
  if (answerLocked) return;

  const animal = animals[current];
  const message = document.getElementById("message");
  answerLocked = true;

  if (selected === animal.name) {
    score++;

    message.innerText = "¡Correcto!";
    message.classList.remove("status-incorrect");
    message.classList.add("status-correct");

    document.getElementById("correct-img").src = animal.correct;

    document.getElementById("correct-name").innerText = animal.name;
    document.getElementById("correct-scientific").innerText = animal.scientific;
    photoHelp.innerHTML = `<strong class="photo-name">${animal.name}</strong><em class="photo-scientific">${animal.scientific}</em><span class="photo-description">${animalDescriptions[animal.name]}</span>`;

    document.getElementById("correct-img").classList.add("correct-zoom");

    document.getElementById("options").style.display = "none";

    document.getElementById("correct-animal").classList.remove("hidden");

    document.getElementById("nextBtn").style.display = "inline-block";

  } else {
    errors++;
    message.innerText = "Incorrecto";
    message.classList.remove("status-correct");
    message.classList.add("status-incorrect");

    setTimeout(() => {
      current++;
      loadAnimal();
    }, 700);
  }
}

// Botón siguiente
document.getElementById("nextBtn").onclick = () => {
  current++;
  loadAnimal();
};

// Pantalla final
function showFinalScreen() {
  hideGameUI();

  const final = document.getElementById("final-screen");
  const scoreText = document.getElementById("final-score");

  const total = animals.length;
  const percent = Math.round((score / total) * 100);

  scoreText.innerText = `Tu puntuación:\n${score} de ${total} (${percent}%) - Errores: ${errors}`;

  final.classList.remove("hidden");

  startConfetti();
}

// Reiniciar juego
document.getElementById("restartBtn").onclick = () => {
  current = 0;
  score = 0;
  errors = 0;
  answerLocked = false;
  animals = generateAnimals();

  document.getElementById("final-screen").classList.add("hidden");
  document.getElementById("confetti-canvas").style.display = "none";

  showGameUI();

  document.getElementById("message").innerText = "";
  document.getElementById("progress-bar").style.width = "0%";
  document.getElementById("nextBtn").style.display = "none";

  loadAnimal();
};

/* CONFETI */
function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  canvas.style.display = "block";

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];

  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();

      c.y += c.d;
      if (c.y > canvas.height) c.y = -10;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// La partida comienza desde la pantalla de bienvenida.
