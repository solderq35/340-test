/*For all entity functions:
Retrieve the data and construct the URL, redirect to it.*/

function searchPatient() {
  var search_string = document.getElementById("search_string").value;
  window.location = "/patient/search/" + encodeURI(search_string);
}

function searchDoctor() {
  var search_string = document.getElementById("search_string").value;
  window.location = "/doctor/search/" + encodeURI(search_string);
}

function searchMedication() {
  var search_string = document.getElementById("search_string").value;
  window.location = "/medication/search/" + encodeURI(search_string);
}

function searchPharmacy() {
  var search_string = document.getElementById("search_string").value;
  window.location = "/pharmacy/search/" + encodeURI(search_string);
}

function searchDiagnosis() {
  var search_string = document.getElementById("search_string").value;
  window.location = "/diagnosis/search/" + encodeURI(search_string);
}
