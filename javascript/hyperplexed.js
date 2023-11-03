// const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789!?§$%&/()=?'"
// const originalText = "Emil Rühmland";
// const originalLength = originalText.length;

// // https://www.youtube.com/watch?v=W5oawMJaXbU

// //#hero .hero-title span
// // #projects .project-wrapper__text-title

// document.querySelector("#hero .hero-title span, .text-color-highlight").onmouseover = event => {
//     let iterations = 0;

//     const interval = setInterval(() => {
//         event.target.innerText = event.target.innerText.split("")
//             .map((letter, index) => {
//                 if (index < iterations) {
//                     return originalText[index];
//                 }

//                 return letters[Math.floor(Math.random() * letters.length)]
//             })
//             .join("");

//         if (iterations >= originalLength) clearInterval(interval);
//         iterations += 1 / 30;

//     }, 3);
// }

// const letters = "å̴̱͉͚̹͚̾͛̆́͝ß̶̣̦͚̞̫͋͊̅̍̃¢̷̛͉̯͖̯̮̏̄̓̚Ð̴̡̮͎͓͑̈́̓͗̎͜ế̶̡̛̝͎̩̹̋͘͝£̵̲̤̪̯̘͌̅̑̀̒g̵͔͚̼͙̙̈́̈́̓́͂ḩ̴̛̲̯͇͕̄̐̂̂ï̷̮̳̭̹͐̐̿̿̂͜j̵̨͎̫͍̍̄͌͑͆͜k̵̡̺̦̩̰̾͂̈́̍̈́l̶̝͈̭̬̐̄̀̄̇͜m̴̛̖̹̼͚͕͋̌̄͋ñ̷̤͉̱̱̬̃͛̔͋̓ð̸̩͙̠̬͎̔̇̾͑̑þ̵̖̝͍̟̻̔̀̽̅͝q̴̡̞̻̺́͒̄̔̚ͅŕ̸̡͎͉̫̞͌̈́͘͘§̸̯̞̠͔̣͐̿̋̄͘†̵̨̦̳̪̘͑́͛̾͋µ̴̫̻̞̫͔͋͒͐̾͠v̴͚͍̦̖̥́́̈́͋͠ẅ̶̲̼͇̙͖̿̈́̐̕x̸̨̯̖̦̩͛̔̈̏̾¥̴͎͕͈̭̈͌̔̚͝ͅz̷̻̩̼̰̼̀̍̀͗͝Ä̸̰̙͙͚̿̏̉̕͜͝ß̸̪̟̰̉̎͛̆͜͜͝Ç̷̩̹̝͚͖̎̆̒̽̚Ð̶̗̜̹͔̆̓̄͘͝ͅẸ̷͖̝͚̣̀̓̑͋̉̂£̸͈̬̟͇̖̿̊̍͂͝G̷͚̪͈̙͔̈́̀̅̒̏Ḩ̸̜̠͎̯͂̂͌͌̓Ì̵̧̪͕̙̫͐̊̿͑̕Ķ̷̛͕͎͇̭̋̑̎̑L̶͇̘͓͙̙͗̌̃̌̚M̴̢̪̳̩͑̆͑̚̕ͅñ̴̛̼̬̝́̇̿̑͜͜Ö̷͉͓͈̰̭͑̋͒̈͝þ̴̘̝͙͕̥́̀́̒̊Q̸͕̠̝̣̉̾̄͒̄͜R̷̤͉̹̲̂̓͛̒̄͜§̷̬̞̰̪̺͛̐́̓̌†̷̤̰̟̪̅̌̎̾̊͜Ú̸̢̡͖͓̗̌̔̆̂̕V̸̳̮͉͇̘̀̈̈́̉͝W̵̧̛͇͈̰̤̐̿͘͠×̵̮̖̫̼͍̓͗́̅̃¥̸̧͕͎̮͓͆͊̌͊̃Z̶̨̨̛̥̣̅͒͐̐ͅ0̴̡̥͔̥̟͒̊́̚͠1̶̡͇̮̮̝̐̏͆̇̈́2̸̪͖̲͍̤̋̌́͋͝3̶͉̤̻̮̟͐̒̈̽͠4̴̛̬̹̤͈̣̿̇͌͝5̷̼͎͇͉̈́̃̈̓̋͜6̸̛̠̜̫̟̊̀̓̓ͅ7̸͈̰̰͍̦͊̽̀̈̚8̴̛̣̫̤̳́̍̒̔͜9̴̢̲̥͙̬̔̈̀̂͝!̸̦̘̠̥͉̄͆̀̅̕?̴̛͉̳̳̟͖̌̽̍̚§̶̬̗̝̭̼̆̆̒̈́̀$̷̲̥̼͖͙̓̆̆͆͠%̴̫̻͓͎̇͒̎̀͜͝&̴̳̮͇̫̠́͑̐̕͝/̵̛̘̯͓͛͋̀͋͜ͅ(̷̲̙̬̘̠̌͌́́͌)̵̡͇̼̙̦̇̂̅̽̏=̴͍͖̻͙̠͐̀̐͂̾?̴͎̖̭̤̝̌͑̄͝͝'̴̩̖̞̟̙͊͒̄͆͐";
// const letters = "▞▖▙ █▀ ▟ ◀ ⬤ ▛ ▜  ▀▄▀ ▀█▄ ▞▖";
// const letters = "0̷̢̫̫̽͊͘1̶̞̟̋̿̿0̶͈̲̲̾̔̂1̷̳̱̙̀0̶͎̀̇̽1̷̫̬̈́͝0̵̳͈̽͗͌1̵̮͙͌͠0̷̭̯̰͂̾̕1̶̠̂͊̈́0̴̞̹̰͂͘̚1̶̪̲̈́̑̏0̴̋̀ͅ1̷̩̜̹̔̓͘0̴̚ͅ1̶͈͖̾͋0̶̗̞̇1̷̨̣͙͒0̷̱͉̞̐̀1̴͙̘͆̎̊0̸̯̓̈́1̸̻͓̑͘0̸̬́1̵̣͒͂0̵̼͊͠1̴̖͒̃̈́0̴͕͌̌0̵̡̫͐̿1̵̦̻̩͆͗̑0̷̲͝1̷̗͕̋0̷̤̥̿ͅ1̴͍͛̄̇000000000111111111111111111";
// const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789";
const letters = "011̵͒͂1̷̳̱̙̀01̶̠̂͊̈́0̴͂͘̚";
// const letters = "011̷0"
const titles = document.querySelectorAll(".project-wrapper__text-title");

