function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}

let body_div = document.querySelector(".body");

let start_coords = {"x": undefined, "y": undefined};

function touchcancel_handler(){
  start_coords = {"x": undefined, "y": undefined};
}

function touch_start_handler(e){
  const firstTouch = getTouches(e)[0];
  start_coords.x = firstTouch.clientX;
  start_coords.y = firstTouch.clientY;
}

function touch_move_handler(e, x=true, close_block=undefined){

    const touch = getTouches(e)[0];

    if(start_coords.x != undefined){
      let diffX = touch.clientX - start_coords.x;
      let diffY = touch.clientY - start_coords.y;

      let len = Math.sqrt(diffX**2 + diffY**2);

      if(len >= 10){
        start_coords = {"x": undefined, "y": undefined};
        if(x == true && Math.abs(diffX) >= 10){
          if(diffX >= 0){
            document.querySelector(".left").click();
          }
          else if(diffX <= 0){
            document.querySelector(".right").click();
          }
        }
        else if(Math.abs(diffY) >= 10 && x == false){
          if(close_block != undefined){
            let scr_top = close_block.scrollTop;

            if(diffY > 0 && scr_top == 0){
              document.querySelector(".close-block").click();
            }
          }
          else{
            let product_info_top = document.querySelector(".product-info").scrollTop;

            if(diffY > 0 && product_info_top == 0){
              document.querySelector(".product-info").setAttribute("style", "");
            }
          }

        }

      }
    }
}

body_div.touchcancel = touchcancel_handler;
body_div.ontouchmove = touch_move_handler;
body_div.ontouchstart = touch_start_handler;

let prd_info = document.querySelector(".product-info");

if(prd_info != undefined){
  prd_info.touchcancel = touchcancel_handler;
  prd_info.ontouchmove = function(e){
    touch_move_handler(e, false);
  }
  prd_info.ontouchstart = touch_start_handler;
}

let products_block = document.querySelector(".products");
let contacts_block = document.querySelector(".contacts");
let delivery_block = document.querySelector(".delivery");

products_block.touchcancel = touchcancel_handler;
products_block.ontouchmove = function(e){
  touch_move_handler(e, false, document.querySelector(".products-block"));
}
products_block.ontouchstart = touch_start_handler;

contacts_block.touchcancel = touchcancel_handler;
contacts_block.ontouchmove = function(e){
  touch_move_handler(e, false, contacts_block.querySelector(".inner-container"));
}
contacts_block.ontouchstart = touch_start_handler;

delivery_block.touchcancel = touchcancel_handler;
delivery_block.ontouchmove = function(e){
  touch_move_handler(e, false, delivery_block.querySelector(".inner-container"));
}
delivery_block.ontouchstart = touch_start_handler;
