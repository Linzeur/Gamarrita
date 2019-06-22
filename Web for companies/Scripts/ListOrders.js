const URL_ORDER = "api/v1/bags/orders-admin/";
var URL_BASE = "";
var indexOrder = 0;

function fetchAPI(url, method, form = null) {
  let auth = sessionStorage.getItem("auth-token");
  let header = new Headers();
  header.append("Authorization", "Token " + auth);
  let initSetting = { method: method, headers: header };
  if (method === "POST" || method === "PUT")
    Object.assign(initSetting, { body: form });
  return fetch(URL_BASE + url, initSetting);
}

function cleanOrder() {
  let fields = document.getElementsByClassName("field");
  let nFields = fields.length;
  for (let i = 0; i < nFields; i++) fields[i].value = "";
  document.getElementById("radioTienda").checked = true;
  indexOrder = 0;
}

function viewOrder(id) {
  $("#listadoLocal").hide();
  $("#listaPedido").show();
  $("#pedidos").show();
  $("#detallePedido").hide();
  $("#informacionPedido").hide();

  indexOrder = id;
  let url = URL_ORDER + id;
  fetchAPI(url, "GET")
    .then(response => response.json())
    .then(resultOrder => {
      $("#divLoading").hide();

      //Order Detail
      const divOrderDetail = document.getElementById("divOrderDetail");
      document.getElementById("orderTitle").innerHTML = `${
        resultOrder["id"]
      } - ${resultOrder["cart"]["user"]["first_name"]} ${
        resultOrder["cart"]["user"]["last_name"]
      }`;

      let strTable = "",
        strTableHead = "",
        strTableBody = "";

      strTableHead += "<thead><tr>";
      let cols = [
        "Nombre",
        "Categoria",
        "Cantidad",
        "Valor total",
        "Precio delivery",
        "Fecha del pedido",
        ""
      ];
      for (let i = 0; i < cols.length; i++) {
        strTableHead += '<th scope="col" class="cen">';
        strTableHead += cols[i];
        strTableHead += "</th>";
      }
      strTableHead += "</tr></thead>";
      let totalValue = 0;
      let img = "";
      let price = 0;
      strTableBody += "<tbody>";
      row = resultOrder;
      strTableBody += "<tr>";
      strTableBody += '<td class="cenImg borderless">';
      strTableBody += '<img class="img-mini" src="';
      strTableBody += resultOrder["product"]["garment"]["photo_1"];
      strTableBody += '" alt="" />';
      strTableBody += "</td>";
      strTableBody += '<td class="cenImg borderless">';
      strTableBody += resultOrder["product"]["garment"]["category"]["name"];
      strTableBody += "</td>";
      strTableBody += '<td class="cenImg borderless">';
      strTableBody += resultOrder["quantity"];
      strTableBody += "</td>";
      price = resultOrder["final_prize_less"];
      if (resultOrder["wholesale"]) price = resultOrder["final_prize_higher"];
      totalValue = resultOrder["quantity"] * price;
      strTableBody += '<td class="cenImg borderless">';
      strTableBody += `S/. ${totalValue}`;
      strTableBody += "</td>";
      strTableBody += '<td class="cenImg borderless">';
      strTableBody += "S/. 10.00 No se cual es el dato";
      strTableBody += "</td>";
      strTableBody += '<td class="cenImg borderless">';
      strTableBody += "No se cual es dato";
      strTableBody += "</td>";
      strTableBody += '<td class="cenImg borderless">';
      strTableBody += '<img class="img-ico" src="images/icons/editar.png" ';
      strTableBody += 'alt="" onclick="verdetallePedido(';
      strTableBody += resultOrder["id"];
      strTableBody += ')"/>';
      strTableBody += "</td></tr>";
      strTableBody += "<tr>";
      strTableBody += '<td colspan="3" class="mg borderless">';
      strTableBody += "Estado del pedido";
      strTableBody += "</td>";
      img = "images/icons/recibido.png";
      if (resultOrder["state"] === "ENVIADO") "images/icons/enviado.png";
      else "images/icons/entregado.png";
      strTableBody += '<td colspan="4" class="mg borderless">';
      strTableBody += '<img class="img-estado" src="';
      strTableBody += img;
      strTableBody += '" id="imgState';
      strTableBody += 0;
      strTableBody += '" alt="" onclick="cambiarEstado(';
      strTableBody += 0;
      strTableBody += ')"/><br /><br />';
      strTableBody += '<button class="btn btnMan" onclick="guardarEstado(';
      strTableBody += 0;
      strTableBody += ')" >Guardar Estado</button>';
      strTableBody += "</td></tr>";

      strTableBody += "</tbody>";

      strTable +=
        '<table class="table table-bordered table-condensed table-hover">';
      strTable += strTableHead;
      strTable += strTableBody;
      strTable += "</table>";

      divOrderDetail.innerHTML = strTable;

      //Product Detail

      let fields = document.getElementsByClassName("field");
      fields[0].src = resultOrder["product"]["garment"]["photo_1"];

      fields[1].innerHTML = resultOrder["product"]["garment"]["name"];
      fields[2].innerHTML = resultOrder["product"]["garment"]["brand"];
      fields[3].innerHTML = `S/. ${price}`;
      fields[4].innerHTML = resultOrder["product"]["garment"]["description"];
      fields[5].innerHTML = resultOrder["product"]["color"]["name"];
      fields[6].innerHTML = resultOrder["product"]["size"]["name"];
      fields[7].innerHTML = `${resultOrder["quantity"]} unidades`;
      fields[8].innerHTML = `S/. ${totalValue}`;
      fields[9].innerHTML = "S/. 10.00 No se cual es el dato";
      window.scrollTo(0, 0);
    })
    .catch(error => {
      $("#divLoading").hide();
      console.log(error);
    });
}

