let balance = 1000;
let matches = [];

const teamList = [
  "Manchester United",
  "Real Madrid",
  "Barcelona",
  "Liverpool",
  "Bayern Munich",
  "Juventus",
  "Paris Saint-Germain",
  "Chelsea",
  "Manchester City",
  "Arsenal",
  "AC Milan",
  "Borussia Dortmund",
  "Tottenham Hotspur",
  "Atletico Madrid",
  "Inter Milan",
  "Napoli",
  "Ajax",
  "AS Roma",
  "RB Leipzig",
  "Sevilla",
];

function generateTeamPower() {
  return Math.floor(Math.random() * (500 - 380 + 1)) + 380;
}

function selectRandomTeams(teamList, numTeams) {
  const shuffledTeams = teamList.sort(() => 0.5 - Math.random());
  return shuffledTeams.slice(0, numTeams);
}

function calculateWinningChance(team1Power, team2Power) {
  const powerDifference = Math.abs(team1Power - team2Power);
  const winningChance = powerDifference / 2 + 50;
  if (team1Power > team2Power) {
    return Math.min(winningChance, 99);
  } else {
    return Math.max(100 - winningChance, 1);
  }
}

function calculateMultiplier(chance) {
  return 100 / chance;
}

function generateRandomMatches(teamList) {
  matches = [];
  const selectedTeams = selectRandomTeams(teamList, 12);

  for (let i = 0; i < 6; i++) {
    const team1 = selectedTeams[i * 2];
    const team2 = selectedTeams[i * 2 + 1];

    const team1Power = generateTeamPower();
    const team2Power = generateTeamPower();
    const team1Chance = calculateWinningChance(team1Power, team2Power);

    matches.push({
      team1: team1,
      team2: team2,
      team1Power: team1Power,
      team2Power: team2Power,
      chance: team1Chance,
    });
  }

  displayMatches();
}

function displayMatches() {
  const matchContainer = document.getElementById("matches");
  const matchSelect = document.getElementById("matchSelect");
  matchContainer.innerHTML = "";
  matchSelect.innerHTML = "";

  matches.forEach((match, index) => {
    const matchText = `${match.team1} (Chance: ${match.chance.toFixed(2)}%) 
                          vs ${match.team2} (Chance: ${(
      100 - match.chance
    ).toFixed(2)}%)`;
    matchContainer.innerHTML += `<div class="match">${matchText}</div>`;
    matchSelect.innerHTML += `<option value="${index}">${matchText}</option>`;
  });

  updateTeamSelect();
}

function updateTeamSelect() {
  const matchIndex = document.getElementById("matchSelect").value;
  const match = matches[matchIndex];
  const teamSelect = document.getElementById("teamSelect");
  teamSelect.innerHTML = `<option value="team1">${match.team1}</option><option value="team2">${match.team2}</option>`;

  updateMultiplier();
}

function updateMultiplier() {
  const matchIndex = document.getElementById("matchSelect").value;
  const match = matches[matchIndex];
  const teamSelect = document.getElementById("teamSelect");
  const chosenTeam = teamSelect.value;
  const chosenTeamChance =
    chosenTeam === "team1" ? match.chance : 100 - match.chance;
  const multiplier = calculateMultiplier(chosenTeamChance);

  const multiplierDisplay = document.getElementById("multiplierDisplay");
  multiplierDisplay.innerText = `Potential Winnings Multiplier: x${multiplier.toFixed(
    2
  )}`;
}

function placeBet(event) {
  event.preventDefault();
  const matchIndex = document.getElementById("matchSelect").value;
  const betAmount = parseInt(document.getElementById("betAmount").value);
  const chosenTeam = document.getElementById("teamSelect").value;

  if (betAmount > balance || betAmount <= 0) {
    alert("Invalid bet amount!");
    return;
  }

  const match = matches[matchIndex];
  const winningTeam = Math.random() * 100 < match.chance ? "team1" : "team2";
  document.getElementById("betButton").classList.add("hidden");
  simulateMatch(match, winningTeam, chosenTeam, betAmount);
}

function determineFinalScore(winningTeam) {
  let team1Score = Math.floor(Math.random() * 5);
  let team2Score = Math.floor(Math.random() * 5);

  if (winningTeam === "team1") {
    if (team1Score <= team2Score) team1Score = team2Score + 1;
  } else {
    if (team2Score <= team1Score) team2Score = team1Score + 1;
  }

  return { team1Score, team2Score };
}

function simulateMatch(match, winningTeam, chosenTeam, betAmount) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = "";

  const { team1Score, team2Score } = determineFinalScore(winningTeam);

  let team1Goals = [];
  let team2Goals = [];

  for (let i = 0; i < team1Score; i++) {
    team1Goals.push(Math.floor(Math.random() * 8) + 1);
  }

  for (let i = 0; i < team2Score; i++) {
    team2Goals.push(Math.floor(Math.random() * 8) + 1);
  }

  let currentTeam1Score = 0;
  let currentTeam2Score = 0;

  let minute = 1;
  const matchInterval = setInterval(() => {
    if (minute > 8) {
      clearInterval(matchInterval);
      finalizeBet(
        match,
        winningTeam,
        chosenTeam,
        betAmount,
        team1Score,
        team2Score
      );
      return;
    }

    if (team1Goals.includes(minute)) currentTeam1Score++;
    if (team2Goals.includes(minute)) currentTeam2Score++;

    resultElement.innerHTML += `<p>Minute ${minute * 10}: ${
      match.team1
    } ${currentTeam1Score} - ${match.team2} ${currentTeam2Score}</p>`;
    minute++;
  }, 1000);
}

function finalizeBet(
  match,
  winningTeam,
  chosenTeam,
  betAmount,
  team1Score,
  team2Score
) {
  const resultElement = document.getElementById("result");

  let resultMessage;
  const chosenTeamChance =
    chosenTeam === "team1" ? match.chance : 100 - match.chance;
  const multiplier = calculateMultiplier(chosenTeamChance);

  if (chosenTeam === winningTeam) {
    balance += Math.floor(betAmount * multiplier - betAmount);
    resultMessage = `You won! ${
      match[chosenTeam]
    } won the match! Final Score: ${match.team1} ${team1Score} - ${
      match.team2
    } ${team2Score}. You won $${Math.floor(
      betAmount * multiplier - betAmount
    )}!`;
  } else {
    balance -= betAmount;
    resultMessage = `You lost. ${match[winningTeam]} won the match. Final Score: ${match.team1} ${team1Score} - ${match.team2} ${team2Score}`;
  }

  document.getElementById("balance").innerText = `Balance: $${balance}`;
  resultElement.innerHTML += `<p>${resultMessage}</p>`;
  document.getElementById("betButton").classList.remove("hidden");
  generateRandomMatches(teamList);
}

document
  .getElementById("matchSelect")
  .addEventListener("change", updateTeamSelect);
document
  .getElementById("teamSelect")
  .addEventListener("change", updateMultiplier);
document.getElementById("betForm").addEventListener("submit", placeBet);

generateRandomMatches(teamList);
