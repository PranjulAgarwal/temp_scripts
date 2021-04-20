console.log("From 11 new");

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
  console.log("from script 11")
    document
        .querySelector("div.product-single__description")
        .insertAdjacentHTML("beforebegin", wish_button);
}

const serverUrl = "https://39c8a2397cd7.ngrok.io";

fetch(`${serverUrl}/db/save/${window.location.hostname}`).then(function (data) {
	// This is the JSON from our data
	console.log(data.json());
    init();
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});
