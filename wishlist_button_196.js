///////////// Initial Setup /////////////
const SettingsModel = require("./Models/SettingsModel");
const dotenv = require("dotenv").config();
const express = require("express");
const crypto = require("crypto");
const cookie = require("cookie");
const request = require("request-promise");
const nonce = require("nonce")();
const querystring = require("querystring");
const { insertCode } = require("./theme");
const { Webhooks } = require("shopify-admin-api");
const planSwitch = require("./Constants");
const axios = require("axios");
const WishlistModel = require("./Models/WishlistModel");

const shopifyApiPublicKey = process.env.SHOPIFY_API_PUBLIC_KEY;
const shopifyApiSecretKey = process.env.SHOPIFY_API_SECRET;
const scopes =
  "write_products,read_script_tags,write_script_tags,read_themes,write_themes,read_orders";
const appUrl = process.env.ngrok_url;
const FRONTEND = process.env.FRONTEND;

var accessToken;
var emailToken;
var emailServer;
var AdminName;
var AdminEmail;

// const app = express();
// const PORT = 3000

// app.get('/', (req, res) => {
//   res.send('Ello Govna')
// });

///////////// Helper Functions /////////////

const buildRedirectUri = () => `${appUrl}/shopify/callback`;

const buildInstallUrl = (shop, state, redirectUri) =>
  `https://${shop}/admin/oauth/authorize?client_id=${shopifyApiPublicKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;

const buildAccessTokenRequestUrl = (shop) =>
  `https://${shop}/admin/oauth/access_token`;

const buildShopDataRequestUrl = (shop) => `https://${shop}/admin/shop.json`;

const generateEncryptedHash = (params) =>
  crypto.createHmac("sha256", shopifyApiSecretKey).update(params).digest("hex");

const fetchAccessToken = async (shop, data) =>
  await axios(buildAccessTokenRequestUrl(shop), {
    method: "POST",
    data,
  });

const fetchShopData = async (shop, accessToken) =>
  await axios(buildShopDataRequestUrl(shop), {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": accessToken,
    },
  });