titles.forEach(title => {
    const originalText = title.textContent;
    const originalLength = originalText.length;
    // We assume .project-wrapper__text-info elements are next siblings after titles.
    const nextInfoBlock1 = title.nextElementSibling;
    const nextInfoBlock2 = nextInfoBlock1 ? nextInfoBlock1.nextElementSibling : null;

    title.onmouseover = event => {
        let iterations = 0;
        // event.target.style.marginBottom = '3.6rem'; // Increase margin bottom

        // // Check if the info blocks exist and reduce their opacity
        // if (nextInfoBlock1) nextInfoBlock1.style.marginBottom = '3.3rem';
        // if (nextInfoBlock2) nextInfoBlock2.style.opacity = '3.3rem';

        const interval = setInterval(() => {
            const newText = originalText
                .split("")
                .map((char, index) => {
                    if (index < iterations) {
                        return char;
                    }
                    return `<span style="opacity: 0.05;">${letters[Math.floor(Math.random() * letters.length)]}</span>`;
                })
                .join("");

            event.target.innerHTML = newText;

            if (iterations >= originalLength) {
                clearInterval(interval);
                // event.target.style.marginBottom = '1.8rem'; // Reset margin bottom

                // // Check if the info blocks exist and reset their opacity
                // if (nextInfoBlock1) nextInfoBlock1.style.marginBottom = '3rem';
                // if (nextInfoBlock2) nextInfoBlock2.style.marginBottom = '3rem';
            }
            iterations += 0.1;
        }, 30);
    };
});
