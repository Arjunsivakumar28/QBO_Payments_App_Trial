console.log("App Works!");

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
}

function loginSubmit(ele) {
    let email_input = ele.parentElement.parentElement.parentElement.children[1].children["email-login-input"].value;
    let password_input = ele.parentElement.parentElement.parentElement.children[1].children[3].children["password-login-input"].value;
    let test_id = "";
    for (let i = 0; i < email_input.length; i++) { test_id += email_input.charCodeAt(i); }
    for (let i = 0; i < password_input.length; i++) { test_id += password_input.charCodeAt(i); }
    if (accounts.findIndex((parse) => parse.id == test_id) != -1) {
        window.location.href = "./home_page/home.html";
    } else {
        console.log("incorrect email : ", email_input, " or password : ", password_input);
    }
    console.log("email input : ", email_input);
    console.log("password input : ", password_input);
    console.log("accounts : ", accounts);
}

function signupSubmit(ele) {
    let email_input = ele.parentElement.parentElement.parentElement.children[1].children["email-login-input"].value;
    let password_input = ele.parentElement.parentElement.parentElement.children[1].children[3].children["password-login-input"].value;
    let confirm_password_input = ele.parentElement.parentElement.parentElement.children[1].children[5].children["password-login-input-confirm"].value;
    if (password_input == confirm_password_input) {
        let account = new Object();
        account.email = email_input;
        account.password = password_input;
        account.id = "";
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


