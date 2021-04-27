const delivery_type = document.querySelector("#delivery-type");
const payment = document.querySelector("#payment");

let delivery = "pickup";

let status = {"city": "none", "street": "none", "postal": "none"};
let cities = {};
let warehouses = {};

payment.onchange = function(){
  let text = payment.value;

  if(text == "imposed"){
    document.querySelector("#delivery-type").selectedIndex = 0;

    document.querySelector("#city").setAttribute("style", "display: none;");
    document.querySelector("#street").setAttribute("style", "display: none;");
    document.querySelector("#postal").setAttribute("style", "display: none;");

    document.querySelector("option[value=kurer]").setAttribute("style", "display: none;");
    document.querySelector("option[value=delivery_under_door]").setAttribute("style", "display: none;");
    document.querySelector("option[value=new_mail]").setAttribute("style", "display: none;");
  }
  else{

    document.querySelector("option[value=kurer]").setAttribute("style", "");
    document.querySelector("option[value=delivery_under_door]").setAttribute("style", "");
    document.querySelector("option[value=new_mail]").setAttribute("style", "");
  }

}

delivery_type.onchange = function(){
  document.querySelector("#wirehouse").value = "";
  document.querySelector("#city-name").value = "";

  document.querySelector("#wirehouse").setAttribute("staticvalue", "");
  document.querySelector("#city-name").setAttribute("staticvalue", "");

  let add_result = document.querySelector(".warehouse-result");
  const ln = add_result.children.length;
  for(let i = 0; i < ln; i++){
    add_result.children[0].remove();
  }
  warehouses = {};
  cities = {};

  let text = delivery_type.value;
  delivery = text;

  let city = document.querySelector("#city");
  let street = document.querySelector("#street");
  let postal = document.querySelector("#postal");

  if(text == "pickup"){
    status = {"city": "none", "street": "none", "postal": "none"};

  }
  else if(text == "kurer" || text == "delivery_under_door"){
    status = {"city": "flex", "street": "flex", "postal": "none"};

  }
  else if(text == "new_mail"){
    status = {"city": "flex", "street": "none", "postal": "flex"};
  }

  city.setAttribute("style", "display: " + status["city"] + ";");
  street.setAttribute("style", "display: " + status["street"] + ";");
  postal.setAttribute("style", "display: " + status["postal"] + ";");
}

function choose_warehouse(ref_id){
  let div = document.querySelector("#wirehouse").parentElement;
  let e = div.querySelector(".error");
  if(e != undefined){
    e.remove();
  }

  let whouse = document.querySelector("#wirehouse");
  whouse.setAttribute("staticvalue", warehouses[ref_id].Description);
  whouse.value = warehouses[ref_id].Description;

  let add_result = document.querySelector(".warehouse-result");
  const ln = add_result.children.length;
  for(let i = 0; i < ln; i++){
    add_result.children[0].remove();
  }
  warehouses = {};
}

function get_city_warehouses(ref){
  let request = {
      "modelName": "AddressGeneral",
      "calledMethod": "getWarehouses",
      "methodProperties": {
           "Language": "ru",
           "CityRef": ref,
      },
      "apiKey": "42a1abbe00f07f5d005413fedecb9147"
  };

  fetch("https://api.novaposhta.ua/v2.0/json/", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(request),
  }).then(async function(response){
    response = await response.json();

    let add_result = document.querySelector(".warehouse-result");
    document.querySelector("#wirehouse").setAttribute("staticvalue", "");

    const ln = add_result.children.length;
    for(let i = 0; i < ln; i++){
      add_result.children[0].remove();
    }
    warehouses = {};

    for(let i = 0; i < response.data.length; i++){
      let div = document.createElement("div");
      div.setAttribute("class", "warehouse-chooser");
      div.setAttribute("onclick", "choose_warehouse('"+response.data[i].Ref+"')");

      let span = document.createElement("span");
      span.innerText = response.data[i].Description;

      let br = document.createElement("br");
      div.append(span);
      div.append(br);
      warehouses[response.data[i].Ref] = {"Description": response.data[i].Description};

      add_result.append(div);
    }
  });
}

let city_input = document.querySelector("#city-name");

const p_num = document.querySelector("#phone-number");
p_num.oninput = function(){
  let val = p_num.value;

  let p = p_num.parentElement;
  let err = p.querySelector(".error");
  if(err != undefined){
    err.remove();
  }

  if(val.length != 17){
    let span = document.createElement("span");
    span.setAttribute("class", "error");
    span.setAttribute("style", "color: red;");

    span.innerText = "Введение номер не действителен";
    p.append(span);
  }

}

