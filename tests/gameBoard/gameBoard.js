async function createOtherPlayersHands(playerCount) {
    // The amount of other players to create is the playerCount - 1 since the player playing has a different hand: his own
    const nOtherPlayers = playerCount - 1
    // The element containing all the other players
    const otherPlayersHands = document.querySelector('other-players-hands-wrapper')

    // The positions on screen of the other players depending on the count of player
    const otherPlayersHandsPositions = {
        3: [[20, 25, 75], [20, 75, 25]],
        4: [[45, 15, 85], [20, 25, 75], [45, 85, 15]],
        5: [[45, 15, 85], [20, 25, 75], [20, 75, 25], [45, 85, 15]]
    }

    // The same positions as before, but only those important for this game with this amount of players
    const otherPlayersHandsPosition = otherPlayersHandsPositions[nOtherPlayers + 1]

    // For every other player (playerCount - 1)
    for (i = 0; i < nOtherPlayers; i++) {
        // Create the other player
        let otherPlayerHand = document.createElement('other-player-hand')

        // Place on the predefined position
        otherPlayerHand.style.top = `${otherPlayersHandsPosition[i][0]}dvh`
        otherPlayerHand.style.left = `${otherPlayersHandsPosition[i][1]}dvw`
        otherPlayerHand.style.right = `${otherPlayersHandsPosition[i][2]}dvw`

        // Add a profile picture to the other player
        let profilePicture = document.createElement('other-player-profile-picture')
        profilePicture.style.setProperty('--profile-picture', "url('https://placehold.jp/3d4070/ffffff/150x150.png')")  // TODO: replace with getUserProfilePicture()

        // Place the username of the other player around his profile picture
        let userNameDisplay = document.createElement('other-player-username')
        let username = 'example user 123'  // TODO: replace with getUsername()
        userNameDisplay.setAttribute('username', username)
        
        // Place the letters spaced by a certain angle
        let angleStep = 11
        let angle = username.length/2 * -(angleStep) + angleStep/2
        for (letter of username) {
            userNameDisplay.innerHTML += `<span style="transform: rotate(${angle}deg) scaleX(-1);">${letter}</span>`
            angle += angleStep
        }

        // Place all elements on the DOM
        profilePicture.appendChild(userNameDisplay)
        otherPlayerHand.appendChild(profilePicture)
        otherPlayersHands.appendChild(otherPlayerHand)
    }
}

// Create MutationObserver
const ownHandObserver = new MutationObserver(onOwnHandMutation)
async function ownHandObserverConnect() {
    // The mutation observer observes all DOM changes to child elements in the own-hand
    ownHandObserver.observe( document.querySelector('own-hand'), {
        childList: true,
        subtree: true
    })
}
// Initialize the MutationObserver
ownHandObserverConnect()

// When a change in one of the own-hand child elements is detected
async function onOwnHandMutation(mutations) {
    // Get the rows in the hand
    const upperRow = document.querySelector('own-hand-upper-row')
    const lowerRow = document.querySelector('own-hand-lower-row')

    // Get the amount of children in each row
    let upperNodes = Array.from(upperRow.children).length
    let lowerNodes = Array.from(lowerRow.children).length

    // Change the position of cards if necessary
    if (upperNodes > 0 && (upperNodes > lowerNodes || (0 < upperNodes && upperNodes <= 3))) {
        // Move last card ofthe upper row to the first position of the lower row
        lowerRow.insertBefore(upperRow.lastElementChild, lowerRow.firstElementChild)
    } else if (upperNodes > 3 && lowerNodes - 1 > upperNodes) {
        // Move the first card from the lower row to the last position of the upper row
        upperRow.appendChild(lowerRow.firstElementChild)
    } else if (upperNodes <= 3 && lowerNodes > 8) {
        // Dont detect changes
        ownHandObserver.disconnect()
        // Move the first four cards from the lower row to the last position of the upper row
        for (i = 0; i < 4; i++) {
            upperRow.appendChild(lowerRow.firstElementChild)
        }
        // Reenable change detection
        await ownHandObserverConnect()
    }
}

async function run() {
    await createOtherPlayersHands(Math.floor(Math.random() * (5 - 3 + 1)) + 3)  // TODO: replace with getPlayerCount
    await createDeck("card-stack")
    await createDeck("card-stack")
    await createDeck("card-stack")

    // DEBUG:

    n = 0
    //setInterval(() => {document.querySelector("card-stack > tarot-card").style.transform = `translateX(-50%) rotate(${n++}deg)`}, 1)
}

run()
