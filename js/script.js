// Variables globales
let playerScore = 0;
let computerScore = 0;
let hangmanWord = '';
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrongGuesses = 6;

// Elementos del DOM
const pptCard = document.getElementById('ppt-card');
const hangmanCard = document.getElementById('hangman-card');
const pptGame = document.getElementById('ppt-game');
const hangmanGame = document.getElementById('hangman-game');
const pptBtn = document.getElementById('ppt-btn');
const hangmanBtn = document.getElementById('hangman-btn');
const pptBack = document.getElementById('ppt-back');
const hangmanBack = document.getElementById('hangman-back');
const pptReset = document.getElementById('ppt-reset');
const hangmanReset = document.getElementById('hangman-reset');
const pptResult = document.getElementById('ppt-result');
const playerScoreElem = document.getElementById('player-score');
const computerScoreElem = document.getElementById('computer-score');
const hangmanDrawing = document.getElementById('hangman-drawing');
const wordDisplay = document.getElementById('word-display');
const hangmanMessage = document.getElementById('hangman-message');
const keyboard = document.getElementById('keyboard');

// Lista de palabras para el ahorcado
const words = [
    'JAVASCRIPT', 'HTML', 'CSS', 'PROGRAMACION', 'COMPUTADORA',
    'INTERNET', 'DESARROLLO', 'APLICACION', 'NAVEGADOR', 'FUNCION','FRAMEWORK','CODIGO','ARCOIRIS',
    'ALGORITMO','SEGURIDAD','BASEDEDATOS','CLASE'
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Event listeners para los botones de selección de juego
    pptBtn.addEventListener('click', showPPTGame);
    hangmanBtn.addEventListener('click', showHangmanGame);
    
    // Event listeners para los botones de volver
    pptBack.addEventListener('click', showMainMenu);
    hangmanBack.addEventListener('click', showMainMenu);
    
    // Event listeners para los botones de reinicio
    pptReset.addEventListener('click', resetPPTGame);
    hangmanReset.addEventListener('click', resetHangmanGame);
    
    // Event listeners para las opciones de Piedra, Papel, Tijera
    const choices = document.querySelectorAll('.choice');
    choices.forEach(choice => {
        choice.addEventListener('click', playPPT);
    });
    
    // Inicializar el juego del ahorcado
    initHangman();
});

// Mostrar el juego de Piedra, Papel, Tijera
function showPPTGame() {
    pptCard.style.display = 'none';
    hangmanCard.style.display = 'none';
    pptGame.style.display = 'block';
}

// Mostrar el juego del Ahorcado
function showHangmanGame() {
    pptCard.style.display = 'none';
    hangmanCard.style.display = 'none';
    hangmanGame.style.display = 'block';
}

// Volver al menú principal
function showMainMenu() {
    pptCard.style.display = 'block';
    hangmanCard.style.display = 'block';
    pptGame.style.display = 'none';
    hangmanGame.style.display = 'none';
}

// Jugar Piedra, Papel, Tijera
function playPPT(event) {
    const playerChoice = event.currentTarget.getAttribute('data-choice');
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * 3)];
    
    let result = '';
    
    if (playerChoice === computerChoice) {
        result = '¡Empate!';
    } else if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        result = '¡Ganaste!';
        playerScore++;
    } else {
        result = '¡Perdiste!';
        computerScore++;
    }
    
    pptResult.textContent = `Elegiste ${getChoiceName(playerChoice)}, la computadora eligió ${getChoiceName(computerChoice)}. ${result}`;
    playerScoreElem.textContent = playerScore;
    computerScoreElem.textContent = computerScore;
}

// Obtener nombre de la opción seleccionada
function getChoiceName(choice) {
    switch(choice) {
        case 'rock': return 'Piedra';
        case 'paper': return 'Papel';
        case 'scissors': return 'Tijera';
        default: return '';
    }
}

// Reiniciar el juego de Piedra, Papel, Tijera
function resetPPTGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreElem.textContent = '0';
    computerScoreElem.textContent = '0';
    pptResult.textContent = '';
}

// Inicializar el juego del Ahorcado
function initHangman() {
    // Crear teclado
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    keyboard.innerHTML = '';
    
    for (let i = 0; i < letters.length; i++) {
        const letter = document.createElement('div');
        letter.className = 'letter';
        letter.textContent = letters[i];
        letter.addEventListener('click', guessLetter);
        keyboard.appendChild(letter);
    }
    
    resetHangmanGame();
}

// Reiniciar el juego del Ahorcado
function resetHangmanGame() {
    // Seleccionar palabra aleatoria
    hangmanWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongGuesses = 0;
    
    // Actualizar interfaz
    updateWordDisplay();
    updateHangmanDrawing();
    hangmanMessage.textContent = '';
    
    // Habilitar todas las letras
    const letterElements = document.querySelectorAll('.letter');
    letterElements.forEach(letter => {
        letter.classList.remove('used', 'correct', 'incorrect');
    });
}

// Actualizar la visualización de la palabra
function updateWordDisplay() {
    let display = '';
    for (let i = 0; i < hangmanWord.length; i++) {
        if (guessedLetters.includes(hangmanWord[i])) {
            display += hangmanWord[i] + ' ';
        } else {
            display += '_ ';
        }
    }
    wordDisplay.textContent = display.trim();
    
    // Verificar si el jugador ganó
    if (!display.includes('_')) {
        hangmanMessage.textContent = '¡Felicidades! ¡Ganaste!';
        disableKeyboard();
    }
}

// Actualizar el dibujo del ahorcado
function updateHangmanDrawing() {
    const hangmanParts = [
        '   ____',
        '  |    |',
        '  |    ' + (wrongGuesses > 0 ? 'O' : ''),
        '  |   ' + (wrongGuesses > 2 ? '/|\\' : wrongGuesses > 1 ? '/|' : wrongGuesses > 0 ? '/' : ''),
        '  |    ' + (wrongGuesses > 4 ? '|' : ''),
        '  |   ' + (wrongGuesses > 5 ? '/ \\' : wrongGuesses > 4 ? '/' : ''),
        '__|__'
    ];
    
    hangmanDrawing.innerHTML = hangmanParts.join('<br>');
    
    // Verificar si el jugador perdió
    if (wrongGuesses >= maxWrongGuesses) {
        hangmanMessage.textContent = `¡Perdiste! La palabra era: ${hangmanWord}`;
        disableKeyboard();
    }
}

// Adivinar una letra
function guessLetter(event) {
    const letter = event.currentTarget.textContent;
    
    // Marcar la letra como usada
    event.currentTarget.classList.add('used');
    
    if (hangmanWord.includes(letter)) {
        // Letra correcta
        event.currentTarget.classList.add('correct');
        guessedLetters.push(letter);
        updateWordDisplay();
    } else {
        // Letra incorrecta
        event.currentTarget.classList.add('incorrect');
        wrongGuesses++;
        updateHangmanDrawing();
    }
}

// Deshabilitar el teclado
function disableKeyboard() {
    const letterElements = document.querySelectorAll('.letter');
    letterElements.forEach(letter => {
        letter.removeEventListener('click', guessLetter);
    });
}