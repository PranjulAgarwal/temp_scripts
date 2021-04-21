console.log("From CDN Script");

//inject icon js in head
function initCss() {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute(
      "href",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    );
    document.head.appendChild(link);
}
initCss();

function renderButton(data) {

    var Value = data.ButtonType;
    var in_list = false

    if(!in_list){   
        var color_Btn = data.ColorBeforeButton;
        var label_Btn = data.LabelBeforeButton;
        var icon_Btn = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
    }else{
        var color_Btn = data.ColorAfterButton;
        var label_Btn = data.LabelAftereButton;
        var icon_Btn = `<i class="fa fa-heart" aria-hidden="true"></i>`;
    }

    console.log({in_list,color_Btn,label_Btn})
    
    const wish_button_1 = `<style>
    .button_wish_1 {
    background-color: ${color_Btn};
    border: none;
    color: white;
    padding: 7px 14px;
    text-align: center;
    display: inline-block;
    font-size: 20px;
    }
    </style>
    <button  id="wish_btn" class="button_wish_1">${label_Btn}</button>`

    const wish_button_2 = `<style>
    .button_wish_2 {
    background-color: ${color_Btn};
    border: none;
    color: white;
    padding: 7px 14px;
    text-align: center;
    display: inline-block;
    font-size: 20px;
    }
    </style>
    <button  id="wish_btn" class="button_wish_2">${icon_Btn}      ${label_Btn}</button>`

    const wish_button_3 = `<style>
    .button_wish_3 {
    background-color: transparent;
    border: none;
    color: ${color_Btn};
    padding: 7px 14px;
    text-align: center;
    display: inline-block;
    font-size: 20px;
    }
    </style>
    <button  id="wish_btn" class="button_wish_3">${label_Btn}</button>`

    const wish_button_4 = `<style>
    .button_wish_4 {
    background-color: transparent;
    border: none;
    color: ${color_Btn};
    padding: 7px 14px;
    text-align: center;
    display: inline-block;
    font-size: 20px;
    }
    </style>
    <button  id="wish_btn" class="button_wish_4">${icon_Btn}      ${label_Btn}</button>`

    const wish_button_5 = `<style>
    .button_wish_5 {
    background-color: transparent;
    border: none;
    color: ${color_Btn};
    padding: 7px 14px;
    text-align: center;
    display: inline-block;
    font-size: 24px;
    }
    </style>
    <button  id="wish_btn" class="button_wish_5">${icon_Btn}</button>`

    init(Value,wish_button_1,wish_button_2,wish_button_3,wish_button_4,wish_button_5,in_list,data,color_Btn,label_Btn);
    
}
function init(Value,wish_button_1,wish_button_2,wish_button_3,wish_button_4,wish_button_5,in_list,data,color_Btn,label_Btn) {
//console.log("from init function")
    
//eventListeners();
    console.log({in_list,color_Btn,label_Btn})
        if(Value == '1')
            document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_1);

        if(Value == '2')
            document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_2);

        if(Value == '3')
            document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_3);

        if(Value == '4')
            document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_4);

        if(Value == '5')
            document.querySelector("div.product-single__description").insertAdjacentHTML("beforebegin", wish_button_5);

    console.log(document.getElementById("wish_btn"))
    document.getElementById("wish_btn").addEventListener("click", (event) => {
        in_list = !in_list;
        changeButton(data,in_list);
    });
}

function changeButton(data,in_list){
    console.log(in_list)
    var btn = document.getElementById('wish_btn');
    if(in_list){
        if(data.ButtonType=='1'){
            btn.style.backgroundColor = `${data.ColorAfterButton}`;
            var doc = document.createTextNode(`${data.LabelAftereButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0] );
        }
        if(data.ButtonType=='2'){
            btn.style.backgroundColor = `${data.ColorAfterButton}`;
            var doc = document.createTextNode(`<i class="fa fa-heart" aria-hidden="true"></i>     ${data.LabelAftereButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
        if(data.ButtonType=='3'){
            btn.style.color = `${data.ColorAfterButton}`;
            var doc = document.createTextNode(`${data.LabelAftereButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
        if(data.ButtonType=='4'){
            btn.style.color = `${data.ColorAfterButton}`;
            var doc = document.createTextNode(`<i class="fa fa-heart" aria-hidden="true"></i>     ${data.LabelAftereButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
        if(data.ButtonType=='5'){
            btn.style.color = `${data.ColorAfterButton}`;
            var doc = document.createTextNode(`<i class="fa fa-heart" aria-hidden="true"></i>`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
    }else{
        if(data.ButtonType=='1'){
            btn.style.backgroundColor = `${data.ColorBeforeButton}`;
            var doc = document.createTextNode(`${data.LabelBeforeeButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0] );
        }
        if(data.ButtonType=='2'){
            btn.style.backgroundColor = `${data.ColorBeforeButton}`;
            var doc = document.createTextNode(`<i class="fa fa-heart-o" aria-hidden="true"></i>     ${data.LabelBeforeeButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
        if(data.ButtonType=='3'){
            btn.style.color = `${data.ColorBeforeButton}`;
            var doc = document.createTextNode(`${data.LabelBeforeeButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
        if(data.ButtonType=='4'){
            btn.style.color = `${data.ColorBeforeButton}`;
            var doc = document.createTextNode(`<i class="fa fa-heart-o" aria-hidden="true"></i>     ${data.LabelBeforeeButton}`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
        if(data.ButtonType=='5'){
            btn.style.color = `${data.ColorBeforeButton}`;
            var doc = document.createTextNode(`<i class="fa fa-heart-o" aria-hidden="true"></i>`)
            btn.childNodes[0].replaceChild(doc,btn.childNodes[0]);
        }
    }
    console.log("btn changed")
}

const serverUrl = "https://ceb2569361c5.ngrok.io";

if (window.meta && window.meta.product) start();
else console.log("not a product page");

function start() {
    //fetch shop owner design settings
    fetch(`${serverUrl}/db/save/${window.location.hostname}`).then(function (response) {
        // The API call was successful!
        return response.json();
    }).then(function (data) {
        // This is the JSON from our response
        console.log(data);
        if(data.Active)
        renderButton(data);
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}
