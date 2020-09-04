// Project: Song Converter
// Names: Nivedha Srinivasan, Oreoluwa Alao
// Date: 6/14/20
// Task Description: Load log in and sign up modals, toggle UI links based on user auth status

// creates objects
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');


// 
const setupUI = (user) => {
    if (user){
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'block');
        loggedOutLinks.forEach(item => item.style.display = 'none');
    } else {
        // toggle UI elements
        loggedInLinks.forEach(item => item.style.display = 'none');
        loggedOutLinks.forEach(item => item.style.display = 'block');
    }
}

const setupSelect = ()=>{
    var selects = document.querySelectorAll('select');
    var instances = M.FormSelect.init(selects);
}

// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals, {
        onOpenStart: setupSelect
    });
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
  });