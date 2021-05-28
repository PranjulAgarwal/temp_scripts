const serverUrl = "https://6c0c0e21d634.ngrok.io"; //Backend URL
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
//inject icon js in head is done

var wish_list = [];
var product_db =[];
var variant_id;
var variant_data = "";
var cart_items = [];

start();

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
                getCustomer_wishlist(data,Customer_data,customer_id)
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
            renderItems(data);
            
            // if (window.meta && (window.meta.page.pageType === "collection")){
            //     renderHeartCatalog(data);
            // }
                renderHeartCatalog(data);
            if (window.meta && window.meta.product){
                renderButton(data);
                document.getElementsByTagName('select')[0].onchange = function() {
                    renderButton(data);
                    getProduct();
                }
            }
        }
        else
        {
            window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
            window.localStorage.setItem('product_db',JSON.stringify(product_db));
            console.log("didn't got list")
            renderItems(data);
            
            // if (window.meta && (window.meta.page.pageType === "collection")){
            //     renderHeartCatalog(data);
            // }
            renderHeartCatalog(data);
            if (window.meta && window.meta.product){
                renderButton(data);
                document.getElementsByTagName('select')[0].onchange = function() {
                    renderButton(data);
                    getProduct();
                }
            }
        }
    }
    console.log(wish_list);
    console.log(product_db);
}

function getCustomer_wishlist (data,Customer_data,customer_id){
    fetch(`${serverUrl}/list_db/${window.location.hostname}/${customer_id}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(Customer_data.customer)
    }).then((res)=>{
        res.json().then((Customer_wishlist)=>{
            if(Customer_wishlist.product_ids.length>0&&Customer_wishlist.product_data.length>0){
                wish_list=Customer_wishlist.product_ids;
                product_db=Customer_wishlist.product_data;
            }else{
                console.log("customer is new or have empty list")
                if(window.localStorage.getItem('wish_list')&&window.localStorage.getItem('product_db'))
                {
                    wish_list = JSON.parse(window.localStorage.getItem('wish_list'));
                    product_db = JSON.parse(window.localStorage.getItem('product_db'));
                    console.log("got list")
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
            console.log(Customer_wishlist);
            console.log(wish_list);
            console.log(product_db);
            renderItems(data);
            
            // if (window.meta && (window.meta.page.pageType === "collection")){
            //     renderHeartCatalog(data);
            // }
            renderHeartCatalog(data);
            if (window.meta && window.meta.product){
                renderButton(data);
                document.getElementsByTagName('select')[0].onchange = function() {
                    renderButton(data);
                    getProduct();
                }
            }
        });
    })
}

 function renderHeartCatalog(data){

    var products_catalog = document.querySelectorAll('button.button_wish_catalog');
    for (var i = 0; i < products_catalog.length; i++) {
    var inlist_index = wish_list.indexOf(products_catalog[i].getAttribute('id'));
    if(inlist_index>-1){
        if(data.CataIconType=='10'){
            products_catalog[i].innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='11'){
            products_catalog[i].innerHTML = `<i class="fa fa-star" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='12'){
            products_catalog[i].innerHTML = `<i class="fa fa-thumbs-up" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='13'){
            products_catalog[i].innerHTML = `<i class="fa fa-bookmark" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
    }else{
        if(data.CataIconType=='10'){
            products_catalog[i].innerHTML = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='11'){
            products_catalog[i].innerHTML = `<i class="fa fa-star-o" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='12'){
            products_catalog[i].innerHTML = `<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='13'){
            products_catalog[i].innerHTML = `<i class="fa fa-bookmark-o" aria-hidden="true"></i>`;
            products_catalog[i].style.color =`${data.CataIconColor}`;
        }
    }
    products_catalog[i].addEventListener('click', function() {
    //   console.clear();
      inlist_index = wish_list.indexOf(this.getAttribute('id'));
    //   console.log("You clicked:", this.getAttribute('id') + " " + this.getAttribute('data-product-name') + " " + this.getAttribute('data-variant-name'));
      variant_id = this.getAttribute('id');
      variant_data = (this.getAttribute('data-product-name') + " - " + this.getAttribute('data-variant-name'));
      if(inlist_index==-1){
          add_variant();
          if(data.CataIconType=='10'){
            this.innerHTML = `<i class="fa fa-heart" aria-hidden="true"></i>`;
            this.style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='11'){
            this.innerHTML = `<i class="fa fa-star" aria-hidden="true"></i>`;
            this.style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='12'){
            this.innerHTML = `<i class="fa fa-thumbs-up" aria-hidden="true"></i>`;
            this.style.color =`${data.CataIconColor}`;
        }
        if(data.CataIconType=='13'){
            this.innerHTML = `<i class="fa fa-bookmark" aria-hidden="true"></i>`;
            this.style.color =`${data.CataIconColor}`;
        }
        }else{
            delete_variant();
            if(data.CataIconType=='10'){
                this.innerHTML = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
                this.style.color =`${data.CataIconColor}`;
            }
            if(data.CataIconType=='11'){
                this.innerHTML = `<i class="fa fa-star-o" aria-hidden="true"></i>`;
                this.style.color =`${data.CataIconColor}`;
            }
            if(data.CataIconType=='12'){
                this.innerHTML = `<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>`;
                this.style.color =`${data.CataIconColor}`;
            }
            if(data.CataIconType=='13'){
                this.innerHTML = `<i class="fa fa-bookmark-o" aria-hidden="true"></i>`;
                this.style.color =`${data.CataIconColor}`;
            }
      }
    });
  }

}

