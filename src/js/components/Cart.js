import {
  settings,
  select,
  templates,
  classNames
} from '../settings.js';
import CartProduct from '../components/CartProduct.js';
import {
  utils
} from '../utils.js';

class Cart {
  constructor(element) {
    const thisCart = this;

    thisCart.products = [];

    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    console.log(thisCart.deliveryFee);


    thisCart.getElements(element);
    // console.log('new Cart', thisCart);
    thisCart.initActions(element);
    // thisCart.update();
  }

  getElements(element) {
    const thisCart = this;

    thisCart.dom = {};

    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = element.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = element.querySelector(select.cart.productList);
    // console.log(thisCart.dom.productList);
    thisCart.renderTotalsKeys = ['totalNumber', 'totalPrice', 'subtotalPrice', 'deliveryFee'];
    // console.log(thisCart.renderTotalsKeys);
    for (let key of thisCart.renderTotalsKeys) {
      thisCart.dom[key] = thisCart.dom.wrapper.querySelectorAll(select.cart[key]);
    }

    thisCart.dom.form = element.querySelector(select.cart.form);
    console.log(thisCart.dom.form);
    thisCart.dom.phone = element.querySelector(select.cart.phone);
    console.log(thisCart.dom.phone);
    thisCart.dom.address = element.querySelector(select.cart.address);
    console.log(thisCart.dom.address);
    /* czy ponizsze dodac w ten sposob? */
    // thisCart.dom.totalNumber = element.querySelector(select.cart.totalNumber);
    // console.log(thisCart.dom.totalNumber);
    // thisCart.dom.subtotalPrice = element.querySelector(select.cart.subtotalPrice);
    // console.log(thisCart.dom.subtotalPrice);
    // thisCart.dom.totalPrice = element.querySelector(select.cart.totalPrice);
    // console.log(thisCart.dom.totalPrice);
  }

  initActions(element) {
    const thisCart = this;

    thisCart.dom.toggleTrigger.addEventListener('click', function () {
      element.classList.toggle(classNames.cart.wrapperActive);
    });

    thisCart.dom.productList.addEventListener('updated', function () {
      thisCart.update();
    });

    thisCart.dom.productList.addEventListener('remove', function () {
      thisCart.remove(event.detail.cartProduct);
    });

    thisCart.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  sendOrder() {
    const thisCart = this;
    const url = settings.db.url + '/' + settings.db.order;

    const payload = {
      phone: thisCart.dom.phone.value,
      address: thisCart.dom.address.value,
      totalNumber: thisCart.totalNumber,
      subtotalPrice: thisCart.subtotalPrice,
      totalPrice: thisCart.totalPrice,
      deliveryFee: thisCart.deliveryFee,
      products: [],
    };

    for (let product of thisCart.products) {
      payload.products.push(product.getData());
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function (response) {
        return response.json();
      }).then(function (parsedResponse) {
        console.log('parsedResponse', parsedResponse);
      });
  }


  add(menuProduct) {
    const thisCart = this;

    const generatedHTML = templates.cartProduct(menuProduct);

    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisCart.dom.productList.appendChild(generatedDOM);

    // console.log('adding product', menuProduct);
    // console.log(generatedHTML);
    // console.log(generatedDOM);
    // thisCart.products.push(menuProduct); // zmieniamy na poznizsza
    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    // console.log('thisCart.products', thisCart.products);
    thisCart.update();
  }

  update() {
    const thisCart = this;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    for (let product of thisCart.products) {
      thisCart.subtotalPrice += product.price;
      thisCart.totalNumber += product.amount;
    }
    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
    console.log(thisCart.totalNumber);
    console.log(thisCart.subtotalPrice);

    for (let key of thisCart.renderTotalsKeys) {
      for (let elem of thisCart.dom[key]) {
        elem.innerHTML = thisCart[key];
      }
    }
  }

  remove(cartProduct) {
    const thisCart = this;

    const index = thisCart.products.indexOf(cartProduct);
    console.log(index);

    thisCart.products.splice(index);

    cartProduct.dom.wrapper.remove();
    thisCart.update();

  }
}

export default Cart;