city_input.oninput = function(){
  let request = {
    "apiKey": "42a1abbe00f07f5d005413fedecb9147",
     "modelName": "Address",
        "calledMethod": "searchSettlements",
        "methodProperties": {
            "CityName": city_input.value,
            "Limit": 5,
        }
    };


    fetch("https://api.novaposhta.ua/v2.0/json/", {
      method: "POST",
      mode: 'cors',
      body: JSON.stringify(request),
    }).then(async function(response){
      response = await response.json();

      let add_result = document.querySelector(".address-result");
      const ln = add_result.children.length;
      for(let i = 0; i < ln; i++){
        add_result.children[0].remove();
      }

      let warehouses = document.querySelector(".warehouse-result");
      const ln1 = warehouses.children.length;
      for(let i = 0; i < ln1; i++){
        warehouses.children[0].remove();
      }
      document.querySelector("#wirehouse").value = "";
      document.querySelector("#wirehouse").setAttribute("staticvalue", "");
      document.querySelector("#city-name").setAttribute("staticvalue", "");

      warehouses = {};
      cities = {};

      if(response.data[0] == undefined){
        return;
      }
      let addresses = response.data[0].Addresses;


      for(let i = 0; i < addresses.length; i++){
        if(addresses[i].Warehouses == 0 && status["postal"] == "flex"){
          continue;
        }
        let div = document.createElement("div");

        div.setAttribute("class", "city-chooser");
        div.setAttribute("onclick", "choose_city('"+addresses[i].DeliveryCity+"')")
        let span = document.createElement("span");
        span.innerText = addresses[i].Present;

        let br = document.createElement("br");
        div.append(span);
        div.append(br);
        cities[addresses[i].DeliveryCity] = {"Warehouses": addresses[i].Warehouses, "Present": addresses[i].Present};

        add_result.append(div);
      }

    })
}
function choose_city(ref_id){
  if(cities[ref_id].Warehouses != 0){
    let div = document.querySelector("#city-name").parentElement;
    let e = div.querySelector(".error");
    if(e != undefined){
      e.remove();
    }

    get_city_warehouses(ref_id);
  }
  let city_input = document.querySelector("#city-name");
  city_input.setAttribute("staticvalue", cities[ref_id]["Present"]);
  city_input.value = cities[ref_id]["Present"];

  let add_result = document.querySelector(".address-result");
  const ln = add_result.children.length;
  for(let i = 0; i < ln; i++){
    add_result.children[0].remove();
  }
  if(cities[ref_id].Warehouses == 0){
    document.querySelector("option[value=new_mail]").setAttribute("style", "display: none;");
  }
  else{
    document.querySelector("option[value=new_mail]").setAttribute("style", "");
  }
}
document.querySelector("#create-order").onclick = function(){
  let error_count = 0;
  let phone = document.querySelector("#phone-number");

  if(phone.value.length != 17){
    let div = phone.parentElement;
    let e = div.querySelector(".error");
    if(e != undefined){
      e.remove();
    }
    let span = document.createElement("span");
    span.setAttribute("style", "color: red;");
    span.setAttribute("class", "error");

    span.innerText = "Введение номер не действителен";
    div.append(span);

    error_count += 1;
  }else{
    let div = phone.parentElement;
    let e = div.querySelector(".error");
    if(e != undefined){
      e.remove();
    }
  }


  let city_name = document.querySelector("#city-name");
  if((city_name.getAttribute("staticvalue") == "" || city_name.value == "") && status["city"] == "flex"){
    let div = city_name.parentElement;
    let e = div.querySelector(".error");
    if(e != undefined){
      e.remove();
    }
    let span = document.createElement("span");
    span.setAttribute("style", "color: red;");
    span.setAttribute("class", "error");

    span.innerText = "Вы не выбрали место из предлагаемых";
    div.append(span);

    error_count += 1;
  }else{
    let div = city_name.parentElement;
    let e = div.querySelector(".error");
    if(e != undefined){
      e.remove();
    }
  }

  let wirehouse = document.querySelector("#wirehouse");
  if((wirehouse.getAttribute("staticvalue") == "" || wirehouse.value == "") && status["postal"] == "flex"){
    let div = wirehouse.parentElement;
    let e = div.querySelector(".error");
    if(e != undefined){
      e.remove();
    }
    let span = document.createElement("span");
    span.setAttribute("style", "color: red;");
    span.setAttribute("class", "error");

    span.innerText = "Вы не выбрали отделения из предлагаемых";
    div.append(span);

    error_count += 1;
  }else{
    let div = wirehouse.parentElement;
    let e = div.querySelector(".error");
    if(e != undefined){
      e.remove();
    }
  }

  if(error_count == 0){

    let capacity = document.querySelector("#capacity");
    let num = Number(capacity.value);
    let p = document.querySelector("#price");
    let n = Math.round(Number(p.getAttribute("price")) * num);

    let p_val = document.querySelector("#payment").value;
    let payment = document.querySelector("option[value="+p_val+"]").innerText;

    let deliver_val = document.querySelector("#delivery-type").value;
    let delivery = document.querySelector("option[value="+deliver_val+"]").innerText;

    let street = document.querySelector("#street-input").value;
    let house = document.querySelector("#house").value;
    let room = document.querySelector("#room").value;

    let address = "Улица: "+street+", Дом: "+house+", Квартира: "+room;

    let request = {
      "payment": payment,
      "delivery-type": delivery,
      "phone-number": phone.value,
      "city-name": city_name.getAttribute("staticvalue"),
      "warehouse": wirehouse.getAttribute("staticvalue"),
      "address": address,
      "price": String(n),
      "product-title": document.querySelector("#product-title").innerText,
    };
    $.ajax({
      url: "/create_order/",
      method: "POST",
      //contentType: "application/json",
      data: {"data": JSON.stringify(request)},
      success: function(e){
        document.querySelector(".success").setAttribute("style", "");
        document.querySelector(".inner-modal").scrollTo(0, 0);
        document.querySelector(".inner-modal").setAttribute("style", "overflow: hidden;");
      },
      error: function(){document.querySelector(".offline-block").setAttribute("style", "transform: translate3d(0,0,0); opacity: 1;");},
    });

  }
}
document.querySelector("#close-order").onclick = function(){
  document.querySelector(".order-modal").setAttribute("style", "display: none; opacity: 0;");
}
