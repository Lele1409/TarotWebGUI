// Variables
const suits = ['♠', '♥', '♣', '♦']
const suitName = {"♠": "spades", "♥": "hearts", "♣":"clubs", "♦":"diamonds"}
const cardRanks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'C', 'Q', 'K']
const suitSVGs = {}
let spritesheetOffset = 0

// Allows during the creation of the cards to determine the placement of each symbol
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

        cardHalf.innerHTML = `<span class="card-value">${rank}</span>`
        
        // Set which half this part represents
        if (i === 0) {  // On the upper half
            cardHalf.classList.add("upper-half")
        } else if (i === 1) {  // On the lower half
            cardHalf.classList.add("lower-half")
        }

        // Set the class defining the image
        if (suit === 'T' || cardRanks.slice(10, 14).includes(rank)) {  // Only for cards that have a background image
            cardHalf.style.backgroundImage = "url('./ressources/spritesheet.webp')"
            cardHalf.style.backgroundPositionX = `${spritesheetOffset++*100/58}%`
        }

        // Since we use the same graphic for the top and bottom of the excuse and face cards, set the counter back when on the top half of one of those cards
        if ((rank==="EX" || cardRanks.slice(10, 14).includes(rank)) && i === 0) {
            spritesheetOffset--
        }

        card.appendChild(cardHalf)
    }

    if (!(suit === 'T') && !(cardRanks.slice(10, 14).includes(rank))) {
        for (let i = 0; i < rank; i++) {
            let suitSymbol = document.createElement('suit-symbol')
            suitSymbol.setAttribute('suit', suit)
            suitSymbol.classList.add(symbolPositions[rank - 1][i])
            suitSymbol.innerHTML = suitSVGs[suitName[suit]]
            card.appendChild(suitSymbol)
        }
    }

    cardWrapper.appendChild(card)

    return cardWrapper
}

async function fetchSVGs() {
    // Get .svg ressources to use in the creation of the cards
    const response = await fetch(`./ressources/svg-suits.html`)
    const data = await response.text()
    for (const suit of Object.values(suitName)) {
        suitSVGs[suit] = data
    }
}

async function createDeck(deckElementSelector) {
    await fetchSVGs();

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

    const deckElement = document.querySelector(deckElementSelector)
    deck.forEach(card => {deckElement.appendChild(card)})
}

createDeck('.deck')