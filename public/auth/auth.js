import { signUpUser, loginUser } from "../utilities/http.js";
import { renderLoginPage,renderDashboardPage, renderStarterPage } from "../dashboard/render-pages.js";
import { getAuthenticatedUserFromCache, saveAuthenticatedUserToCache, deleteAuthenticatedUserFromCache } from "../utilities/cache.js"


function onPageLoad(){
    const user = getAuthenticatedUserFromCache();
    if(user.jwtToken){
        $('main.app').html(renderDashboardPage());
        $('.logout').show();
    }
    else {
        $('main.app').html(renderStarterPage());
    }
}

function logout(){
    deleteAuthenticatedUserFromCache();
    $('main.app').html(renderStarterPage());
    $('.logout').hide();
}

function onSignUpSubmit(event){

    event.preventDefault();

    let userData = { 
        username: $('.js-signup').find('.username').val(),
        password: $('.js-signup').find('.password').val(),
        firstName: $('.js-signup').find('.firstname').val(),
        lastName: $('.js-signup').find('.lastname').val()
    }

    signUpUser({
        userData,
        onSuccess: user => {
            $('main.app').html(renderLoginPage());
        },
        onError: err => {
            alert(`${JSON.stringify(err)}`);
            console.log(err.responseJSON.message);
        }    
    })
    
}

function onLoginSubmit(event){
    event.preventDefault();

    let userData = { 
        username: $('.js-login').find('.username').val(),
        password: $('.js-login').find('.password').val(),
    }

    loginUser({
        userData,
        onSuccess: user => {
            console.log(`user response is ${JSON.stringify(user)}`)
            saveAuthenticatedUserToCache(user);
            $('main.app').html(renderDashboardPage());
            $('.logout').show();
        },
        onError: err => {
            alert(`${JSON.stringify(err)}`);
            console.log(err.responseJSON.message);
        }    
    })
}

export { onSignUpSubmit, onLoginSubmit, onPageLoad, logout};