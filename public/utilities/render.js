window.RENDER_MODULE = {
    renderJournalsToCalendar
}

// let monthsValue = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06", "Jul":"07", "Aug":"08", "Sep":"09", "Oct":"10", "Nov":"11", "Dec":"12"};
let monthsValue = {"01": "jan", "02":"feb", "03": "mar", "04": "apr", "05": "may", "06": "jun", "07": "jul", "08": "aug", "09": "sep", "10": "oct", "11": "nov", "12": "dec"};
function renderJournalsToCalendar(journalData){

    journalData.forEach(obj => {

        let monthAndYear = $('.calendar').find('#monthAndYear').text();
        let year = obj.publishDate.substring(0,4);
        let month = obj.publishDate.substring(5,7);
        let day = obj.publishDate.substring(8,10);

        if(day.substring(0,1) === '0'){
            day = day.substring(1,2)
        }


        $(`.${monthsValue[month]}${day}${year}`).find('.title').append(obj.title);
    })
}