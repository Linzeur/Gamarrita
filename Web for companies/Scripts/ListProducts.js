const URL_SIGN_IN = "/api/v1/products/garments/";
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
  requestServer(URL_SIGN_IN, "get", listProducts);
}

function listProducts(result) {
  var jsonResult = JSON.parse(result);
  var list = jsonResult["results"], nList = jsonResult["count"];
  var strTableBody = "";
  var rowList;
  for (var i = 0; i < nList; i++) {
    rowList = list[i];
    strTableBody += "<tr>";
    strTableBody += "<td>";
    strTableBody += "<img class=\"img-mini\" src=\"";
    strTableBody += rowList["photo_1"];
    strTableBody += "\" alt=\"\">";
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += rowList["name"];
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += rowList["id"];
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += rowList["precio_size_less"];
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += rowList["precio_size_higher"];
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += rowList["category"]["name"];
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += "<img class=\"img-ico\" src=\"images/icons/editar.png\" alt=\"\" onclick=\"editarProducto()\">";
    strTableBody += "<img class=\"img-ico\" src=\"images/icons/eliminar.png\" alt=\"\" onclick=\"eliminarProducto()\">";
    strTableBody += "</td>";
    strTableBody += "</tr>";
  }
  
  document.getElementById("tbListProducts").innerHTML = strTableBody;
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