const htmlRoot = document.querySelector("html");

const isDark = window.localStorage.getItem("dark-theme");

htmlRoot.dataset.dark = isDark;
