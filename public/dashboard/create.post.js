let STATE = {
    months: {
        Janurary: "01", 
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12"
    }
};

HTTP = window.HTTP_MODULE;
CACHE = window.CACHE_MODULE;
RENDER = window.RENDER_MODULE;

$(function(){
    $('.js-journal').submit(postJournal)
    $('#months').html(appendMonths());
    $('#days').html(appendDays());
    $('#years').html(appendYear());
})

function postJournal(){

    let journalData = {
        title:$('.js-journal').find('.title').val(),
        mood: $('.js-journal').find('.mood').val(),
        thoughts: $('.js-journal').find('.thoughts').val()
    }

    HTTP.createJournal({
        journalData,
        onSuccess: data => {
            alert('Journal has been posted into database, redirecting ');
            window.open('/dashboard/dashboard.html','_self');
        },
        onError: err => {
            console.error(err);
        }
    })
}

function appendDays(){
    let days = [];
    for(let day = 1; day <= 31; day++){
        days.push(`<option value=${day}>${day}</option>`);
    }

    return days.join('');
}

function appendMonths(){
    let months = Object.keys(STATE.months).map(month => {
        return `<option value=${STATE.months[month]}>${month}</option>`
    })

    return months.join('');
}

function appendYear(){
    let years = [];
    let currentYear = new Date().getFullYear();

    for(let year = 2010; year <= currentYear; year++){
        years.push(`<option value=${year}>${year}</option>`);
    }

    return years.join('');
}
