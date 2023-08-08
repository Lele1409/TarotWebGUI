// Suits and values for the cards
const suits = ['♠', '♥', '♣', '♦']
const cardRanks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'C', 'Q', 'K']

// Allows during the creation of the cards to determine the placement of each symbol
// 
const symbolPositions = [
    ['center'],
    ['top-center', 'bottom-center'],
    ['top-center', 'center', 'bottom-center'],
    ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
    ['top-left', 'top-right', 'center-left', 'center-right', 'bottom-left', 'bottom-right'],
    ['top-left', 'top-right', 'center-top', 'center-left', 'center-right', 'bottom-left', 'bottom-right'],
    ['top-left', 'top-right', 'center-top', 'center-bottom', 'center-left', 'center-right', 'bottom-left', 'bottom-right'],
    ['top-left', 'top-right', 'center-top-left', 'center-top-right', 'center', 'center-bottom-left', 'center-bottom-right', 'bottom-left', 'bottom-right'],
    ['top-left', 'top-right', 'center-top-left', 'center-top-right', 'center-top', 'center-bottom', 'center-bottom-left', 'center-bottom-right', 'bottom-left', 'bottom-right']
    
]

function createCard(suit, rank) {
    let cardWrapper = document.createElement('card-wrapper')
    let card = document.createElement('card')
    
    card.setAttribute('suit', suit)
    card.setAttribute('rank', rank)

    for (let i = 0; i <= 1; i++) {
        let cardHalf = document.createElement('card-half')

        cardHalf.className = `half-${i}`
        cardHalf.innerHTML = `<span class="card-value">${rank}</span>`

        if (suit === 'T') {
            cardHalf.style.backgroundImage = "url('https://placehold.jp/150x150.png')"
        } else if (cardRanks.slice(10, 14).includes(rank)) {
            cardHalf.style.backgroundImage = "url('https://placehold.jp/150x150.png')"
        }

        card.appendChild(cardHalf)
    }

    if (!(suit === 'T') && !(cardRanks.slice(10, 14).includes(rank))) {
        for (let i = 0; i < rank; i++) {
            let suitSymbol = document.createElement('suit-symbol')
            suitSymbol.setAttribute('suit', suit)
            suitSymbol.classList.add(symbolPositions[rank - 1][i])
            let suitName = {"♠": "spades", "♥": "hearts", "♣":"clubs", "♦":"diamonds"}
            let SVGElement = document.querySelector(`#svg-${suitName[suit]}`).cloneNode(true)
            SVGElement.removeAttribute('id')
            suitSymbol.appendChild(SVGElement)
            card.appendChild(suitSymbol)
        }
    }

    cardWrapper.appendChild(card)

    return cardWrapper
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
