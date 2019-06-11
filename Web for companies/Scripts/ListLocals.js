const URL_LOCAL = "api/v1/enterprises/locals/";
var URL_BASE = "";
var indexLocal = 0;

function fetchAPI(url, method, form = null) {
  let auth = sessionStorage.getItem("auth-token");
  let header = new Headers();
  header.append("Authorization", "Token " + auth);
  let initSetting = { method: method, headers: header };
  if (method === "POST" || method === "PUT")
    Object.assign(initSetting, { body: form });
  return fetch(URL_BASE + url, initSetting);
}

function cleanLocal() {
  let fields = document.getElementsByClassName("field");
  let nFields = fields.length;
  for (let i = 0; i < nFields; i++) fields[i].value = "";
  document.getElementById("radioTienda").checked = true;
  indexLocal = 0;
}

function addLocal() {
  $("#tituloLocal").text("Nuevo Local");
  $("#subTituloLocal").text("Ingresa los datos de tu nuevo local.");
  $("#rdoTipeLocal").show();
  $("#tiendaFormulario").show();
  $("#galeriaFormulario").hide();
  $("#btnSaveLocal").show();
  $("#btnUpdateLocal").hide();
  $("#listLocal").hide();
  $("#formLocal").show();
  window.scrollTo(0, 0);
}

function editLocal(id) {
  $("#divLoading").show();
  $("#tituloLocal").text("Editar Local");
  $("#subTituloLocal").text("Edita los datos de tu local.");
  $("#rdoTipeLocal").hide();
  $("#btnSaveLocal").hide();
  $("#btnUpdateLocal").show();
  $("#listLocal").hide();
  $("#formLocal").show();

  indexLocal = id;
  let url = URL_LOCAL + id + "/";
  fetchAPI(url, "GET")
    .then(response => response.json())
    .then(objLocal => {
      $("#divLoading").hide();
      let fields = document.getElementsByClassName("field");
      fields[0].value = objLocal["address"];
      fields[1].value = objLocal["reference"];
      fields[2].value = objLocal["name"];
      fields[3].value = objLocal["store"];
      fields[4].value = objLocal["floor"];
      fields[5].value = objLocal["address"];
      if (objLocal["type_store"] === "TIENDA") {
        document.getElementById("radioTienda").checked = true;
        $("#tiendaFormulario").show();
        $("#galeriaFormulario").hide();
      } else {
        document.getElementById("radioGaleria").checked = true;
        $("#tiendaFormulario").hide();
        $("#galeriaFormulario").show();
      }
      window.scrollTo(0, 0);
    })
    .catch(error => {
      $("#divLoading").hide();
      console.log(error);
    });
}

function saveLocal() {
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
  let url = URL_LOCAL;
  let method = "POST",
    msg = "Se creo el local exitosamente";
  if (indexLocal != 0) {
    url = URL_LOCAL + indexLocal + "/";
    method = "PUT";
    msg = "Se actualizó el local exitosamente";
  }
  fetchAPI(url, method, formData)
    .then(response => {
      alert(msg);
      return fetchAPI(URL_LOCAL, "GET");
    })
    .then(response => response.json())
    .then(resJson => {
      $("#divLoading").hide();
      listLocals(resJson);
      closeLocal();
    })
    .catch(error => {
      $("#divLoading").hide();
      console.log(error);
    });
}

function deleteLocal(id) {
  if (confirm("Esta seguro de eliminar este local?")) {
    $("#divLoading").show();
    let url = URL_LOCAL + id + "/";
    fetchAPI(url, "DELETE")
      .then(() => {
        alert("Se eliminó el local exitosamente");
        return fetchAPI(URL_LOCAL, "GET");
      })
      .then(response => response.json())
      .then(resJson => {
        $("#divLoading").hide();
        listLocals(resJson);
      })
      .catch(error => {
        $("#divLoading").hide();
        console.log(error);
      });
  }
}

function closeLocal() {
  $("#listLocal").show();
  $("#formLocal").hide();
  window.scrollTo(0, 0);
  cleanLocal();
}

function listLocals(jsonResult) {
  const divLocals = document.getElementById("divLocals"),
    divAddLocal = document.getElementById("divAddLocal");
  divLocals.innerHTML = "No tienes ningún local";
  divAddLocal.style.display = "";
  if (jsonResult.length > 0) {
    divAddLocal.style.display = "none";
    let strTable = "",
      strTableHead = "",
      strTableBody = "";

    strTableHead += "<thead><tr>";
    strTableBody += "<tbody><tr>";

    if (jsonResult[0]["type_store"] === "TIENDA") {
      strTableHead += '<th scope="col">Direccion</th>';
      strTableHead += '<th scope="col">Referencia</th>';

      strTableBody += "<td>";
      strTableBody += jsonResult[0]["address"];
      strTableBody += "</td>";
      strTableBody += "<td>";
      strTableBody += jsonResult[0]["reference"];
      strTableBody += "</td>";
    } else {
      strTableHead += '<th scope="col">Nombre</th>';
      strTableHead += '<th scope="col">N° de tienda</th>';
      strTableHead += '<th scope="col">N° de piso</th>';
      strTableHead += '<th scope="col">Direccion</th>';

      strTableBody += "<td>";
      strTableBody += jsonResult[0]["name"];
      strTableBody += "</td>";
      strTableBody += "<td>";
      strTableBody += jsonResult[0]["store"];
      strTableBody += "</td>";
      strTableBody += "<td>";
      strTableBody += jsonResult[0]["floor"];
      strTableBody += "</td>";
      strTableBody += "<td>";
      strTableBody += jsonResult[0]["address"];
      strTableBody += "</td>";
    }

    strTableHead += '<th scope="col">Acciones</th>';
    strTableHead += "</tr></thead>";

    strTableBody += "<td>";
    strTableBody += '<img class="img-ico" src="images/icons/editar.png" ';
    strTableBody += 'alt="" onclick="editLocal(';
    strTableBody += jsonResult[0]["id"];
    strTableBody += ')"/>';
    strTableBody += '<img class="img-ico" src="images/icons/eliminar.png" ';
    strTableBody += 'alt="" onclick="deleteLocal(';
    strTableBody += jsonResult[0]["id"];
    strTableBody += ')"/>';
    strTableBody += "</td>";
    strTableBody += "</tr></tbody>";

    strTable +=
      '<table class="table table-bordered table-condensed table-hover">';
    strTable += strTableHead;
    strTable += strTableBody;
    strTable += "</table>";

    divLocals.innerHTML = strTable;
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
  fetchAPI(URL_LOCAL, "GET")
    .then(response => response.json())
    .then(resJson => {
      $("#divLoading").hide();
      listLocals(resJson);
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
