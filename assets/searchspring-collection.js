/*
TODO: 
Null property cleanup on searchObj
Clean up logging
*/

/* 
 --- GLOBAL VARIABLES ---
*/
const urlArr = window.location.href.split("?")[0].split("/");
const pageType = urlArr[urlArr.length - 1];
let searchObject = initialSearch();
let firstLoad = true;

// Product grid for Injecting product cards

let productGrid = document.getElementById("product-grid");
if (pageType === "search") {
    productGrid = document.querySelector("#product-grid .product-grid");
}
const loadingGrid = document.getElementById("loading-grid");
// Array of elements for injecting in the product grid
let elementArray = [];

// Pagination list, items and wrapper
const paginationItems = document.querySelectorAll(".pagination__list a");

/* 
 --- URL HANDLING ---
*/

/**
 * Function for fetching search params from URL and generating search Object
 * @returns {object} Object containing all searchspring parameters for service payload
 */
function initialSearch() {
    const queryString = window.location.search;

    let searchObj = {};
    searchObj.selectedValues = searchObj.selectedValues || [];

    if (queryString) {
        // Fetch params
        const urlParams = new URLSearchParams(queryString);
        const entries = urlParams.entries();

        // Build search Object with key:value pairs

        for (const entry of entries) {
            switch (entry[0]) {
                case "sort.field":
                    searchObj.sort = searchObj.sort || {};
                    searchObj.sort.field = entry[1];
                    break;
                case "sort.direction":
                    searchObj.sort = searchObj.sort || {};
                    searchObj.sort.direction = entry[1];
                    break;
                case "page":
                    searchObj.page = entry[1];
                    break;
                case "tag":
                    searchObj.tag = entry[1];
                    break;
                case "oq":
                    searchObj.oq = entry[1];
                    break;
                case "perPage":
                    searchObj.perPage = entry[1];
                    break;
                case "siteId":
                    searchObj.siteId = entry[1];
                    break;
                case "domain":
                    searchObj.domain = entry[1];
                    break;
                case "resultsFormat":
                    searchObj.resultsFormat = entry[1];
                    break;
                case "redirectResponse":
                    searchObj.redirectResponse = entry[1];
                    break;
                case "q":
                    searchObj.q = entry[1];
                    break;
                default:
                    if (entry[0].includes("filter.")) {
                        if (entry[0] !== "bgfilter.collection_handle" && entry[0] !== 'filter.variant_title') {
                            if (searchObj.selectedValues[entry[0]]) {
                                searchObj.selectedValues[entry[0]].push(
                                    entry[1]
                                );
                            } else {
                                searchObj.selectedValues[entry[0]] =
                                    entry[1].split(",");
                            }
                        } else if (entry[0] == 'filter.variant_title') {
                            const elements = entry[1].split(",Age");
                            const nonUniSizes = ["EACH", "1SIZE", "NON"]
                            elements.forEach((size, i) => {
                                

                                if (!size.includes('Age Group') && size.includes(",")) {
                                    nonUniSizes.forEach(v => {
                                        if (size.includes(v)) {
                                            size = size.replace(`,${v}`, "")
                                            elements.push(v)
                                        }
                                    })
                                    const string = `Age${size}`
                                    elements[i] = string
                                } 
                                
                            })
                            searchObj.selectedValues[entry[0]] = elements
                        }
                    } else {
                        searchObj.selectedValues[entry[0]] = entry[1];
                    }
                    break;
            }
        }
    }
    if (pageType !== "search") {
        window.handle = handle;
    }
    searchObj.perPage = searchObj.perPage || window.searchspring.perPage;
    return searchObj;
}

/**
 * Function for mapping SearchObject to URL string
 * Pushes string to URL without redirect, used for EDM campaigns
 * @returns {void}
 */
