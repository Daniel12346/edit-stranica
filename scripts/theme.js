//uzima vrijednost dark-theme iz local storage-a i postavlja je na html element
const htmlRoot = document.querySelector("html");

const isDark = window.localStorage.getItem("dark-theme");

htmlRoot.dataset.dark = isDark;
