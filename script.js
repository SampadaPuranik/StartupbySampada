// Data structure for teams
let teams = [
    { name: "Team A", points: 1000, resources: 5, history: [] },
    { name: "Team B", points: 1000, resources: 5, history: [] },
    { name: "Team C", points: 1000, resources: 5, history: [] }
];
let currentTeam = null; // Selected team for gameplay

// Sample cards
const challengeCards = [
    { text: "Product Development - Spend 200 points for a feature.", points: -200 },
    { text: "Market Expansion - Spend 300 points.", points: -300 }
];
const riskCards = [
    { text: "Venture Capital - Gain 500 points but lose future 10%.", points: 500 },
    { text: "Ad Gamble - Spend 200 points.", points: -200 }
];
const eventCards = [
    { text: "Economic Boom - Gain 100 points.", points: 100 },
    { text: "Market Crash - Lose 50 points.", points: -50 }
];


// Track current stage and card drawing status
let currentStage = 1; // Stages: 1, 2, or 3
let drawnCards = {};
let challengeCardIndex = 0;
let riskCardIndex = 0;
let eventCardIndex = 0;

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

// Sequential card drawing
function drawCardSequential(cardType) {
    if (!currentTeam) return alert("Please select a team first.");
    let card;

    switch (cardType) {
        case "challenge":
            card = challengeCards[challengeCardIndex];
            challengeCardIndex = (challengeCardIndex + 1) % challengeCards.length;
            break;
        case "risk":
            card = riskCards[riskCardIndex];
            riskCardIndex = (riskCardIndex + 1) % riskCards.length;
            break;
        case "event":
            card = eventCards[eventCardIndex];
            eventCardIndex = (eventCardIndex + 1) % eventCards.length;
            break;
    }

    applyCardEffect(card, `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} Card: ${card.text}`);
}

// Draw specific card types
function drawChallengeCard() {
    if (currentStage !== 1) return alert("You can only draw Challenge Cards in Stage 1.");
    drawCardSequential("challenge");
}

function drawRiskCard() {
    if (currentStage !== 2) return alert("You can only draw Risk Cards in Stage 2.");
    drawCardSequential("risk");
}

function drawEventCard() {
    if (currentStage !== 3) return alert("You can only draw Event Cards in Stage 3.");
    drawCardSequential("event");
}

// Apply card effects
function applyCardEffect(card, description) {
    if (!currentTeam) return alert("Please select a team first.");
    
    // Apply effects
    currentTeam.points += card.points || 0;
    currentTeam.points += card.reward || 0;
    currentTeam.points += card.penalty || 0;
    currentTeam.resources += card.points < 0 ? -1 : 0;
    currentTeam.history.push(description);
    
    // Update UI
    document.getElementById('points').textContent = currentTeam.points;
    document.getElementById('resources').textContent = currentTeam.resources;
    document.getElementById('card-display').textContent = description;

    updateScoreboard();
}

// Update scoreboard
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

// Team Registration
function registerTeam() {
    const teamNameInput = document.getElementById("new-team-name");
    const teamName = teamNameInput.value.trim();

    if (!teamName) return alert("Please enter a valid team name.");
    if (teams.some(team => team.name === teamName)) return alert("Team name must be unique.");

    const newTeam = { name: teamName, points: 1000, resources: 5, history: [] };
    teams.push(newTeam);
    teamNameInput.value = "";

    const teamSelect = document.getElementById("team-select");
    const option = document.createElement("option");
    option.value = teams.length - 1;
    option.textContent = teamName;
    teamSelect.appendChild(option);

    updateScoreboard();
}

// Advance to next stage
function nextStage() {
    if (currentStage >= 3) {
        alert("The game has ended. Thank you for playing!");
        return;
    }
    currentStage++;
    alert(`Stage ${currentStage} has begun!`);
}
