// Variables
const suits = ['♠', '♥', '♣', '♦']
const suitName = {"♠": "spades", "♥": "hearts", "♣":"clubs", "♦":"diamonds"}
const cardRanks = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'C', 'Q', 'K']
const suitSVGs = {}
let spritesheetOffset = 0
let nCardsCreated = 0

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
    let card = document.createElement('tarot-card')

    card.setAttribute('suit', suit)
    card.setAttribute('rank', rank)
    card.setAttribute('card', `${suit}${rank}`)
    card.setAttribute('isFlipped', 'false')
    card.id = `tarot-card-${nCardsCreated++}`

    // Initialize relative position to parent to 0%, so the next change gets animated and the card does not get teleported
    card.style.top = '0%'
    card.style.left = '0%'


    let cardFront = document.createElement('tarot-card-front')
    let cardOuterBorder = document.createElement('tarot-card-outer-border')
    let cardContainer = document.createElement('tarot-card-container')

    for (let i = 0; i <= 1; i++) {
        let cardHalf = document.createElement('tarot-card-half')

        cardHalf.innerHTML = `<span class="card-value">${rank}</span>`
        
        // Set which half this part represents
        if (i === 0) {  // On the upper half
            cardHalf.classList.add("upper-half")
        } else if (i === 1) {  // On the lower half
            cardHalf.classList.add("lower-half")
        }

        // Set the class defining the image
        if (suit === 'T' || cardRanks.slice(10, 14).includes(rank)) {  // Only for cards that have a background image
            cardHalf.style.backgroundImage = "url('./cards/ressources/spritesheet.webp')"
            cardHalf.style.backgroundPositionX = `${spritesheetOffset++*100/58}%`
        }

        // Since we use the same graphic for the top and bottom of the excuse and face cards, set the counter back when on the top half of one of those cards
        if ((rank==="EX" || cardRanks.slice(10, 14).includes(rank)) && i === 0) {
            spritesheetOffset--
        }

        cardContainer.appendChild(cardHalf)
    }

    let cardSuitSymbolsContainer = document.createElement('tarot-card-suit-symbols-container')

    if (!(suit === 'T') && !(cardRanks.slice(10, 14).includes(rank))) {
        for (let i = 0; i < rank; i++) {
            let cardSuitSymbol = document.createElement('tarot-card-suit-symbol')
            cardSuitSymbol.classList.add(symbolPositions[rank - 1][i])
            cardSuitSymbol.innerHTML = suitSVGs[suitName[suit]]
            cardSuitSymbolsContainer.appendChild(cardSuitSymbol)
        }
    }

    cardContainer.appendChild(cardSuitSymbolsContainer)

    cardOuterBorder.appendChild(cardContainer)
    cardFront.appendChild(cardOuterBorder)
    card.appendChild(cardFront)

    // Create the element for the back of the card
    let cardBack = document.createElement('tarot-card-back')
    cardOuterBorder = document.createElement('tarot-card-outer-border')
    cardContainer = document.createElement('tarot-card-container')

    cardContainer.style.backgroundImage = "url('./cards/ressources/tarot-card-back.png')"

    cardOuterBorder.append(cardContainer)
    cardBack.appendChild(cardOuterBorder)
    card.appendChild(cardBack)

    return card
}

async function fetchSVGs() {
    // Get .svg ressources to use in the creation of the cards
    const response = await fetch(`./cards/ressources/svg-suits.html`)
    const data = await (await response.text()).toString()
    for (const suit of Object.values(suitName)) {
        suitSVGs[suit] = data.split('\n')[Object.values(suitName).indexOf(suit)]
    }
}


// ***************************
// ********** "API" **********
// ***************************
async function createDeck(deckElementSelectorString) {
    await fetchSVGs();

    // Reset offset when creating a deck after already having created another one
    spritesheetOffset = 0

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

    const deckElement = document.querySelector(deckElementSelectorString)
    deckElement.style.visibility = 'hidden'
    for (card of deck) {
        deckElement.appendChild(card)
        await new Promise(resolve => setTimeout(resolve, 10))
    }
    deckElement.style.visibility = 'visible'
}

async function setCardFlippedState(cards, isFlipped, interval=500, reversed=false) {
    // Select the cards
    if (typeof(cards) === 'string') {
        cards = Array.from(document.querySelectorAll(cards))
    } else {
        cards = Array.from([cards].flat())
    }

    // Reverse flipping order if reversed is true
    if (reversed) {cards.reverse()}

    // Flip cards one by one
    for (card of cards) {
        await new Promise(resolve => setTimeout(resolve, interval))
        card.setAttribute("isFlipped", isFlipped)
    }
}