

function searchPatient() {
    //get the first name 
    var search_string  = document.getElementById('search_string').value

    //construct the URL and redirect to it

    window.location = '/patient/search/' + encodeURI(search_string)
}

function searchDoctor() {
    //get the first name 
    var search_string  = document.getElementById('search_string').value

    //construct the URL and redirect to it

    window.location = '/doctor/search/' + encodeURI(search_string)
}

function searchMedication() {
    //get the first name 
    var search_string  = document.getElementById('search_string').value

    //construct the URL and redirect to it

    window.location = '/medication/search/' + encodeURI(search_string)
}