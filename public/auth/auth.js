import { createJournal } from "../utilities/http.js"
import { signUpUser, loginUser, updateJournalPost, deleteJournalPost } from "../utilities/http.js";
import { fetchJournals } from "../dashboard/dashboard.js"
import { renderLoginPage, renderStarterPage } from "../dashboard/render-pages.js";
import { getAuthenticatedUserFromCache, saveAuthenticatedUserToCache, deleteAuthenticatedUserFromCache } from "../utilities/cache.js"


function onPageLoad(){
    const user = getAuthenticatedUserFromCache();
    if(user.jwtToken){
        $('main.app').html(fetchJournals());
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
        onSuccess: () => {
            $('main.app').html(renderLoginPage());
        },
        onError: err => {
            $('.js-signup').find('.error').html(err.responseJSON.message)
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
            saveAuthenticatedUserToCache(user);
            $('main.app').html(fetchJournals());
            $('.logout').show();
        },
        onError: err => {;
            $('.js-login').find('.error').html(err.responseText)
        }    
    })
}

function onCreatePost(event){
    event.preventDefault();

    let journalData = {
        title: $('main.app').find('.js-journal .title').val(),
        mood: $('main.app').find('.js-journal .mood').val(),
        thoughts: $('main.app').find('.js-journal .thoughts').val()
    }

    createJournal({
        journalData,
        onSuccess: user => {
            alert(`Journal has been saved`);
            $('main.app').html(fetchJournals());
        },
        onError: err => {
            $('main.app').find('.error').text(err.responseText);
        }
    })
}

function onUpdatePost(event){
    event.preventDefault();

    let updatedJournalData = {
        id: $(event.currentTarget).data('id'),
        title: $('main.app').find('.js-journal-update .title').val(),
        mood: $('main.app').find('.js-journal-update .mood').val(),
        thoughts: $('main.app').find('.js-journal-update .thoughts').val()
    }

    updateJournalPost({
        updatedJournalData,
        onSuccess: () => {
            alert('Journal post has been updated');
            $('main.app').html(fetchJournals());
        },
        onError: err => {
            alert(err)
        }
    })
}

function onDeletePost(id){
    deleteJournalPost({
        id,
        onSuccess: () => {
            alert('Post Deleted')
            $('main.app').html(fetchJournals());
        },
        onError: err => {
            console.log(`error inside onDeletePost`)
        }
    })
}

export { onSignUpSubmit, onLoginSubmit, onPageLoad, logout, onCreatePost, onUpdatePost, onDeletePost};