function getProduct(){
    var urlParams = new URLSearchParams(window.location.search);
    var myParam = urlParams.get('variant');
    if(myParam){
        variant_id=myParam;
    }
    else{
        variant_id = (window.meta.product.variants[0].id).toString();
    }
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
                render_heart(data);
                // if (window.meta && window.meta.product){
                //     renderButton(data);
                //     document.getElementsByTagName('select')[0].onchange = function() {
                //         renderButton(data);
                //         getProduct();
                //     }
                // }
            }
        });
    }).catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
    });
}

function render_heart(data){

    const wishlistUI = `<style>
    body {font-family: Arial, Helvetica, sans-serif;}
    
    /* The Modal (background) */
    .modal_wishlist {
      display: none; 
      position: fixed; 
      z-index: 99; 
      left: 0;
      top: 0;
      padding-top: 10em;
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
      border-radius: 10px;
      margin: auto;
      padding: 0;
      border: 1px solid #888;
      width: 80%;
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
      padding-block: 0.6em;
    }
    
    .close:hover,
    .close:focus {
      color: #000;
      text-decoration: none;
      cursor: pointer;
    }
    
    .modal-header {
      padding: 1vh 2vw;
      background-color:  ${data.CartColor};
      border-top-right-radius: 9px;
    border-top-left-radius: 9px;
    }
    
    .modal-body {padding: 2px 16px; height: 88.6%;min-height: 20vh;}

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
        background-color: ${data.CartColor};
        color: white;
        width: 100%;
        padding: 5px;
        font-size: 16px;
        text-align: center;
        border-radius: 0px 0px 5px 5px;
    }
    .outofstock_btn {
        background-color: #565350;
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

    .modal-menu{
        float: right;
    	padding: 8px;
    	margin-right: 15px;
    }

    </style>
    
    
    <!-- The Modal -->
    <div id="myModal" class="modal_wishlist">
    
      <!-- Modal content -->
      <div class="modal-content">
        <div class="modal-header">
          <span class="close">&times;</span>
          <h2 style="color: white;">WISHLIST</h2>
        </div>
        <div class="modal-body">
            <div style="display: flex; flex-wrap: wrap; " id="wishlist_grid">
            </div>
        </div>
      </div>
    
    </div>`

    const heart_button = `<style>
    .heart_wish {
    background-color: transparent;
    border: none;
    text-align: center;
    font-size: 1.5em;
    color: ${data.CataIconColor};
    }
    </style>
    <button id='myBtn' class='heart_wish'><i class='fa fa-heart' aria-hidden='true'></i></button>`

    const star_button = `<style>
    .heart_wish {
    background-color: transparent;
    border: none;
    text-align: center;
    font-size: 1.5em;
    color: ${data.CataIconColor};
    }
    </style>
    <button id='myBtn' class='heart_wish'><i class="fa fa-star" aria-hidden="true"></i></button>`

    const thumbsup_button = `<style>
    .heart_wish {
    background-color: transparent;
    border: none;
    text-align: center;
    font-size: 1.5em;
    color: ${data.CataIconColor};
    }
    </style>
    <button id='myBtn' class='heart_wish'><i class="fa fa-thumbs-up" aria-hidden="true"></i></button>`

    const bookmark_button = `<style>
    .heart_wish {
    background-color: transparent;
    border: none;
    text-align: center;
    font-size: 1.5em;
    color: ${data.CataIconColor};
    }
    </style>
    <button id='myBtn' class='heart_wish'><i class="fa fa-bookmark" aria-hidden="true"></i></button>`
    
    if(data.CataIconType=='10')
    {
        document.querySelector("#heart_btn").innerHTML=(heart_button);
        document.querySelector("desktop_btn").appendChild=(<button id='myBtn' class='heart_wish_desktop'><i class='fa fa-heart-o' aria-hidden='true'></i></button>);
        document.querySelector("mobile_btn").appendChild=(<button id='myBtn' class='heart_wish_mobile'><i class='fa fa-heart-o' aria-hidden='true'></i></button>);
    }
    if(data.CataIconType=='11')
    {
        document.querySelector("#heart_btn").innerHTML=(star_button);
        document.querySelector("desktop_btn").appendChild=(<button id='myBtn' class='heart_wish_desktop'><i class='fa fa-star-o' aria-hidden='true'></i></button>);
        document.querySelector("mobile_btn").appendChild=(<button id='myBtn' class='heart_wish_mobile'><i class='fa fa-star-o' aria-hidden='true'></i></button>);
    }
    if(data.CataIconType=='12')
    {
        document.querySelector("#heart_btn").innerHTML=(thumbsup_button);
        document.querySelector("desktop_btn").appendChild=(<button id='myBtn' class='heart_wish_desktop'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>);
        document.querySelector("mobile_btn").appendChild=(<button id='myBtn' class='heart_wish_mobile'><i class='fa fa-thumbs-o-up' aria-hidden='true'></i></button>);
    }
    if(data.CataIconType=='13')
    {
        document.querySelector("#heart_btn").innerHTML=(bookmark_button);
        document.querySelector("desktop_btn").appendChild=(<button id='myBtn' class='heart_wish_desktop'><i class='fa fa-bookmark-o' aria-hidden='true'></i></button>);
        document.querySelector("mobile_btn").appendChild=(<button id='myBtn' class='heart_wish_mobile'><i class='fa fa-bookmark-o' aria-hidden='true'></i></button>);
    }
    
    



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

    function myFunction(x) {
        if (x.matches) { // If media query matches
          document.getElementsByClassName('desktop_btn').style.display = "none";
        } else {
          document.getElementsByClassName('desktop_btn').style.display = "block";
        }
      }
      
      var x = window.matchMedia("(max-width: 770px)")
      myFunction(x) // Call listener function at run time
      x.addEventListener('change',()=>{myFunction}) // Attach listener function on state changes
    
}



