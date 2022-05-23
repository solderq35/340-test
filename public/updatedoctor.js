function updateDoctor(id){
    $.ajax({
        url: '/doctor/' + id,
        type: 'PUT',
        data: $('#update-doctor').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
