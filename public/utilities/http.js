function signUpUser(options) {
    const { userData, onSuccess, onError } = options;

    $.ajax('/api/user/',{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            if(onError) {
                onError(err);
            }
        }
    })
}

function loginUser(options){
    const { userData, onSuccess, onError } = options;

    $.ajax('/api/auth/login',{
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        dataType: 'json',
        data: JSON.stringify(userData),
        success: onSuccess,
        error: err => {
            if(onError) {
                onError(err);
            }
        }
    })
}

function getAllJournalPosts(options){

    let {storeJournals}  = options;
    
    $.ajax('/api/journal-post/',{
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('authToken')}`
        },
        dataType: 'json',
        success: storeJournals
    })
}

function createJournal(options){
    let { journalData, onSuccess, onError } = options;

    $.ajax('/api/journal-post/',{
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('authToken')}`
        },
        dataType: 'json',
        data: JSON.stringify(journalData),
        success: onSuccess,
        error: err => {
            if(onError) {
                onError(err);
            }
        }
    })
}

function updateJournalPost(options){
    let { updatedJournalData, onSuccess, onError } = options;

    $.ajax(`/api/journal-post/${updatedJournalData.id}`,{
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('authToken')}`
        },
        dataType: 'json',
        data: JSON.stringify(updatedJournalData),
        success: onSuccess,
        error: err => {
            if(onError) {
                onError(err);
            }
        }
    })
}

function deleteJournalPost(options){
    let { id, onSuccess, onError } = options;

    $.ajax(`/api/journal-post/${id}`,{
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('authToken')}`
        },
        dataType: 'json',
        success: onSuccess,
        error: err => {
            if(onError) {
                onError(err);
            }
        }
    })
}

export { signUpUser, loginUser, createJournal, getAllJournalPosts, updateJournalPost, deleteJournalPost };