function renderItems(data){
    const shop_name = window.location.hostname;
    
    
    for(var i=0;i<wish_list.length;i++){
        const variantid = wish_list[i];
        fetch(`https://${shop_name}/admin/api/2021-04/variants/${variantid}.json`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
        }).then((res)=>{
            res.json().then((variantData)=>{
                console.log(variantData.variant);
                const productid = variantData.variant.product_id;
                const variantTitle = variantData.variant.title;
                const variantPrice = variantData.variant.price;
                const inventory_quantity = variantData.variant.inventory_quantity;
                fetch(`https://${shop_name}/admin/api/2021-04/products/${productid}.json`,{
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      accept: "application/json",
                    },
                }).then((res)=>{
                    res.json().then((productData)=>{
                        const productTitle = productData.product.title;
                        const productImg = (productData.product.images[0].src||`https://www.google.com/imgres?imgurl=https%3A%2F%2Fwww.spmcil.com%2FUploadImage%2Fim0094014.52708cb3-2ba3-4651-a658-f9a90ad8c6d2.jpg&imgrefurl=https%3A%2F%2Fwww.spmcil.com%2FInterface%2FProductDescription.aspx%3FImage%3DoqrLGyfRtSbUVc9gxvkfNPDYIJtQIKtxsSRmq9brjG%2F1gI4fe%2BKjKOv5Xu18mYCjLpcvTPbJvhc35c5ew5WBVXxP3HQf1guf%26ProdId%3Ds6wC3wbar4Q%3D%26From%3DSmfP2cdfE1E%3D&tbnid=Ml0YucuXCpLq4M&vet=12ahUKEwjgtsTC5ufwAhXUNisKHXkgCSEQMygNegUIARDcAQ..i&docid=IOUkonp9V_AoyM&w=300&h=300&q=product%20image%20not%20available&ved=2ahUKEwjgtsTC5ufwAhXUNisKHXkgCSEQMygNegUIARDcAQ`);
                        const productHandle = productData.product.handle;
                        const productUrl = `https://${shop_name}/products/${productHandle}`;
                        if(data.CataIconType=='10')
                        var remove_wishlist = `<i class="fa fa-heart" aria-hidden="true"></i>`;
                        if(data.CataIconType=='11')
                        var remove_wishlist = `<i class="fa fa-star" aria-hidden="true"></i>`;
                        if(data.CataIconType=='12')
                        var remove_wishlist = `<i class="fa fa-thumbs-up" aria-hidden="true"></i>`;
                        if(data.CataIconType=='13')
                        var remove_wishlist = `<i class="fa fa-bookmark" aria-hidden="true"></i>`;
                        const productCard = `<div class="product_card" id="${productTitle} - ${variantTitle}">
                                                <button id="${variantid}" style="color:${data.CataIconColor}" data-item="${productTitle} - ${variantTitle}" class="button_wishlistUI">
                                                    ${remove_wishlist}
                                                </button>
                                                <a href="${productUrl}" style="text-decoration: none; color:black;">
                                                    <img src="${productImg}" class="prod_img" alt="${productTitle}">
                                                    <div class="card_container">
                                                        <div style="display: flow-root;">
                                                            <h6 style="display: flex;
                                                            flex-direction: row;
                                                            height: 3vh;
                                                            overflow: hidden;"><b>${productTitle}</b></h6> 
                                                            <p>${variantTitle}</p> 
                                                        </div>
                                                        <p>Price: ${variantPrice}</p> 
                                                    </div>
                                                </a>
                                                <div id="${variantid}" data-item="${productTitle} - ${variantTitle}" class="addtocart_btn">
                                                    ${data.CartLabelBefore}
                                                </div>
                                            </div>`;                  
                        const CartItemCard = `<div class="product_card" id="${productTitle} - ${variantTitle}">
                                                <button id="${variantid}" style="color:${data.CataIconColor}" data-item="${productTitle} - ${variantTitle}" class="button_wishlistUI">
                                                    ${remove_wishlist}
                                                </button>
                                                <a href="${productUrl}" style="text-decoration: none; color:black;">
                                                    <img src="${productImg}" class="prod_img" alt="${productTitle}">
                                                    <div class="card_container">
                                                        <div style="display: flow-root;">
                                                            <h6 style="display: flex;
                                                            flex-direction: row;
                                                            height: 3vh;
                                                            overflow: hidden;"><b>${productTitle}</b></h6> 
                                                            <p>${variantTitle}</p> 
                                                        </div>
                                                        <p>Price: ${variantPrice}</p> 
                                                    </div>
                                                </a>
                                                <div id="${variantid}" data-item="${productTitle} - ${variantTitle}" class="addtocart_btn">
                                                    ${data.CartLabelAfter}
                                                </div>
                                            </div>`;                  
                        const OutofStockCard = `<div class="product_card" id="${productTitle} - ${variantTitle}">
                                                <button id="${variantid}" style="color:${data.CataIconColor}" data-item="${productTitle} - ${variantTitle}" class="button_wishlistUI">
                                                    ${remove_wishlist}
                                                </button>
                                                <a href="${productUrl}" style="text-decoration: none; color:black;">
                                                    <img src="${productImg}" class="prod_img" alt="${productTitle}">
                                                    <div class="card_container">
                                                        <div style="display: flow-root;">
                                                            <h6 style="display: flex;
                                                            flex-direction: row;
                                                            height: 3vh;
                                                            overflow: hidden;"><b>${productTitle}</b></h6> 
                                                            <p>${variantTitle}</p> 
                                                        </div>
                                                        <p>Price: ${variantPrice}</p> 
                                                    </div>
                                                </a>
                                                <div id="${variantid}" data-item="${productTitle} - ${variantTitle}" class="outofstock_btn">
                                                    OUT OF STOCK
                                                </div>
                                            </div>`;
                        if(inventory_quantity>0)                  
                        {
                            document.getElementById('wishlist_grid').innerHTML+= productCard;
                        }
                        else
                        document.getElementById('wishlist_grid').innerHTML+= OutofStockCard;
                        console.log("added" + i);
                        buttonMethods(data);
                    })
                }).then(()=>{
                })
            })
        })
    }
}

