var navMain = document.querySelector(".nav-main");
var navToggle = document.querySelector(".nav-main__toggle");
var logo = document.querySelector(".logo");

navMain.classList.remove("nav-main--nojs");

navToggle.addEventListener("click", function() {
  if (navMain.classList.contains("nav-main--closed")) {
    navMain.classList.remove("nav-main--closed");
    navMain.classList.add("nav-main--opened");
    logo.classList.add("logo--nav-opened");
  } else {
    navMain.classList.add("nav-main--closed");
    navMain.classList.remove("nav-main--opened");
    logo.classList.remove("logo--nav-opened");
  }
});
