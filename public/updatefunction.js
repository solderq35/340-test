function updateDoctor(id){
    $.ajax({
        url: '/doctor/' + id,
        type: 'PUT',
        data: $('#update-doctor').serialize(),
        success: function(result){
            window.location.replace("./");
        }
		
		
    })
	window.location.reload();
};

function updatePatient(id){
    $.ajax({
        url: '/patient/' + id,
        type: 'PUT',
        data: $('#update-patient').serialize(),
        success: function(result){
            window.location.replace("./");
        }
		
		
    })
	window.location.reload();
};

function updateMedication(id){
    $.ajax({
        url: '/medication/' + id,
        type: 'PUT',
        data: $('#update-medication').serialize(),
        success: function(result){
            window.location.replace("./");
        }
		
		
    })
	window.location.reload();
};

function updatePharmacy(id){
    $.ajax({
        url: '/pharmacy/' + id,
        type: 'PUT',
        data: $('#update-pharmacy').serialize(),
        success: function(result){
            window.location.replace("./");
        }
		
		
    })
	window.location.reload();
};

