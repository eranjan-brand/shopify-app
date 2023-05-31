/*
 HTML Element to switch the product grid layout for tablet and below devices
*/

class GridChanger extends HTMLElement {
    constructor() {
        super();
        this.contentWrapper = this.closest('#MainContent')
        this.productGrid = this.contentWrapper.querySelector('#ProductGridContainer')
        this.layoutOptions = this.querySelectorAll('.layout__grid-option')
        this.layoutOptions.forEach(el => {
            el.addEventListener('click', this.handleGridChange.bind(this))
        })
    }

    handleGridChange(event) {
        const active = event.target.classList.contains('active')
        if (active) return;
        const twoColumnClass = 'grid--2-col-tablet-down'
        const oneColumnClass = 'grid--1-col-tablet-down'
        const element = this.productGrid.querySelectorAll(`.${twoColumnClass}, .${oneColumnClass}`)
        element.forEach(el => {
            if (el.classList.contains(twoColumnClass) && event.target.classList.contains(`layout__1-col`)) {
                el.classList.remove(twoColumnClass);
                el.classList.add(oneColumnClass);
            } else if (el.classList.contains(oneColumnClass) && event.target.classList.contains(`layout__2-col`)) {
                el.classList.remove(oneColumnClass);
                el.classList.add(twoColumnClass);
            }
        })
        
        this.layoutOptions.forEach(option => {
            option.classList.remove('active')
        })
        event.target.classList.add('active')
    }
}

customElements.define("grid-changer", GridChanger);
