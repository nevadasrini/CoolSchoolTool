const addForm = document.getElementById('addtask-form');
addForm.addEventListener('submit', (e) => {
    console.log("pooser!")
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    const subject = addForm['subject'].value;
    const desc = addForm['desc'].value;
    const docID = subject+desc;

    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("loser~")
            db.collection('assignments').doc(docID).set({
                subject: addForm['subject'].value,
                duedate: addForm['due-date'].value,
                desc: addForm['desc'].value,
                userID: user.uid
            })
        }
    })
})
