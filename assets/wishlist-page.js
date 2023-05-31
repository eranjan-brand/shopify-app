
/* Product Tile Markup - You can play around with this to change the
information that appears on the Wishlisted Product tiles  */
var productCardMarkup = `<div class="swym-wishlist-grid grid">
   {{#products}} 
   <a href="{{du}}"aria-label="{{dt}}" class="grid__item swym-wishlist-item swym-is-anchor">
     <button id="swym-remove-productBtn" aria-label="Delete" data-variant-id="{{epi}}" data-product-id="{{empi}}" class="swym-delete-btn swym-nav swym-nav-1 swym-is-button">
       <span class="swym-icon">
       </span>
     </button>
     <div class="swym-wishlist-image-wrapper">
       <img alt="" class="swym-wishlist-image" src="{{iu}}">
     </div>
     <button class="swym-is-button">
       <div class="swym-title swym-title-1">
         {{dt}}
       </div>
     </button>
     <div class="swym-variant-title swym-text swym-title-2 swym-variant-title-spacer">
       {{variantinfo}}
     </div>
     <div class="swym-product-price swym-text swym-text-1">
       <div class="swym-product-final-price swym-value">
         \${{pr}}
       </div>
     </div>
     <button id="swym-custom-add-toCartBtn" data-state-cart="{{#isInCart}}swym-added{{/isInCart}}" data-product-url="{{du}}" data-variant-id="{{epi}}" data-product-id="{{empi}}" class="swym-add-to-cart-btn swym-button swym-button-1 swym-is-button swym-is-button">
       {{#isInCart}}Added to cart{{/isInCart}}{{^isInCart}}Add to cart{{/isInCart}}
     </button>
   </a>
   {{/products}}
</div>`;

function capitalizeSize(str) {
	const string = str.toLowerCase();
	let words = string.split(" ");
	for (let i = 0; i < words.length; i++) {
		if (words[i].match(/[a-z]/i)) { // check if the word contains letters
			if (words[i].toLowerCase() === "us") {
				words[i] = "US"
			} else {
				words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase();
			}
		
	  }
	}
	return words.join(" ");
  }

function getVariantInfo(variants) {
    try {
        let size = '';
        const regex = /US\ \d+/g
        const variantSplit = variants.split(',')
        variantSplit.forEach(variant => {
            if (regex.test(variant)) {
                size = variant
            }
        })
		if (size) {
            return capitalizeSize(size)
        } else {
            return variants;
        }
		
        
	} catch (err) {
        console.log("error: ", err)
		return variants;
	}
}

function onAddToCartClick(e) {
	e.preventDefault();
	var productId = e.currentTarget.getAttribute("data-product-id");
	var variantId = e.currentTarget.getAttribute("data-variant-id");
	var du = e.target.getAttribute("data-product-url");
	e.target.innerHTML = "Adding..";
	window._swat.replayAddToCart({
		empi: productId,
		du: du
	}, variantId, function(c) {
		e.target.innerHTML = "Added to Cart";
		e.target.setAttribute("data-state-cart", "swym-added");
		console.log("Successfully added product to cart.", c);
	}, function(e) {
		console.log(e);
	});
}

function onRemoveBtnClick(e) {
	e.preventDefault();
	var epi = +e.currentTarget.getAttribute("data-variant-id");
	var empi = +e.currentTarget.getAttribute("data-product-id");
	window._swat.fetch(function(products) {
		products.forEach(function(product) {
			if (epi && empi && product.epi == epi && product.empi == empi){
				window._swat.removeFromWishList(product, function() {
					if (!window.SwymCallbacks) {
						window.SwymCallbacks = [];
					}
					window.SwymCallbacks.push(swymRenderWishlist);
				});
			}
		});
	})
}

function swymRenderWishlist(swat) {
	// Get wishlist items
	swat.fetch(function(products) {
		console.log(products)
		var wishlistContentsContainer = document.getElementById("wishlist-items-container");
		var formattedWishlistedProducts = products.map(function(p) {
			p = SwymUtils.formatProductPrice(p); // formats product price and adds currency to product Object
			p.isInCart = _swat.platform.isInDeviceCart(p.epi) || (p.et == _swat.EventTypes.addToCart);
			p.variantinfo = (p.vi ? getVariantInfo(p.vi) : "");
			return p;
		});
		var productCardsMarkup = SwymUtils.renderTemplateString(productCardMarkup, {
			products: formattedWishlistedProducts
		});
		if(wishlistContentsContainer){
			wishlistContentsContainer.innerHTML = productCardsMarkup;
			attachClickListeners();
		} else{
		  console.log("Container not found, Wishlist Page element not found");
		}
	});
}

function attachClickListeners() {
	var addToCartButtons = document.querySelectorAll("#swym-custom-add-toCartBtn");
	var removeBtns = document.querySelectorAll("#swym-remove-productBtn");
	//   Add to cart Btns
	for (var i = 0; i < addToCartButtons.length; i++) {
		addToCartButtons[i].addEventListener('click', onAddToCartClick, false);
	}
	//   Remove Buttons
	for (var k = 0; k < removeBtns.length; k++) {
		removeBtns[k].addEventListener('click', onRemoveBtnClick, false);
	}
	console.log("Events attached!");
}

if (!window.SwymCallbacks) {
	window.SwymCallbacks = [];
}
window.SwymCallbacks.push(swymRenderWishlist); /* Init Here */