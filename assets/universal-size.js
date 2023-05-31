document.addEventListener("click", function (e) {
    //e.stopImmediatePropagation();
    const clickTarget = e.target.closest(
        ".universal-dropdown .universal-dropdown-container"
    );
    const selectTarget = e.target.closest(
        ".universal-dropdown .universal-dropdown-container ul.universal-size-list"
    );
    const activeProduct = e.target.closest('[id^="ProductInfo-"]');

    if (clickTarget) {
        openDropdown(clickTarget);
    }

    if (selectTarget) {
        //console.log('label:',selectTarget.previousElementSibling);
        changeSize(selectTarget, e);
        if (activeProduct) {
            printSizeGrids(activeProduct, e);
        }
    }

    if (
        !e.target.matches(".universal-select") &&
        e.target.closest('[id^="ProductInfo-"]')
    ) {
        const dropdowns = e.target
            .closest('[id^="ProductInfo-"]')
            .querySelector(".universal-size-list");
        if (dropdowns) {
            if (dropdowns.classList.contains("hp-open")) {
                dropdowns.classList.remove("hp-open");
            }
        } else {
            console.log("not exist");
        }
    }
});

document.addEventListener("DOMContentLoaded", function () {
    //  Function for setting default size select for size grid
    // product_default_size value set in universal-size-grid.liquid
    const sizeElement = document.querySelector(
        `.size-option[data-size="${window.product_default_size}"]`
    );
    if (sizeElement) {
        sizeElement.click();
    }
});

function openDropdown(target) {
    target.querySelector(".universal-size-list").classList.toggle("hp-open");
}

function changeSize(targetParent, event) {
    let label =
        targetParent.previousElementSibling.querySelector(".universal-label");

    label.innerHTML = event.target.dataset.size;
    label.dataset.title = event.target.dataset.size;
    for (let element of targetParent.children) {
        if (
            element.dataset.size != label.dataset.title &&
            element.classList.contains("selected")
        ) {
            element.classList.remove("selected");
        }
    }

    if (!event.target.classList.contains("selected")) {
        event.target.classList.add("selected");
    }
}

function printSizeGrids(currentProduct, event) {
    const ukSize = JSON.parse(
        JSON.parse(
            currentProduct.querySelector('[id^="UniSizeUK-"]').textContent
        )
    );
    const usSize = JSON.parse(
        JSON.parse(
            currentProduct.querySelector('[id^="UniSizeUS-"]').textContent
        )
    );
    const euroSize = JSON.parse(
        JSON.parse(
            currentProduct.querySelector('[id^="UniSizeEU-"]').textContent
        )
    );

    const originalSizes = currentProduct.querySelector(
        "fieldset.product-form__input"
    );
    let selectedSize = event.target.dataset.size;

    originalSizes.querySelectorAll("label").forEach((element, index) => {
        switch (selectedSize) {
            case "UK":
                element.innerHTML = `<span>UK</span><span>${
                    ukSize[`key${index}`]
                }</span>`;
                // element.innerHTML = `<span>${ukSize[`key${index}`]}</span>`;
                break;
            case "US":
                element.innerHTML = `<span>US</span><span>${
                    usSize[`key${index}`]
                }</span>`;
                // element.innerHTML += `<span>${usSize[`key${index}`]}</span>`;
                break;
            case "EU":
                element.innerHTML = `<span>EU</span><span>${
                    euroSize[`key${index}`]
                }</span>`;
                // element.innerHTML = `<span>${euroSize[`key${index}`]}</span>`;
                break;
            default:
                element.innerHTML = `<span>UK</span><br><span>${
                    ukSize[`key${index}`]
                }</span>`;
            // element.innerHTML = `<span>${ukSize[`key${index}`]}</span>`;
        }
    });
}
