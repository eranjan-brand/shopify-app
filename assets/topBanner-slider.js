const slider = document.querySelector('.top-banner-slider')
if (slider) {

    slider.classList.remove('topbanner-load');
    const totalTime = 6000
    const items = document.querySelector('.top-banner-slider').querySelectorAll('.content-slide');
    items.forEach(item => {
        item.style.display = 'none';
    });
    let currentSlide = 0;
    if (items.length > 1) {
        cycleItem();
    } else {
        items[0].style.display = 'block';
    }
    
    
    async function cycleItem() {
        const item = items[currentSlide].querySelector('.announcement-bar__message')
        item.style.opacity = 0
        items[currentSlide].style.display = "block"
        setTimeout(() => {
            item.style.opacity = 1
        }, 300);
        setTimeout(() => {
            item.style.opacity = 0
        }, totalTime - 300);
        setTimeout(() => {
            items[currentSlide].style.display = "none"
                currentSlide = (currentSlide + 1) % items.length;
                cycleItem();
        }, totalTime);
    }
}