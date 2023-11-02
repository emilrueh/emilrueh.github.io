const letters = "ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789!?§$%&/()=?'"
const originalText = "Emil Rühmland";
const originalLength = originalText.length;

// https://www.youtube.com/watch?v=W5oawMJaXbU

//#hero .hero-title span
// #projects .project-wrapper__text-title

document.querySelector("#hero .hero-title span").onmouseover = event => {
    let iterations = 0;

    const interval = setInterval(() => {
        event.target.innerText = event.target.innerText.split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return originalText[index];
                }

                return letters[Math.floor(Math.random() * originalLength)]
            })
            .join("");

        if (iterations >= originalLength) clearInterval(interval);
        iterations += 1 / 100;

    }, 3);
}