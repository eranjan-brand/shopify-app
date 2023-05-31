/**
 * Returns DOM Node for search query
 *
 * @param {string} query the search input value
 */
function appendSearchButton(query, redirect, productCount) {
    const searchForHTML = `<li id="predictive-search-option-search-keywords" class="predictive-search__list-item" role="option">
        <a href="${
            redirect == false ? "/search?q=" : ""
        }${query}" class="predictive-search__item predictive-search__item--term link link--text h5 animate-arrow" tabindex="-1">
           Go to ${query}
            <svg viewBox="0 0 14 10" fill="none" aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z" fill="currentColor">
                </path>
            </svg>
        </a>
    </li>`;

    const el = document.createElement("div");
    el.classList.add("predictive-search__appended");
    el.innerHTML = searchForHTML;
    return el;
}

/**
 * Returns DOM Node for search query
 *
 * @param {string} query the search input value
 * @param {number} total the total count of products
 */
function appendSeeAllButton(query, total, originalQuery) {
    const seeAllHTML = `<li class="predictive-search__list-see-all" role="option">
        <a href="/search?q=${query}${originalQuery ? "&oq="+originalQuery : ""}" class="predictive-search__item predictive-search__item--term link link--text h5 animate-arrow" tabindex="-1">
            See all results (${total})
        </a>
    </li>`;

    const el = document.createElement("div");
    el.classList.add("predictive-search__prepended");
    el.innerHTML = seeAllHTML;
    return el;
}

/**
 *
 * @param {string} query the suggested input value
 * @returns {HTMLElement} Node for suggested query
 */
function prependSearchSuggestion(query, originalQuery, corrected, seeAll) {
    const suggestedSearch = `<li id="predictive-search-option-search-keywords" class="predictive-search__list-item" role="option">
        <a data-query="${query}" ${
        corrected ? `data-corrected="${query}"` : ""
    } href="/search?q=${query}${
        originalQuery ? "&oq=" + originalQuery : ""
    }" class="predictive-search__item predictive-search__item--term link link--text h5 animate-arrow" tabindex="-1">
            ${seeAll ? `See all results (${seeAll})` : `Did you mean “${query}”?`}
            <svg viewBox="0 0 14 10" fill="none" aria-hidden="true" focusable="false" role="presentation" class="icon icon-arrow" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z" fill="currentColor">
                </path>
            </svg>
        </a>
    </li>`;

    const el = document.createElement("div");
    el.classList.add("predictive-search__prepended");
    el.innerHTML = suggestedSearch;
    return el;
}

/**
 * Function for Fetching product card HTML generated via Shopify Alternate templates w/ product-handle
 * Populates suggestionArray global with HTML response of each product template
 * @param {object} response Searchspring response object
 * @returns {object} Result of promise execution
 */
async function fetchSuggestionTemplates(response) {
    // Reset element array
    let suggestionArray = [];
    const productResults = response.results;

    // Map each product result to a promise, fetch templates and place in order in suggestionArray
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
                            return false;
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
                        suggestionArray[i] = trackedResponse;
                        return response;
                    }
                });
                // Return promise complete
                return response;
            })
        );
        // Return promise complete
        if (data) {
            return suggestionArray.join("");
        } else {
            return false;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Returns HTML String for displaying products returned by searchspring suggest api
 *
 * @param {array} items Array of product objects for mapping list items
 */
async function renderSuggestionWrapper(items) {
    if (items) {
        var data = await fetchSuggestionTemplates(items);
    }
    if (data) {
        return `
        <div id="predictive-search-results">
            <span class="predictive-search-status visually-hidden" role="status" aria-hidden="true"></span>
            <ul id="predictive-search-results-list" class="predictive-search__results-list list-unstyled" role="listbox" aria-labelledby="predictive-search-products">
                
                ${
                    data
                        ? data
                        : `
                <li id="predictive-search-option" class="predictive-search__list-item predictive-search__item predictive-search__no-results" role="option" aria-selected="false">
                    <b>No products found</b>
                </li>`
                }
            </ul>
            <div class="predictive-search__loading-state" aria-hidden="true">
                <svg aria-hidden="true" focusable="false" role="presentation" class="spinner" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                    <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                </svg>
            </div>
        </div>
        <span class="hidden" data-predictive-search-live-region-count-value="">
            ${items ? items.length : ""} results
        </span>`;
    } else {
        return false;
    }
    
}

function renderRelatedWrapper() {
    const customEl = document.createElement("div");
    customEl.classList.add("predictive-search__related-searches");
    customEl.innerHTML = `<h3>Related results</h3>
    <ul></ul>`;
    return customEl;
}

function renderRelatedSearches(relatedSearches, wrapper) {
    const relatedWrapper = wrapper.querySelector("ul");
    const relatedLi = `${relatedSearches
        .map((item) => {
            return `<li>${item.text}</li>`;
        })
        .join("")}`;
    relatedWrapper.innerHTML = relatedLi;
    const searchInput = document.querySelector("#Search-In-Modal");
    const listItems = wrapper.querySelectorAll("li");
    listItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            searchInput.value = item.textContent;
            searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        });
    });
    
}

