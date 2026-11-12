
"use strict";

// Henter HTML-elementene
const helicopter = document.getElementById("helicopter");
const gameArea = document.getElementById("game-area");

const helipad = document.getElementById("helipad");
const missionsDisplay = document.getElementById("missions");
const missionMessage = document.getElementById("mission-message");

 // Henter personen som trenger hjelp
const rescuePerson = document.getElementById("rescue-person");

// Holder oversikt over redningsoppdraget
let personRescued = false;


let messageTimeout;

let missions = 0;
let hasLanded = false;


// Startposisjon for helikopteret
let posX = 100;
let posY = 100;

// Antall piksler helikopteret flytter seg
const speed = 20;

// Oppdaterer helikopterets posisjon
function moveHelicopter() {
    const maxX = gameArea.clientWidth - helicopter.offsetWidth;
    const maxY = gameArea.clientHeight - helicopter.offsetHeight;

    // Holder helikopteret innenfor spilleområdet
    posX = Math.max(0, Math.min(posX, maxX));
    posY = Math.max(0, Math.min(posY, maxY));

    helicopter.style.left = posX + "px";
    helicopter.style.top = posY + "px";

    checkRescue();
    checkLanding();
}

// Lytter etter tastetrykk
document.addEventListener("keydown", function(event) {

    switch (event.key) {
        case "ArrowUp":
            posY -= speed;
            break;

        case "ArrowDown":
            posY += speed;
            break;

        case "ArrowLeft":
            posX -= speed;
            break;

        case "ArrowRight":
            posX += speed;
            break;

        default:
            return;
    }

    // Hindrer at piltastene ruller nettsiden
    event.preventDefault();

    moveHelicopter();
});

// Plasserer helikopteret ved oppstart
moveHelicopter();


 // Flytter helikopteret dit brukeren klikker
gameArea.addEventListener("click", function(event) {

    // Finner spilleområdets plassering på skjermen
    const rect = gameArea.getBoundingClientRect();

    // Beregner posisjonen i spilleområdet
    posX = event.clientX - rect.left
        - gameArea.clientLeft
        - helicopter.offsetWidth / 2;

    posY = event.clientY - rect.top
        - gameArea.clientTop
        - helicopter.offsetHeight / 2;

    // Flytter helikopteret til den nye posisjonen
    moveHelicopter();
});


// Sjekker om helikopteret har landet
function checkLanding() {
    const helicopterRect = helicopter.getBoundingClientRect();
    const helipadRect = helipad.getBoundingClientRect();

    // Finner midtpunktet til helikopteret
    const centerX = helicopterRect.left + helicopterRect.width / 2;
    const centerY = helicopterRect.top + helicopterRect.height / 2;

    // Kontrollerer om midtpunktet er inne på landingsplassen
    const landed =
        centerX >= helipadRect.left &&
        centerX <= helipadRect.right &&
        centerY >= helipadRect.top &&
        centerY <= helipadRect.bottom;

    if (landed && !hasLanded && personRescued) {
        missions++;
        missionsDisplay.textContent = missions;
        personRescued = false;
        hasLanded = true;

        showMissionMessage();
    }

    // Gjør det mulig å lande på nytt etter avgang
    if (!landed) {
        hasLanded = false;
    }
}

function showMissionMessage() {
    missionMessage.classList.add("show");
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        missionMessage.classList.remove("show");
    }, 2000);
}


// Sjekker om helikopteret når personen
function checkRescue() {
    if (personRescued) {
        return;
    }

    const helicopterRect = helicopter.getBoundingClientRect();
    const personRect = rescuePerson.getBoundingClientRect();

    // Beregner midtpunktet til helikopteret
    const centerX = helicopterRect.left + helicopterRect.width / 2;
    const centerY = helicopterRect.top + helicopterRect.height / 2;

    // Sjekker om helikopteret er over nødsignalet
    const rescued =
        centerX >= personRect.left &&
        centerX <= personRect.right &&
        centerY >= personRect.top &&
        centerY <= personRect.bottom;

    if (rescued) {
        personRescued = true;
        rescuePerson.classList.add("rescued");

        // Viser melding om redningen
        missionMessage.querySelector("strong").textContent =
            "PERSON REDDET!";

        missionMessage.querySelector("span").textContent =
            "Fly tilbake til landingsplassen!";

        missionMessage.querySelector("small").textContent =
            "RETURNER TIL BASEN";

        missionMessage.classList.add("show");

// Oppdaterer meldingen etter vellykket landing
missionMessage.querySelector("strong").textContent =
    "OPPDRAG FULLFØRT!";

missionMessage.querySelector("span").textContent =
    "Personen er trygt tilbake på basen!";

missionMessage.querySelector("small").textContent =
    "+1 REDNINGSOPPDRAG";

        clearTimeout(messageTimeout);

        messageTimeout = setTimeout(function() {
            missionMessage.classList.remove("show");
        }, 2500);
    }
}


 // Starter et nytt redningsoppdrag
function startNewMission() {

    // Mulige posisjoner for nødsignalet
    const rescueLocations = [
        { x: 15, y: 66 },
        { x: 75, y: 25 },
        { x: 55, y: 70 }
    ];

    // Velger en tilfeldig posisjon
    const randomIndex = Math.floor(
        Math.random() * rescueLocations.length
    );

    const location = rescueLocations[randomIndex];

    // Flytter nødsignalet til den nye posisjonen
    rescuePerson.style.left = location.x + "%";
    rescuePerson.style.top = location.y + "%";

    // Viser nødsignalet igjen
    rescuePerson.classList.remove("rescued");

    personRescued = false;
    
    // Starter neste redningsoppdrag
startNewMission();
}

