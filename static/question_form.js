let switch_btn = 0;
document.querySelector(".question-form-img").onclick = function(){
  if(switch_btn == 0){
    switch_btn = 1;
    document.querySelector(".question-form").setAttribute("style", "transform: translate3d(0, 0, 0);");
    document.querySelector("#help-button").setAttribute("src", "/static/times-solid.svg");
  }
  else{
    switch_btn = 0;
    document.querySelector(".question-form").setAttribute("style", "transform: translate3d(100%, 0, 0);");
    document.querySelector(".question-success-block").setAttribute("style", "transform: translate3d(100%, 0, 0);");
    document.querySelector("#help-button").setAttribute("src", "/static/question-solid.svg");
  }

}
const email = document.querySelector("#email");
const question = document.querySelector("#question");


function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

email.oninput = function(){
  remove_error(email);

  if(email.value != ""){
    let result = validateEmail(email.value);
    if(result == false){
      let pelem = email.parentElement;
      add_error(email, "Введение email не действителен");
    }
    else{

    }
  }
}



question.oninput = function(){
  remove_error(question);
}

function remove_error(elem, p=false){
  if(elem.value != "" || p == true){
    let pelem = elem.parentElement;

    let err = pelem.querySelectorAll(".error");
    const ln = err.length;

    for(let i = 0; i < ln; i++){
      err[0].remove();
    }

  }

}
function add_error(elem, error_text){
  let parent = elem.parentElement;

  let span = document.createElement("span");
  span.setAttribute("class", "error");
  span.setAttribute("style", "color: red;");
  span.innerText = error_text;

  parent.append(span)
}
document.querySelector("#send-question").onclick = function(){
  let error_counter = 0;

  if(email.value == ""){
    error_counter += 1;
    remove_error(email, true);
    add_error(email, "Это поле обязательное");
  }
  if(validateEmail(email.value) == false){
    error_counter += 1;
  }
  if(question.value == ""){
    error_counter += 1;
    remove_error(question, true);
    add_error(question, "Это поле обязательное");
  }

  if(error_counter == 0){

    // send request
    $.ajax({
      url: "/question/",
      method: "POST",
      data: {"data": JSON.stringify({
        "email": email.value,
        "question": question.value,
      })},
      success: function(){document.querySelector(".question-success-block").setAttribute("style", "transform: translate3d(0, 0, 0);");},
      error: function(){
        document.querySelector(".offline-block").setAttribute("style", "transform: translate3d(0,0,0);");
      }
    })

    email.value = "";
    question.value = "";
  }
}
