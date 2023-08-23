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
