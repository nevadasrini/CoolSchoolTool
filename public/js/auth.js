// listen for auth status changes and logs them to the console
var currentUser = null;
var currentUserData = null;


auth.onAuthStateChanged(user => {
    if (user) {
        console.log('user logged in: ', user)
        if (!currentUser == null){
            getUser(cred.user.uid).then(doc=>{
                currentUser = doc;
                currentUserData = doc.data();
                setupUI(user);
                console.info(currentUserData);
            })
            .catch(error=>console.error(error));
        }else{
            setupUI(user);
        }
        
    } else {
        
        if(!document.location.href.includes("index.html")){
            document.location.href = "index.html";
            console.log( document.location.href);
        }
        setupUI();
        console.log('user logged out');
    }
})

// sign up
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    // prevent refresh (losing info)
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    const name = signupForm['signup-name'].value;



    const docID = email;
    db.collection('users').doc(docID).set({
        email: email,
        name: name,
    })
    
    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();

        let uid = cred.user.uid;
        
        db.collection('users').doc(docID).update({
            userid: uid || "none"
        })
    })
    
    auth.onAuthStateChanged(user => {
        
    })
})

// log out
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    // prevent default actions (refresh)
    e.preventDefault()
    auth.signOut().then(() => {
        console.log("logged out");
    })
})

//  login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
    // prevent default actions (refresh)
    e.preventDefault()

    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    // log in user
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // close login modal and reset form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();

        return getUser(cred.user.uid);
    }).then(doc=>{
        currentUser = doc;
        currentUserData = doc.data();
        console.info(currentUserData);
    })
    .catch(error=>console.error(error));
})
