console.log("From CDN Script");
const serverUrl = "http://4738a24d230b.ngrok.io";
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
render_heart();

var wish_list = [];
var variant_id;
var product_db =[""];
var variant_data = "";

if (window.meta && window.meta.product){ 
    getProduct();
    start();
}
else console.log("not a product page");

if (window.meta && (window.meta.page.pageType === "collection")){
    console.log(document.querySelectorAll('button.heart_button_catalog'));
}

function renderHeartCatalog(){

    if(inlist){
        const icon_Btn_cata = `<i class="fa fa-heart" aria-hidden="true"></i>`
    }else{
        const icon_Btn_cata = `<i class="fa fa-heart-o" aria-hidden="true"></i>`
    }

    const heart_button_catalog =`<style>
    .button_wish_catalog {
    background-color: transparent;
    border: none;
    }
    </style>
    <button  id="{{ product.variants[0].id }}" class="button_wish_catalog"><i class="fa fa-heart-o" aria-hidden="true"></i></button>`

    document.getElementById('heart_button_catalog')

}

function getProduct(){
    variant_id = document.querySelector('select[name="id"] option[selected="selected"]').getAttribute('value');
    console.log(variant_id + " got");
    var i;
    var array = window.meta.product.variants;
    for(i=0;i<array.length;i++){
        if(array[i].id==variant_id){
            variant_data=array[i].name;
            break;
        }
    }
}

function start() {
    //fetch shop owner design settings
    console.log("in start")
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
                Customer_data_call(data);
            }
        });
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

function render_heart(){

    const wishlistUI = `<style>
    body {font-family: Arial, Helvetica, sans-serif;}
    
    /* The Modal (background) */
    .modal_wishlist {
      display: none; 
      position: fixed; 
      z-index: 99; 
      left: 0;
      top: 0;
      width: 100%; 
      height: 100%; 
      overflow: auto; 
      background-color: rgb(0,0,0); 
      background-color: rgba(0,0,0,0.4); 
    }
    
    /* Modal Content */
    .modal-content {
      position: relative;
      background-color: #fefefe;
      margin: auto;
      padding: 0;
      border: 1px solid #888;
      width: 100%;
      height: 100%;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
      -webkit-animation-name: animatetop;
      -webkit-animation-duration: 0.4s;
      animation-name: animatetop;
      animation-duration: 0.4s
    }
    
    /* Add Animation */
    @-webkit-keyframes animatetop {
      from {top:-300px; opacity:0} 
      to {top:0; opacity:1}
    }
    
    @keyframes animatetop {
      from {top:-300px; opacity:0}
      to {top:0; opacity:1}
    }
    
    /* The Close Button */
    .close {
      color: white;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    
    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
    
    .modal-header {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }
    
    .modal-body {padding: 2px 16px; height: 88.6%;}
    
    .modal-footer {
      padding: 2px 16px;
      background-color: #5cb85c;
      color: white;
    }
    </style>
    
    
    <!-- The Modal -->
    <div id="myModal" class="modal_wishlist">
    
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <span class="close">&times;</span>
          <h2>Modal Header</h2>
        </div>
        <div class="modal-body">
          <p>Some text in the Modal Body</p>
          <p>Some other text...</p>
        </div>
        <div class="modal-footer">
          <h3>Modal Footer</h3>
        </div>
      </div>
    
    </div>`

    const heart_button = `<style>
    .heart_wish {
    background-color: transparent;
    border: none;
    padding: 10px 14px;
    margin-left: 5px;
    font-size: 19px;
    text-align: center;
    }
    </style>
    <button id='myBtn' class='heart_wish'><i class='fa fa-heart' aria-hidden='true'></i></button>`
    
    // const heart_button =  document.createElement('a');
    // heart_button.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i>';
    document.querySelector("#heart_btn").innerHTML+=(heart_button);
    document.querySelector("head").insertAdjacentHTML('afterend',wishlistUI);

    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
    modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
    modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}