///////////// Route Handlers /////////////
const OAuth = (app) => {
  app.get("/shopify", (req, res) => {
    const shop = req.query.shop;

    if (!shop) {
      return res.status(400).send("no shop");
    }

    const state = nonce();

    const installShopUrl = buildInstallUrl(shop, state, buildRedirectUri());

    res.cookie("state", state); // should be encrypted in production
    res.redirect(installShopUrl);
  });

  app.get("/shopify/callback", async (req, res) => {
    const { shop, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
      return res.status(403).send("Cannot be verified");
    }

    const { hmac, ...params } = req.query;
    const queryParams = querystring.stringify(params);
    const hash = generateEncryptedHash(queryParams);

    if (hash !== hmac) {
      return res.status(400).send("HMAC validation failed");
    }

    try {
      const data = {
        client_id: shopifyApiPublicKey,
        client_secret: shopifyApiSecretKey,
        code,
      };
      const tokenResponse = await fetchAccessToken(shop, data);

      const { access_token } = tokenResponse.data;

      const shopData = await fetchShopData(shop, access_token);

      req.session.shopData = shopData.data.shop;
      //console.log(req.session.shopData);
      req.session.accesstoken = access_token;

      await SettingsModel.findOne({ USERID: shop }).then(async(result) => {
        if (!result) {

            const template = {
                USERID: shop,
                token: access_token,
                AdminName:req.session.shopData.shop_owner,
                AdminEmail:req.session.shopData.email,
              };
              const data = await SettingsModel.create(template);

            

          //Script Insert
          const createScriptTagUrl = `https://${req.query.shop}/admin/api/2021-01/script_tags.json`;
          const scriptTagBody = {
            script_tag: {
              event: "onload",
              src: "https://cdn.jsdelivr.net/gh/PranjulAgarwal/temp_scripts/wishlist_button_195.js",
            },
          };
          const shopRequestHeaders = {
            "X-Shopify-Access-Token": access_token,
            "X-Shopify-Topic": "orders/create",
          };
          request.post(
            {
              url: createScriptTagUrl,
              body: scriptTagBody,
              headers: shopRequestHeaders,
              json: true,
            },
            function (error, response, body) {
              if (!error) {
                ////console.log(body);
              }
            }
          );

          //Theme Webhook
          const service = new Webhooks(shop, access_token);
          //console.log(access_token + "here");
          let webhook = {
            address: `${appUrl}/webhook/webHook/theme?shop=${req.query.shop}`,
            topic: "themes/update",
          };
          webhook = service
            .create(webhook)
            .then((response) => console.log("this is my webhoooook", response))
            .catch((error) => console.log(error));

          //ShopUpdate WebHook
          let webhookShopUdate = {
            address: `${appUrl}/webhook/shopUpdate`,
            topic: "shop/update",
          };

          webhookShopUdate = service
            .create(webhookShopUdate)
            .then((response) =>
              console.log("this is my shopupdate webhoooook", response)
            )
            .catch((error) => console.log(error));

            //EMail Server Create
            const emailbody = {
                serverName: shop + "-wishlist",
            };
            request
                .post({
                url: `${appUrl}/email/new`,
                body: emailbody,
                json: true,
                })
                .then(async(server) => {
                console.log(
                    "New Postmark Server Created : ",
                    server,
                    server.Name
                );
                emailToken = server.ApiTokens[0];
                emailServer = server.Name;
                let response = await WishlistModel.create(
                  { 
                    SHOP_ID: shop,
                    emailServer: emailServer,
                    emailToken:emailToken,
                  }
                );
            });
            
          //Installed Themes Snippet Inject
          const createThemeTagUrl = `https://${req.query.shop}/admin/api/2021-04/themes.json`;
          const themeRequestHeaders = {
            "X-Shopify-Access-Token": access_token,
            "X-Shopify-Topic": "orders/create",
          };
          request
            .get(createThemeTagUrl, { headers: themeRequestHeaders })
            .then(async(res) => {
              var themes = JSON.parse(res).themes;
              for (var i = 0; i < themes.length; i++) {
                if (themes[i].role === "main"&&(themes[i].name === "Debut"||themes[i].name === "Simple"||themes[i].name === "Boundless"||themes[i].name === "Venture"||themes[i].name === "Narrative"||themes[i].name === "Express")) {
                  insertCode(
                    req.query.shop,
                    themes[i].id,
                    themes[i].theme_store_id,
                    access_token
                  );
                  break;
                }else if(themes[i].role !== "main"){
                  continue;
                }else{
                  try {
                    const serverClient = new postmark.ServerClient(emailToken);
                    
                    const response = await serverClient.sendEmail({
                        From: 'admin@superassistant.io',
                        To: `${req.session.shopData.email}`,
                        Bcc: 'admin@superassistant.io',
                        Subject: 'Unsupported Shopify Store Theme - Wishlist SuperAssistant',
                        TextBody:'The '+`${req.session.shopData.name}`+' have installed an unsupported themes. Email of Owner' + `${req.session.shopData.email}`,
                        MessageStream:"outbound"
                    })
                    res.status(200).json(response)
                  } catch (err) {
                      console.log("Error Sending Email",err.message)
                  }
                }
              }
            });


            let planType = shopData.data.shop.plan_name;
            let applicable_price = planSwitch(planType);
            
            //console.log(applicable_price);
            var date = new Date();
            date.setDate(date.getDate() + 7);

            axios(
              `https://${shopData.data.shop.myshopify_domain}/admin/api/2021-01/recurring_application_charges.json`,
              {
                method: "POST",
                headers: {
                  "X-Shopify-Access-Token": access_token,
                  "Content-Type": "application/json",
                },
                data: {
                  recurring_application_charge: {
                    name: "Super Assistant Plan",
                    price: applicable_price,
                    return_url: appUrl + "/webhook/BillingResponse",
                    test: true,
                    trial_days: 7,
                    trial_ends_on: date,
                  },
                },
              }
            )
              .then((response) => {
                //console.log("heyy i have reached here");
                res.redirect(
                  `${response.data.recurring_application_charge.confirmation_url}`
                );
              })
              .catch((err) => console.log(err));

        //   res.redirect(`http://localhost:3000/?shop=${shop}`);
        } else {
          const template = {
            USERID: shop,
            token: access_token,
          };
          const data = await SettingsModel.findOneAndUpdate(
            { USERID: shop },
            template
          );

          if (result.paymentDone) {
            // console.log(envConstants.FRONTEND_URL);
            res.redirect(`${FRONTEND}/home`+`?shopurl=${shop}`);
          }else{
            let planType = shopData.data.shop.plan_name;
            let applicable_price = planSwitch(planType);
            
            //console.log(applicable_price);
            var date = new Date();
            date.setDate(date.getDate() + 7);

            axios(
              `https://${shopData.data.shop.myshopify_domain}/admin/api/2021-01/recurring_application_charges.json`,
              {
                method: "POST",
                headers: {
                  "X-Shopify-Access-Token": access_token,
                  "Content-Type": "application/json",
                },
                data: {
                  recurring_application_charge: {
                    name: "Super Assistant Plan",
                    price: applicable_price,
                    return_url: appUrl + "/webhook/BillingResponse",
                    test: true,
                    trial_days: 7,
                    trial_ends_on: date,
                  },
                },
              }
            )
              .then((response) => {
                //console.log("heyy i have reached here");
                res.redirect(
                  `${response.data.recurring_application_charge.confirmation_url}`
                );
              })
              .catch((err) => console.log(err));
          }

        //   res.redirect(`http://localhost:3000/?shop=${shop}`);
        }
      });

    //   res.send(shopData.data.shop);
    } catch (err) {
      //console.log(err);
      res.status(500).send("something went wrong");
    }
  });

  //test api
  app.get("/test", (req, res) => {
    res.status(200).json({
      success: true,
    });
  });

  //customerdata_request
  app.get("/customers/data_request",(req,res)=>{
    res.status(200).json({message: "success"});
  })
  //customerdata_deletion
  app.post("/customers/redact",async (req,res)=>{
    update_params = {
      $set:{"Customers.$.Customer_firstname":'requested delete',"Customers.$.Customer_lastname":'requested delete',"Customers.$.Customer_email":'requested delete',"Customers.$.Customer_phone":'requested delete'}
    }
    search_params ={
      SHOP_ID:req.params.SHOP_ID,
      Customers:{$elemMatch:{Customer_id:req.body.Customer.id}}
    }
    await WishlistModel.updateOne(search_params,update_params)
    
    res.status(200).json({message: "success"});
  })

  // shop/redact
  app.post("/shop/redact", async(req,res)=>{
    let shopDomain = req.body.shop_domain;
    //console.log(req.body);

    await WishlistModel.findOne({SHOP_ID:shopDomain}).then((result)=>{
      let data = result.Customers;
      data.forEach(element => {
        element.Customer_firstname="requested delete",
        element.Customer_lastname="requested delete",
        element.Customer_id="requested delete",
        // element.product_ids=["requested delete"],
        // element.product_data=["requested delete"],
        element.Customer_email="requested delete",
        element.DateUpdated="requested delete",
        element.LastReminder="requested delete",
        element.Customer_phone="requested delete"
      });

      WishlistModel.updateOne({SHOP_ID:shopDomain},{$set:{Customers:data}}).catch((err)=>{
        console.log(err)
      })
    }).catch((err)=>{console.log(err)})

    res.status(200).json({message: "success"});
  })
};

module.exports = { OAuth };
