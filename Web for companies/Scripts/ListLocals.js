const URL_SIGN_IN = "/api/v1/enterprises/locals/1";
var URL_BASE = "";

function requestServer(url, methodHttp, callBackMethod, param) {
  var xhr = new XMLHttpRequest();
  url = URL_BASE + url;
  auth = sessionStorage.getItem("auth-token").toString();
  xhr.open(methodHttp, url);
  xhr.setRequestHeader('Authorization', 'Token ' + auth );
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
  URL_BASE = sessionStorage.getItem("urlBase").toString();
  requestServer(URL_SIGN_IN, "get", listLocalsShop);
}

function listLocalsShop(result) {
  var jsonResult = JSON.parse(result);
  var list = jsonResult, nList = 1;
  var strTableBody = "";
  var rowList;
  for (var i = 0; i < nList; i++) {
    rowList = list;
    strTableBody += "<tr>";
    strTableBody += "<th scope=\"row\">";
    strTableBody += rowList["id"];
    strTableBody += "</th>";
    strTableBody += "<td>";
    strTableBody += rowList["address"];
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += rowList["reference"];
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += "<img class=\"img-ico\" src=\"images/icons/editar.png\" alt=\"\" onclick=\"editarLocal()\">";
    strTableBody += "<img class=\"img-ico\" src=\"images/icons/eliminar.png\" alt=\"\" onclick=\"eliminarLocal()\">";
    strTableBody += "</td>";
    strTableBody += "</tr>";
  }
  
  document.getElementById("tbListLocalsShop").innerHTML = strTableBody;
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