function updateUrl() {
    let url = window.location.href.split("?")[0];
    let val = Object.keys(searchObject)
        .map(function (key) {
            if (typeof searchObject[key] === "object") {
                if (key === "selectedValues") {
                    return Object.keys(searchObject[key])
                        .map((subKey) => {
                            if (typeof subKey === "object") {
                                return searchObject[key][subKey]
                                    .map((subFilter) => {
                                        return [subKey, subFilter].join("=");
                                    })
                                    .join("&");
                            } else {
                                return [subKey, searchObject[key][subKey]].join(
                                    "="
                                );
                            }
                        })
                        .join("&");
                } else if (key === "sort") {
                    return `&sort.field=${searchObject[key]["field"]}&sort.direction=${searchObject[key]["direction"]}&`;
                } else {
                    return searchObject[key]
                        .map((filter) => {
                            return [key, filter].join("=");
                        })
                        .join("&");
                }
            } else {
                return [key, searchObject[key]].join("=");
            }
        })
        .join("&");
    if (val !== "") {
        url += "?" + val;
    }
    window.history.pushState({}, "", url);
}

/* 
 --- PAGINATION ---
*/

const paginationTemplate = `
<a href="#" class="pagination__item link" aria-label="Page 1" data-page="1">1</a>
`;

function renderPagination() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("pagination-wrapper");
    const pagination = `
        <nav class="pagination" role="navigation" aria-label="Pagination">
            <ul class="pagination__list list-unstyled" role="list">
            <li>
                <a href="{{ paginate.previous.url }}{{ anchor }}" class="pagination__item pagination__item--next pagination__item-arrow link motion-reduce" aria-label="Previous page">
                <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
                </path></svg>
                </a>
            </li>
            <li>
                <a href="#" class="pagination__item link pagination__item--current" aria-label="Page 1" data-page="1" aria-disabled="true" aria-current="true">1</a>
            </li>
            <li>
                <a href="#" class="pagination__item link" aria-label="Page 2" data-page="2">2</a>
            </li>
            <li>
                <a href="#" class="pagination__item link" aria-label="Page 3" data-page="3">3</a>
            </li>
            <li>
                <a href="{{ paginate.next.url }}{{ anchor }}" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce" aria-label="Next Page">
                    <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
                        </path>
                    </svg>
                </a><
            /li>
            </ul>
        </nav>
    `;

    wrapper.innerHTML = pagination;
    return wrapper;
}

/**
 * Function for building Pagination from SearchSpring data
 * @param {object} data Searchspring response data
 * @returns {void}
 */
