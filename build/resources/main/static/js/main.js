console.log("App Works!");

console.log("making an update to home page");

// Close window and go to connected
function launchPopup(path) {
    let parameters = "location=1,width=800,height=650";
    parameters += ",left=" + (screen.width - 800) / 2 + ",top=" + (screen.height - 650) / 2;
    // Launch Popup
    window.open(path, 'connectPopup', parameters);
}

// Password show and hide function
function password_show_hide(ele) {
    console.log("click works")
    console.log("element check : ", ele.children);
    let password = ele.parentElement.children[0];
    let show_eye = ele.children[0];
    let hide_eye = ele.children[1];
    hide_eye.classList.remove("d-none");
    if (password.type === "password") {
        password.type = "text";
        show_eye.style.display = "none";
        hide_eye.style.display = "block";
    } else {
        password.type = "password";
        show_eye.style.display = "block";
        hide_eye.style.display = "none";
    }
}

// let fruits = [];

// // session storage get
// console.log("Initial data check", JSON.parse(sessionStorage.getItem("fruits")));
// if (JSON.parse(sessionStorage.getItem("fruits")) != null) {
//     fruits = JSON.parse(sessionStorage.getItem("fruits"));
//     displayFruits();
// }

// // session storage set 
// sessionStorage.setItem("fruits", JSON.stringify(fruits));

let accounts = []
if (JSON.parse(sessionStorage.getItem("accounts")) != null) {
    accounts = JSON.parse(sessionStorage.getItem("accounts"));
    console.log("accounts : ", accounts);
} else {
    
    // "admin"
    // "admin@gmail.com"
    let account = new Object();
    account.email = "admin@gmail.com";
    account.password = "password";
    account.id = "";
    account.isActive = false
    for (let i = 0; i < account.email.length; i++) { account.id += account.email.charCodeAt(i); }
    for (let i = 0; i < account.password.length; i++) { account.id += account.password.charCodeAt(i); }
    accounts.push(account);

    // "Amy's Bird Sanctuary"
    // "Birds@Intuit.com"
    account = new Object();
    account.email = "Birds@Intuit.com";
    account.password = "password";
    account.id = "";
    account.isActive = false
    for (let i = 0; i < account.email.length; i++) { account.id += account.email.charCodeAt(i); }
    for (let i = 0; i < account.password.length; i++) { account.id += account.password.charCodeAt(i); }
    accounts.push(account);

    // "Bill's Windsurf Shop"
    // "Surf@Intuit.com"
    account = new Object();
    account.email = "Surf@Intuit.com";
    account.password = "password";
    account.id = "";
    account.isActive = false
    for (let i = 0; i < account.email.length; i++) { account.id += account.email.charCodeAt(i); }
    for (let i = 0; i < account.password.length; i++) { account.id += account.password.charCodeAt(i); }
    accounts.push(account);

    // "Cool Cars"
    // "Cool_Cars@intuit.com"
    account = new Object();
    account.email = "Cool_Cars@intuit.com";
    account.password = "password";
    account.id = "";
    account.isActive = false
    for (let i = 0; i < account.email.length; i++) { account.id += account.email.charCodeAt(i); }
    for (let i = 0; i < account.password.length; i++) { account.id += account.password.charCodeAt(i); }
    accounts.push(account);

    console.log("accounts", accounts)

    sessionStorage.setItem("accounts", JSON.stringify(accounts));
}


function loginSubmit(ele) {
    let email_input = ele.parentElement.parentElement.parentElement.children[1].children["email-login-input"].value;
    let password_input = ele.parentElement.parentElement.parentElement.children[1].children[3].children["password-login-input"].value;
    let test_id = "";
    for (let i = 0; i < email_input.length; i++) { test_id += email_input.charCodeAt(i); }
    for (let i = 0; i < password_input.length; i++) { test_id += password_input.charCodeAt(i); }
    let found_idx = accounts.findIndex((parse) => parse.id == test_id)
    if (found_idx != -1) {
        accounts[found_idx].isActive = true
        sessionStorage.setItem("accounts", JSON.stringify(accounts));
        window.location.href = "/login"
    } else {
        console.log("incorrect email : ", email_input, " or password : ", password_input);
    }
    console.log("email input : ", email_input);
    console.log("password input : ", password_input);
    console.log("accounts : ", accounts);
}

function signupSubmit(ele) {
    let email_input = ele.parentElement.parentElement.parentElement.children[1].children["email-signup-input"].value;
    let password_input = ele.parentElement.parentElement.parentElement.children[1].children[3].children["password-signup-input"].value;
    let confirm_password_input = ele.parentElement.parentElement.parentElement.children[1].children[5].children["password-signup-input-confirm"].value;
    if (password_input == confirm_password_input) {
        let account = new Object();
        account.email = email_input;
        account.password = password_input;
        account.id = "";
        account.isActive = false
        for (let i = 0; i < email_input.length; i++) { account.id += email_input.charCodeAt(i); }
        for (let i = 0; i < password_input.length; i++) { account.id += password_input.charCodeAt(i); }
        if (accounts.findIndex((parse) => parse.email == email_input) == -1) {
            accounts.push(account);
            sessionStorage.setItem("accounts", JSON.stringify(accounts));
        } else {
            console.log("account ", email_input, " already exists!!!!!!!!")
        }
    } else {
        console.log("confirm password : ", confirm_password_input, " not same as password input : ", password_input)
    }
    console.log("email input : ", email_input);
    console.log("password input : ", password_input);
    console.log("confirm password input : ", confirm_password_input);
    console.log("accounts : ", accounts);
}


