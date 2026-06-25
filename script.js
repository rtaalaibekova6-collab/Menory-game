// Карталардын эможилери (ар биринен экиден)
const cardsArray = ['🍎', '🍎', '🍌', '🍌', '🍇', '🍇', '🍉', '🍉', '🍒', '🍒', '🥑', '🥑', '🍍', '🍍', '🥕', '🥕'];

let flippedCards = [];
let matchedCount = 0;
let moves = 0;
let pName = "";

const authBox = document.getElementById("authBox");
const gameActive = document.getElementById("gameActive");
const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const displayName = document.getElementById("displayName");
const movesText = document.getElementById("movesText");
const grid = document.getElementById("grid");
const leaderboard = document.getElementById("leaderboard");

// event handling: Оюнду баштоо
startBtn.addEventListener("click", () => {
    pName = playerNameInput.value.trim();
    // input control: бош калтырууну текшерүү
    if (pName === "") {
        alert("Сураныч, атыңызды жазыңыз!");
        return;
    }
    authBox.style.display = "none";
    gameActive.style.display = "block";
    displayName.textContent = pName;
    createBoard();
});

// Карталарды аралаштыруу алгоритми
function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
}

// Оюн талаасын түзүү
function createBoard() {
    grid.innerHTML = "";
    flippedCards = [];
    matchedCount = 0;
    moves = 0;
    movesText.textContent = moves;

    const shuffledCards = shuffle([...cardsArray]);

    shuffledCards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.textContent = "❓"; // Башында баары жабык

        // event handling: Картаны чыкылдатуу окуясы
        card.addEventListener("click", flipCard);
        grid.appendChild(card);
    });
}

function flipCard() {
    // Эгерде эки карта ачык болсо же ачылган картаны кайра басса, иштебейт
    if (flippedCards.length === 2 || this.classList.contains("flipped")) return;

    this.classList.add("flipped");
    this.textContent = this.dataset.emoji;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesText.textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Эгер туура табылса
        matchedCount += 2;
        flippedCards = [];

        // Оюн бүткөнүн текшерүү
        if (matchedCount === cardsArray.length) {
            setTimeout(() => {
                alert(`Куттуктайбыз, ${pName}! Сиз ${moves} кадам менен жеңдиңиз! 🎉`);
                addRecord(pName, moves); // add функциясы
                authBox.style.display = "flex";
                gameActive.style.display = "none";
                playerNameInput.value = "";
            }, 500);
        }
    } else {
        // Туура эмес болсо, 1 секунддан кийин кайра жабылат
        setTimeout(() => {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
            card1.textContent = "❓";
            card2.textContent = "❓";
            flippedCards = [];
        }, 1000);
    }
}

// add / delete: Жеңүүчүлөрдү кошуу жана өчүрүү
function addRecord(name, finalMoves) {
    const li = document.createElement("li");
    li.textContent = `${name}: ${finalMoves} кадам`;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Өчүрүү";
    delBtn.classList.add("del-btn");

    // event handling & delete
    delBtn.addEventListener("click", () => {
        leaderboard.removeChild(li);
    });

    li.appendChild(delBtn);
    leaderboard.appendChild(li);
}