fetch(`https://${window.location.hostname}/cart.js`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
        }).then((res)=>{
            res.json().then((cartData)=>{
                for(var i=0;i<cartData.item_count;i++){
                    cart_items.push((cartData.items[i].variant_id).toString())
                }
                console.log(cart_items)
            })
        })

function buttonMethods(data) {
    const shop_name = window.location.hostname;
    
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
    for (var i = 0; i < cart_btn.length; i++) {
        
        cart_btn[i].addEventListener('click', function() {
            console.clear();
            console.log("You clicked add to cart:", this.getAttribute('data-item'));
            console.log(this.getAttribute('id'))
            this.innerHTML = data.CartLabelAfter
            addtocart(this.getAttribute('id'))
        });
    }
    
    cartCheck(data);
}

function cartCheck(data){
    var cart_btn = document.querySelectorAll('div.addtocart_btn');
    for (var i = 0; i < cart_btn.length; i++) {

        var incart = cart_items.indexOf(cart_btn[i].getAttribute('id'));
        if(((incart)>-1)){
            cart_btn[i].innerHTML = data.CartLabelAfter
            console.log(cart_items.indexOf(cart_btn[i].getAttribute('id')))
            console.log('here ' + cart_btn[i].getAttribute('id'))
        }else{
            cart_btn[i].innerHTML = data.CartLabelBefore
            console.log("not here")
        }
    }
}

