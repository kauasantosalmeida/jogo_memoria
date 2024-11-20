let popupVisivel = false;
let totalMatched = 0;  // Contador para o número de pares encontrados

// Função para mostrar e esconder o pop-up
function mostrarPopup() {
    const popup = document.getElementById("popup");

    if (popupVisivel) {
        popup.style.display = "none";
        popupVisivel = false;
    } else {
        popup.style.display = "block";
        popupVisivel = true;
    }
}

const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

fetch("./data/cards.json")
    .then((res) => res.json())
    .then((data) => {
        cards = [...data, ...data]; // Duplicar as cartas para o jogo
        shuffleCards();
        generateCards();
        mostrarCartasPorTempo(); // Mostrar as cartas por alguns segundos
    });

// Função para embaralhar as cartas
function shuffleCards() {
    let currentIndex = cards.length, randomIndex, temporaryValue;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

// Função para mostrar as cartas viradas por um tempo
function mostrarCartasPorTempo() {
    // Mostrar todas as cartas viradas para a frente
    const todasAsCartas = document.querySelectorAll('.card');
    todasAsCartas.forEach(carta => carta.classList.add('flipped'));

    // Esperar 3 segundos antes de virar as cartas de volta
    setTimeout(() => {
        todasAsCartas.forEach(carta => carta.classList.remove('flipped')); // Virar as cartas para trás
        iniciarJogo(); // Iniciar o jogo normalmente
    }, 700); // 3000 milissegundos = 3 segundos
}

// Função para gerar as cartas no grid
function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-name", card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image} />
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener("click", flipCard);
    }
}

// Função para virar a carta
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add("flipped");

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    checkForMatch();
}

// Função para verificar se as cartas combinam
function checkForMatch() {
    let isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        totalMatched++;
        disableCards();
        checkForWin();
    } else {
        unflipCards();
    }
}

// Função para desabilitar as cartas combinadas
function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);

    resetBoard();
}

// Função para voltar as cartas que não combinaram
function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        resetBoard();
    }, 1000);
}

// Função para resetar o tabuleiro
function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

// Função para verificar se o jogador venceu
function checkForWin() {
    // Verifique se todos os pares foram encontrados
    if (totalMatched === cards.length / 2) {
        // Exiba a mensagem de parabéns
        setTimeout(() => {
            alert("Parabéns, você encontrou todos os pares de animais!");
            restart();  // Reinicia o jogo após o alerta
        }, 500); // Atraso para garantir que o jogador veja o último par encontrado
    }
}

// Função para reiniciar o jogo
function restart() {
    totalMatched = 0;  // Resetar o contador de pares encontrados
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = "";

    // Certifique-se de remover a classe "flipped" se por algum motivo ficou aplicada
    document.querySelectorAll(".card").forEach(card => {
        card.classList.remove("flipped");
    });

    generateCards();

    // Após o reinício, mostrar as cartas viradas novamente por um tempo
    mostrarCartasPorTempo();  // Isso vai garantir que as cartas fiquem visíveis por 3 segundos
}

// Função para iniciar o jogo normalmente (após mostrar as cartas por um tempo)
function iniciarJogo() {
    // O jogo está agora pronto para ser jogado normalmente
    // Qualquer lógica de inicialização pode ser chamada aqui
}
