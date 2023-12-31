const tarotTable = document.querySelector("tarot-table")

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
        otherPlayerHand.id = `debugHand-${i}`  // TODO: remove

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

        // Add two pins showing if the player is the taker or a called player
        let takerPin = document.createElement('other-player-pin-taker')
        takerPin.classList.add('other-player-pin')
        takerPin.style.display = 'none'
        takerPin.innerHTML = '<abbr title="Taking player">T</abbr>'

        let calledPin = document.createElement('other-player-pin-called')
        calledPin.classList.add('other-player-pin')
        calledPin.style.display = 'none'
        calledPin.innerHTML = '<abbr title="Called player">C</abbr>'

        let chelemPin = document.createElement('other-player-pin-chelem')
        chelemPin.classList.add('other-player-pin')
        chelemPin.style.display = 'none'
        chelemPin.innerHTML = '<abbr title="Chelem">Ch</abbr>'

        // Place all elements on the DOM
        profilePicture.appendChild(takerPin)
        profilePicture.appendChild(calledPin)
        profilePicture.appendChild(chelemPin)
        profilePicture.appendChild(userNameDisplay)
        otherPlayerHand.appendChild(profilePicture)
        otherPlayersHands.appendChild(otherPlayerHand)
    }
}

// Create MutationObserver
const ownHandObserver = new MutationObserver(onOwnHandMutation)
async function ownHandObserverConnect() {
    // The mutation observer observes all DOM changes to child elements in the own-hand
    ownHandObserver.observe(document.querySelector('own-hand'), {
        childList: true,
        subtree: true
    })
}
// Initialize the MutationObserver
ownHandObserverConnect()

// When a change in one of the own-hand child elements is detected
async function onOwnHandMutation(mutations) {  // TODO: implement some sort of sorting
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
        for (i = 0; i < 3; i++) {
            upperRow.appendChild(lowerRow.firstElementChild)
        }
        // Reenable change detection
        await ownHandObserverConnect()

        // To check if any other changes will have to be made, add last element while the change is detectable
        upperRow.appendChild(lowerRow.firstElementChild)
    }
}

const initialDeckObserver = new MutationObserver(onInitialDeckMutation)
initialDeckObserver.observe(document.querySelector('init-deck'), {
    childList: true,
    subtree: true
})

async function onInitialDeckMutation(mutations) {
    for (mutation of mutations) {
        mutation.addedNodes.forEach(async function(node) {await setCardsFlippedState([node], true, 0)})
    }
}

async function activateToggleButtons() {
    const toggleButtons = document.querySelectorAll("button[toggle]")
    for (button of toggleButtons) {
        button.addEventListener("mouseup", (event) => {
            if (button.getAttribute("toggle") === "unpressed") {
                button.setAttribute("toggle", "pressed")
            } else if (button.getAttribute("toggle") === "pressed") {
                button.setAttribute("toggle", "unpressed")
            }
        })
    }
}

async function disableButtons(buttons) {
    for (button of buttons) {
        button.disabled = true
    }
}

async function enableButtons(buttons) {
    for (button of buttons) {
        button.disabled = false
    }
}

async function run() {
    const invalidOverlayCloseButton = document.querySelector('invalid-screen-overlay > button')
    invalidOverlayCloseButton.addEventListener('click', () => {
        invalidOverlayCloseButton.parentElement.style.display = "none"
    })

    await createOtherPlayersHands(Math.floor(Math.random() * (5 - 3 + 1)) + 3)  // TODO: replace with getPlayerCount
    await createDeck("init-deck")
    //for (i = 0; i < 78; i++) {
    
    // DEBUG:
    //await moveCards(document.querySelectorAll(`#tarot-card-${i}`), 80, 50, true, NaN, document.querySelector("own-hand-lower-row"))}

}


// ***************************
// ********** "API" **********
// ***************************
async function moveCards(cards, destTopPercent, destLeftPercent, sync=false, interval=0, finalAppend=undefined) {
    for (card of cards) {
        // Get the current position of the cards
        let currentTop = (card.getBoundingClientRect().top - tarotTable.getBoundingClientRect().top) / tarotTable.getBoundingClientRect().bottom * 100
        let currentLeft = (card.getBoundingClientRect().left - tarotTable.getBoundingClientRect().left) / tarotTable.getBoundingClientRect().right * 100

        // Place the cards on the tarot-table, so they can freely move on it
        tarotTable.appendChild(card)

        // Set the position 
        card.style.top = `${currentTop}%`
        card.style.left = `${currentLeft}%`

        // Delay for transition to happen (otherwise teleport)
        await new Promise(resolve => setTimeout(resolve, 10))

        // Move the card to the specified location
        card.style.top = `${destTopPercent}%`
        card.style.left = `${destLeftPercent}%`

        // Append the card to any other element specified
        if (typeof(finalAppend) === 'object' ) {
            // Wait for transition end before appending
            endMove(card, finalAppend)
        }        
        
        if (!(sync)) {
            // Wait in between moving cards
            await new Promise(resolve => setTimeout(resolve, interval))
        }
    }
}

