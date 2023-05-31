
// Faceted search Desktop Head HTML template
function renderFacetHead(facet) {
    return `
    <summary class="facets__summary caption-large focus-offset" aria-label="${facet.label} (REPLACESELECTED selected)" role="button"
    aria-expanded="false" aria-controls="${facet.field}">
        <div>
            <span>${facet.label}</span>
            <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z"
                    fill="currentColor">
                </path>
            </svg>
        </div>
    </summary>`
}

function combineObjects(masterObject, obj2) {
    var result = masterObject;
    var keys = Object.keys(obj2)
    keys.forEach(function(key) {
        if (key in masterObject) {
        result[key] = masterObject[key].concat(obj2[key]);
      } else {
        result[key] = [obj2[key]];
      }
    });
    return result;
}



function renderNonUniversalSizingLi(size) {
    const listItem = document.createElement('li')
    listItem.classList.add('list-menu__item', 'facets__item', 'size-grid__tab--item')
    listItem.setAttribute('data-value', size)
    listItem.setAttribute('data-parent', 'filter.variant_title')
    if (searchObject?.selectedValues?.["filter.variant_title"]?.includes(size)) {
        listItem.classList.add('active')
    } 
    const innerHTML = `
    <label for="Filter-filter.v.option.size-${size}" class="facet-checkbox">
        <input type="checkbox" name="${size}" value="${size}" id="Filter-filter.v.option.size-${size}">
        <svg width="1.6rem" height="1.6rem" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <rect width="16" height="16" stroke="currentColor" fill="none" stroke-width="1"></rect>
        </svg>
        <svg class="icon icon-checkmark" width="1.1rem" height="0.7rem" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 3.5L2.83333 4.75L4.16667 6L9.5 1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <span aria-hidden="true">${size}</span>
        <span class="visually-hidden">${size}</span> 
    </label>`
    listItem.innerHTML = innerHTML
    return listItem
}


function renderUniversalSizingLi(size, gender, title, device, firstGender) {
    const listItem = document.createElement('li')
    listItem.setAttribute('data-gender', gender)
    listItem.classList.add('list-menu__item', 'facets__item', 'size-grid__tab--item')
    listItem.setAttribute('data-value', size.value)
    listItem.setAttribute('data-parent', 'filter.variant_title')
    if (gender == firstGender) {
        listItem.classList.add('visible')
    }
    if (searchObject?.selectedValues?.["filter.variant_title"]?.includes(size.value)) {
        listItem.classList.add('active')
    } 
    const innerHTML = `
    <label for="Filter-filter.v.option.size-${size.size}-${gender}-${title}-${device}" class="facet-checkbox">
        <input type="checkbox" name="${size.value}" value="${size.value}" id="Filter-filter.v.option.size-${size.size}-${gender}-${title}-${device}">
        <svg width="1.6rem" height="1.6rem" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <rect width="16" height="16" stroke="currentColor" fill="none" stroke-width="1"></rect>
        </svg>
        <svg class="icon icon-checkmark" width="1.1rem" height="0.7rem" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 3.5L2.83333 4.75L4.16667 6L9.5 1" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        <span aria-hidden="true" class="facet-checkbox--title">${title == 'US' ? 'US' : title == 'EURO' ? 'EU' : title}</span>
        <span aria-hidden="true">${size.size}</span>
        <span class="visually-hidden">${size.size}</span> 
    </label>`
    listItem.innerHTML = innerHTML
    return listItem
}

function getValueFromKey(object, keys) {
    for (let i = 0; i < keys.length; i++) {
        if (object.hasOwnProperty(keys[i])) {
            return object[keys[i]];
        }
    }
}

