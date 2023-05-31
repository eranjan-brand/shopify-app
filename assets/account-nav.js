function showTabContent(eventTarget){
    const contentParent = document.querySelector('.account-main-content');
    const allContents = contentParent.querySelectorAll('.account-content');
    if(eventTarget.dataset.value){
        let elementID = eventTarget.dataset.value;
        allContents.forEach((element)=>{
            if (element.id != elementID){
                element.style.display = 'none';
                element.classList.remove('active')
            }
            if( element.id == elementID) {
                // Show matched content
                element.style.display = 'block';
                element.classList.add('active')
                
                // Change account page title
                let accountTitle = document.querySelector('.customer__title');
                accountTitle.innerHTML = eventTarget.innerHTML;
                // Change nav-tab text color and add underline
                navTabs = eventTarget.closest('.account-nav-tabs-container');
                navTabs.querySelectorAll('.account-nav-tab').forEach((tab)=>{
                    tab.classList.remove('selected');
                })
                eventTarget.classList.add('selected');
            }
        })
    
    }  
}



document.addEventListener('DOMContentLoaded',()=> {

    const navTabs = document.querySelector('nav.account-nav-tabs');
    navTabs.addEventListener('click',(e) => showTabContent(e.target));
    // Javascript to enable link to tab
    const url = document.location.toString();
    if (url.match('#')) {
        const targetNav = url.split('#')[1]
        const li = document.querySelector(`li[data-value="acc-${targetNav}"]`)
        if (!li) return            
        li.click('')
    } else {
        const targetNav = "orders"
        const li = document.querySelector(`li[data-value="acc-${targetNav}"]`)
        if (!li) return            
        li.click('')
    }
})