function buildPagination(data) {
    let productGridContainer = document.querySelector(
        "#ProductGridContainer"
    );
    if (productGridContainer.querySelector(".collection__load-more")) {
        const grid = document.querySelector("#ProductGridContainer");
        const loadMore = productGridContainer.querySelector(
            ".collection__load-more"
        );
        grid.appendChild(loadMore);
    } else {
        let paginationWrapper = document.querySelector(".pagination-wrapper");
        // If single page/no results
        if (data.pagination.totalPages <= 1) {
            if (paginationWrapper) {
                paginationWrapper.style.display = "none";
            }
            return;
        } else {
            if (paginationWrapper) {
                paginationWrapper.style.display = "block";
            } else {
                paginationWrapper = renderPagination();
                document
                    .querySelector("#product-grid")
                    .appendChild(paginationWrapper);
            }
        }

        const paginationList =
            paginationWrapper.querySelector(".pagination__list");

        paginationOption = document.createElement("li");
        paginationOption.innerHTML = paginationTemplate;
        let paginationItems = [];
        const currentPage = parseInt(searchObject.page) || 1;
        const totalPages = data.pagination.totalPages;
        const blankItem = document.createElement("li");
        const itemsToDisplay = 2;
        blankItem.innerHTML = `<span class="pagination__item">…</span>`;

        paginationItems.push(createPaginationItem(1));
        if (currentPage >= 5) {
            paginationItems.push(blankItem.cloneNode(true));
        }
        for (let index = -itemsToDisplay; index < itemsToDisplay; index++) {
            if (currentPage + index > 1 && currentPage + index < currentPage) {
                paginationItems.push(createPaginationItem(currentPage + index));
            }
        }
        if (currentPage > 1 && currentPage < totalPages) {
            paginationItems.push(createPaginationItem(currentPage));
        }
        for (let index = 1; index < itemsToDisplay + 1; index++) {
            if (currentPage + index > 1 && currentPage + index < totalPages) {
                paginationItems.push(createPaginationItem(currentPage + index));
            }
        }
        if (totalPages - currentPage > itemsToDisplay + 1) {
            paginationItems.push(blankItem.cloneNode(true));
        }
        paginationItems.push(createPaginationItem(totalPages));

        // Reset pagination <ul>
        paginationList.innerHTML = "";

        // Pagination Arrow HTML
        const caratIcon = `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor">
        </svg>`;
        const paginateNext = `
        <a href="{{ paginate.next.url }}{{ anchor }}" class="pagination__item pagination__item--prev pagination__item-arrow link motion-reduce" aria-label="Next Page" >
        ${caratIcon}
        </a>`;
        const paginatePrev = `
        <a href="{{ paginate.previous.url }}{{ anchor }}" class="pagination__item pagination__item--next pagination__item-arrow link motion-reduce" aria-label="Previous page">
        ${caratIcon}
        </a>`;
        // END Pagination Arrow HTML

        // Create pagination arrows
        const prev = document.createElement("li");
        const next = document.createElement("li");
        prev.innerHTML = paginatePrev;
        next.innerHTML = paginateNext;
        // Append <li> tags to pagination wrapper
        paginationList.appendChild(prev);
        for (let index = 0; index < paginationItems.length; index++) {
            paginationList.appendChild(paginationItems[index]);
        }
        paginationList.appendChild(next);

        prev.addEventListener("click", function (event) {
            event.preventDefault();
            const toPage = parseInt(searchObject.page || 1) - 1;
            if (toPage >= 1) {
                searchObject.page = toPage.toString();
                sendRequest();
            }
        });
        next.addEventListener("click", function (event) {
            event.preventDefault();
            const toPage = parseInt(searchObject.page || 1) + 1;
            if (toPage <= data.pagination.totalPages) {
                searchObject.page = toPage.toString();
                sendRequest();
            }
        });
        // Apply click listener for pagination items
        paginationListener();
        // Show pagination once loaded;
        paginationWrapper.removeAttribute("hidden");
    }
}

/**
 * Function for building Pagination items with event listener
 * @param {int} pageNum page number for pagination item
 * @returns {void}
 */
function createPaginationItem(pageNum) {
    // Clone base
    const item = paginationOption.cloneNode(true);
    const anchor = item.querySelector("a");
    anchor.setAttribute("href", `#`);
    anchor.setAttribute("aria-label", `Page ${pageNum}`);
    anchor.setAttribute("data-page", `${pageNum}`);
    if (pageNum.toString() === searchObject.page) {
        anchor.setAttribute("aria-disabled", true);
        anchor.setAttribute("aria-current", true);
        anchor.classList.add("pagination__item--current");
    } else if (!searchObject.page && pageNum === 1) {
        anchor.setAttribute("aria-disabled", true);
        anchor.setAttribute("aria-current", true);
        anchor.classList.add("pagination__item--current");
    }
    anchor.textContent = pageNum;
    anchor.addEventListener("click", function (event) {
        event.preventDefault();
        searchObject.page = event.currentTarget.textContent;
        sendRequest();
    });
    return item;
}

/**
 * Function for building Pagination from SearchSpring data
 * Function for applying event listener to Pagination
 * Triggers SearchSpring request with updated page param
 * @returns {void}
 */
function paginationListener() {
    paginationItems.forEach((item) => {
        item.addEventListener("click", function (event) {
            event.preventDefault();
            searchObject.page = event.currentTarget.textContent;
            sendRequest();
        });
    });
}

/* 
 --- SORTING ---
*/

