async function createOtherPlayersHands(playerCount) {
    const nOtherPlayers = playerCount - 1
    const otherPlayersHands = document.querySelector('other-players-hands-wrapper')

    const otherPlayersHandsPositions = {
        3: [[10, 35, 65], [10, 65, 35]],
        4: [[30, 20, 80], [10, 40, 60], [30, 80, 20]],
        5: [[30, 20, 80], [10, 35, 65], [10, 65, 35], [30, 80, 20]]
    }

    const otherPlayersHandsPosition = otherPlayersHandsPositions[nOtherPlayers + 1]

    for (i = 0; i < nOtherPlayers; i++) {
        let otherPlayerHand = document.createElement('other-player-hand')

        otherPlayerHand.style.top = `${otherPlayersHandsPosition[i][0]}%`
        otherPlayerHand.style.left = `${otherPlayersHandsPosition[i][1]}%`
        otherPlayerHand.style.right = `${otherPlayersHandsPosition[i][2]}%`

        otherPlayersHands.appendChild(otherPlayerHand)
    }
}

async function createOwnHand() {
    
}
// UFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF top and bottom
async function addCardToOwnHand(cardSelector) {
    let ownHand = document.querySelector(own-hand)
    await setCardPosition(cardSelector, )
}

async function run() {
    await createOtherPlayersHands(Math.floor(Math.random() * (5 - 3 + 1)) + 3)  // TODO: replace with getPlayerCount
    await createOwnHand()
    await createDeck("card-stack")

    await createDeck('own-hand-upper-row')
    await createDeck('own-hand-lower-row')

    n = 0
    setInterval(() => {document.querySelector("card-stack > tarot-card").style.transform = `rotate(${n++}deg)`}, 1)
}

run()
