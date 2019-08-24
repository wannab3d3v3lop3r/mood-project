function getAuthenticatedUserFromCache(){
    let jwtToken = localStorage.getItem('authToken');
    let userId = localStorage.getItem('userid');
    let username = localStorage.getItem('username');
    let firstName = localStorage.getItem('firstName');
    let lastName = localStorage.getItem('lastName');
    
    return {
        jwtToken,
        userId,
        username,
        firstName,
        lastName
    }
}

function saveAuthenticatedUserToCache(user){
    localStorage.setItem('authToken', user.authToken);
    localStorage.setItem('userid', user.user.id);
    localStorage.setItem('username', user.user.username);
    localStorage.setItem('firstName', user.user.firstName);
    localStorage.setItem('lastName', user.user.lastName);
}

function deleteAuthenticatedUserFromCache(){
    localStorage.removeItem('authToken');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
}

export { getAuthenticatedUserFromCache, saveAuthenticatedUserToCache, deleteAuthenticatedUserFromCache}