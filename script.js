// DOM Elements
const gameBoard = document.getElementById('game-board');
const matchesDisplay = document.getElementById('matches');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let isChecking = false;

document.addEventListener('DOMContentLoaded', initializeGame);
resetButton.addEventListener('click', initializeGame);

// Function to initialize the game
function initializeGame() {
    gameBoard.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    isChecking = false;
    messageElement.classList.add('hidden');
    matchesDisplay.textContent = '0';
    
    // Create card data
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    cards = [];
    
    // Create pairs of cards
    for (let letter of letters) {
        cards.push(
            { id: Math.random(), letter: letter, isFlipped: false, isMatched: false },
            { id: Math.random(), letter: letter, isFlipped: false, isMatched: false }
        );
    }
    
    // Shuffle the cards
    cards.sort(() => Math.random() - 0.5);
    
    // Create card elements and add them to the game board
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;
        cardElement.textContent = card.letter;
        
        // Add click event listener to each card
        cardElement.addEventListener('click', () => handleCardClick(card.id));
        gameBoard.appendChild(cardElement);
    });
}

// Function to handle card clicks
function handleCardClick(cardId) {
    const cardIndex = cards.findIndex(card => card.id === cardId);
    const card = cards[cardIndex];
    
    if (isChecking || flippedCards.length >= 2 || card.isFlipped || card.isMatched) {
        return;
    }
    
    // Flip the card
    card.isFlipped = true;
    updateCardDisplay(cardId);
    
    // Add to flipped cards
    flippedCards.push(cardId);
    
    // Check for matches when two cards are flipped
    if (flippedCards.length === 2) {
        checkForMatch();
    }
}

//update the display of a card
function updateCardDisplay(cardId) {
    const cardElement = document.querySelector(`.card[data-id="${cardId}"]`);
    const card = cards.find(card => card.id === cardId);
    
    if (card.isMatched) {
        cardElement.classList.add('matched');
        cardElement.classList.add('flipped');
    } else if (card.isFlipped) {
        cardElement.classList.add('flipped');
    } else {
        cardElement.classList.remove('flipped');
    }
}

//check if the two flipped cards match
function checkForMatch() {
    isChecking = true;
    
    const [firstCardId, secondCardId] = flippedCards;
    const firstCard = cards.find(card => card.id === firstCardId);
    const secondCard = cards.find(card => card.id === secondCardId);
    
    if (firstCard.letter === secondCard.letter) {
        // Match found
        firstCard.isMatched = true;
        secondCard.isMatched = true;
        
        updateCardDisplay(firstCardId);
        updateCardDisplay(secondCardId);
        
        matchedPairs++;
        matchesDisplay.textContent = matchedPairs;
        
        // Check if game is complete
        if (matchedPairs === 8) {
            messageElement.classList.remove('hidden');
        }
        
        // Reset for next turn
        flippedCards = [];
        isChecking = false;
    } else {
        // No match - flip cards back after delay
        setTimeout(() => {
            firstCard.isFlipped = false;
            secondCard.isFlipped = false;
            
            updateCardDisplay(firstCardId);
            updateCardDisplay(secondCardId);
            
            flippedCards = [];
            isChecking = false;
        }, 1000);
    }
}