function Customer_data_call (data) {
    if(window.meta.page.customerId)
    {
        console.log(window.meta.page.customerId)
        const customer_id = window.meta.page.customerId;
        const shop_name = window.location.hostname;

        fetch(`https://${shop_name}/admin/api/2021-04/customers/${customer_id}.json`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
        }).then((res)=>{
            res.json().then((Customer_data)=>{
                console.log(Customer_data.customer)
                getCustomer_wishlist(Customer_data,customer_id,data)
            })
        })
    }
    else 
    {
        console.log("customer not loggedIn")
        if(window.localStorage.getItem('wish_list'))
        {
            wish_list = JSON.parse(window.localStorage.getItem('wish_list'));
            product_db = JSON.parse(window.localStorage.getItem('product_db'));
            console.log("got list")
            renderButton(data);
        }
        else
        {
            window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
            window.localStorage.setItem('product_db',JSON.stringify(product_db));
            console.log("didn't got list")
            renderButton(data);
        }
    }
    console.log(wish_list);
    console.log(product_db);
}
console.log(wish_list);
console.log(product_db);

function getCustomer_wishlist (Customer_data,customer_id,data){
    fetch(`${serverUrl}/list_db/${window.location.hostname}/${customer_id}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(Customer_data.customer)
    }).then((res)=>{
        res.json().then((Customer_wishlist)=>{
            wish_list=Customer_wishlist.product_ids;
            product_db=Customer_wishlist.product_data;
            console.log(Customer_wishlist);
            renderButton(data);
        });
    })
}


function renderButton(data) {

    var variant_id = document.querySelector('select[name="id"] option[selected="selected"]').getAttribute('value');
    console.log(variant_id)

    console.log(wish_list)
    
    if(wish_list.indexOf(variant_id)>=0)
    var in_list = true
    else
    var in_list = false
    console.log(wish_list.indexOf(variant_id))
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
    <button  id='wish_btn' class="button_wish_1">${label_Btn}</button>`

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
            document.querySelector("#wish_btn_product").innerHTML+=( wish_button_1);

        if(Value == '2')
            document.querySelector("#wish_btn_product").innerHTML+=( wish_button_2);

        if(Value == '3')
            document.querySelector("#wish_btn_product").innerHTML+=( wish_button_3);

        if(Value == '4')
            document.querySelector("#wish_btn_product").innerHTML+=( wish_button_4);

        if(Value == '5')
            document.querySelector("#wish_btn_product").innerHTML+=( wish_button_5);

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
        var variant_id = document.querySelector('select[name="id"] option[selected="selected"]').getAttribute('value');
        console.log(variant_id + "  On Prodct Page" + " in form change")

        if(wish_list.indexOf(variant_id))
        var in_list = true
        else
        var in_list = false

        changeButton(data,in_list);
    });

}

function add_variant(){

    wish_list.push(variant_id);
    product_db.push(variant_data);
    console.log(wish_list);
    console.log(product_db);
    if(!window.meta.page.customerId){
        window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
        window.localStorage.setItem('product_db',JSON.stringify(product_db));
    }else{
        fetch(`${serverUrl}/list_db/${window.location.hostname}/${window.meta.page.customerId}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body:JSON.stringify({
                product_ids:wish_list,
                product_data:product_db,
            })
        }).then((res)=>{
            res.json().then((Customer_data)=>{
                console.log(Customer_data);
            });
        })
    }
}

function delete_variant(){

    wish_list.splice(wish_list.indexOf(variant_id),1);
    product_db.splice(product_db.indexOf(variant_data),1);
    console.log(wish_list);
    console.log(product_db);
    if(!window.meta.page.customerId){
        window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
        window.localStorage.setItem('product_db',JSON.stringify(product_db));
    }else{
        fetch(`${serverUrl}/list_db/${window.location.hostname}/${window.meta.page.customerId}`,{
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body:JSON.stringify({
                products_ids:wish_list,
                products_data:product_db
            })
        }).then((res)=>{
            res.json().then((Customer_data)=>{
                console.log(Customer_data);
            });
        })
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
