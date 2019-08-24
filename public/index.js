'use strict';

//importing functions that render state

import { renderLoginPage, renderRegisterPage } from "./dashboard/render-pages.js";
import { onLoginSubmit, onPageLoad, onSignUpSubmit, logout } from "./auth/auth.js"
 
// event listeners
$(function(){
    onPageLoad();

    $('main.app').on('click','.login', () => {
        $('main.app').html(renderLoginPage());
    })

    $('main.app').on('click','.register', () => {
        $('main.app').html(renderRegisterPage());
    })

    $('main.app').on('submit', '.js-login', onLoginSubmit);

    $('main.app').on('submit', '.js-register', onSignUpSubmit);

    $('.logout').on('click', logout)
})
