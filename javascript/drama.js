if (window.innerWidth > 768) {
    const dramaLetters = "01";
    const aboutSection = document.querySelector('.drama-js-background');
    let moveCounter = 0;
    const movesToUpdate = 3; // Change text every 2 mouse moves, adjust as needed

    function randomChar() {
        return dramaLetters[Math.floor(Math.random() * dramaLetters.length)];
    }

    function randomString(elementWidth, elementHeight, fontSize, lineHeight) {
        let string = "";
        const charWidth = fontSize * 0.6;
        const charsPerLine = Math.floor(elementWidth / charWidth);
        const lines = Math.ceil(elementHeight / lineHeight);
        const targetLength = charsPerLine * lines;

        for (let i = 0; i < targetLength; i++) {
            string += randomChar();
        }
        return string;
    }

    document.onmousemove = e => {
        moveCounter++;
        if (moveCounter >= movesToUpdate) {
            const rect = aboutSection.getBoundingClientRect();
            aboutSection.innerText = randomString(rect.width, rect.height, 10, 14);
            moveCounter = 0;
        }
    };
}