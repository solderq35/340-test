function updatedoctor(doctor_id){
    $.ajax({
        url: '/doctor/' + doctor_id,
        type: 'PUT',
        data: $('#update-doctor').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