function renderSizeTabs(masterObject, ulWrapper,  wrapper) {
    const genderKeys = ['MENS', 'WOMENS', 'KIDS']
    const obj = getValueFromKey(masterObject, genderKeys)
    const navTab = document.createElement('div')
    navTab.classList.add('size-grid__wrapper')

    const genderNav = document.createElement('ul')
    genderNav.classList.add('size-grid__gender--nav')
    var firstItem = null;
    Object.keys(masterObject).forEach(category => {
        if (genderKeys.includes(category)) {
            const navItem = document.createElement('li')
            if (firstItem == null) {
                navItem.classList.add('active')
                firstItem = category
            }
            navItem.classList.add('size-grid__gender--nav-item')
            const anchor = document.createElement('a')
            anchor.setAttribute('href', category)
            anchor.textContent = category
            navItem.appendChild(anchor)
            genderNav.appendChild(navItem)
            
        }
    })
    navTab.prepend(genderNav)

    if (obj) {
        const tabNav = document.createElement('ul')
        tabNav.classList.add('size-grid__nav')
        ulWrapper.prepend(navTab)
        Object.keys(obj[0]).forEach((sizeHeading, i ) => {
            const sizeNav = document.createElement('li')
            sizeNav.classList.add('size-grid__nav--item')
            if (i === 0) {
                sizeNav.classList.add('active')
            }

            const sizeAnchor = document.createElement('a')
            if (sizeHeading.includes('US')) {
                sizeAnchor.textContent = 'US'
            } else if(sizeHeading.includes('EURO')) {
                sizeAnchor.textContent = 'EU'
            } else {
                sizeAnchor.textContent = sizeHeading
            }
            
            
            sizeAnchor.setAttribute('href', `#${sizeHeading}`)
            sizeNav.appendChild(sizeAnchor)
            tabNav.appendChild(sizeNav)

            const sizeTab = document.createElement('div')
            sizeTab.setAttribute('data-size', sizeHeading)
            sizeTab.setAttribute('id', sizeHeading)
            sizeTab.classList.add('size-grid__tab--wrapper')
            sizeTab.innerHTML = `<ul class="size-grid__tab"></ul>`
            wrapper.appendChild(sizeTab)
            navTab.appendChild(tabNav)

        })

    }
    return firstItem


}

function renderUniversalSizing(masterObject, device) {
    const genderKeys = ['MENS', 'WOMENS', 'KIDS']
    const ulWrapper = document.createElement('ul')
    ulWrapper.classList.add('facets__list','list-unstyled','no-js-hidden')
    const wrapper = document.createElement('div')
    wrapper.classList.add('size-grid__wrapper')
    ulWrapper.appendChild(wrapper)
    const firstGender = renderSizeTabs(masterObject, ulWrapper, wrapper)

    const nonUniWrapper = document.createElement('div')
    nonUniWrapper.classList.add('size-grid__wrapper')

    const nonUniTab = document.createElement('div')
    nonUniTab.classList.add('size-grid__tab--wrapper', 'nonuniversal')

    nonUniWrapper.appendChild(nonUniTab)

    nonUniList = document.createElement('ul')
    nonUniList.classList.add('size-grid__tab')
    nonUniTab.appendChild(nonUniList)
    Object.keys(masterObject).forEach(key => {
        if (genderKeys.includes(key)) {
            // Gendered subnav
            masterObject[key].forEach(size => {
                Object.keys(size).forEach(sizingTitle => {
                    
                    if (sizingTitle == "CM") return;
                    const listItem = renderUniversalSizingLi(size[sizingTitle], key, sizingTitle, device, firstGender)
                    const genderedList = wrapper.querySelector(`#${sizingTitle} .size-grid__tab`)
                    genderedList.appendChild(listItem)
                    
                    
                })
            })
        } else {
            // No gender (not universal sizing)
            
            masterObject[key].forEach(size => {
                    const listItem =  renderNonUniversalSizingLi(size)
                    nonUniList.appendChild(listItem)
            })
        }
        
    })

    ulWrapper.prepend(nonUniWrapper)
    return ulWrapper;
}



function renameObjectKey(object, old_key, new_key) {
    Object.defineProperty(object, new_key,
        Object.getOwnPropertyDescriptor(object, old_key));
    delete object[old_key];
}


