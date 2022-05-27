function deletedoctor(doctor_id){
    $.ajax({
        url: '/doctor/' + doctor_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletediagnosis(diagnosis_id){
    $.ajax({
        url: '/diagnosis/' + diagnosis_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletemedication(medication_id){
    $.ajax({
        url: '/medication/' + medication_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletepharmacy(pharmacy_id){
    $.ajax({
        url: '/pharmacy/' + pharmacy_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletepatient(patient_id){
    $.ajax({
        url: '/patient/' + patient_id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deletePeopleCert(pid, cid){
  $.ajax({
      url: '/people_certs/pid/' + pid + '/cert/' + cid,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};

function deletemediphar(medication_id, pharmacy_id){
  $.ajax({
      url: '/mediphar/medication_id/' + medication_id + '/pharmacy_id/' + pharmacy_id,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};