// Synchronous function as to not block the execution of moveCards for the other cards
function endMove(card, finalAppend) {
    setTimeout(() => {
        finalAppend.appendChild(card)
    },
        // Time based on the transition-duration in ms
        window.getComputedStyle(card).getPropertyValue("transition-duration").slice(0,-1)*1000
    )
}

async function showPin(playerID, pin) {
    document.querySelector(`${playerID} other-player-pin-${pin}`).style.display = 'block'
}

async function hidePin(playerID, pin) {
    document.querySelector(`${playerID} other-player-pin-${pin}`).style.display = 'none'
}

// Specific card movements
async function dealCards(cards, playerID) {  // From init-deck to player
    const player = document.querySelector(`#${playerID}`)
    const currentPlayerTop = (player.getBoundingClientRect().top - tarotTable.getBoundingClientRect().top) / tarotTable.getBoundingClientRect().bottom * 100
    const currentPlayerLeft = (player.getBoundingClientRect().left - tarotTable.getBoundingClientRect().left) / tarotTable.getBoundingClientRect().right * 100
    for (card of cards) {
        await moveCards([card], currentPlayerTop, currentPlayerLeft, false, 10, player)
        
        if (!(playerID === "own-hand-lower-row")) {
            card.style.visibility = "hidden"
        } else if (playerID === "own-hand-lower-row") {
            await setCardsFlippedState([card], false, 0)
        }
    }
}

async function playCard(playerID, card) {  // From player to middle, location depending on playerCount
    const player = document.querySelector(`#${playerID}`)

    const currentTrick = document.querySelector("current-trick")
    const currentTrickTop = (currentTrick.getBoundingClientRect().top - tarotTable.getBoundingClientRect().top) / tarotTable.getBoundingClientRect().bottom * 100
    const currentTrickRight = (currentTrick.getBoundingClientRect().right - tarotTable.getBoundingClientRect().right) / tarotTable.getBoundingClientRect().right * -100

    // Move to the player playing
    card.style.visibility = "hidden"
    await player.appendChild(card)
    card.style.visibility = "visible"
    // Move towards the middle
    await moveCards([card], currentTrickTop, currentTrickRight, false, 0, currentTrick)
}

async function putAwayTrick() {  // Cards in the current-hand up through the top of the scree
    for (card of document.querySelectorAll("current-trick > tarot-card")) {
        console.log(card)
        const cardPosLeft = (card.getBoundingClientRect().left - tarotTable.getBoundingClientRect().left) / tarotTable.getBoundingClientRect().right * 100
        await moveCards([card], -20, cardPosLeft, false, 50, undefined)
    }
}

async function sortOwnHandByCardName(order) {
    // Parameter order is a list of the name of the cards, order starting at the top left card and ending
    // at the lower right card
    moveCards(document.querySelectorAll("own-hand tarot-card"), 80, 80, true)
    let cards = []
    for (card of order) {
        cards.push(document.querySelector(`tarot-card[card=${card}]`))
    }
    dealCards(cards, "own-hand-lower-row")
}

async function displayMultipleChoice(choices) {
    // Choices should be an object like so:
    // Every element can be an empty list, <designates defaultValue>
    // [
    //     [
    //         (text:) <"i"> ? "string",
    //         (toggle:) <"none"> ? "pressed" ? "unpressed",
    //         (disable:) <false> ? true
    //     ],
    //     [
    //         ...
    //     ]
    // ]

    const oldElems = document.querySelectorAll("multiple-choice-container")
    for (elem of oldElems) {
        elem.remove()
    }

    const multipleChoiceElem = document.createElement("multiple-choice-container")

    let i = 0
    for (choice of choices) {
        const button = document.createElement("button")

        if (choice[0] === undefined) {
            button.innerHTML = "null"
        } else {
            button.innerHTML = choice[0]
        }

        if (!(choice[1] === undefined)) {
            button.setAttribute("toggle", choice[1])
        }

        if (!(choice[2] === undefined) && choice[2]) {
            button.setAttribute("disabled", '')
        }

        multipleChoiceElem.appendChild(button)
        i++
    }

    await activateToggleButtons

    tarotTable.appendChild(multipleChoiceElem)
}

run()
