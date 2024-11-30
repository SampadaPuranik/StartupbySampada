// script.js

// Data structure for teams
let teams = [
    { name: "Team A", points: 1000, resources: 5, history: [] },
    { name: "Team B", points: 1000, resources: 5, history: [] },
    { name: "Team C", points: 1000, resources: 5, history: [] }
];
let currentTeam = null; // Selected team for gameplay

// Sample cards
const challengeCards = [
    { text: "Product Development - Spend 200 points for a feature.", points: -200, reward: 50 },
    { text: "Market Expansion - Spend 300 points, high success gains 100.", points: -300, reward: 100 }
];
const riskCards = [
    { text: "Venture Capital - Gain 500 points but lose future 10%.", reward: 500 },
    { text: "Ad Gamble - Spend 200, double or lose 150.", points: -200, reward: 400 }
];
const eventCards = [
    { text: "Economic Boom - Gain 100 points.", reward: 100 },
    { text: "Market Crash - Lose 50 points.", penalty: -50 }
];

// Populate team dropdown on load
window.onload = () => {
    const teamSelect = document.getElementById('team-select');
    teams.forEach((team, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
    updateScoreboard();
};

// Select a team for gameplay
function selectTeam() {
    const teamIndex = document.getElementById('team-select').value;
    currentTeam = teams[teamIndex];
    document.getElementById('current-team-name').textContent = currentTeam.name;
    document.getElementById('points').textContent = currentTeam.points;
    document.getElementById('resources').textContent = currentTeam.resources;
}

// Draw Challenge Card
function drawChallengeCard() {
    let card = challengeCards[Math.floor(Math.random() * challengeCards.length)];
    updateTeamStats(card, "Challenge Card: " + card.text);
}

// Draw Risk Card
function drawRiskCard() {
    let card = riskCards[Math.floor(Math.random() * riskCards.length)];
    updateTeamStats(card, "Risk Card: " + card.text);
}

// Draw Event Card
function drawEventCard() {
    let card = eventCards[Math.floor(Math.random() * eventCards.length)];
    updateTeamStats(card, "Event Card: " + card.text);
}

// Roll Dice for a random event outcome
function rollDice() {
    let diceResult = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-result').textContent = diceResult;
    let outcome = (diceResult > 3) ? { points: 100 } : { points: -50 };
    updateTeamStats(outcome, "Dice Roll: " + (outcome.points > 0 ? "Win 100" : "Lose 50"));
}

// Update points, resources, and history for the current team
function updateTeamStats(action, description) {
    if (!currentTeam) return alert("Please select a team first.");
    
    currentTeam.points += (action.points || 0) + (action.reward || 0);
    currentTeam.resources += action.points < 0 ? -1 : 0;
    currentTeam.history.push(description);
    
    // Update display
    document.getElementById('points').textContent = currentTeam.points;
    document.getElementById('resources').textContent = currentTeam.resources;
    document.getElementById('card-display').textContent = description;

    updateScoreboard();
}

// Display all teams' data in the scoreboard
function updateScoreboard() {
    const scoreboardBody = document.getElementById('scoreboard-body');
    scoreboardBody.innerHTML = '';
    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team.name}</td>
            <td>${team.points}</td>
            <td>${team.resources}</td>
            <td>${team.history.join('<br>')}</td>
        `;
        scoreboardBody.appendChild(row);
    });
}

// Track current stage and card-drawing status
let currentStage = 1; // Stage 1, 2, or 3
let drawnCards = {}; // Tracks cards drawn by team in the current stage

// Team Registration
function registerTeam() {
    const teamNameInput = document.getElementById("new-team-name");
    const teamName = teamNameInput.value.trim();

    if (!teamName) return alert("Please enter a valid team name.");
    if (teams.some(team => team.name === teamName)) return alert("Team name must be unique.");

    const newTeam = { name: teamName, points: 1000, resources: 5, history: [] };
    teams.push(newTeam);
    drawnCards[teamName] = { stage1: false, stage2: false, stage3: false }; // Initialize drawn status
    teamNameInput.value = "";

    const teamSelect = document.getElementById("team-select");
    const option = document.createElement("option");
    option.value = teams.length - 1;
    option.textContent = teamName;
    teamSelect.appendChild(option);

    updateScoreboard();
}

// Card Drawing Logic with Suspense
function drawCard(type) {
    if (!currentTeam) return alert("Please select a team first.");
    if (drawnCards[currentTeam.name][`stage${currentStage}`]) {
        return alert(`You have already drawn a card for Stage ${currentStage}.`);
    }

    // Mark card as drawn for this stage
    drawnCards[currentTeam.name][`stage${currentStage}`] = true;

    // Show suspense
    const suspenseDiv = document.getElementById("card-suspense");
    const suspenseTimer = document.getElementById("suspense-timer");
    suspenseDiv.style.display = "block";
    let timeLeft = 7;

    const interval = setInterval(() => {
        suspenseTimer.textContent = timeLeft;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(interval);
            suspenseDiv.style.display = "none";

            // Draw card based on type
            let card;
            if (type === "challenge") card = challengeCards[Math.floor(Math.random() * challengeCards.length)];
            if (type === "risk") card = riskCards[Math.floor(Math.random() * riskCards.length)];
            if (type === "event") card = eventCards[Math.floor(Math.random() * eventCards.length)];

            // Apply card effects
            updateTeamStats(card, `${type.charAt(0).toUpperCase() + type.slice(1)} Card: ${card.text}`);
        }
    }, 1000);
}

// Button Handlers for Drawing Cards
function drawChallengeCard() {
    if (currentStage !== 1) return alert("You can only draw Challenge Cards in Stage 1.");
    drawCard("challenge");
}

function drawRiskCard() {
    if (currentStage !== 2) return alert("You can only draw Risk Cards in Stage 2.");
    drawCard("risk");
}

function drawEventCard() {
    if (currentStage !== 3) return alert("You can only draw Event Cards in Stage 3.");
    drawCard("event");
}

// Advance to Next Stage
function nextStage() {
    if (currentStage >= 3) {
        return alert("The game has ended. Thank you for playing!");
    }
    currentStage++;
    alert(`Stage ${currentStage} has begun!`);
}
