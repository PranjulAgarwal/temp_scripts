 console.log("From 5 new");

const wish_button = `<style>
.button_wish {
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
<button class="button_wish">Button</button>`

function init() {
  console.log("from script 5")
    document
        .querySelector("div.product-form__item product-form__item--submit product-form__item--payment-button")
        .insertAdjacentHTML("beforebegin", wish_button);
}

init();
