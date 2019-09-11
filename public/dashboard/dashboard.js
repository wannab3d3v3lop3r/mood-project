import { getAllJournalPosts } from '../utilities/http.js'

let STATE = {};

let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let days = ["Sunday", "Monday", "Tuesday", "Wedneday", "Thursday", "Friday", "Saturday"];

function renderCalendar(state, month, year){
    let firstDay = (new Date(year, month)).getDay();
    let alreadyPosted = findLatestDate();

    let date = 1;
    let tableString = `<div class="calendar">`;
    tableString += `<div class="calendar-nav">
                        <div></div>
                        <div class="calendar-nav-month">
                            <button class="next-btn previous-month"><i class="arrow left"></i>Previous</button>
                            <div class="month">${months[month]} ${year}</div>
                            <button class="prev-btn next-month">Next<i class="arrow right"></i></button>          
                        </div>
                        <div>
                            ${alreadyPosted ? `` : `<a href="#" class="btn-post">Create Post</a>`}
                        </div>
                    </div>`;

    // calendar dates of the month
    tableString += `<div class="calendar-container">`

    tableString += showDays();

    // calendar dates with number
    for (let i = 0; i < 5; i++) {
        // creates a table row
        // tableString += `<div class="row">`;

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            //creates empty boxes
            if (i === 0 && j < firstDay) {
                tableString += `<div class="journal-box empty hidden"></div>`;
            }
            else if (date > daysInMonth(month, year)) {
                break;
            }
            //creates boxes with the date number
            else {

                const box = findDateData(state, date, month + 1, year);

                if(box !== undefined){
                    tableString +=
                        `<a href="#" class="journal-box ${box.mood}" data-id="${box.id}"> 
                            <div>
                                <span class="date-number">${date}</span>
                            </div>
                            <div class="journal-info">
                                <span class="journal-title">${box.title}</span>
                                <p class="journal-content">${box.thoughts}</p>
                            </div>
                        </a>`;
                }
                else {
                    tableString +=
                    `<div class="journal-box hidden">
                        <div>
                            <span class="date-number">${date}</span>
                        </div>
                    </div>`;
                }

                date++;
            }
        }
    }
    tableString += '</div>'
    //return the whole string with .html()
    $('main.app').html(tableString);
}

function findDateData(state, date, month, year){

    let items = state.find(item => {
        let journalDay = 0;
        let journalMonth = 0;
        let journalYear = 0;

        if(Number(item.publishDate.substring(8,9) === 0)){
            journalDay = Number(item.publishDate.substring(9,10))
            journalMonth = Number(item.publishDate.substring(6,7))
            journalYear = Number(item.publishDate.substring(0,4))

            return date === journalDay && month === journalMonth && year === journalYear
        }
        else {
            journalDay = Number(item.publishDate.substring(8,10))
            journalMonth = Number(item.publishDate.substring(6,7))
            journalYear = Number(item.publishDate.substring(0,4))

            return date === journalDay && month === journalMonth && year === journalYear
        }
    })

    return items;
}

function findLatestDate(){

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let currentDay = today.getDate();

    return STATE.journals.some(journal => {

            let journalDay = Number(journal.publishDate.substring(8,10))
            let journalMonth = Number(journal.publishDate.substring(5,7))
            let journalYear = Number(journal.publishDate.substring(0,4))

            return journalDay === currentDay && journalMonth === currentMonth + 1 && journalYear === currentYear
    })
}

function storeJournals(data){
    STATE.journals = data;
    renderCalendar(data, currentMonth, currentYear)
}

function fetchJournals(){
    getAllJournalPosts({storeJournals})
}

$(function(){
    fetchJournals();
    $('main.app').on('click','.next-month',next)
    $('main.app').on('click','.previous-month',previous)
})


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    renderCalendar(STATE.journals, currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    renderCalendar(STATE.journals, currentMonth, currentYear);
}

function showDays(){
    let dayString = '';
    for(let i = 0; i < 7; i++){
        dayString += `<div class="days hidden">${days[i]}</div>`
    }
    return dayString;
}

// check how many days in a month code from https://dzone.com/articles/determining-number-days-month
function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function getJournalPost(id){
    let foundJournal = STATE.journals.find(journal => journal.id === id)
    STATE.currentID = foundJournal.id
    return foundJournal;
}

export { fetchJournals, getJournalPost }