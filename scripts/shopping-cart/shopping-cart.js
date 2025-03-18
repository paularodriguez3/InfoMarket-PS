const shoppingCart = [];

function showShoppingCart() {
    shoppingCart.forEach(item => {
        console.log(item);
    });
}

function addToCart(item) {
    shoppingCart.push(item);
}