function saveOrder() {
  $("#divLoading").show();
  let fields = document.getElementsByClassName("field");
  var formData = new FormData();
  let typeStore = "GALERIA",
    address = fields[5].value;
  if (document.getElementById("radioTienda").checked) {
    typeStore = "TIENDA";
    address = fields[0].value;
  }
  formData.append("type_store", typeStore);
  formData.append("address", address);
  formData.append("reference", fields[1].value);
  formData.append("name", fields[2].value);
  formData.append("store", fields[3].value);
  formData.append("floor", fields[4].value);
  let url = URL_ORDER;
  let method = "POST",
    msg = "Se creo el local exitosamente";
  if (indexOrder != 0) {
    url = URL_ORDER + indexOrder + "/";
    method = "PUT";
    msg = "Se actualizó el local exitosamente";
  }
  fetchAPI(url, method, formData)
    .then(response => {
      alert(msg);
      return fetchAPI(URL_ORDER, "GET");
    })
    .then(response => response.json())
    .then(resJson => {
      $("#divLoading").hide();
      listOrders(resJson);
      closeOrder();
    })
    .catch(error => {
      $("#divLoading").hide();
      console.log(error);
    });
}

function deleteOrder(id) {
  if (confirm("Esta seguro de eliminar este local?")) {
    $("#divLoading").show();
    let url = URL_ORDER + id + "/";
    fetchAPI(url, "DELETE")
      .then(() => {
        alert("Se eliminó el local exitosamente");
        return fetchAPI(URL_ORDER, "GET");
      })
      .then(response => response.json())
      .then(resJson => {
        $("#divLoading").hide();
        listOrders(resJson);
      })
      .catch(error => {
        $("#divLoading").hide();
        console.log(error);
      });
  }
}

function closeOrder() {
  $("#listOrder").show();
  $("#formOrder").hide();
  window.scrollTo(0, 0);
  cleanOrder();
}

function listOrders(jsonResult) {
  const divOrders = document.getElementById("divOrders");
  divOrders.innerHTML = "No tienes ningún pedido";
  let nList = jsonResult.length;
  if (nList > 0) {
    let strTable = "",
      strTableHead = "",
      strTableBody = "";

    strTableHead += "<thead><tr>";
    strTableHead += '<th scope="col">Nro. Pedido</th>';
    strTableHead += '<th scope="col">Cliente</th>';
    strTableHead += '<th scope="col">Estado</th>';
    strTableHead += '<th scope="col">Ver</th>';
    strTableHead += "</tr></thead>";

    strTableBody += "<tbody>";
    let row = null;
    let fullName = "";
    for (let i = 0; i < nList; i++) {
      row = jsonResult[i];
      fullName =
        row["cart"]["user"]["first_name"] +
        " " +
        row["cart"]["user"]["last_name"];
      strTableBody += "<tr><td>";
      strTableBody += row["id"];
      strTableBody += "</td>";
      strTableBody += "<td>";
      strTableBody += fullName;
      strTableBody += "</td>";
      strTableBody += "<td>";
      strTableBody += row["state"];
      strTableBody += "</td>";
      strTableBody += "<td>";
      strTableBody += '<img class="img-ico" src="images/icons/editar.png" ';
      strTableBody += 'alt="" onclick="viewOrder(';
      strTableBody += row["id"];
      strTableBody += ')"/>';
      strTableBody += "</td></tr>";
    }
    strTableBody += "</tbody>";

    strTable +=
      '<table class="table table-bordered table-condensed table-hover">';
    strTable += strTableHead;
    strTable += strTableBody;
    strTable += "</table>";

    divOrders.innerHTML = strTable;
  }
}

function changeForm() {
  if (document.getElementById("radioTienda").checked) {
    $("#tiendaFormulario").show();
    $("#galeriaFormulario").hide();
  } else {
    $("#tiendaFormulario").hide();
    $("#galeriaFormulario").show();
  }
}

window.onload = function() {
  $("#divLoading").show();
  URL_BASE = sessionStorage.getItem("urlBase").toString();
  fetchAPI(URL_ORDER, "GET")
    .then(response => response.json())
    .then(resJson => {
      $("#divLoading").hide();
      listOrders(resJson);
    })
    .catch(error => console.log(error));
};

function errorsMessages(error) {
  var jsonError = JSON.parse(error);
  var strError = "";
  for (var key in jsonError) {
    if (jsonError.hasOwnProperty(key)) {
      strError += jsonError[key][0];
      strError += "<br/>";
    }
  }
  document.getElementById("errorMessage").innerHTML = strError;
  $("#modalError").modal("show");
}
