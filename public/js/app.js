const addForm = document.getElementById('addtask-form');
const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('assignments').where('subject', '==', searchForm['search'].value).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            auth.onAuthStateChanged(user => {
                if (doc.data().userID== user.uid){
                        console.log(searchForm['search'].value)
                        renderTasks(doc)
                        console.log(doc.data());
                }
            })
        })
    })

})

addForm.addEventListener('submit', (e) => {
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    const subject = addForm['subject'].value;
    const description = addForm['desc'].value;
    const docID = subject+description;

    auth.onAuthStateChanged(user => {
        if (user) {
            db.collection('assignments').doc(docID).set({
                subject: addForm['subject'].value,
                duedate: addForm['due-date'].value,
                desc: addForm['desc'].value,
                userID: user.uid
            })
        }
    })
})

const taskList = document.querySelector('#task-list');

function renderTasks(doc){
    //create elements

    let li = document.createElement('li');
    let name = document.createElement('span');
    let desc = document.createElement('span');
    let cross = document.createElement('div');
    let date = document.createElement('span');

    //assign values to elements
    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().subject;
    desc.textContent = doc.data().desc;
    cross.textContent = 'X';
    date.textContent = doc.data().duedate;

    //append elements of taskList to each list item
    li.appendChild(name);
    li.appendChild(desc);
    li.appendChild(cross);
    li.appendChild(date);

    //append list item to taskList
    taskList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('assignments').doc(id).delete();
    })
}

document.addEventListener('DOMContentLoaded', function() {
  //setInterval(page_refresh, 0.25*60000)
  if (!Notification) {
    alert('Desktop notifications not available in your browser. Try Chromium.');
    return;
  }
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});


function checkNotif(doc) {
  //console.log(doc);
  const duedate = Date.parse(doc.duedate);
  //console.log(duedate);
  var OneDay = new Date().getTime() + (1 * 24 * 60 * 60 * 1000)
  var OneHour = new Date().getTime() + (1 * 60 * 60 * 1000)
  if (OneDay > duedate) {
    //console.log('Less than 1 day')
    sendNotif(doc, 'a day');
  } else if (OneDay < duedate) {
    //console.log('More than 1 day')
  }
}

function sendNotif(doc, timeRemains) {
  if (Notification.permission !== 'granted')
    Notification.requestPermission();
  else {
    var notification = new Notification(`${doc.subject} is due in less than ${timeRemains}!`, {
      icon: 'https://classcape.online/images/logo.png',
      body: `${doc.desc} - ${doc.duedate}`,
    });
    notification.onclick = function() {
      window.open('https://classcape.online/assignments.html');
    };
  }
}

//cycle through assignments and pass through render function
if(searchForm['search'].value==''){
    db.collection('assignments').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            auth.onAuthStateChanged(user => {
                if (doc.data().userID== user.uid){
                    renderTasks(doc);
                    checkNotif(doc.data());
                    console.log(doc.data());
                }
            })
        })
    })
}
