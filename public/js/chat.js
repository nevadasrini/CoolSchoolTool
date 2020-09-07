const addForm = document.getElementById('addtask-form');
addForm.addEventListener('submit', (e) => {
    console.log("pooser!")
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    const subject = addForm['subject'].value;
    const description = addForm['desc'].value;
    const linkID = 'app.html';
    const docID = subject+description;

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("loser~")
            db.collection('rooms').doc(docID).set({
                subject: addForm['subject'].value,
                room: addForm['desc'].value,
                link: linkID,
                userID: user.uid
            }).then(cred=> {
                const modal = document.querySelector('#modal-add');
                M.Modal.getInstance(modal).close();
                loginForm.reset();
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

    //assign values to elements
    li.setAttribute('data-id', doc.id)
    name.textContent = doc.data().subject;
    desc.textContent = doc.data().room;
    cross.textContent = 'X';
    // Create anchor element. 
                var a = document.createElement('a');  
                  
                // Create the text node for anchor element. 
                var link = document.createTextNode("Join Class!"); 
                  
                // Append the text node to anchor element. 
                a.appendChild(link);  
                  
                  
                // Set the href property. 
                a.href = doc.data().link;  
                  
                // Append the anchor element to the body. 
                

    //append elements of taskList to each list item
    li.appendChild(name);
    li.appendChild(desc);
    li.appendChild(cross);
    li.appendChild(a);  

    //append list item to taskList
    taskList.appendChild(li);

    //deleting data
    cross.addEventListener('click', (e) =>{
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('rooms').doc(id).delete();
    })
}

//cycle through assignments and pass through render function
db.collection('rooms').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        auth.onAuthStateChanged(user => {
            if (doc.data().userID== user.uid){
                renderTasks(doc)
                console.log(doc.data());
            }
        })
    })
})
