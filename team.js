const scrollLink = document.querySelectorAll('.links-container a[href^="#"]');
const section = document.querySelectorAll('.targetScrollSection');
const sections = {};
let identCounter = 0;

scrollLink.forEach(item => {
    item.addEventListener('click', (e) => {
        let targetBlock = document.querySelector(e.target.hash);
        e.preventDefault()
        window.scrollTo({
            top: targetBlock.offsetTop,
            behavior: 'smooth'
        });
    });
})

Array.prototype.forEach.call(section, (e) => {
    sections[e.id] = e.offsetTop;
});

window.onscroll = () => {
    let scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;
    for (identCounter in sections) {
        if (sections[identCounter] <= scrollPosition) {
            document.querySelector('.nav-active').setAttribute('class', ' ');
            document.querySelector('a[href*=' + identCounter + ']').setAttribute('class', 'nav-active');
        }
    }
};

const cards = document.querySelectorAll(".card");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    removeActiveClass();
    card.classList.add("active");
  });
});

function removeActiveClass() {
  cards.forEach((card) => {
    card.classList.remove("active");
  });
}
