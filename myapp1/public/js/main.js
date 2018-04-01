$(document).ready(function(){
    $('.deleteButton').on('click', deleteUser);
});

function deleteUser(){
    let confirmation = confirm('Delete User?');

    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/'+$(this).data('idnum')
        }).done(function(response){
            //window.location.replace('/');
        });
        window.location.replace('/');
    }else{
        return false;
    }
}