if (window.innerWidth > 768) {
    const crudeLetters = "01̵͒͂1̷̳̱̙̀01̶̠̂͊̈́0̴͂͘̚";
    // const crudeLetters = "011010";
    const titles = document.querySelectorAll(".hero-title a");

    titles.forEach(title => {
        const originalText = title.textContent;
        const originalLength = originalText.length;

        title.onmouseover = event => {
            let iterations = 0;

            const interval = setInterval(() => {
                const newText = originalText
                    .split("")
                    .map((char, index) => {
                        if (index < iterations) {
                            return char;
                        }
                        return `<span style="opacity: 1;">${crudeLetters[Math.floor(Math.random() * crudeLetters.length)]}</span>`;
                    })
                    .join("");

                event.target.innerHTML = newText;

                if (iterations >= originalLength) {
                    clearInterval(interval);
                }
                iterations += 0.019;
            }, 1);
        };
    });
}
