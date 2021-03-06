'use strict';

const renderStarterPage = () => {
    return `
        <div class="intro">
            <div>
                <h2 class="intro-title">
                    A mood journal with visual appeal
                    <br>
                    A safe space where you can embrace
                    <br>    
                </h2>
            </div>
            <div class="intro-btn">
                <button class="login">Log In</button>
                <button class="register">Get Started</button>
            </div>
        </div>
        `
}

const renderLoginPage = () => {
    return `<form class="js-login" aria-label="login">
                <input id="username" type="text" class="username" placeholder="Username" required>
                <input id="password" type="password" class="password" placeholder="Password" required>
                <button class="back-btn-login" type="click">Back</button>
                <button class="login-submit" type="submit">Log in</button>
                <div>
                    <p>For demo</p>
                    <p>Use localuser for username</p>
                    <p>Use localpassword for password</p>
                </div>
                <p class="error"></p>
            </form>`
}

const renderRegisterPage = () => {
    return `<form class="js-signup" aria-label="login">
                <input id="username" class="username" type="text" placeholder="Username" required>
                <input id="password" class="password" type="text" placeholder="Password" required>
                <input id="firstname" class="firstname" type="text" placeholder="First name" required>
                <input id="lastname" class="lastname" type="text" placeholder="Last name" required>
                <button class="back-btn-login" type="click">Back</button>
                <button class="register-submit" type="submit">Sign up</button>
                <p class="error"></p>
            </form>`
}

const renderDashboardPage = () => {
    return `<h1>welcome to the dashboard</h1>
            <button class="btn-post">Create Post</button>
            <button class="btn btn-outline-primary col-sm-6 previous-month">Previous</button>
            <button class="btn btn-outline-primary col-sm-6 next-month">Next</button>
            <div class="calendar">
                <div id="monthAndYear"></div>
                <div class="calendar-days"></div>
                <div class="dashboard-calendar">
                    <div id="calendar-body"></div>
                </div>
            </div>`;
}
//<input id="mood" type="text" name="mood" class="mood" placeholder="mood" required>
const renderCreatePost = () => {
    return `<section class="journal-post">
                <form role="form" aria-label="User's Journal Post" class="js-journal">
                    <input id="title" type="text" name="title" class="title" placeholder="title" required>
                    <select class="mood">
                        <option>Choose a mood</option>
                        <option value="happy">Happy</option>
                        <option value="sad">Sad</option>
                        <option value="anger">Anger</option>
                        <option value="normal">Normal</option>
                    </select>
                    <textarea id="thoughts" type="text" name="thoughts" class="thoughts" placeholder="thoughts" required></textarea>
                    <div class="btn-container">
                        <button class="back-btn" type="click">Back</button>
                        <button type="submit">submit</button>
                    </div>
                    <p class="error"></p>
                </form>
            </section>`
}

const renderUpdatePost = journalPost => {
    return `<section class="journal-update">
                <form role="form" aria-label="User's Journal Post" class="js-journal-update" data-id="${journalPost.id}">
                    <input id="title" type="text" name="title" class="title" placeholder="title" value="${journalPost.title} required"></input>
                    <select class="mood">
                        <option value="happy" ${journalPost.mood === 'happy' ? 'selected' : ''}>Happy</option>
                        <option value="sad" ${journalPost.mood === 'sad' ? 'selected' : ''}>Sad</option>
                        <option value="anger" ${journalPost.mood === 'anger' ? 'selected' : ''}>Anger</option>
                        <option value="normal" ${journalPost.mood === 'normal' ? 'selected' : ''}>Normal</option>
                    </select>
                    <textarea id="thoughts" type="text" name="thoughts" class="thoughts" placeholder="thoughts" required>${journalPost.thoughts}</textarea>
                    <div class="btn-container">
                        <button class="back-btn" type="click">Back</button>
                        <button class="delete-btn" type="click">Delete Post</button>
                    </div>
                    <button class="update-btn" type="submit">submit</button>
                </form>
            </section>`
}



export { renderStarterPage, renderLoginPage, renderRegisterPage, renderDashboardPage, renderCreatePost, renderUpdatePost }