function addtocart(id){
    const shop_name = window.location.hostname;
    const ID = parseInt(id)
    let formData = {
        'items': [{
         'id': ID,
         'quantity': 1
         }]
       };
       
       fetch(`https://${shop_name}/cart/add.js`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify(formData)
       })
       .then((response) => {
           console.log('added'+ (response))
       })
       .catch((error) => {
         console.error('Error:', error);
       });
}

function renderButton(data) {

    var urlParams = new URLSearchParams(window.location.search);
    var myParam = urlParams.get('variant');
    if(myParam){
        variant_id=myParam;
    }
    else{
        variant_id = (window.meta.product.variants[0].id).toString();
    }
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
        if(data.IconType=='6')
        var icon_Btn = `<i class="fa fa-heart-o" aria-hidden="true"></i>`;
        if(data.IconType=='7')
        var icon_Btn = `<i class="fa fa-star-o" aria-hidden="true"></i>`;
        if(data.IconType=='8')
        var icon_Btn = `<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>`;
        if(data.IconType=='9')
        var icon_Btn = `<i class="fa fa-bookmark-o" aria-hidden="true"></i>`;
    }else{
        var color_Btn = data.ColorAfterButton;
        var label_Btn = data.LabelAfterButton;
        if(data.IconType=='6')
        var icon_Btn = `<i class="fa fa-heart" aria-hidden="true"></i>`;
        if(data.IconType=='7')
        var icon_Btn = `<i class="fa fa-star" aria-hidden="true"></i>`;
        if(data.IconType=='8')
        var icon_Btn = `<i class="fa fa-thumbs-up" aria-hidden="true"></i>`;
        if(data.IconType=='9')
        var icon_Btn = `<i class="fa fa-bookmark" aria-hidden="true"></i>`;
    }
    
    const wish_button_1 = `<style>
    .button_wish_1 {
    background-color: ${color_Btn};
    border: none;
    color: white;
    padding: 7px 14px;
    width: 100%;
    text-align: center;
    display: inline-block;
    }
    </style>
    <button  id='wish_btn' class="button_wish_1">${label_Btn}</button>`

    const wish_button_2 = `<style>
    .button_wish_2 {
    background-color: ${color_Btn};
    border: none;
    color: white;
    padding: 7px 14px;
    width: 100%;
    text-align: center;
    display: inline-block;
    }
    </style>
    <button  id="wish_btn" class="button_wish_2">${icon_Btn}      ${label_Btn}</button>`

    const wish_button_3 = `<style>
    .button_wish_3 {
    background-color: transparent;
    border: none;
    color: ${color_Btn};
    padding: 7px 14px;
    width: 100%;
    text-align: center;
    display: inline-block;
    }
    </style>
    <button  id="wish_btn" class="button_wish_3">${label_Btn}</button>`

    const wish_button_4 = `<style>
    .button_wish_4 {
    background-color: transparent;
    border: none;
    color: ${color_Btn};
    padding: 7px 14px;
    width: 100%;
    text-align: center;
    display: inline-block;
    }
    </style>
    <button  id="wish_btn" class="button_wish_4">${icon_Btn}      ${label_Btn}</button>`

    const wish_button_5 = `<style>
    .button_wish_5 {
    background-color: transparent;
    border: none;
    color: ${color_Btn};
    padding: 7px 14px;
    width: 100%;
    text-align: center;
    display: inline-block;
    font-size: 24px;
    }
    </style>
    <button  id="wish_btn" class="button_wish_5">${icon_Btn}</button>`

    init(Value,wish_button_1,wish_button_2,wish_button_3,wish_button_4,wish_button_5,in_list,data,color_Btn,label_Btn);    
}