function buildUniversalSizing(facet, device) {
    let masterObject = {}
    facet.values.forEach(facetValue => {
        const sizingString = facetValue.value
        const sizeObject = {};
        if (sizingString.includes(',')) {
            const sizingArrayWithDigits = sizingString.split(",").filter(function(val) {
                return val.match(/\d+/);
            });
            sizingArrayWithDigits.forEach(function (val) {
                // Check for duplicate space in size string, there seems to be some data inconsitency here.
                const newVal = val.replace("  ", " ");
                const splitVal = newVal.split(" ");
                const size = parseFloat(splitVal.pop());
                const sizeTitle = splitVal.join(" ").trim().toUpperCase();
                sizeObject[sizeTitle] = { size: size, value: facetValue.value };
                sizeObject[sizeTitle].count = facetValue.count
            });
            delete sizeObject['CM'] 
            if (sizeObject['WOMENS US']) {
                var object = {}
                renameObjectKey(sizeObject, 'WOMENS US', 'US')
                renameObjectKey(sizeObject, 'WOMENS UK', 'UK')
                object['WOMENS'] = sizeObject
            } else if (sizeObject['MENS US']){
                var object = {}
                renameObjectKey(sizeObject, 'MENS US', 'US')
                renameObjectKey(sizeObject, 'MENS UK', 'UK')
                object['MENS'] = sizeObject
            } else if (sizeObject['KIDS US']) {
                var object = {}
                renameObjectKey(sizeObject, 'KIDS US', 'US')
                renameObjectKey(sizeObject, 'KIDS UK', 'UK')
                object['KIDS'] = sizeObject
            }
           
        } else {
            sizeObject[sizingString] = sizingString
            sizeObject[sizingString].count = facetValue.count

        }
        if (object) {
            masterObject = combineObjects(masterObject,object)
        } else {
            masterObject = combineObjects(masterObject,sizeObject)
        }
        
    })

    return renderUniversalSizing(masterObject, device)
}

// Faceted search Desktop Body HTML template
function renderFacetBody(facet) {
    const device = "desktop"
    if (facet.field === 'variant_title') {
        const temp = document.createElement('div')
        var element = buildUniversalSizing(facet, device)
        temp.appendChild(element)
        var elementHTML = temp.innerHTML
    }
    const facetType = facet.type == 'slider' ? 'slider' : 'list';
    const checkBoxFacet = `<fieldset class="facets-wrap parent-wrap ">
    <legend class="visually-hidden">${facet.label}</legend>
    <ul class="facets__list list-unstyled no-js-hidden" role="list"><li class="list-menu__item facets__item">
      ${facet.values.map((option, i) => {
        let valueData = ''
        if (option.type === 'range') {
            valueData = `data-low="${option.low}" data-high="${option.high}"`
        } else {
            valueData = `data-value="${option.value}"`
        }
        return `<li class="list-menu__item facets__item ${option.active ? "active" : ""}" data-parent="filter.${facet.field}" ${valueData}>
                <label for="Filter-${option.value}-${i}" class="facet-checkbox">
                <input type="checkbox" name="${option.value}"  value="${option.value}" id="Filter-${option.value}-${i}">
                
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#E8E8E8"/>
                </svg>
                <svg class="icon icon-checkmark" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="16" height="16" rx="3" fill="#617F59"/>
<path d="M11.125 5.5L6.75 10.5L4.875 8.625" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


                <span aria-hidden="true">${option.label} (${option.count})</span>
                <span class="visually-hidden">${option.label} (${option.count} products)</span>
                </label>
            </li>`
      }).join('')}
          </ul>
  </fieldset>`;
    
    if (facetType == 'slider' && !elementHTML) {
        var HTML = renderPriceSlider(facet)
    } else if (elementHTML) {
        HTML = elementHTML
    } else {
        HTML = checkBoxFacet
    }

    return `<div id="Facet-${facet.field}" class="parent-display facets__display"><div class="facets__header">
    <span class="facets__selected no-js-hidden">
        ${ facetType == 'slider' ? "" : "REPLACESELECTED selected"}
    </span >
    <facet-remove>
      <a href="#" class="facets__reset link underlined-link">
        Reset
      </a>
    </facet-remove>
  </div>
  ${HTML}
</div>`
}

function renderPriceSlider(facet) {
    facetHTML = `<price-range class="facets__price" id="Facet-${facet.field}" data-parent="${facet.field}">
    <span class="field-currency">$</span>
    <div class="field">
        <input class="field__input" name="${facet.field}.low" id="Filter-Price-GTE" type="number" placeholder="0" min="0" max="${facet.range[1]}" value="${facet.range[0]}">
        <label class="field__label" for="Filter-Price-GTE">From</label>
    </div><span class="field-currency">$</span><div class="field">
        <input class="field__input" name="${facet.field}.high" id="Filter-Price-LTE" type="number" min="0" placeholder="${facet.range[1]}" max="${facet.range[1]}" value="${facet.range[1]}">
        <label class="field__label" for="Filter-Price-LTE">To</label>
    </div>
    </price-range>
    <div class="price-range__submit">
    <button type="button" class="button button--primary" onClick="sendRequest()">Apply</button>
    </div>`;

    return facetHTML;
}