/**
 * Function for populating both Mobile and Desktop sort boxes from SearchSpring data
 * Also applies change event listener for sending SearchSpring request with sort params
 * @param {object} res Searchspring response data
 * @returns {void}
 */
function populateSorting(res) {
    // Mobile and Desktop sort boxes
    const sortFilter = document.querySelectorAll("#SortBy, #SortBy-mobile");
    // Reset sort box options
    sortFilter.forEach((filter) => {
        filter.innerHTML = "";
    });
    let filterList = [];
    res.sorting.options.forEach((field) => {
        const option = document.createElement("option");
        option.setAttribute(`value`, `${field.field}=${field.direction}`);
        option.textContent = field.label;
        // Set selected sort if param provided
        if (
            searchObject.sort?.field === field.field &&
            searchObject.sort?.direction === field.direction
        ) {
            option.setAttribute("selected", "selected");
        }
        filterList.push(option);
        // Build option html and append to dropdown
    });

    sortFilter.forEach((filter) => {
        filterList.forEach((option) => {
            filter.appendChild(option.cloneNode(true));
        });
    });

    sortFilter.forEach((filter) => {
        filter.addEventListener("change", sortListener);
    });
}

/**
 * Function for handling change events for sort filter
 * @param {HTMLChangeEvent} event
 * @returns {void}
 */
function sortListener(event) { 
    event.preventDefault();
    const sortSelected = event.currentTarget.value.split("=");
    delete searchObject.page;
    searchObject["sort"] = {};
    searchObject["sort"]["field"] = sortSelected[0];
    searchObject["sort"]["direction"] = sortSelected[1];
    if (event.currentTarget.id === "SortBy") {
        sendRequest();
    }
}


/**
 * Function for populating Product Count text content from SearchSpring data
 * @param {number} count Count of products returned from SearchSpring
 * @returns {void}
 */
function setProductCount(count) {
    // Mobile and Desktop product count text containers
    const productCount = document.querySelector("#ProductCountDesktop");
    const productCountMobile = document.querySelector("#ProductCount");
    const productCountMobileFlyout = document.querySelector(
        ".mobile-facets__count"
    );
    const infiniteScrollCount = document.querySelector(
        ".collection__product-count--wrapper"
    );
    try {
        // Update product count text
        const productText = `${count} products`;
        productCount.textContent = productText;
        productCountMobile.textContent = productText;
        productCountMobileFlyout.textContent = productText;
    } catch (err) {
        console.warn("Element not found: ", err);
    }

    if (infiniteScrollCount) {
        try {
            const perPage = parseInt(searchObject.perPage);
            if (searchObject.page) {
                var prodCount =
                    perPage * parseInt(searchObject.page) <= count
                        ? perPage * parseInt(searchObject.page)
                        : count;
            } else {
                var prodCount =
                    perPage <= count
                        ? perPage
                        : count;
            }
            if (prodCount === 0) {
                document.querySelector(
                    ".collection__pagination--wrapper"
                ).style.display = "none";
            } else {
                document.querySelector(
                    ".collection__pagination--wrapper"
                ).style.display = "block";
                document.querySelector(
                    ".collection__product-count"
                ).textContent = prodCount;
                document.querySelector(
                    ".collection__product-total"
                ).textContent = count;
            }
        } catch (err) {
            console.warn("Element not found: ", err);
        }
    }
}

/* 
 --- DATA FETCHING ---
*/

/**
 * Function for Fetching product card HTML generated via Shopify Alternate templates w/ product-handle
 * Populates ElementArray global with HTML response of each product template
 * @param {object} response Searchspring response object
 * @returns {object} Result of promise execution
 */
