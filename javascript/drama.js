if (window.innerWidth > 768) {
    // const dramaLetters = "01";
    const dramaNumbers = "01";
    // const dramaCrudeNumbers = "01̵͒͂1̷̳̱̙̀01̶̠̂͊̈́0̴͂͘̚";
    const dramaLetters = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    // const dramaLetters = "OIlo";
    const aboutSection = document.querySelector('.drama-js-background');
    let moveCounter = 0;
    const movesToUpdate = 3; // Change text every X mouse moves, adjust as needed

    function randomChar() {
        const char = dramaLetters[Math.floor(Math.random() * dramaLetters.length)];
        const num = dramaNumbers[Math.floor(Math.random() * dramaNumbers.length)];
        // const crude = dramaCrudeNumbers[Math.floor(Math.random() * dramaCrudeNumbers.length)];

        const randomMath = Math.random();

        // Randomly decide whether to style this character differently
        if (randomMath < 0.0001) { // 1% chance for each character
            // const color = Math.random() < 0.5 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)';
            const color = 'rgba(255, 255, 255, 0.4)'
            return `<span style="color: ${color};">${char}</span>`; // Replace 'yourAccentColor' with the actual color value
        }
        return num;
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
            aboutSection.innerHTML = randomString(rect.width, rect.height, 10, 14); // Use innerHTML instead of innerText
            moveCounter = 0;
        }
    };
}