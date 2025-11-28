const track = document.querySelector(".testimonial-track");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const dotsContainer = document.querySelector(".testimonial-dots");

const cards = document.querySelectorAll(".testimonial-card");
const cardWidth = cards[0].offsetWidth + 25;

let index = 0;
let maxIndex = cards.length - 3; // show 3 at a time

// Create dots
for (let i = 0; i <= maxIndex; i++) {
    let dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dotsContainer.appendChild(dot);

    dot.addEventListener("click", () => {
        index = i;
        updateSlider();
    });
}

const dots = document.querySelectorAll(".testimonial-dots span");

function updateSlider() {
    track.scrollTo({
        left: index * cardWidth,
        behavior: "smooth"
    });

    dots.forEach(d => d.classList.remove("active"));
    dots[index].classList.add("active");
}

leftArrow.addEventListener("click", () => {
    if (index > 0) index--;
    updateSlider();
});

rightArrow.addEventListener("click", () => {
    if (index < maxIndex) index++;
    updateSlider();
});
