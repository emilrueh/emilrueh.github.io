if (window.innerWidth > 768) {
    const aboutSection = document.querySelector('.drama-js-background');
    let moveCounter = 0;
    const movesToUpdate = 3; // Change text every X mouse moves, adjust as needed

    const dramaBinary = "01";
    const dramaNumbers = "0123456789";
    const dramaLetters = "ABCDEFGHIKLMNOPQRSTUVWXYZ";

    const dramaLettersLength = dramaLetters.length;
    const dramaNumbersLength = dramaNumbers.length;
    const dramaBinaryLength = dramaBinary.length;

    function randomChar() {
        const char = dramaLetters[Math.floor(Math.random() * dramaLettersLength)];
        const num = dramaNumbers[Math.floor(Math.random() * dramaNumbersLength)];
        const bin = dramaBinary[Math.floor(Math.random() * dramaBinaryLength)];
        // 50% char or num on 0.1%
        const charOrNum = Math.random() < 0.5 ? char : num

        const randomMath = Math.random();

        // Randomly decide whether to style this character differently
        if (randomMath < 0.001) { // 0.1% chance for each character
            // const color = Math.random() < 0.5 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.4)';
            const color = 'rgba(255, 255, 255, 0.4)'
            return `<span style="color: ${color};">${charOrNum}</span>`; // Replace 'yourAccentColor' with the actual color value
        }
        return bin;
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

    document.addEventListener('mousemove', e => {
        moveCounter++;
        if (moveCounter >= movesToUpdate) {
            const rect = aboutSection.getBoundingClientRect();
            aboutSection.innerHTML = randomString(rect.width, rect.height, 10, 14);
            moveCounter = 0;
        }
    });
}