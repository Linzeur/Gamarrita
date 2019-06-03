const URL_SIGN_IN = "/api/v1/users/login-enterprise/";
var URL_BASE = "";

function requestServer(url, callBackMethod, param) {
  var xhr = new XMLHttpRequest();
  url = URL_BASE + url;
  xhr.open("post", url);
  xhr.onreadystatechange = function () {
    if  (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 400) callBackMethod(xhr.response);
      else errorsMessages(xhr.response);
    }
  }
  if (param != undefined) xhr.send(param);
  else xhr.send();
}

window.onload = function() {
  URL_BASE = "http://back.gamarrita.com"
  sessionStorage.setItem("urlBase", URL_BASE);
  assignEvents(); 
}

function assignEvents() {
  document.getElementById("btnSignIn").onclick = function() {
    txtEmail = document.getElementById("txtInputUser").value;
    txtPassword = document.getElementById("txtInputPassword").value;
    if (txtEmail != "") {
      if (txtPassword != "") {
        var form = new FormData();
        form.append("email", txtEmail);
        form.append("password", txtPassword);
        requestServer(URL_SIGN_IN, validationLogin, form);
      } else document.getElementById("errorPassword").innerHTML = "Este campo es obligatorio";
    } else document.getElementById("errorEmail").innerHTML = "Este campo es obligatorio";
  }
}

function validationLogin(result) {
  var jsonMessage = JSON.parse(result)
  sessionStorage.setItem("auth-token", jsonMessage["token"]);
  window.location.href = "indexEmpresa.html";
}

function errorsMessages(error) {
  var jsonError = JSON.parse(error);
  var strError = ""
  for ( var key in jsonError ) {
    if ( jsonError.hasOwnProperty(key)) {
      strError += jsonError[key][0];
      strError += "<br/>";
    }
  }
  document.getElementById("errorMessage").innerHTML = strError;
  $('#modalError').modal('show');
}