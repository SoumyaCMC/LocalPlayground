const navbtn = document.getElementById('navbtn')
const blackMain = document.querySelector('.navbar')

navbtn.addEventListener('click', (e) => openNavbar(e))

function openNavbar(e) {
    blackMain.classList.toggle('navopen')
    if(!navbtn.classList.contains('opened')){
        blackMain.style.zIndex = "2"
        navbtn.style.zIndex = "3"
    }
    else{
        blackMain.style.zIndex = "1000"
        navbtn.style.zIndex = "1001"
    }
}
