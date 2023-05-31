const largeScreen = 1024;
let screenWidth = screen.width;
if (screenWidth > largeScreen) {
const header = ".list-menu.list-menu--inline li header-menu";
const menuContent = ".list-menu.list-menu--inline li header-menu details.mega-menu .mega-menu__content"; 
const menu = document.querySelectorAll(header);
let menuItem = (function(event) {
  for (let i = 0; i < menu.length; i++) {
      menu[i].addEventListener("mouseover", (event) => {
        // console.log("Mouse in");
        menu[i].querySelector("details.mega-menu").setAttribute("open","open");
        menu[i].querySelector("details.mega-menu").classList.add("menu-opening");
        menu[i].querySelector("summary").setAttribute("aria-expanded","true");
      });

      menu[i].addEventListener("mouseout", (event) => {
      // console.log("Mouse out");
      menu[i].querySelector("details.mega-menu").removeAttribute("open","open");
      menu[i].querySelector("details.mega-menu").classList.remove("menu-opening");
     // menu[i].querySelector("summary.header__menu-item").setAttribute("aria-expanded","false");
     menu[i].querySelector("summary").setAttribute("aria-expanded","false");
      });
  }
})();
}