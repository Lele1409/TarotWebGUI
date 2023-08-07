// Suits and values for the cards
const suits = ['♤', '♡', '♧', '♢']
const cardRanks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'C', 'Q', 'K']


function createCard(suit, rank) {
    let card = document.createElement('card')
    
    card.setAttribute('suit', suit)
    card.setAttribute('rank', rank)

    for (i = 0; i <= 1; i++) {
        let cardHalf = document.createElement('card-half')

        cardHalf.className = `half-${i}`
        cardHalf.innerHTML = rank

        if (suit === 'T') {
            cardHalf.style.backgroundImage = "url('https://placehold.jp/150x150.png')"
        }

        card.appendChild(cardHalf)
    }

    return card
}

// Create the cards
// First trumps
const deck = []
for (let i = 1; i <= 21; i++) {
    deck.push(createCard('T', i))
}
// Add the excuse
deck.push(createCard('T', 'EX'))

// Add all the cards from the other suits
suits.forEach(suit => {
    cardRanks.forEach(rank => {
        deck.push(createCard(suit, rank))
    })
})

const deckElement = document.querySelector('.deck')
deck.forEach(card => {deckElement.appendChild(card)})
