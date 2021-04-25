console.log("From CDN Script");
const serverUrl = "http://d2169d321375.ngrok.io";
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

var wish_list = [];
console.log(wish_list);

if (window.meta && window.meta.product){ 
    start();
}
else console.log("not a product page");

function start() {
    //fetch shop owner design settings
    fetch(`${serverUrl}/db/save/${window.location.hostname}`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
    }).then(function (response) {
        // The API call was successful!
        response.json().then(function (data) {
            // This is the JSON from our response
            if(data.Active)
            {
                renderButton(data);
                Customer_data_call();
            }
        });
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

function Customer_data_call () {
    if(window.meta.page.customerId)
    {
        console.log(window.meta.page.customerId)
        const customer_id = window.meta.page.customerId;
        fetch(`${serverUrl}/list_db/${window.location.hostname}/${customer_id}`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
        }).then((res)=>{
            res.json().then((Customer_data)=>{
                console.log(Customer_data);
            });
        })
    }
    else 
    {
        console.log("customer not loggedIn")
        if(window.localStorage.getItem('wish_list'))
        {
            wish_list = JSON.parse(window.localStorage.getItem('wish_list'));
            console.log("got list")
        }
        else
        {
            window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
            console.log("didn't got list")
        }
    }
    console.log(wish_list);
}
console.log(wish_list);


function renderButton(data) {

    var product_id = document.querySelector('select.product-form__variants option[selected="selected"]').getAttribute('value');
    console.log(product_id)

    console.log(wish_list)
    
    if(wish_list.indexOf(product_id)>=0)
    var in_list = true
    else
    var in_list = false
    console.log(wish_list.indexOf(product_id))
    console.log(in_list)
    
    var Value = data.ButtonType;

    if(!in_list){   
        var color_Btn = data.ColorBeforeButton;
        var label_Btn = data.LabelBeforeButton;
        var icon_Btn = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
    }else{
        var color_Btn = data.ColorAfterButton;
        var label_Btn = data.LabelAfterButton;
        var icon_Btn = `<i class="fa fa-heart" aria-hidden="true"></i>`;
    }
    
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
    
//eventListeners();
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

    document.getElementById("wish_btn").addEventListener("click", (event) => {
        if(!in_list){
            add_variant();
            in_list = !in_list;
            changeButton(data,in_list);
        }else{
            delete_variant();
            in_list = !in_list;
            changeButton(data,in_list);
        }
    });
    document.getElementById("ProductSelect-product-template").addEventListener("change", (event) => {
        var product_id = document.querySelector('select.product-form__variants option[selected="selected"]').getAttribute('value');
        console.log(product_id + "  On Prodct Page" + " in form change")

        if(wish_list.indexOf(product_id))
        var in_list = true
        else
        var in_list = false

        changeButton(data,in_list);
    });

}

function add_variant(){
    var product_id = document.querySelector('select.product-form__variants option[selected="selected"]').getAttribute('value');
    console.log(product_id + " added")
    wish_list.push(product_id);
    console.log(wish_list);
    if(!window.meta.page.customerId){
        window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
    }
}

function delete_variant(){
    var product_id = document.querySelector('select.product-form__variants option[selected="selected"]').getAttribute('value');
    console.log(product_id + " removed")
    wish_list.splice(wish_list.indexOf(product_id),1);
    console.log(wish_list);
    if(!window.meta.page.customerId){
        window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
    }
}

function changeButton(data,in_list){
    console.log(in_list)
    var btn = document.getElementById('wish_btn');
    if(in_list){
        if(data.ButtonType=='1'){
            btn.style.backgroundColor = `${data.ColorAfterButton}`;
            btn.innerHTML=`${data.LabelAfterButton}`;
        }
        if(data.ButtonType=='2'){
            btn.style.backgroundColor = `${data.ColorAfterButton}`;
            btn.innerHTML=`<i class="fa fa-heart" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
        }
        if(data.ButtonType=='3'){
            btn.style.color = `${data.ColorAfterButton}`;
            btn.innerHTML=`${data.LabelAfterButton}`;
        }
        if(data.ButtonType=='4'){
            btn.style.color = `${data.ColorAfterButton}`;
            btn.innerHTML=`<i class="fa fa-heart" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
        }
        if(data.ButtonType=='5'){
            btn.style.color = `${data.ColorAfterButton}`;
            btn.innerHTML=`<i class="fa fa-heart" aria-hidden="true"></i>`;
        }
        
    }else{
        if(data.ButtonType=='1'){
            btn.style.backgroundColor = `${data.ColorBeforeButton}`;
            btn.innerHTML=`${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='2'){
            btn.style.backgroundColor = `${data.ColorBeforeButton}`;
            btn.innerHTML=`<i class="fa fa-heart-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='3'){
            btn.style.color = `${data.ColorBeforeButton}`;
            btn.innerHTML=`${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='4'){
            btn.style.color = `${data.ColorBeforeButton}`;
            btn.innerHTML=`<i class="fa fa-heart-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='5'){
            btn.style.color = `${data.ColorBeforeButton}`;
            btn.innerHTML=`<i class="fa fa-heart-o" aria-hidden="true"></i>`;
        }
    }
    console.log("btn changed")
}