async function fetchTemplates(response) {
    // Reset element array
    elementArray = [];
    const productResults = response.results;

    // Map each product result to a promise, fetch templates and place in order in elementArray
    try {
        let data = await Promise.all(
            productResults.map(async (product, i) => {
                // Template url
                const productTileTemplateUrl =
                    "/products/" + product.handle + "?view=product-card";

                // Fetch template content
                const resultPromise = fetch(productTileTemplateUrl).then(
                    function (res) {
                        if (res.status == 200) {
                            return res.text();
                        } else {
                            return '';
                        }
                        
                    }
                );
                // Once template returned, check for blank, and add to array
                const response = await resultPromise.then(function (response) {
                    if (response && response.trim() != "") {
                        const intelliSuggestTracking = `onmousedown="return intellisuggestTrackClick(this, '${product.intellisuggestData}', '${product.intellisuggestSignature}')"`;
                        const trackedResponse = response.replace(
                            `<li class="grid__item">`,
                            `<li class="grid__item" ${intelliSuggestTracking}>`
                        );

                        // Build product grid by appending card template
                        elementArray[i] = trackedResponse;
                        return response;
                    }
                });
                // Return promise complete
                return response;
            })
        );
        // Return promise complete
        return data;
    } catch (error) {
        console.log(error);
    }
}

/**
 * Function for wrapping inline banner in product grid LI
 * @param {string} banner HTML string of searchspring inline banner
 * @returns {string} HTML string of full inline banner LI
 */
function inlineBannerWrapper(banner) {
    const wrapper = `<li class="grid__item searchspring__inline-banner"><div class="card-wrapper">${banner}
    </div></li>`;
    return wrapper;
}

/**
 * Function for wrapping inline banner in product grid LI
 * @param {object} response Searchspring response object
 * @param {string[]} elementArray Array of product grid HTML strings for adding banners
 * @returns {string[]} Array of HTML strings for inline banners
 */
function renderInlineBanners(response, elementArray) {
    const newArray = [...elementArray];
    const firstProductIndex = response.pagination.begin;
    const lastProductIndex = response.pagination.end;
    if (response.merchandising.content.inline.length) {
        response.merchandising.content.inline.forEach((banner) => {
            const startIndex = banner.config.position.index;
            if (
                startIndex + 1 >= firstProductIndex &&
                startIndex <= lastProductIndex
            ) {
                const element = inlineBannerWrapper(banner.value);
                const deleteCount = 0;
                const elementToInsert = element;
                newArray.splice(startIndex, deleteCount, elementToInsert);
            }
        });
    }
    return newArray;
}

/**
 * Function for building no results display
 * @param {string} searchType Search type for displaying dynamic error message depending on previous search
 * @returns {string} HTML string for no products display
 */
function displayNoProducts(searchType) {
    return `
    <div class="title-wrapper center">
        <h2 class="title title--primary">
        No products found
        <br>
        ${
            searchType === "existing-search"
                ? `Use fewer filters or <facet-remove class="underlined-link link" href="#">remove all<facet-remove>`
                : ``
        }
        </h2>
    </div>
    `;
}

/**
 * Function for posting request to searchspring and calling results handlers
 * Also toggles loading state of products grid/facets
 * @returns {void}
 */
async function sendRequest() {
    const gridWrapper = document.querySelector('.product-grid--wrapper')
    if (gridWrapper && !firstLoad) {
        gridWrapper.scrollIntoView();
    }
    firstLoad = false;
    updateUrl();
    // Faceted search function from faceted-search.js
    if (pageType === "search") {
        var searchSpringData = await window
            .getSearchspringService()
            .getSearchResults(searchObject["q"], "search", searchObject);
        if (searchSpringData.merchandising.redirect) {
            window.location.href = searchSpringData.merchandising.redirect;
        }
    } else {
        var searchSpringData = await window
            .getSearchspringService()
            .getCollectionByHandle(window.handle, searchObject);
    }
    if (searchSpringData) {
        productGrid.style.opacity = 0;
        loadingGrid.style.display = "flex";
        const products = await fetchTemplates(searchSpringData);
        if (products.length > 0) {
            resultsHandler(searchSpringData);
            
            initialiseWishlistIcons()
            
        } else {
            noResultsHandler();
        }
        loadingGrid.style.display = "none";
        productGrid.style.opacity = 1;
        document
            .querySelector("facet-filters-form")
            .classList.remove("shimmer");
        document.querySelector(".facets-container").classList.remove("loading");
    } else {
        noResultsHandler();
    }
}

