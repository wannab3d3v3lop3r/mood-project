const TEMP_ENDPOINT = "http://localhost:8080";

function checkCredentials(email, password){
    const settings = {
        url: TEMP_ENDPOINT + '/login',
        data: {

        },
        ContentType: 'application/javascript',
        dataType: 'json',
        type: 'GET',
        success: callback
    }
    $.ajax(settings);
}

function watchLogin(){
    $('.js-login').submit(function(event){
        event.preventDefault();

        const email = $(this).find('.user-email').val();
        const password = $(this).find('.user-password').val();

        console.log(email, password);
    })
}

$(watchLogin);
