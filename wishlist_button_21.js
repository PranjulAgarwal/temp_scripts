console.log("From CDN Script");

//inject icon js in head
(function(d, script) {
    script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.onload = function(){
        // remote script has loaded
    };
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    d.getElementsByTagName('head')[0].appendChild(script);
}(document));

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
    
    const wish_button_1 = `<style>
    .button_wish_1 {
    background-color: ${colorBefore};
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    }
    </style>
    <button class="button_wish_1">${labelBefore}</button>`

    const wish_button_2 = `<style>
    .button_wish_2 {
    background-color: ${colorBefore};
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    }
    </style>
    <button class="button_wish_2"><i class="fa fa-heart-o" aria-hidden="true"></i>${labelBefore}</button>`

    const wish_button_3 = `<style>
    .button_wish_3 {
    background-color: transparent;
    border: none;
    color: ${colorBefore};
    padding: 10px 20px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    }
    </style>
    <button class="button_wish_3">${labelBefore}</button>`

    const wish_button_4 = `<style>
    .button_wish_4 {
    background-color: transparent;
    border: none;
    color: ${colorBefore};
    padding: 10px 20px;
    text-align: center;
    display: inline-block;
    font-size: 16px;
    }
    </style>
    <button class="button_wish_4"><i class="fa fa-heart-o" aria-hidden="true"></i>${labelBefore}</button>`

    const wish_button_5 = `<style>
    .button_wish_5 {
    background-color: transparent;
    border: none;
    color: ${colorBefore};
    padding: 10px 20px;
    text-align: center;
    display: inline-block;
    font-size: 24px;
    }
    </style>
    <button class="button_wish_5"><i class="fa fa-heart-o" aria-hidden="true"></i></button>`

    init();

    function init() {
    console.log("from init function")
        
        {   
            if(value == '1')
                document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_1);

            if(value == '2')
                document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_2);

            if(value == '3')
                document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_3);

            if(value == '4')
                document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_4);

            if(value == '5')
                document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_5);
        }

    }
}

const serverUrl = "https://abb07fcc5149.ngrok.io";

//fetch shop owner design settings
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