function init(Value,wish_button_1,wish_button_2,wish_button_3,wish_button_4,wish_button_5,in_list,data,color_Btn,label_Btn) {

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
        var urlParams = new URLSearchParams(window.location.search);
        var myParam = urlParams.get('variant');
        if(myParam){
            variant_id=myParam;
        }
        else{
            variant_id = (window.meta.product.variants[0].id).toString();
        }
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
        window.localStorage.setItem('wish_list',JSON.stringify(wish_list));
        window.localStorage.setItem('product_db',JSON.stringify(product_db));
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
            if(data.IconType=='6')
            btn.innerHTML=`<i class="fa fa-heart" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='7')
            btn.innerHTML=`<i class="fa fa-star" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='8')
            btn.innerHTML=`<i class="fa fa-thumbs-up" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='9')
            btn.innerHTML=`<i class="fa fa-bookmark" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
        }
        if(data.ButtonType=='3'){
            btn.style.color = `${data.ColorAfterButton}`;
            btn.innerHTML=`${data.LabelAfterButton}`;
        }
        if(data.ButtonType=='4'){
            btn.style.color = `${data.ColorAfterButton}`;
            if(data.IconType=='6')
            btn.innerHTML=`<i class="fa fa-heart" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='7')
            btn.innerHTML=`<i class="fa fa-star" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='8')
            btn.innerHTML=`<i class="fa fa-thumbs-up" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='9')
            btn.innerHTML=`<i class="fa fa-bookmark" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
        }
        if(data.ButtonType=='5'){
            btn.style.color = `${data.ColorAfterButton}`;
            if(data.IconType=='6')
            btn.innerHTML=`<i class="fa fa-heart" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='7')
            btn.innerHTML=`<i class="fa fa-star" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='8')
            btn.innerHTML=`<i class="fa fa-thumbs-up" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
            if(data.IconType=='9')
            btn.innerHTML=`<i class="fa fa-bookmark" aria-hidden="true"></i>     ${data.LabelAfterButton}`;
        }
        
    }else{
        if(data.ButtonType=='1'){
            btn.style.backgroundColor = `${data.ColorBeforeButton}`;
            btn.innerHTML=`${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='2'){
            btn.style.backgroundColor = `${data.ColorBeforeButton}`;
            if(data.IconType=='6')
            btn.innerHTML=`<i class="fa fa-heart-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='7')
            btn.innerHTML=`<i class="fa fa-star-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='8')
            btn.innerHTML=`<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='9')
            btn.innerHTML=`<i class="fa fa-bookmark-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='3'){
            btn.style.color = `${data.ColorBeforeButton}`;
            btn.innerHTML=`${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='4'){
            btn.style.color = `${data.ColorBeforeButton}`;
            if(data.IconType=='6')
            btn.innerHTML=`<i class="fa fa-heart-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='7')
            btn.innerHTML=`<i class="fa fa-star-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='8')
            btn.innerHTML=`<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='9')
            btn.innerHTML=`<i class="fa fa-bookmark-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
        }
        if(data.ButtonType=='5'){
            btn.style.color = `${data.ColorBeforeButton}`;
            if(data.IconType=='6')
            btn.innerHTML=`<i class="fa fa-heart-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='7')
            btn.innerHTML=`<i class="fa fa-star-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='8')
            btn.innerHTML=`<i class="fa fa-thumbs-o-up" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
            if(data.IconType=='9')
            btn.innerHTML=`<i class="fa fa-bookmark-o" aria-hidden="true"></i>     ${data.LabelBeforeButton}`;
        }
    }
    console.log("btn changed")
}
