'use strict';

//importing functions that render state
import { getJournalPost, fetchJournals } from "./dashboard/dashboard.js"
import { renderLoginPage, renderRegisterPage, renderCreatePost, renderUpdatePost } from "./dashboard/render-pages.js";
import { onLoginSubmit, onPageLoad, onSignUpSubmit, logout, onCreatePost, onUpdatePost, onDeletePost } from "./auth/auth.js"
 
// event listeners
$(function(){
    onPageLoad();

    const $app = $('main.app');

    $app.on('click','.login', () => {
        $app.html(renderLoginPage());
    })

    $app.on('click','.register', () => {
        $app.html(renderRegisterPage());
    })

    $app.on('click','.btn-post', () => {
        $app.html(renderCreatePost());
    })

    $app.on('submit', '.js-login', onLoginSubmit);

    $app.on('submit', '.js-register', onSignUpSubmit);

    $app.on('submit','.js-journal', onCreatePost);

    $app.on('click', 'a.journal-box', e => {
            const journalPost = getJournalPost($(e.currentTarget).data('id'))
            $app.html(renderUpdatePost(journalPost))
    })

    $app.on('click','.delete-btn', e => {
        e.preventDefault();

        var answer = window.confirm("Are you sure you want to delete this post?")

        if(answer){
            const id = $(e.currentTarget).closest('.js-journal-update').data('id');
            onDeletePost(id)
        }
    })

    $app.on('click','.back-btn', function(e){
        e.preventDefault();

        $app.html(fetchJournals());
    })

    $app.on('submit','.js-journal-update', onUpdatePost)

    $('.logout').on('click', logout)
})
