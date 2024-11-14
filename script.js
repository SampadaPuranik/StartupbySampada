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
    { text: "Social Media Blitz - Spend 200 points to reach millions.", points: -200 },
    { text: "Influencer Marketing - Spend 300 points for high engagement.", points: -300 }
];
const eventCards = [
    { text: "Economic Boom - Gain 100 points.", reward: 100 },
    { text: "Market Crash - Lose 60 points.", penalty: -60 },
    { text: "Super Economic Boom - Gain 120 points.", reward: 120 },
    { text: "Super Market Crash - Lose 40 points.", penalty: -40 }
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

// Update points, resources, and history for the current team
function updateTeamStats(action, description) {
    if (!currentTeam) return alert("Please select a team first.");
    
    // Update points based on reward or penalty
    if (action.reward) {
        currentTeam.points += action.reward;
    } else if (action.penalty) {
        currentTeam.points += action.penalty;
    } else {
        currentTeam.points += action.points || 0;
    }
    
    // Deduct a resource if the action is a points deduction
    if (action.points < 0 || action.penalty) {
        currentTeam.resources -= 1;
    }
    
    // Add the action to the team's history
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
