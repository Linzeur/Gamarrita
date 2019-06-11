const URL_PRODUCTS = "api/v1/products/enterprise/garments/",
  URL_PRODUCT = "api/v1/products/garments-upt/";
const URLS_FEATURES = [
  "api/v1/products/category/",
  "api/v1/products/size/",
  "api/v1/products/color/"
];

var URL_BASE = "";
var newDetailProducts = [],
  imageProduct = [];
var indexProduct = 0,
  indexDetail = 0;

function fetchAPI(url, method, form = null) {
  let auth = sessionStorage.getItem("auth-token");
  let header = new Headers();
  header.append("Authorization", "Token " + auth);
  let initSetting = { method: method, headers: header };
  if (method === "POST") Object.assign(initSetting, { body: form });
  return fetch(URL_BASE + url, initSetting);
}

function cleanProduct() {
  let fields = document.getElementsByClassName("field");
  let nFields = fields.length;
  for (let i = 0; i < nFields; i++) {
    if (fields[i].id.indexOf("select") > -1) fields[i].selectedIndex = 0;
    else fields[i].value = "";
  }
  document.getElementById("chkOffer").checked = false;
  newDetailProducts = [];
  indexProduct = 0;
  indexDetail = 0;
  imageProduct = [];
}

function addProduct() {
  $("#divTitulo").text("Nuevo producto");
  $("#divSubTitulo").text("Ingresa los datos de tu nuevo producto.");
  $("#btnSaveProduct").show();
  $("#btnUpdateProduct").hide();
  $("#listadoLocal").hide();
  $("#AgregarLocal").show();
  window.scrollTo(0, 0);
}

function editProduct(id) {
  $("#tituloLocal").text("Editar Producto");
  $("#subTituloLocal").text("Edita los datos de tu producto.");
  $("#btnSaveProduct").hide();
  $("#btnUpdateProduct").show();
  $("#listadoLocal").hide();
  $("#AgregarLocal").show();
  window.scrollTo(0, 0);
  $("#divLoading").show();
  indexProduct = id;
  let url = URL_PRODUCT + id + "/";
  fetchAPI(url, "GET")
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(objProduct => {
      console.log(objProduct);
      let fields = document.getElementsByClassName("field");
      fields[0].value = objProduct["name"];
      fields[1].value = objProduct["description"];
      fields[2].value = objProduct["category"];
      fields[3].value = objProduct["unidad_medida"];
      fields[4].value = objProduct["precio_size_less"];
      fields[5].value = objProduct["precio_size_higher"];
      document.getElementById("chkOffer").checked = objProduct["ofert"];
      $("#divLoading").hide();
    })
    .catch(error => {
      $("#divLoading").hide();
      console.log(error);
    });
}

function saveProduct() {
  $("#divLoading").show();
  let fields = document.getElementsByClassName("field");
  var formData = new FormData();
  formData.append("name", fields[0].value);
  formData.append("description", fields[1].value);
  formData.append("category", fields[2].value);
  formData.append("unidad_medida", fields[3].value);
  formData.append("precio_size_less", +fields[4].value);
  formData.append("precio_size_higher", +fields[5].value);
  formData.append("ofert", document.getElementById("chkOffer").checked);
  formData.append("exclusive", false);
  formData.append("brand", "Prueba");
  fetchAPI(URL_PRODUCTS, "POST", formData)
    .then(response => {
      alert("Se creo el producto exitosamente");
      return fetchAPI(URL_PRODUCTS, "GET");
    })
    .then(response => response.json())
    .then(resJson => {
      listProducts(resJson);
      $("#divLoading").hide();
      closeProduct();
    })
    .catch(error => {
      $("#divLoading").hide();
      console.log(error);
    });
}

function closeProduct() {
  $("#listadoLocal").show();
  $("#AgregarLocal").hide();
  window.scrollTo(0, 0);
  cleanProduct();
}

function addDetail() {
  $("#myModal").modal();
  $("#tituloDetalle").text("Agregar detalle");
  $("#btnSaveDetail").text("Agregar detalle");
  indexDetail = 0;
}

function editDetail(index) {
  $("#myModal").modal();
  $("#tituloDetalle").text("Editar detalle");
  $("#btnSaveDetail").text("Guardar cambios");
  indexDetail = index;
  document.getElementById("selectColor").value = newDetailProducts[index][0];
  // let chkSizes = document.getElementsByClassName("sizes");
  // let nSizes = chkSizes.length;
  // let arrIdSizes = [],
  //   arrNameSizes = [];
  // for (let i = 0; i < nSizes; i++) {
  //   if (chkSizes[i].checked) {
  //     arrIdSizes.push(chkSizes[i].value);
  //     arrNameSizes.push(chkSizes[i].getAttribute("data-name"));
  //   }
  // }
  document.getElementById("txtStock").value = newDetailProducts[index][2];
}