function buildSearchListWrapper(el) {
    const ul = document.createElement("ul");
    ul.setAttribute("id", "predictive-search-results-list");
    ul.classList.add("predictive-search__results-list", "list-unstyled");
    ul.setAttribute("role", "listbox");
    ul.setAttribute("aria-labelledby", "predictive-search-products");

    const div = document.createElement("div");
    div.setAttribute("id", "predictive-search-results");
    div.setAttribute("class", "searchspring-search");

    ul.append(div);
    el.append(ul);
}

/**
 * Returns HTML String for displaying products returned by searchspring suggest api
 *
 * @param {string} query input value for suggestion api
 * @param {HTMLElement} element predictive search element for injecting the built HTML
 */
async function renderSearchSuggestions(query, element) {
    // Get suggested queries from SearchSpring
    const fetchData = await window
        .getSearchspringService()
        .getSuggestion(query);
    const suggestedQuery = await fetchData.json();
    let suggestion = "";
    const searchInjectionEl = element.querySelector("[data-predictive-search]");
    buildSearchListWrapper(searchInjectionEl);

    // Check if we have a suggested query, or alternative
    if (suggestedQuery["corrected-query"]) {
        suggestion = suggestedQuery["corrected-query"];
        var originalQuery = suggestedQuery.query;
    } else if (suggestedQuery.suggested) {
        suggestion = suggestedQuery.suggested.text;
    } else if (suggestedQuery.alternatives.length) {
        suggestion = suggestedQuery.alternatives[0].text;
    } else {
        // No suggestions/alternatives
        suggestion = suggestedQuery.query;
    }

    payload = {};
    payload.perPage = 4;
    if (originalQuery) {
        payload.oq = originalQuery;
    }

    const suggestedProducts = await window
        .getSearchspringService()
        .getSearchResults(suggestion, "autocomplete", payload);
    if (suggestedProducts) {
        element.removeAttribute("loading");
    }
    clearPreviousSuggestions();
    if (suggestedQuery.suggested || suggestedQuery.alternatives.length) {
        const searchHTML = await renderSuggestionWrapper(suggestedProducts);
        element.renderSearchResults(searchHTML);
    } else {
        if (suggestedProducts.merchandising.redirect) {
            var buttonEl = appendSearchButton(suggestedProducts.pagination.redirect, true, 0)
        } else {
            if (suggestedProducts.results.length > 0) {
                const searchHTML = await renderSuggestionWrapper(
                    suggestedProducts
                );
                element.renderSearchResults(searchHTML);
                const results = suggestedProducts.pagination.totalResults;
                const wrapper = element.querySelector(
                    "#predictive-search-results"
                );
                
                wrapper.prepend(appendSeeAllButton(suggestion, results, originalQuery));
            } else {
                const noResultEl = await renderSuggestionWrapper(null);
                element.renderSearchResults(noResultEl);
            }
        }
    }
    
    const resultsDiv = element.querySelector(".searchspring-search");
    const wrapper = renderRelatedWrapper();
    renderRelatedSearches(suggestedQuery.alternatives || null, wrapper);
    const resultWrapper = element.querySelector("#predictive-search-results");
    
    
    if (suggestedQuery["corrected-query"]) {
        const searchEl = prependSearchSuggestion(suggestedQuery["corrected-query"], suggestedQuery.query, true);
        // const seeAll = prependSearchSuggestion(suggestedQuery["corrected-query"], suggestedQuery.query, true, suggestedProducts.pagination.totalResults);
        // resultWrapper.prepend(seeAll)
        wrapper.prepend(searchEl);
    } else if (suggestedQuery.suggested || suggestedQuery.alternatives.length) {
        
        if (suggestedQuery.query == suggestedQuery.suggested.text) {
            const seeAll = prependSearchSuggestion(suggestedQuery.query, false, false, suggestedProducts.pagination.totalResults);
            resultWrapper.prepend(seeAll)
        } else {
            const searchEl = prependSearchSuggestion(suggestion, suggestedQuery.query, true);
            const seeAll = prependSearchSuggestion(suggestion, suggestedQuery.query, true, suggestedProducts.pagination.totalResults);
            resultWrapper.prepend(seeAll)
            wrapper.prepend(searchEl);
        }
    }
   
    resultsDiv.prepend(wrapper);
    setSearchResultsOffset()
    element.open();
    initialiseSearchWishlistIcons();
}

