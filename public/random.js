
const STORE = {
    response: [],
  }
  
  /* VIEW? */
  function displayStuff(stuff) {
    let str = '';
  
    for (let i = 0; i < 5; i++) {
      str += `<div class="row">`
      
      for (let j = 0; j < 7; j++) {
          //i + j = day
          //month, year other parameters
          //
        const stuffsDay = findStuffForDay(stuff, i + j + 1); // also: month, year as args?
  
        //if undefined/null render an empty grid
  
        //use dom for the source of truth.
        //else
        //data-whatever attribute
        str += `
          <div 
            data-stuff-id="${stuffsDay.id ? : }"
            class="styly ${stuffsDay.mood === 'happy' ? 'green' : 'red'}">
            <h1>Whatever</h1>
            ${stuffsDay.title}
            <button>Edit</button>
          </div>
        `;
      }
  
      str += `</div>`;
    }
    return str
  }
  
  // controller
  
  // unhappy coupling between controller and view :( damnit jQuery
  $('.thing').on('click', '.whatever > button', editWhatever)
  
  fetchStuff(function (resJson) {
    STORE.response = resJson
    $('.thing').html(displayStuff(resJson))
  })
  
  function editWhatever(ev) {
      //look data method
      const whateverId = $(ev.currentTarget).closest('.whatever').data('whatever-id')
  
      fetchWhatever(whateverId, function(resJson) {
          displayDetails(resJson);
      });
  }
  
  editStuff(function (resJson) {
      STORE.response = resJson
      $('.thing').html(displayStuff(resJson))
  })
  // model
  
  function fetchStuff(cb) {
    fetch('asdad')
      .then(resJson => {
        cb(resJson)
      })
  } 