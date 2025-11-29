const track = document.querySelector(".testimonial-track");
const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");
const dotsContainer = document.querySelector(".testimonial-dots");

// Read cards and create clones to enable seamless looping
let cards = Array.from(document.querySelectorAll(".testimonial-card"));
const GAP = 25; // should match CSS gap between cards

if (cards.length === 0) {
    // nothing to do
    throw new Error('No testimonial cards found');
}

// Clone last and first and add them to the track for infinite loop illusion
const firstClone = cards[0].cloneNode(true);
const lastClone = cards[cards.length - 1].cloneNode(true);
track.insertBefore(lastClone, cards[0]);
track.appendChild(firstClone);

// re-query cards after cloning
cards = Array.from(track.querySelectorAll('.testimonial-card'));

// index points to the currently centered card in the 'cards' NodeList
// because of the prepended lastClone, the first real card is at index 1
let index = 1;

// number of real slides
const realCount = cards.length - 2;

// build dots for real slides
for (let i = 0; i < realCount; i++) {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);

    dot.addEventListener('click', () => {
        // map real index (0..realCount-1) to cloned list index (1..realCount)
        index = i + 1;
        updateSlider();
    });
}

const dots = document.querySelectorAll('.testimonial-dots span');

function getCardWidth() {
    // width + gap
    return cards[0].offsetWidth + GAP;
}

function getCenterOffset() {
    // center the active card in the visible track area so halves of neighbors show
    return (track.offsetWidth - cards[0].offsetWidth) / 2;
}

function updateDotsVisual() {
    // Determine which real slide is centered and update dots
    let realIndex = index - 1; // because of prepended clone
    if (realIndex < 0) realIndex = realCount - 1;
    if (realIndex >= realCount) realIndex = 0;

    dots.forEach(d => d.classList.remove('active'));
    if (dots[realIndex]) dots[realIndex].classList.add('active');
}

let scrollTimeout = null;

function updateSlider(smooth = true) {
    const left = index * getCardWidth() - getCenterOffset();
    track.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });

    // update visual dots immediately (they reflect the target center)
    updateDotsVisual();

    // After smooth scroll completes, if we're on a clone, jump to the corresponding real slide
    if (scrollTimeout) clearTimeout(scrollTimeout);
    // Timeout duration should exceed the smooth scroll duration used by browsers; 450ms is a safe choice
    scrollTimeout = setTimeout(() => {
        // if we landed on the prepended clone (index === 0), jump to last real
        if (index === 0) {
            index = realCount;
            const leftInstant = index * getCardWidth() - getCenterOffset();
            track.scrollTo({ left: leftInstant, behavior: 'auto' });
            updateDotsVisual();
        }

        // if we landed on the appended clone (index === cards.length - 1), jump to first real
        if (index === cards.length - 1) {
            index = 1;
            const leftInstant = index * getCardWidth() - getCenterOffset();
            track.scrollTo({ left: leftInstant, behavior: 'auto' });
            updateDotsVisual();
        }
    }, 480);
}

// initialize position to show first real slide centered
window.addEventListener('load', () => {
    // small timeout to ensure layout measured correctly
    setTimeout(() => updateSlider(false), 50);
});

// arrows
leftArrow.addEventListener('click', () => {
    index = (index - 1 + cards.length) % cards.length;
    updateSlider();
});

rightArrow.addEventListener('click', () => {
    index = (index + 1) % cards.length;
    updateSlider();
});

// autoplay loop
let autoplayInterval = null;
function startAutoplay() {
    if (autoplayInterval) return;
    autoplayInterval = setInterval(() => {
        index = (index + 1) % cards.length;
        updateSlider();
    }, 3000);
}

function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
}

track.addEventListener('mouseenter', stopAutoplay);
track.addEventListener('mouseleave', startAutoplay);

// restart autoplay on interaction
leftArrow.addEventListener('click', () => {
    stopAutoplay();
    startAutoplay();
});
rightArrow.addEventListener('click', () => {
    stopAutoplay();
    startAutoplay();
});

// handle window resize to re-center correctly
window.addEventListener('resize', () => {
    // re-calc and jump to the current index without smooth to avoid flicker
    updateSlider(false);
});

// start autoplay
startAutoplay();
