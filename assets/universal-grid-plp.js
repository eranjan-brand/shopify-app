document.addEventListener("click", function (e) {
    const inputTarget = e.target.closest(".size-grid__wrapper .list-menu__item input"); 
    const navTarget = e.target.closest(".size-grid__nav li");
    if(inputTarget){
        handleSizeBoxClick(inputTarget)
    }
    if (navTarget) {
        handleNavClick(navTarget, e)
    }
});

function handleNavClick(target, event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    const wrapper = event.target.closest('.facets__list')
    const achor = target.querySelector('a')
    let tabLinks = wrapper.querySelectorAll(".size-grid__nav li");
    let tabPages = wrapper.querySelectorAll(".size-grid__tab--wrapper:not(.nonuniversal)");
    
    // remove active class from all tab links
    for (let j = 0; j < tabLinks.length; j++) {
        tabLinks[j].classList.remove("active");
    }
    // hide all tab pages
    for (let k = 0; k < tabPages.length; k++) {
        tabPages[k].style.display = "none";
    }
    
    // show current tab page and add active class to current tab link
    const currentPage = achor.getAttribute("href");
    const relevantTabs = wrapper.querySelectorAll(currentPage)
    relevantTabs.forEach(tab => {
        tab.style.display = "block";
    })
    const relevantNavItems = wrapper.querySelectorAll(`[href="${currentPage}"]`)
    relevantNavItems.forEach(item => {
        item.closest('li').classList.add("active");
    })
}

function handleSizeBoxClick(target) {
    const wrapper = target.closest('.list-menu__item')
    const active = wrapper.classList.contains('active')
    const label = wrapper.querySelector('label');
    const forAttr = label.getAttribute('for');
    const relatedSizeBoxes = document.querySelectorAll(`[for="${forAttr}"]`)
    for (let i = 0; i < relatedSizeBoxes.length; i++) {
        const menuItem = relatedSizeBoxes[i].closest('.list-menu__item')
        if (active) {
            menuItem.classList.remove('active')
        } else {
            menuItem.classList.add('active')
        }
    }
}

document.addEventListener('click', function (e) {
    const nav = e.target.closest('.size-grid__gender--nav')
    
    if (nav) {
        try {
            e.preventDefault()
            const li = e.target.closest('li')
            const wrapper = e.target.closest('.facets__list')
            const genderNavItems = wrapper.querySelectorAll('.size-grid__gender--nav-item')
            genderNavItems.forEach(navItem => {
                navItem.classList.remove('active')
            })
            li.classList.add('active');
            const targetNav = li.querySelector('a')
            const gender = targetNav.getAttribute('href').toUpperCase()
            const tabItems = wrapper.querySelectorAll('.size-grid__tab--item[data-gender]')
            tabItems.forEach(item => {
                item.style.display = "none"
            })
            const relevantItems = document.querySelectorAll(`[data-gender="${gender}"]`)
            relevantItems.forEach(item => {
                item.style.display = "flex"
            })
                    
        } catch {
            console.warn("Universal sizing elements not available")
        }
    }
    
    
})

