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
            $('main.app').html(fetchJournals());
            $('.logout').show();
        },
        onError: err => {
            alert(`${JSON.stringify(err)}`);
            console.log(err.responseJSON.message);
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
            alert(`journal post has been added to database`);
            $('main.app').html(fetchJournals());
        },
        onError: err => {
            console.log(err);
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
            alert('Post has been updated');
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
            $('main.app').html(fetchJournals());
        },
        onError: err => {
            console.log(`error inside onDeletePost`)
        }
    })
}

export { onSignUpSubmit, onLoginSubmit, onPageLoad, logout, onCreatePost, onUpdatePost, onDeletePost};