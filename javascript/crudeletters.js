// const crudeLetters = "01̵͒͂1̷̳̱̙̀01̶̠̂͊̈́0̴͂͘̚";
const crudeLetters = "01_ ";
const scrambleWindow = 3; // glitch chars ahead of the resolved text
const scrambleSpeed = 0.06; // letters resolved per tick
const scrambleRotate = 40; // ms between glitch char changes
const scrambleEvery = 9; // seconds between automatic replays (0 = off)
const titles = document.querySelectorAll(".hero-title .name");

titles.forEach(title => {
    const originalText = title.textContent;
    const originalLength = originalText.length;

    let autoTimer = null;

    const scramble = () => {
        if (title.dataset.scrambling) return;
        title.dataset.scrambling = "true";

        // any scramble pushes the next automatic one out by scrambleEvery
        if (scrambleEvery > 0) {
            clearTimeout(autoTimer);
            autoTimer = setTimeout(scramble, scrambleEvery * 1000);
        }

        // lock the box so glitch glyphs don't shift surrounding layout
        const rect = title.getBoundingClientRect();
        title.style.display = "inline-block";
        title.style.width = `${rect.width}px`;
        title.style.height = `${rect.height}px`;
        title.style.whiteSpace = "nowrap";
        title.style.textAlign = "left";

        let iterations = 0;
        let lastRotate = 0;
        let glitchCache = {};

        const interval = setInterval(() => {
            if (performance.now() - lastRotate >= scrambleRotate) {
                lastRotate = performance.now();
                glitchCache = {};
            }

            const newText = originalText
                .split("")
                .map((char, index) => {
                    if (index < iterations) {
                        return char;
                    }
                    if (index < iterations + scrambleWindow) {
                        glitchCache[index] ??= crudeLetters[Math.floor(Math.random() * crudeLetters.length)];
                        return `<span style="opacity: 1;">${glitchCache[index]}</span>`;
                    }
                    return "";
                })
                .join("");

            title.innerHTML = newText;

            if (iterations >= originalLength) {
                clearInterval(interval);
                title.innerHTML = originalText;
                title.style.display = "";
                title.style.width = "";
                title.style.height = "";
                title.style.whiteSpace = "";
                title.style.textAlign = "";
                delete title.dataset.scrambling;
            }
            iterations += scrambleSpeed;
        }, 1);
    };

    title.onmouseover = scramble;
    title.onclick = scramble;
    document.fonts.ready.then(scramble);
});
