const currentProductGrid = document.getElementById("product-grid");

let next_url = currentProductGrid.dataset.nextUrl;

const load_more_wrapper = document.querySelector(".collection__load-more");
const load_more_btn = document.getElementsByClassName("load-more_btn")[0];
const load_more_spinner = document.getElementsByClassName("load-more_spinner")[0];
const load_more_product_count = document.querySelector('.collection__product-count');
const load_more_product_total = document.querySelector('.collection__product-total');
async function getNextPage() {
    try {
        let res = await fetch(next_url);
        return await res.text();
    } catch (error) {
        console.log(error);
    }
}


function toggleLoadMoreDisplay(totalProducts) {
    if (totalProducts == 0) {
        load_more_wrapper.style.display = 'none'
    } else {
        const perPage = parseInt(searchObject.perPage)
        if (searchObject.page) {
            var page = parseInt(searchObject.page)
        }
        const prodCount = perPage * (page || 1) <= totalProducts ? perPage * (page || 1) : totalProducts
        load_more_product_count.textContent = prodCount
        load_more_product_total.textContent = totalProducts
        if (prodCount >= totalProducts) {
            load_more_wrapper.style.display = 'none';
        } else {
            load_more_wrapper.style.display = 'block'
        }
    }
}

async function searchSpringHandler() {
    let infiniteProductGrid = document.getElementById('product-grid');
    if (pageType === 'search') {
        infiniteProductGrid = document.querySelector('#product-grid .product-grid')
    }

    if (searchObject.page && searchObject.page !== 1) {
        searchObject.page = searchObject.page + 1
    } else {
        searchObject.page = 2
    }
    
    if (pageType === 'search') {
        var searchSpringData = await window.getSearchspringService().getSearchResults(searchObject['q'], "search", searchObject)
    } else {
        var searchSpringData = await window.getSearchspringService().getCollectionByHandle(window.handle, searchObject)
    }
    if (searchSpringData) {
        
        const products = await fetchTemplates(searchSpringData)
        infiniteProductGrid.innerHTML += products.join('')
        load_more_spinner.style.display = "none";
        document.querySelector('facet-filters-form').classList.remove('shimmer')
        document.querySelector('.facets-container').classList.remove('loading')
        load_more_btn.style.display = "block";
        const totalProducts = searchSpringData.pagination.totalResults
        toggleLoadMoreDisplay(totalProducts)
        return true;
    } else {
        return false;
    }
}

async function defaultInfiniteScrollHandler() {
    let nextPage = await getNextPage();

    const parser = new DOMParser();
    const nextPageDoc = parser.parseFromString(nextPage, "text/html");

    load_more_spinner.style.display = "none";

    const productgrid = nextPageDoc.getElementById("product-grid");
    const new_products = productgrid.getElementsByClassName("grid__item");
    const new_url = productgrid.dataset.nextUrl;
    if (new_url) {
        load_more_btn.style.display = "block";
    } else {
        load_more_wrapper.style.display = "none";
    }
    next_url = new_url;
    let prodCount = parseInt(load_more_product_count.textContent);
    for (let i = 0; i < new_products.length; i++) {
        prodCount++
        let single_product = new_products[i].cloneNode(true);
        currentProductGrid.appendChild(single_product);
    }
    load_more_product_count.textContent=prodCount
    return true;
}


async function loadMoreProducts() {
    load_more_btn.style.display = "none";
    load_more_spinner.style.display = "block";

    const loadMoreButton = document.querySelector('.collection__load-more'); 
    observer.unobserve(loadMoreButton)


    if (window.searchspring) {
        var productStatus = await searchSpringHandler()
    } else {
        var productStatus = await defaultInfiniteScrollHandler()
    }
    
    if (productStatus) {
        if (!window.SwymCallbacks) {
            window.SwymCallbacks = []
        }
        function swymCallbackFn(swat) {
            swat.initializeActionButtons("#product-grid")
        }
        window.SwymCallbacks.push(swymCallbackFn)
        observer.observe(loadMoreButton)
    }
}


let options = {
    rootMargin: "1000px"
}

const loadMoreButton = document.querySelector('.collection__load-more'); 

const observer = new IntersectionObserver(function (entries, self) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            loadMoreProducts()
        }
      });
}, options);

if (loadMoreButton) {
    observer.observe(loadMoreButton)
}