/**
 * Updates the top position of the results element to prevent overlap of the header
 */
function setSearchResultsOffset() {
    const headerWrapper = document.querySelector(".header-hp");
    if (headerWrapper) {
        var height = headerWrapper.offsetHeight;
        const heightWithoutAnnouncement = height
        const announcementBar = document.querySelector(
            "#shopify-section-top-banner"
        );
        if (announcementBar) {
            height += announcementBar.offsetHeight;
        }
        document.querySelector(
            ".modal-overlay"
        ).style.top = `${height}px`;
        if (window.innerWidth > 750) {
            document.querySelector(
                ".predictive-search--header.searchspring-search"
            ).style.top = `${height}px`;
        } else {
            document.querySelector(
                ".predictive-search--header.searchspring-search"
            ).style.top = `${heightWithoutAnnouncement}px`;
        }
    }
}

/**
 * Clears DOM Nodes of search suggestions and corrections from the predictive search results list
 */
function clearPreviousSuggestions() {
    const previousSuggestions = document.querySelectorAll(
        ".predictive-search__appended, .predictive-search__prepended"
    );
    for (let index = 0; index < previousSuggestions.length; index++) {
        previousSuggestions[index].remove();
    }
}

/**
 * Returns HTML String for displaying no products returned by searchspring suggest api
 *
 * @param {string} query string value of the unsuccessful search
 */
function noResultHandler(query) {
    const wrapper = `
        <div id="predictive-search-results">
            <span>No results found for <span class="suggestion">${query}</span></span></button>
        </div>
    <span class="predictive-search-status visually-hidden" role="status" aria-hidden="true"></span>
    `;
    return wrapper;
}

const debouncedQuery = debounce((e, el) => {
    e.preventDefault();
    const query = el.getQuery();
    if (query !== "") {
        renderSearchSuggestions(query, el);
    }
}, 300);

function onEnter(e, element) {}