/**
 * Function for enabling SWYM Wishlist functionality after product load
 * @returns {void}
 */
function initialiseWishlistIcons() {
    if (!window.SwymCallbacks) {
        window.SwymCallbacks = []
    }
    function swymCallbackFn(swat) {
        swat.initializeActionButtons("#ProductGridContainer")
    }
    window.SwymCallbacks.push(swymCallbackFn)
}

/**
 * Function for displaying no results for searchspring search
 * @returns {void}
 */
function noResultsHandler() {
    console.log("Error fetching data");
    setProductCount(0);
    const facetWrapperEl = document.querySelector(".facets-wrapper");
    let noProductDisplay = "";

    if (facetWrapperEl.classList.contains("searchSpringEnabled")) {
        document.querySelector("#FacetFiltersForm").style.opacity = 1;
        noProductDisplay = displayNoProducts("existing-search");
    } else {
        noProductDisplay = displayNoProducts("first-search");
    }
    productGrid.innerHTML = noProductDisplay;

    document.querySelectorAll("facet-remove").forEach((el) => {
        el.addEventListener("click", function () {
            searchObject.selectedValues = {};
            sendRequest();
        });
    });

    productGrid.classList.add("collection", "collection--empty");
    productGrid.classList.remove(
        "grid",
        "product-grid",
        "grid--2-col-tablet-down",
        "grid--4-col-desktop"
    );

    const paginationWrapper = document.querySelector(".pagination-wrapper");
    if (paginationWrapper) {
        paginationWrapper.style.display = "none";
    }
}

/**
 * @param {array} bannerHTML Searchspring Banner array
 * @returns {HTMLElement} returns DIV element wrapped in searchspring class
 */

function renderBanner(bannerHTML) {
    const bannerEl = document.createElement("div");
    bannerEl.classList.add("searchspring__banner","page-width");
    bannerEl.innerHTML = bannerHTML[0];
    return bannerEl;
}

/**
 * Function for rending all elements from Searchspring Response
 * @param {object} searchSpringData Searchspring response object used for rendering inline banners
 * @returns {void}
 */
function resultsHandler(searchSpringData) {
    productGrid.classList.remove("collection", "collection--empty");
    if (productGrid.classList.contains('grid--1-col-tablet-down')) {
        productGrid.classList.add("grid--1-col-tablet-down")
    } else {
        productGrid.classList.add("grid--2-col-tablet-down")
    }
    productGrid.classList.add(
        "grid",
        "product-grid",
        "grid--4-col-desktop"
    );
    if (searchSpringData.merchandising.content.inline) {
        elementArray = renderInlineBanners(searchSpringData, elementArray);
    }

    productGrid.innerHTML = elementArray.join("");
    const primaryBanner = document.querySelector('.searchspring__banner');
    if (searchSpringData.merchandising.content.header && !primaryBanner) {
        productGrid.parentNode.parentNode.parentNode.prepend(
            renderBanner(searchSpringData.merchandising.content.header)
        );
    }
    if (searchSpringData.merchandising.content.footer) {
        productGrid.append(
            renderBanner(searchSpringData.merchandising.content.footer)
        );
    }

    document.querySelector("#FacetFiltersForm").style.opacity = 1;

    renderFacets(searchSpringData);
    setProductCount(searchSpringData.pagination.totalResults);
    populateSorting(searchSpringData);
    buildPagination(searchSpringData);

    try {
        toggleLoadMoreDisplay(searchSpringData.pagination.totalResults)
    } catch (e) {
        // Infinite scroll not loaded
    }
    

    const facetWrapperEl = document.querySelector(".facets-wrapper");
    if (!facetWrapperEl.classList.contains("searchSpringEnabled")) {
        facetWrapperEl.classList.add("searchSpringEnabled");
    }

}

// Trigger initial request on collection load
sendRequest();
