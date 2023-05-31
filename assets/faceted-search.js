/* 
 --- FACETED SEARCH ---
*/

// Templates pulled from faceted-search-templates.js

// Function for rendering faceted search from SearchSpring Data
function renderFacets(data) {
    // Mobile and Desktop faceted search containers
    const facetWrapper = document.getElementById('FacetsWrapperDesktop');
    const openFacet = facetWrapper.querySelector('details[open]')
    let facetId = "";
    if (openFacet) {
        facetId = openFacet.getAttribute('id')
    }
    const mobileFacetWrapper = document.querySelector('.mobile-facets__main');
    // TODO: Design Price slider and conditional rendering
    
    facetWrapper.innerHTML = '';
    mobileFacetWrapper.innerHTML = '';
    data.facets.forEach((facet, i) => {
        let wrapper = `
        <details id="${facet.field}" class="disclosure-has-popup facets__disclosure js-filter" data-index="${i}">
            ${renderFacetHead(facet)}
            ${renderFacetBody(facet)}
        </details>`;
        let activeCount = 0
        facet.values.forEach(val => {
            if (val.active) {
                activeCount++ 
            }
        })
        // const activeCount = (wrapper.match(/active/g) || []).length;
        wrapper = wrapper.replaceAll('REPLACESELECTED', activeCount);
        facetWrapper.innerHTML += wrapper;

        const mobileDetails = `
        <details id="Mobile-facet-${facet.field}" class="mobile-facets__details js-filter" data-index="mobile-${i}">
            ${renderMobileFacetHead(facet)}
            ${renderMobileFacetBody(facet)}
        </details>
        `
        mobileFacetWrapper.innerHTML += mobileDetails;
    })
    mobileFacetWrapper.innerHTML += renderMobileSortBy();
    mobileFacetWrapper.innerHTML += renderMobileFacetFooter();
    mobileFacetAccordion();

    renderActiveFacets(data)
    facetListener();

    if (facetId !== "") {
        document.querySelector(`#${facetId}`).setAttribute('open', 'open')
    }
}



// Function for applying event listeners to mobile faceted search accordion
function mobileFacetAccordion() {
    const mobileSummary = document.querySelectorAll('.mobile-facets__summary')
    const mobileFacetsCloseButton = document.querySelectorAll('.mobile-facets__close-button');

    mobileSummary.forEach(facet => {
        facet.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const detailsContainer = target.closest('details')
            if (detailsContainer.getAttribute('open')) {
                detailsContainer.removeAttribute('open')
                detailsContainer.classList.remove('menu-opening');
                if (detailsContainer.closest('.mobile-facets__main')) {
                    detailsContainer.closest('.mobile-facets__main').classList.remove('submenu-open');
                }
            } else {
                detailsContainer.setAttribute('open', 'open')
                detailsContainer.classList.add('menu-opening');
                if (detailsContainer.closest('.mobile-facets__main')) {
                    detailsContainer.closest('.mobile-facets__main').classList.add('submenu-open');
                }
            }
        })
    })

    mobileFacetsCloseButton.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const detailsContainer = target.closest('details')
            detailsContainer.removeAttribute('open')
            detailsContainer.classList.remove('menu-opening');
            detailsContainer.closest('.mobile-facets__main').classList.remove('submenu-open');
        })
    })
}

// Function for applying select listeners on desktop and mobile Faceted search
function facetListener() {
    // Mobile, click adds to search object, apply button submits
    // Desktop click add to search object and submits

    const desktopFacets = document.querySelectorAll('#FacetFiltersForm .facets__item');
    const mobileFacets = document.querySelectorAll('#FacetFiltersFormMobile .mobile-facets__item');

    desktopFacets.forEach(facet => {
        facet.addEventListener('click', function (e) {
            e.preventDefault();
            facetClickHandler(facet)
            sendRequest()
        })
    })

    mobileFacets.forEach(facet => {
        facet.addEventListener('click', function (e) {
            e.preventDefault();
            facetClickHandler(facet)
        })
    })

    facetKeyListener()
    resetSearchListener()

    const mobileSubmit = document.querySelectorAll('.mobile-facets__footer button');
    mobileSubmit.forEach((submit) => { submit.addEventListener('click', () => { sendRequest() }); });
}



function facetClickHandler(facet) {
    let parentFacetField = facet.getAttribute('data-parent');
    let facetValue = facet.getAttribute('data-value');
    if (facetValue == undefined) {
        // type = range
        // Fetch high and low values of range facets
        // Create array of facet field names
        const facetValues= [facet.getAttribute('data-low'),facet.getAttribute('data-high')]
        const parentFacetFields = [`${parentFacetField}.low`, `${parentFacetField}.high`];

        // Create search object property for each facet if not existing
        for (let i = 0; i < parentFacetFields.length; i++) {
            const element = parentFacetFields[i];
            searchObject.selectedValues[element] = searchObject.selectedValues[element] || [];
        }

        if (facet.classList.contains('active')) {
            // If facet already active, remove active call and remove element from field array
            facet.classList.remove('active');
            for (let i = 0; i < parentFacetFields.length; i++) {
                const element = parentFacetFields[i];
                const index = searchObject.selectedValues[element].indexOf(facetValues[i]);
                if (index > -1) {
                    searchObject.selectedValues[element].splice(index, 1);
                }
            }
            
        } else {
            // Activate class styling and add to search object property
            facet.classList.add('active');
            for (let i = 0; i < parentFacetFields.length; i++) {
                const element = parentFacetFields[i];
                searchObject.selectedValues[element].push(facetValues[i]);
            }
        }
    } else {
        // Type != range
        // Create search object property for facet if not existing
        searchObject.selectedValues[parentFacetField] = searchObject.selectedValues[parentFacetField] || [];
        if (facet.classList.contains('active')) {
            // If facet already active, remove active call and remove element from field array
            facet.classList.remove('active');
            const index = searchObject.selectedValues[parentFacetField].indexOf(facetValue);
            if (index > -1) {
                searchObject.selectedValues[parentFacetField].splice(index, 1);
            }
        } else {
            // Activate class styling and add to search object property
            facet.classList.add('active');
            searchObject.selectedValues[parentFacetField].push(facetValue);
        }
    }
    if (searchObject.page) {
        delete searchObject.page
    }

}

function facetKeyListener() {
    try {
        const wrapper = document.querySelectorAll('price-range')

        wrapper.forEach(element => {
            const field = element.getAttribute('data-parent');
            const minField = element.querySelectorAll('.field')[0]
            const maxField = element.querySelectorAll('.field')[1]
    
            const inputs = element.querySelectorAll('input')
            inputs.forEach(input => {
                input.addEventListener('input', debounce(function (e) {
                    e.preventDefault()
                    searchObject.selectedValues[`filter.${field}.low`] = [minField.querySelector('input').value]
                    searchObject.selectedValues[`filter.${field}.high`] = [maxField.querySelector('input').value]
                }))
            })
        })
        
    } catch (error) {
        console.warn("Price facet not found")
    }
    

}

function addMultipleEventListener(element, events, handler) {
    events.forEach(e => element.addEventListener(e, handler))
}
  

function resetSearchListener() {
    const removeButtons = document.querySelectorAll('facet-remove')
    removeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const mobileFilters = document.querySelector('menu-drawer.mobile-facets__wrapper')
            mobileFilters.closeMenuDrawer('click')
            searchObject.selectedValues = {};
            if (searchObject.sort) {
                delete searchObject.sort
            }
            sendRequest();
        })
    })
}