function applyEventListeners() {
    const searchPageSearch = document.querySelectorAll(
        "predictive-search form"
    );
    const headerSearchEl = document.querySelector(
        "predictive-search.search-modal__form"
    );
    const headerSearchInput = headerSearchEl.querySelector(
        'input[type="search"]'
    );
    const pageSearchEl = document.querySelector(
        ".template-search__search predictive-search"
    );

    if (pageSearchEl) {
        var pageSearchInput = pageSearchEl.querySelector(
            'input[type="search"]'
        );
    }

    document.addEventListener("click", function (e) {
        const predictiveSearchElement = document.querySelector(
            ".search-modal__form"
        );
        const currentTarget = e.target;
        if (
            (!currentTarget.closest(".search-modal__form") || (currentTarget.classList.contains('modal__toggle-close-predictive') || currentTarget.closest('button').classList.contains('search-modal__close-button')) &&
            predictiveSearchElement.getAttribute("open") == "true")
        ) {
            predictiveSearchElement.querySelector('.field input').value = ""
            predictiveSearchElement.close();
            const body = document.querySelector('body')
            body.style.overflow = 'auto'
        }
    });

    headerSearchEl.addEventListener("input", (e) => {
        debouncedQuery(e, headerSearchEl);
    });
    headerSearchEl.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
            e.preventDefault();
            if (headerSearchEl.getQuery().length <= 0) return;
            const urlLoc = window.location.pathname.split("/").pop();
            const url = urlLoc.split("?")[0];
            const suggestionElement =
                headerSearchEl.querySelector("[data-corrected]");
            const originalQuery = headerSearchEl.getQuery();
            if (!originalQuery) return;
            // if (url === "search") {
            //     const input = headerSearchEl.querySelector("input");
            //     if (suggestionElement) {
            //         searchObject["q"] =
            //             suggestionElement.getAttribute("data-query");
            //         searchObject["oq"] = originalQuery;
            //         input.value = suggestionElement.getAttribute("data-query");
            //     } else {
            //         searchObject["q"] = headerSearchEl.getQuery();
            //     }
            //     if (pageSearchEl) {
            //         pageSearchInput.value = searchObject["q"];
            //     }
            //     headerSearchEl.closest("details-modal").close();
            //     sendRequest();
            // } else {
                let queryString = "/search?";
                if (suggestionElement) {
                    queryString += `q=${suggestionElement.getAttribute(
                        "data-query"
                    )}`;
                    queryString += `&oq=${originalQuery}`;
                } else {
                    queryString += `q=${originalQuery}`;
                }
                window.location.href = queryString;
            // }
        }
    });

    // headerSearchInput.addEventListener('focus', function (e) {
    //     e.preventDefault()
    //     if (e.currentTarget.value) {
    //         const query = headerSearchEl.getQuery();
    //         renderSearchSuggestions(query, headerSearchEl)
    //     }
    // })

    if (pageSearchEl) {
        pageSearchEl.addEventListener("input", (e) => {
            debouncedQuery(e, pageSearchEl);
        });
        pageSearchEl.addEventListener("keydown", (e) => {
            if (e.code === "Enter") {
                e.preventDefault();

                const suggestionElement =
                    pageSearchEl.querySelector("[data-corrected]");
                const input = pageSearchEl.querySelector("input");
                if (pageSearchEl.getQuery().length <= 0) return;

                if (suggestionElement) {
                    searchObject["q"] =
                        suggestionElement.getAttribute("data-query");
                    searchObject["oq"] = pageSearchEl.getQuery();
                    input.value = pageSearchEl.getAttribute("data-query");
                } else {
                    searchObject["q"] = pageSearchEl.getQuery();
                    delete searchObject["oq"];
                }
                sendRequest();
            }
        });

        // pageSearchInput.addEventListener('focus', function (e) {
        //     e.preventDefault()
        //     if (e.currentTarget.value) {
        //         const query = pageSearchEl.getQuery();
        //         renderSearchSuggestions(query, pageSearchEl)
        //     }
        // })
    }

    // searchPageSearch.forEach(el => {
    //     el.addEventListener('submit', function (e) {
    //         e.preventDefault();
    //         searchObject['q'] = e.currentTarget.value;
    //         sendRequest();
    //     })
    // })
}

/**
 * Function for enabling SWYM Wishlist functionality after product load
 * @returns {void}
 */
function initialiseSearchWishlistIcons() {
    if (!window.SwymCallbacks) {
        window.SwymCallbacks = []
    }
    function swymCallbackFn(swat) {
        swat.initializeActionButtons("#predictive-search-results-list")
    }
    window.SwymCallbacks.push(swymCallbackFn)
}

function initialiseDesktopSearch() {
    const headerElement = document.querySelector('details-modal.header__search')
    const details = headerElement.querySelectorAll('details')
    if (window.innerWidth > 900) {
        details.forEach(el => {
            el.setAttribute('open', 'true')
        })
    }

    const windowWidth = window.innerWidth;
    window.addEventListener('resize', function (event) {
        if (window.innerWidth == windowWidth) return;
        if (window.innerWidth > 900) {
            details.forEach(el => {
                el.setAttribute('open', 'true')
            })
        } else {
            details.forEach(el => {
                el.removeAttribute('open')
            })
        }
    }, true);
}

document.addEventListener('DOMContentLoaded', function () {
    initialiseDesktopSearch();
    applyEventListeners();
})