function renderActiveFacets(searchspringData) {
    const facetForm = document.querySelector('#FacetFiltersForm')
    const activeWrapper = facetForm.querySelector('.active-facets')
    
    if (!activeWrapper) {
        const wrapper = document.createElement('div')
        wrapper.classList.add('active-facets', 'active-facets-desktop')
        facetForm.appendChild(wrapper)
    } else {
        activeWrapper.innerHTML = '';
    }

    const closeIcon =  `
    <svg aria-hidden="true" focusable="false" role="presentation" width="12" height="13" class="icon icon-close-small" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.48627 9.32917L2.82849 3.67098" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M2.88539 9.38504L8.42932 3.61524" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
    </svg>`

    const removeTemplate = document.createElement('facet-remove')
    const anchor = document.createElement('a')
    anchor.classList.add('active-facets__button', 'active-facets__button--light')
    anchor.setAttribute('role', 'button')
    anchor.innerHTML = `
        <span class="active-facets__button-inner button button--tertiary">
        Size: M 10 / W 12
        <span class="visually-hidden">Remove filter</span>
        </span>`
    removeTemplate.appendChild(anchor)

    const removeAllFacets = document.createElement('facet-remove')
    removeAllFacets.classList.add('active-facets__button-wrapper')
    removeAllFacets.innerHTML = `
        <a href="#" class="active-facets__button-remove underlined-link" role="button">
            <span>Clear all</span>
        </a>`

    searchspringData.facets.forEach(facet => {
        if (facet.facet_active > 0) {
            if (facet.type === 'slider') {
                const removeFacet = removeTemplate.cloneNode(true)
                const textContent = removeFacet.querySelector('.active-facets__button-inner')
                textContent.innerHTML = `${closeIcon} ${facet.label}: ${facet.active[0]} - ${facet.active[1]}`

                facetForm.querySelector('.active-facets').appendChild(removeFacet)

                removeFacet.addEventListener('click', function (e) {
                    e.preventDefault()
                    e.stopImmediatePropagation()
                    const high = searchObject?.['selectedValues']?.[`filter.${facet.field}.high`]
                    const low = searchObject?.['selectedValues']?.[`filter.${facet.field}.low`]

                    if (high && low) {
                        delete searchObject?.['selectedValues']?.[`filter.${facet.field}.low`]
                        delete searchObject?.['selectedValues']?.[`filter.${facet.field}.high`]
                        sendRequest();
                    }
                })
            } else {
                facet.values.forEach(val => {
                    if (val.active) {
                        const removeFacet = removeTemplate.cloneNode(true)
                        const textContent = removeFacet.querySelector('.active-facets__button-inner')
                        if (facet.field == 'variant_title') {
                            if (val.value.includes(',')) {
                                const values = val.value.split(',')
                                values.forEach(val => {
                                    if (val.includes('US')) {
                                        const size = val.split(" ")
                                        if (size.length === 3 && size[2] !== '') {
                                            const gender = size[0]
                                            const sizeRegion = size[1]
                                            const sizeValue = size[2]
                                            textContent.innerHTML = `${ closeIcon } ${facet.label}: ${gender[0]} ${sizeRegion} ${sizeValue}`
                                        }
                                    }
                                })
                            } else {
                                textContent.innerHTML = `${ closeIcon } ${facet.label}: ${val.value}`
                            }
                            
                        } else {
                            if (val.value) {
                                textContent.innerHTML = `${ closeIcon } ${facet.label}: ${val.value}`
                            } else {
                                textContent.innerHTML = `${ closeIcon } ${facet.label}: ${val.label}`
                            }
                            
                        }
                        
                        facetForm.querySelector('.active-facets').appendChild(removeFacet)
    
                        removeFacet.addEventListener('click', function (e) {
                            e.preventDefault()
                            e.stopImmediatePropagation()
                            const fieldArr = searchObject?.['selectedValues']?.[`filter.${facet.field}`]
                            if (fieldArr) {
                                const filteredArray = fieldArr.filter(e => e !== val.value)
                                searchObject['selectedValues'][`filter.${facet.field}`] = filteredArray;
                                sendRequest();
                            }
                        })
                    }
                })
            }
            }
            
    })

    facetForm.querySelector('.active-facets').appendChild(removeAllFacets)

}



// Faceted search Mobile Head HTML template
function renderMobileFacetHead(facet) {
    return `
    <summary class="mobile-facets__summary focus-inset" role="button" aria-expanded="false" aria-controls="${facet.field}-mobile">
        <div>
            <span>${facet.label}</span>
            <span class="mobile-facets__arrow no-js-hidden">
            <svg class="icon icon-arrow" width="10" height="16" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#3C3C3C" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

            </span>
            <noscript>
                <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
                </svg>
            </noscript>
        </div>
    </summary>
    `
}

