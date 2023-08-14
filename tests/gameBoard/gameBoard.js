async function createOtherPlayersHands(playerCount) {
    const nOtherPlayers = playerCount - 1
    const otherPlayersHands = document.querySelector('other-players-hands-wrapper')

    const otherPlayersHandsPositions = {
        3: [[20, 25, 75], [20, 75, 25]],
        4: [[45, 15, 85], [20, 25, 75], [45, 85, 15]],
        5: [[45, 15, 85], [20, 25, 75], [20, 75, 25], [45, 85, 15]]
    }

    const otherPlayersHandsPosition = otherPlayersHandsPositions[nOtherPlayers + 1]

    for (i = 0; i < nOtherPlayers; i++) {
        let otherPlayerHand = document.createElement('other-player-hand')

        otherPlayerHand.style.top = `${otherPlayersHandsPosition[i][0]}dvh`
        otherPlayerHand.style.left = `${otherPlayersHandsPosition[i][1]}dvw`
        otherPlayerHand.style.right = `${otherPlayersHandsPosition[i][2]}dvw`

        let profilePicture = document.createElement('other-player-profile-picture')
        profilePicture.style.setProperty('--profile-picture', "url('https://placehold.jp/3d4070/ffffff/150x150.png')")  // TODO: replace with getUserProfilePicture()

        let userNameDisplay = document.createElement('other-player-username')
        let username = 'example user 123'  // TODO: replace with getUsername()
        userNameDisplay.setAttribute('username', username)
        
        let angleStep = 11
        let angle = username.length/2 * -(angleStep) + angleStep/2
        for (letter of username) {
            userNameDisplay.innerHTML += `<span style="transform: rotate(${angle}deg) scaleX(-1);">${letter}</span>`
            angle += angleStep
        }

        profilePicture.appendChild(userNameDisplay)
        otherPlayerHand.appendChild(profilePicture)
        otherPlayersHands.appendChild(otherPlayerHand)
    }
}
let ownHandObserver = undefined
async function createOwnHand() {
    ownHandObserver = new MutationObserver(onOwnHandMutation)
    
    ownHandObserver.observe( document.querySelector('own-hand'), {
        childList: true,
        subtree: true
    })
}


async function onOwnHandMutation(mutations) {
    const upperRow = document.querySelector('own-hand-upper-row')
    const lowerRow = document.querySelector('own-hand-lower-row')

    console.log(upperRow, lowerRow)

    let upperNodes = Array.from(upperRow.children)
    let lowerNodes = Array.from(lowerRow.children)

    if (upperNodes.length > 0 && (upperNodes.length > lowerNodes.length || (0 < upperNodes && upperNodes <= 3))) {
        console.log("runter")
        lowerRow.insertBefore(upperRow.lastElementChild, lowerRow.firstElementChild)
    } else if (upperNodes.length > 3 && lowerNodes.length + 2 > upperNodes.length) {
        console.log("normal hcoho")
        upperRow.appendChild(lowerRow.firstElementChild)
    } else if (upperNodes.length <= 3 && lowerNodes.length > 9) {
        console.log("hoch")
        ownHandObserver.disconnect()
        for (i = 0; i < 3; i++) {
            upperRow.appendChild(lowerRow.firstElementChild)
        }
        ownHandObserver.observe( document.querySelector('own-hand'), {
            childList: true,
            subtree: true
        })

        upperRow.appendChild(lowerRow.firstChild)
    }
    
}

async function run() {
    await createOtherPlayersHands(Math.floor(Math.random() * (5 - 3 + 1)) + 3)  // TODO: replace with getPlayerCount
    await createOwnHand()
    await createDeck("card-stack")
    await createDeck("card-stack")
    await createDeck("card-stack")

    // DEBUG:

    n = 0
    //setInterval(() => {document.querySelector("card-stack > tarot-card").style.transform = `translateX(-50%) rotate(${n++}deg)`}, 1)
}

run()
