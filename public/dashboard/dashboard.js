import { getAllJournalPosts } from '../utilities/http.js'

let STATE = {};
const CACHE = window.CACHE_MODULE;
const HTTP = window.HTTP_MODULE;
const RENDER = window.RENDER_MODULE;

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectYear = document.getElementById("year");
let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let lowerCaseMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

let monthAndYear = document.getElementById("monthAndYear");

function renderCalendar(state, month, year){
    let firstDay = (new Date(year, month)).getDay();
    let stateIndex = 0;

    let date = 1;
    let tableString = `<div class="calendar">`;
    tableString += `<button class="btn btn-outline-primary col-sm-6 previous-month">Previous</button><button class="btn btn-outline-primary col-sm-6 next-month">Next</button>`;
    // calendar dates of the month
    tableString += `<div>`;
    tableString += showDays();
    tableString += `</div>`
    console.log(state)
    // calendar dates with number
    for (let i = 0; i < 5; i++) {
        // creates a table row
        tableString += `<div class="row">`;

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            //creates empty boxes
            if (i === 0 && j < firstDay) {
                tableString += `<div class="empty"></div>`;
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }
            //creates boxes with the date number
            else {

                const box = findStuffForDayLOL(state, date, month + 1, year);
                console.log(box)
                tableString +=
                `<div  class="colored-box">
                    <div>
                    <span>${date}</span>
                    <div class="title"></div>
                    </div>
                </div>`;
                date++;
            }
        }
        tableString += '</div>'
    }
    //return the whole string with .html()
    $('main.app').html(tableString);
}

function findStuffForDayLOL(state, date, month, year){

    let items = state.find(item => {
        let journalDay = Number(item.publishDate.substring(9,10))
        let journalMonth = Number(item.publishDate.substring(6,7))
        let journalYear = Number(item.publishDate.substring(0,4))

        if(date === journalDay && month === journalMonth && year === journalYear){
            return item
        }
    })

    console.log(`items is `, items)

    return items;
}

function storeJournals(data){
    STATE.journals = data;
    renderCalendar(data, currentMonth, currentYear);
    console.log(`State has been stored`, STATE);
}

function fetchJournals(){
    getAllJournalPosts({storeJournals})
}

$(function(){
    fetchJournals();

    // showDays();
    // setTimeout(function(){
    //     renderCalendar(STATE, currentMonth, currentYear)
    // },1000)
    

    // HTTP.getAllJournalPosts({onSuccess: RENDER.renderJournalsToCalendar});

    $('main.app').on('click','.next-month',next)

    $('main.app').on('click','.previous-month',previous)
})


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    // showCalendar(currentMonth, currentYear);
    renderCalendar(STATE.journals, currentMonth, currentYear);
    // HTTP.getAllJournalPosts({onSuccess: RENDER.renderJournalsToCalendar});
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    renderCalendar(STATE.journals, currentMonth, currentYear);
    // HTTP.getAllJournalPosts({onSuccess: RENDER.renderJournalsToCalendar});
}


// create a function 

//create State to hold all the data

// API layer,
function showCalendar(month, year) {

    //first day of the month which lies on which particular day (Mon-Sunday)
    let firstDay = (new Date(year, month)).getDay();

 // body of the calendar
    // clearing all previous cells

    // filing data about month and in the page via DOM.
    // monthAndYear.innerHTML = months[month] + " " + year;

    // creating all cells
    let date = 1;
    let rowNum = 1;

    let tableString = ``;

    for (let i = 0; i < 5; i++) {
        // creates a table row
        tableString += `<div class="row">`;
        
        // add on to tableString to produce a big html
        $('#calendar-body').append(`<div class="row-${rowNum}"><div>`)

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            //creates empty boxes
            if (i === 0 && j < firstDay) {
                $(`.row-${rowNum}`).append(`<div class="empty"></div>`);
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }

            //creates boxes with the date number
            else {
                $(`.row-${rowNum}`).append(`<div class="colored-box"><div class="${lowerCaseMonths[month]}${date}${year}"><span>${date}</span><div class="title"></div></div></div>`);

                date++;
            }
        }

        rowNum++;
        tableString += '</div>'
    }
    //return the whole string with .html()
}

function showDays(){
    let dayString = '';
    for(let i = 0; i < 7; i++){
        dayString += `<div class="days">${days[i]}</div>`
    }
    return dayString;
}
// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}


// view



//controller

//model