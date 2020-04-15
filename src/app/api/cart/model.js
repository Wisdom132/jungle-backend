module.exports = function Cart(cart) {
  this.items = cart.items || {}; //object of products
  this.totalItems = cart.totalItems || 0; // total items 
  this.totalPrice = cart.totalPrice || 0; // ttotal price of items in cart
  this.userId = cart.userId

  this.add = function(item, id) {
    var cartItem = this.items[id];
    if (!cartItem) {
      cartItem = this.items[id] = {
        item: item,
        quantity: 0,
        price: 0
      };
    }
    cartItem.quantity++;
    cartItem.price = cartItem.item.price * cartItem.quantity;
    this.totalItems++;
    this.totalPrice += cartItem.item.price;
  };

  this.remove = function(id) {
    this.totalItems -= this.items[id].quantity;
    this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };

  this.getItems = function() {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};