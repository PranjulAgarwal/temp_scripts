console.log("From CDN Script");

function renderButton(data) {
    var Active = data.Active;
    var Value = data.ButtonType;
    var colorBefore = data.ColorBeforeButton;
    var colorAfter = data.ColorAfterButton;
    var labelBefore = data.LabelBeforeButton;
    var labelAfter = data.LabelAfterButton;
    var CartLabelBefore = data.CartLabelBefore;
    var CartLabelAfter = data.CartLabelAfter;
    var color = data.CartColor;
    var Count = data.ShowCount;
    const wish_button = `<style>
    .button_wish {
    background-color: ${colorBefore};
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
    <button class="button_wish">${labelBefore}</button>`

    function init() {
    console.log("from init function")
        document
            .querySelector("div.product-single__description")
            .insertAdjacentHTML("beforebegin", wish_button);
    }
}

const serverUrl = "https://dd9bb97e4385.ngrok.io";

fetch(`${serverUrl}/db/save/${window.location.hostname}`).then(function (response) {
	// The API call was successful!
	return response.json();
}).then(function (data) {
	// This is the JSON from our response
	console.log(data);
    renderButton(data);
}).catch(function (err) {
	// There was an error
	console.warn('Something went wrong.', err);
});