function deleteDetail(index) {
  if (confirm("¿Esta seguro de borrar este detalle?")) {
    newDetailProducts.splice(index, 1);
    listDetailProduct();
  }
}

function newDetailProduct() {
  let selectColor = document.getElementById("selectColor").value;
  let chkSizes = document.getElementsByClassName("sizes");
  let nSizes = chkSizes.length;
  let arrIdSizes = [],
    arrNameSizes = [];
  for (let i = 0; i < nSizes; i++) {
    if (chkSizes[i].checked) {
      arrIdSizes.push(chkSizes[i].value);
      arrNameSizes.push(chkSizes[i].getAttribute("data-name"));
    }
  }
  let txtStock = document.getElementById("txtStock").value;
  let newDetail = [selectColor, arrIdSizes, arrNameSizes, txtStock];
  return newDetail;
}

function saveDetail() {
  let newDetail = newDetailProduct();
  newDetailProducts.push(newDetail);
  listDetailProduct();
}

function updateDetail() {
  let newDetail = newDetailProduct();
  newDetailProducts[indexDetail] = newDetail;
  listDetailProduct();
}

function listDetailProduct() {
  let nDetailProduct = newDetailProducts.length;
  let str = "";
  for (let i = 0; i < nDetailProduct; i++) {
    str += "<tr>";
    str += "<td>";
    str += newDetailProducts[i][0];
    str += "</td>";
    str += "<td>";
    str += newDetailProducts[i][1].join();
    str += "</td>";
    str += "<td>";
    str += newDetailProducts[i][4];
    str += "</td>";
    str += "<td>";
    str += '<img class="img-ico" src="images/icons/editar.png" alt=""';
    str += 'onclick="editDetail(';
    str += i;
    str += ')">';
    str += '<img class="img-ico" src="images/icons/eliminar.png" alt=""';
    str += 'onclick="deleteDetail(';
    str += i;
    str += ')">';
    str += "</td>";
    str += "</tr>";
  }
  document.getElementById("tbListDetailProducts").innerHTML = str;
}

window.onload = function() {
  $("#divLoading").show();
  URL_BASE = sessionStorage.getItem("urlBase");
  fetchAPI(URL_PRODUCTS, "GET")
    .then(response => response.json())
    .then(resJson => {
      listProducts(resJson);
      $("#divLoading").hide();
      return Promise.all(URLS_FEATURES.map(url => fetchAPI(url, "GET")));
    })
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(resJson => {
      listSelect(resJson[0], "selectCategories");
      listSizes(resJson[1]);
      listSelect(resJson[2], "selectColor");
    });
};

function listProducts(result) {
  var nList = result.length;
  var strTableBodyRegulars = "",
    strTableBodyOffers = "",
    strTableBody = "";
  var rowList;
  for (var i = 0; i < nList; i++) {
    rowList = result[i];
    strTableBody = "<tr>";
    strTableBody += "<td>";
    strTableBody += '<img class="img-mini" src="';
    if (rowList["photo_1"]) strTableBody += rowList["photo_1"];
    strTableBody += '" alt="">';
    strTableBody += "</td>";
    strTableBody += "<td>";
    strTableBody += rowList["name"];
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
    strTableBody += '<img class="img-ico" src="images/icons/editar.png" ';
    strTableBody += 'alt="" onclick="editProduct(';
    strTableBody += rowList["id"];
    strTableBody += ')"/>';
    strTableBody += '<img class="img-ico" src="images/icons/eliminar.png" ';
    strTableBody += 'alt="" onclick="deleteProduct(';
    strTableBody += rowList["id"];
    strTableBody += ')"/>';
    strTableBody += "</td>";
    strTableBody += "</tr>";
    if (rowList["ofert"]) strTableBodyOffers += strTableBody;
    else strTableBodyRegulars += strTableBody;
  }

  document.getElementById(
    "tbListProductsRegulars"
  ).innerHTML = strTableBodyRegulars;
  document.getElementById(
    "tbListProductsOffers"
  ).innerHTML = strTableBodyOffers;
}

function listSelect(result, idElement) {
  let nList = result.length;
  let str = "";
  for (let i = 0; i < nList; i++) {
    str += "<option ";
    str += 'value="';
    str += result[i].id;
    str += '">';
    str += result[i].name;
    str += "</option>";
  }
  document.getElementById(idElement).innerHTML = str;
}

function listSizes(result) {
  let nList = result.length;
  let str = "";
  for (let i = 0; i < nList; i++) {
    str += '<label class="checkbox-inline">';
    str += '<input class="sizes" type="checkbox" value="';
    str += result[i].id;
    str += '" data-name="';
    str += result[i].name;
    str += '">';
    str += result[i].name;
    str += "</label>";
  }
  document.getElementById("divSizes").innerHTML = str;
}

function errorsMessages(error) {
  console.log(error);
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
