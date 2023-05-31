document.addEventListener('click', function(e) {
    const target = e.target.closest('.additional-colours__show-more')
    const wrapper = e.target.closest('.card__additional-colours')
    if (target) {
        e.preventDefault()
        e.stopImmediatePropagation()
        const hiddenColours = wrapper.querySelectorAll('ul li:nth-child(n+5)')
        hiddenColours.forEach( el => {
            el.style.display = 'block'
        })
        wrapper.querySelector('.additional-colours__show-more').style.display = 'none';
    }
})

document.addEventListener('click', function (e) {
    const target = e.target.closest('.additional-colours__option')
    if (target) {
        e.preventDefault()
        if (!target.classList.contains('active')) {
            const list = target.closest('ul')
            const items = list.querySelectorAll('li')
            items.forEach(li => {
                li.classList.remove('active')
            })
            target.classList.add('active')
        }

        const cardWrapper = target.closest('.card-wrapper')
        const anchorTag = target.querySelector('a')
      
        const swatchTitle = target.querySelector('.card__title').getAttribute('data-title')
        const productUrl = target.querySelector('.card__url').getAttribute('data-url')
        const cardTitleElement = cardWrapper.querySelectorAll('.card__heading a')
        
        cardTitleElement.forEach(el => {
            if (el) {
                el.setAttribute('href', productUrl)
            }
        })
        
        // Update image to selected swatch
        const cardImageContainer = cardWrapper.querySelector('.card__media img')
        cardImageContainer.srcset = anchorTag.querySelector('img').src;




        // swatch regular price
        const swatchPrice = target.querySelector('.card__price__regular').getAttribute('data-price')
        // swatch sale price
        const swatchSalePrice = target.querySelector('.card__price__sale').getAttribute('data-price')

        // Update regular price
        const regularPriceElement = cardWrapper.querySelector('.card-information .price__container .price__regular .price-item--regular')
        if (regularPriceElement) {
            regularPriceElement.textContent = swatchPrice;
        }

        if (swatchPrice == swatchSalePrice) {
            // Product not on sale
            const onSaleElement = cardWrapper.querySelector('.price--on-sale')
            if (onSaleElement) {
                onSaleElement.classList.remove('price--on-sale')
            }
        } else {
            // Product on sale
            const priceWrapper = cardWrapper.querySelector('.price')
            const onSaleElement = cardWrapper.querySelector('.price--on-sale')
            if (!onSaleElement) {
                priceWrapper.classList.add('price--on-sale')
            }

            const salePriceElement = cardWrapper.querySelector('.card-information .price__container .price__sale .price-item--sale')
            if (salePriceElement) {
                salePriceElement.textContent = swatchSalePrice;
            }

            // Update sale price to swatch sale price
            const saleOldPriceElement = cardWrapper.querySelector('.card-information .price__container .price__sale .price-item--regular')
            if (saleOldPriceElement) {
                saleOldPriceElement.textContent = swatchPrice;
            }
        }


        const quickAddElement = cardWrapper.querySelector('.quick-add__submit')

        if (quickAddElement) {
            quickAddElement.setAttribute('data-product-url', productUrl)
        }

        const additionalImage = target.querySelector('.card__hover-image')
        const currentImage = cardWrapper.querySelectorAll('.card__media img')

        if (additionalImage && currentImage[1]) {
            const srcset = additionalImage.getAttribute('data-srcset')
            const src = additionalImage.getAttribute('data-src')
            currentImage[1].setAttribute('srcset', srcset)
            currentImage[1].setAttribute('src', src)
        }
        
        const quickAddForm = cardWrapper.querySelector('form')
       
        const wishlistIcon = cardWrapper.querySelector('.swym-button')
        
        const variantId = target.querySelector('.card__variant-id').getAttribute('data-variant-id')
        const productId = target.querySelector('.card__product-id').getAttribute('data-product-id')
        const promoLine = target.querySelector('.card__promoline')
        const promoLineWrapper = cardWrapper.querySelector('.promoline-wrapper')

        if (promoLine) {
            
            promoLineContent = promoLine.getAttribute('data-promoline')
            if (promoLineWrapper) {
                promoLineWrapper.style.display = 'block';
                promoLineWrapper.setAttribute('id', `promoline-${productId}`)
                const span = promoLineWrapper.querySelector('span')
                span.textContent = promoLineContent
            } else {
                const infoWrapper = target.closest('.card__information')

                const promoElement = document.createElement('div')
                promoElement.setAttribute('id', `promoline-${productId}`)
                promoElement.classList.add('promoline-wrapper')
                const span = document.createElement('span')
                span.textContent = promoLineContent
                promoElement.appendChild(span)
                infoWrapper.appendChild(promoElement)
            }
        } else {
            if (promoLineWrapper && !promoLine) {
                promoLineWrapper.style.display = 'none';
            }
        }

        if (quickAddForm) {
            const input = quickAddForm.querySelector("input[name='id']")
            input.value = variantId
        }

        if (wishlistIcon) {
            const productId = target.querySelector('.card__product-id').getAttribute('data-product-id')
            wishlistIcon.setAttribute('data-product-id', productId)
            wishlistIcon.setAttribute('data-variant-id', variantId)
            wishlistIcon.setAttribute('data-product-url', productUrl)
            wishlistIcon.className = `swym-button swym-add-to-wishlist-view-product product_${productId} swym-icontext swym-heart swym-loaded`
            if (!window.SwymCallbacks) {
                window.SwymCallbacks = []
            }
            function swymCallbackFn(swat) {
                window.triggerSwymVariantEvent(variantId)
                swat.initializeActionButtons("#ProductGridContainer")
                swat.initializeActionButtons("#predictive-search-results-list")
            }
            window.SwymCallbacks.push(swymCallbackFn)
        }
        
    }

})

