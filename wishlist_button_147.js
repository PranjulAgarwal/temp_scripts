console.log("From CDN Script");
const serverUrl = "http://1418c2ca535b.ngrok.io";
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
Customer_data_call();

function Customer_data_call () {
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
                getCustomer_wishlist(Customer_data,customer_id)
            })
        })
    }
    else 
    {
        console.log("customer not loggedIn")
        if(window.localStorage.getItem('wish_list')&&window.localStorage.getItem('product_db'))
        {
            wish_list = JSON.parse(window.localStorage.getItem('wish_list'));
            product_db = JSON.parse(window.localStorage.getItem('product_db'));
            console.log("got list")
            renderItems();
            if (window.meta && window.meta.product){ 
                getProduct();
                start();

            }
            else console.log("not a product page");
            
            if (window.meta && (window.meta.page.pageType === "collection")){
                renderHeartCatalog();
            }
            // renderButton(data);
        }
        else
        {
            window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
            window.localStorage.setItem('product_db',JSON.stringify(product_db));
            console.log("didn't got list")
            renderItems();
            if (window.meta && window.meta.product){ 
                getProduct();
                start();
            }
            else console.log("not a product page");
            
            if (window.meta && (window.meta.page.pageType === "collection")){
                renderHeartCatalog();
            }
            // renderButton(data);
        }
    }
    console.log(wish_list);
    console.log(product_db);
}


function getCustomer_wishlist (Customer_data,customer_id){
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
            console.log(wish_list);
            console.log(product_db);
            renderItems();
            if (window.meta && window.meta.product){ 
                getProduct();
                start();
            }
            else console.log("not a product page");
            
            if (window.meta && (window.meta.page.pageType === "collection")){
                renderHeartCatalog();
            }
            // renderButton(data);
        });
    })
}


 function renderHeartCatalog(){

    var products_catalog = document.querySelectorAll('button.button_wish_catalog');
    for (var i = 0; i < products_catalog.length; i++) {
    var inlist_index = wish_list.indexOf(products_catalog[i].getAttribute('id'));
    if(inlist_index>-1){
        products_catalog[i].innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>`;
    }
    products_catalog[i].addEventListener('click', function() {
      console.clear();
      inlist_index = wish_list.indexOf(this.getAttribute('id'));
      console.log("You clicked:", this.getAttribute('id') + " " + this.getAttribute('data-product-name') + " " + this.getAttribute('data-variant-name'));
      variant_id = this.getAttribute('id');
      variant_data = (this.getAttribute('data-product-name') + " - " + this.getAttribute('data-variant-name'));
      if(inlist_index==-1){
          add_variant();
          this.innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>`;
        }else{
            delete_variant();
            this.innerHTML = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
      }
    });
  }

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
                // Customer_data_call(data);
                renderButton(data);
                document.getElementsByName('select')[0].addEventListener('change',renderButton(data));
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

    .product_card {
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    transition: 0.3s;
    border-radius: 5px;
    margin: 1em;
    width: 150px;
    }
    
    .product_card:hover {
        box-shadow: 0 8px 16px 0 rgba(0,0,0,0.4);
    }
    
    .prod_img {
        border-radius: 5px 5px 0 0;
        width:100%;
        height:150px;
    }
    
    .card_container {
        padding-inline: 0.4em;
    }
    .addtocart_btn:hover{
        cursor: pointer;
    }
    
    .addtocart_btn {
        background-color: red;
        color: white;
        width: 100%;
        padding: 5px;
        font-size: 16px;
        text-align: center;
        border-radius: 0px 0px 5px 5px;
    }
    .button_wishlistUI { 
        background-color: transparent; 
        border: none; 
        position: absolute; 
        margin-top: 3px;
        font-size: 16px;
    }
    .button_wishlistUI:hover{
        cursor: pointer;
    }

    </style>
    
    
    <!-- The Modal -->
    <div id="myModal" class="modal_wishlist">
    
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <span class="close">&times;</span>
          <h2>Wishlist</h2>
        </div>
        <div class="modal-body">
            <div style="display: flex; flex-wrap: wrap; " id="wishlist_grid">
            </dv>
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

function renderItems(){
    const shop_name = window.location.hostname;
    for(var i=0;i<wish_list.length;i++){
        var variantid = wish_list[i];
        fetch(`https://${shop_name}/admin/api/2021-04/variants/${variantid}.json`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
        }).then((res)=>{
            res.json().then((data)=>{
                console.log(data.variant);
                const productid = data.variant.product_id;
                const variantTitle = data.variant.title;
                const variantPrice = data.variant.price;
                fetch(`https://${shop_name}/admin/api/2021-04/products/${productid}.json`,{
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      accept: "application/json",
                    },
                }).then((res)=>{
                    res.json().then((productData)=>{
                        const productTitle = productData.product.title;
                        const productImg = productData.product.images[0].src;
                        const productHandle = productData.product.handle;
                        const productUrl = `https://${shop_name}/products/${productHandle}`;
                        
                        const productCard = `<div class="product_card" id="${productTitle} - ${variantTitle}">
                                                <button id="${variantid}" data-item="${productTitle} - ${variantTitle}" class="button_wishlistUI">
                                                    <i class="fa fa-heart" aria-hidden="true"></i>
                                                </button>
                                                <a href="${productUrl}" style="text-decoration: none; color:black;">
                                                    <img src="${productImg}" class="prod_img" alt="${productTitle}">
                                                    <div class="card_container">
                                                        <div style="display: flow-root;">
                                                            <h4><b>${productTitle}</b></h4> 
                                                            <p>${variantTitle}</p> 
                                                        </div>
                                                        <p>Price: ${variantPrice}</p> 
                                                    </div>
                                                </a>
                                                <div id="${variantid}" data-item="${productTitle} - ${variantTitle}" class="addtocart_btn">
                                                    Added to Cart
                                                </div>
                                            </div>`;                  
                        document.getElementById('wishlist_grid').innerHTML+= productCard;
                        console.log("added" + i);
                        buttonMethods();
                    })
                }).then(()=>{
                })
            })
        })
    }
}

function buttonMethods() {
    
    var remove_btn = document.querySelectorAll('button.button_wishlistUI');
    for (var i = 0; i < remove_btn.length; i++) {
        
        remove_btn[i].addEventListener('click', function() {
            console.clear();
            console.log("You clicked remove:", this.getAttribute('id'));
            variant_id = this.getAttribute('id');
            variant_data = (this.getAttribute('data-item'));
            document.getElementById(`${variant_data}`).remove();
            delete_variant();
        });
        
    }

    var cart_btn = document.querySelectorAll('div.addtocart_btn');
    for (var i = 0; i < remove_btn.length; i++) {
        
        cart_btn[i].addEventListener('click', function() {
            console.clear();
            variant_id = this.getAttribute('id');
            variant_data = (this.getAttribute('data-item'));
            console.log("You clicked add to cart:", this.getAttribute('data-item'));
        });
        
    }
}

window.addEventListener('')

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
    width: 98%;
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
    width: 98%;
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
    width: 98%;
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
    width: 98%;
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
    width: 98%;
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
            document.querySelector("#wish_btn_product").innerHTML=( wish_button_1);

        if(Value == '2')
            document.querySelector("#wish_btn_product").innerHTML=( wish_button_2);

        if(Value == '3')
            document.querySelector("#wish_btn_product").innerHTML=( wish_button_3);

        if(Value == '4')
            document.querySelector("#wish_btn_product").innerHTML=( wish_button_4);

        if(Value == '5')
            document.querySelector("#wish_btn_product").innerHTML=( wish_button_5);

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
