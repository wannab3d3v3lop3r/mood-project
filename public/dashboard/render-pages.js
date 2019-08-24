'use strict';

const renderStarterPage = () => {
    return `
        <div class="intro">
            <h2>
                Release your inner thoughts
                <br>
                Find comfort and love within yourself
            </h2>
            <button class="login">Log In</button>
            <button class="register">Get Started</button>
        </div>
        `
}

const renderLoginPage = () => {
    return `<form class="js-login" aria-label="login">
                <input id="username" type="text" class="username" placeholder="Username" required>
                <input id="password" type="password" class="password" placeholder="Password" required>
                <button class="login-submit" type="submit">Log in</button>
                <div class="error hidden"></div>
            </form>`
}

const renderRegisterPage = () => {
    return `<form class="js-signup" aria-label="login">
                <input id="username" class="username" type="text" placeholder="Username" required>
                <input id="password" class="password" type="text" placeholder="Password" required>
                <input id="firstname" class="firstname" type="text" placeholder="First name" required>
                <input id="lastname" class="lastname" type="text" placeholder="Last name" required>
                <button class="register-submit" type="submit">Sign up</button>
                <div class="error hidden"></div>
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

export { renderStarterPage, renderLoginPage, renderRegisterPage, renderDashboardPage }