// Faceted search Mobile Body HTML template
function renderMobileFacetBody(facet) {
    const device = "mobile"
    if (facet.field === 'variant_title') {
        const temp = document.createElement('div')
        var element = buildUniversalSizing(facet, device)
        temp.appendChild(element)
        var elementHTML = temp.innerHTML
    }
    
    const facetType = facet.type == 'slider' ? 'slider' : 'list';
    const checkboxFacet = `
        <ul class="mobile-facets__list list-unstyled" role="list"><li class="mobile-facets__item list-menu__item">
            ${facet.values.map((option, i) => {
                return `
                <li class="mobile-facets__item list-menu__item ${option.active ? "active" : ""}" data-parent="filter.${facet.field}" data-value="${option.value}">
                    <label for="Filter-${option.value}-${i}-mobile" class="mobile-facets__label">
                        <input class="mobile-facets__checkbox" type="checkbox" name="${option.value}"  value="${option.value}" id="Filter-${option.value}-${i}-mobile">
                            <span class="icon icon-checkmark" class="mobile-facets__highlight"></span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="15" height="15" rx="2.5" stroke="#E8E8E8"/>
</svg>

                            <svg class="icon icon-checkmark" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="16" height="16" rx="3" fill="#617F59"/>
<path d="M11.125 5.5L6.75 10.5L4.875 8.625" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

                            <span aria-hidden="true">${option.label} (${option.count})</span>
                            <span class="visually-hidden">${option.label} (${option.count} product)</span>
                    </label>
                </li>
                `
            }).join('')}
        </ul>
        `

    if (facetType == 'slider' && !elementHTML) {
        var HTML = renderMobilePriceSlider(facet)
    } else if (elementHTML) {
        HTML = elementHTML
    } else {
        HTML = checkboxFacet
    }

    return `<div id="${facet.field}-mobile" class="mobile-facets__submenu gradient">
    <button class="mobile-facets__close-button link link--text focus-inset" aria-expanded="true" type="button">
    <svg class="icon icon-arrow" width="10" height="16" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.1875 1.375L6.8125 7L1.1875 12.625" stroke="#3C3C3C" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ${facet.label}
        </button>${HTML}
    ${renderMobileFacetFooter() }
    </div>`
}

function renderMobileFacetFooter() {
    return `
    <div class="no-js-hidden mobile-facets__footer gradient">
        <facet-remove class="mobile-facets__clear-wrapper">
            <a href="#" class="mobile-facets__clear underlined-link">Clear</a>
        </facet-remove>
        <button type="button" class="no-js-hidden button button--primary" onclick="this.closest('menu-drawer').closeMenuDrawer('click')">Apply</button>
        <noscript>
            <button class="button button--primary">
                Apply
            </button>
        </noscript>
    </div>`
}

function renderMobilePriceSlider(facet) {
    return `<p class="mobile-facets__info"></p>
        <price-range class="facets__price facets__price--mobile" data-parent="${facet.field}">
            <span class="field-currency">$</span>
            <div class="field">
                <input class="field__input" name="${facet.field}.low" id="Mobile-Filter-Price-GTE" type="number" placeholder="0" min="0" inputmode="decimal" max="${facet.range[1]}" value="${facet.range[0]}">
                <label class="field__label" for="Mobile-Filter-Price-GTE">From</label>
            </div>
            <span class="field-currency">$</span>
            <div class="field">
                <input class="field__input" name="${facet.field}.high" id="Mobile-Filter-Price-LTE" type="number" min="0" inputmode="decimal" placeholder="${facet.range[1]}" max="${facet.range[1]}" value="${facet.range[1]}">
                <label class="field__label" for="Mobile-Filter-Price-LTE">To</label>
            </div>
        </price-range>`
}

function renderMobileSortBy() {
    return `<div class="mobile-facets__details js-filter" data-index="mobile-">
    <div class="mobile-facets__summary">
      <div class="mobile-facets__sort">
        <label for="SortBy-mobile">Sort by:</label>
        <div class="select">
          <select name="sort_by" class="select__select" id="SortBy-mobile" aria-describedby="a11y-refresh-page-message"></select>
          <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
<path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
</path></svg>
        </div>
      </div>
    </div>
  </div>`
}