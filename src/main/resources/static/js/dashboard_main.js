console.log("check works!");

console.log("making an update to dashboard");

// -----------------------------------------------------------------------------------------------------------------------

// Sidebar open close function
function sidebar_open_close(ele) {
    let mainbar = document.getElementById("main-bar");
    let sidebar = document.getElementById("main-sidebar");
    let open = ele.children[0].children[0];
    let close = ele.children[0].children[1];

    open.classList.remove("d-none");
    if (sidebar.style.display == "flex") {

        sidebar.classList.remove("d-flex");
        sidebar.style.display = "none";

        mainbar.classList.remove("col-10");
        mainbar.classList.add("col");

        close.style.display = "none";

        open.style.display = "flex";

        console.log("element check : ", close.style.display);
    } else {

        sidebar.classList.remove("d-none");
        sidebar.style.display = "flex";

        mainbar.classList.remove("col");
        mainbar.classList.add("col-10");

        close.style.display = "flex";

        open.style.display = "none";

        console.log("element check : ", close.style.display);
    }
    console.log("element check : ", sidebar);


}

// -----------------------------------------------------------------------------------------------------------------------

// global variables (array)
let originalApiArray;
let displayApiArray;

let warningInvoiceElements = document.querySelectorAll(".warning-invoices");
let paymentsTable = document.querySelector(".recent-payments");

let title = ""

console.log("the accounts: ", JSON.parse(sessionStorage.getItem("accounts")))
let accounts = JSON.parse(sessionStorage.getItem("accounts"))
let act_obj = accounts.find(obj => obj.isActive == true)
console.log("act_obj", act_obj)

switch (act_obj.email) {
    case "admin@gmail.com":
        title = "Admin"
        break;
    case "Birds@Intuit.com":
        title = "Amy's Bird Sanctuary"
        break;
    case "Surf@Intuit.com":
        title = "Bill's Windsurf Shop"
        break;
    case "Cool_Cars@intuit.com":
        title = "Cool Cars"
        break;
    default:
        title = ""
}

document.getElementById("login-title").innerText = title
document.getElementById("portal-title").innerText = (title == "Admin") ? "Admin Portal" : "Customer Portal"

// -----------------------------------------------------------------------------------------------------------------------

// signout
function signOut() {
    accounts.forEach(obj => obj.isActive = false)
    sessionStorage.setItem("accounts", JSON.stringify(accounts));
    window.location.href = "/"
}

// -----------------------------------------------------------------------------------------------------------------------

// Find Status of Api Array
function checkStatus(apiObj) {
    if (apiObj.balance == 0) {
        return "Paid";
    } else if (Date.now() > apiObj.dueDate) {
        return "Over Due";
    } else if (Date.now() <= apiObj.dueDate) {
        return "Not Due";
    }
}

// --------------------------------------------------------------------------------------------------------------

// Find Type of Api Array
function checkType(apiObj) {
    if (apiObj.unappliedAmt == 0) {
        return "Applied";
    } else if (apiObj.unappliedAmt == apiObj.totalAmt) {
        return "Unapplied";
    } else {
        return "Partially Applied";
    }
}


// --------------------------------------------------------------------------------------------------------------

// Convert date obj to string date
function dateConvert(dateObj) {

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();

    if (day < 10) { day = "0" + day; }
    if (month < 10) { month = "0" + month; }

    return [month, day, year].join('/');
}

// --------------------------------------------------------------------------------------------------------------

// Get Invoice ID from Payment Obj
function invoiceIdFromPayment(payObj) {
    let txnId = "-";

    if (payObj.line.length != 0) {
        if (payObj.line[0].linkedTxn.length != 0) {
            if (payObj.line[0].linkedTxn[0].txnType == "Invoice") {
                txnId = payObj.line[0].linkedTxn[0].txnId;
            }
        }
    }
    return txnId;
}

// --------------------------------------------------------------------------------------------------------------

// delay function
const delay = ms => new Promise(res => setTimeout(res, ms));

// --------------------------------------------------------------------------------------------------------------

// Bank Accounts crud operations check
function bankAccountCheck() {
    console.log("bank account check button works");
    fetch("/bankAccountGet")
        .then(response => {
            console.log("the response object : ", response);
            console.log("the type of response object : ", typeof response);
            response.text()
            .then(text => {
                console.log("the text object : ", text);
                console.log("the type of text object : ", typeof text);
                console.log("first character : ", text[0]);
                if (text.startsWith("[", 0)) {
                    let arr = [];
                    arr = JSON.parse(text);
                    console.log("the array of objects : ", arr);
                    console.log("the type of array of objects : ", typeof arr);
                // } else if (text.startsWith("{", 0)) {
                //     let arr = text.split(" /// ");
                //     for (let i = 0; i < arr.length; i++) {
                //         arr[i] = JSON.parse(arr[i]);
                //     }
                //     console.log("the array of objects : ", arr);
                //     console.log("the type of array of objects : ", typeof arr);
                }
            })
        })
        .catch(err => console.log("an error with fetch for paymentsCheck : ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Bank Accounts Tokenization
function bankAccountToken() {
    console.log("bank account Token button works");
    fetch("/bankAccountToken")
        .then(response => {
            console.log("the response object : ", response);
            console.log("the type of response object : ", typeof response);
            response.text()
            .then(text => {
                console.log("the text object : ", text);
                console.log("the type of text object : ", typeof text);
                console.log("first character : ", text[0]);
                if (text.startsWith("[", 0)) {
                    let arr = [];
                    arr = JSON.parse(text);
                    console.log("the array of objects : ", arr);
                    console.log("the type of array of objects : ", typeof arr);
                // } else if (text.startsWith("{", 0)) {
                //     let arr = text.split(" /// ");
                //     for (let i = 0; i < arr.length; i++) {
                //         arr[i] = JSON.parse(arr[i]);
                //     }
                //     console.log("the array of objects : ", arr);
                //     console.log("the type of array of objects : ", typeof arr);
                }
            })
        })
        .catch(err => console.log("an error with fetch for paymentsCheck : ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Credit Card crud operations check
function creditCardCheck() {
    console.log("credit card crud operation check");
    fetch("/creditCardGet")
        .then(response => {
            console.log("the response object : ", response);
            console.log("the type of response object : ", typeof response);
            response.text()
            .then(text => {
                console.log("the text object : ", text);
                console.log("the type of text object : ", typeof text);
                console.log("first character : ", text[0]);
                if (text.startsWith("[", 0)) {
                    let arr = [];
                    arr = JSON.parse(text);
                    console.log("the array of objects : ", arr);
                    console.log("the type of array of objects : ", typeof arr);
                }
            })
        })
        .catch(err => console.log("an error with fetch for creditCardCheck : ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Credit Card Tokenization
function creditCardToken() {
    console.log("credit card tokenization button works");
    fetch("/cardToken")
        .then(response => {
            console.log("the response object : ", response);
            console.log("the type of response object : ", typeof response);
            response.text()
            .then(text => {
                console.log("the text object : ", text);
                console.log("the type of text object : ", typeof text);
                console.log("first character : ", text[0]);

                let val = JSON.parse(text);
                console.log("the value of object : ", val);
                console.log("the type of object : ", typeof val);

            })
        })
        .catch(err => console.log("an error with fetch for creditCardToken : ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Creating charge for card token
function chargeProcessCard(idx, ele) {

    warningModal.hide();

    console.log("creating charge for card button works");
    console.log("check ele: ", ele.id)
    let amount = "0";
    if (ele.id == "pay-bal") {
        amount = displayApiArray[idx].balance;
    } else if (ele.previousElementSibling.value) {
        amount = ele.previousElementSibling.value
    } else {
        amount = "0"
    }

    let load_html = `
    <div class="w-100 row justify-content-center">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    document.querySelector(".payable-invoice-item" + idx).innerHTML = load_html;
    paymentsTable.innerHTML = load_html;
    // payments-and-graph

    fetch("/chargeProcess?id=" + displayApiArray[idx].id + "&amt=" + amount)
        .then(response => {
            console.log("the response object : ", response);
            console.log("the type of response object : ", typeof response);
            response.text()
            .then(text => {
                console.log("the text object : ", text);
                console.log("the type of text object : ", typeof text);
                console.log("first character : ", text[0]);
                if (text.startsWith("{", 0)) {
                    let arr = text.split(" /// ");
                    for (let i = 0; i < arr.length; i++) {
                        arr[i] = JSON.parse(arr[i]);
                    }
                    console.log("the array of objects : ", arr);
                    console.log("the type of array of objects : ", typeof arr);
                }
                queryInvoices()
                queryPayments()
            })
        })
        .catch(err => console.log("an error with fetch for creditCardToken : ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Get list of all customers using query 
function customersList() {
    console.log("get list of customers");
    fetch("/queryCustomers")
    .then(response => {
        console.log("the response object : ", response);
        console.log("the type of response object : ", typeof response);
        response.text()
        .then(text => {
            console.log("the text object : ", text);
            console.log("the type of text object : ", typeof text);
            console.log("first character : ", text[0]);
            
            let arr = text.split(" /// ");
            for (let i = 0; i < arr.length; i++) {
                arr[i] = JSON.parse(arr[i]);
            }
            
            console.log("the array of objects : ", arr);
            console.log("the type of array of objects : ", typeof arr);
        })
    }).catch (err => console.log("an error with fetching customer query + ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Get list of all accounts using query 
function accountsList() {
    console.log("get list of customers");
    fetch("/queryAccounts")
    .then(response => {
        console.log("the response object : ", response);
        console.log("the type of response object : ", typeof response);
        response.text()
        .then(text => {
            console.log("the text object : ", text);
            console.log("the type of text object : ", typeof text);
            console.log("first character : ", text[0]);
            
            let arr = text.split(" /// ");
            for (let i = 0; i < arr.length; i++) {
                arr[i] = JSON.parse(arr[i]);
            }
            
            console.log("the array of objects : ", arr);
            console.log("the type of array of objects : ", typeof arr);
        })
    }).catch (err => console.log("an error with fetching customer query + ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Get sales receipt crud response 
function salesReceiptCrud() {
    console.log("get list of customers");
    fetch("/salesReceiptCrud")
    .then(response => {
        console.log("the response object : ", response);
        console.log("the type of response object : ", typeof response);
        response.text()
        .then(text => {
            console.log("the text object : ", text);
            console.log("the type of text object : ", typeof text);
            console.log("first character : ", text[0]);

            if (text.startsWith("{", 0)) {
                let arr = text.split(" /// ");
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = JSON.parse(arr[i]);
                }
                console.log("the array of objects : ", arr);
                console.log("the type of array of objects : ", typeof arr);
            }

        }).catch (err => console.log("an error with fetching customer query one + ", err))
    }).catch (err => console.log("an error with fetching customer query + ", err))
}

// --------------------------------------------------------------------------------------------------------------

// Get depsoit list response
function depositList() {
    console.log("get list of deposits");
    fetch("/depositList")
    .then(response => {
        console.log("the response object : ", response);
        console.log("the type of response object : ", typeof response);
        response.text()
        .then(text => {
            console.log("the text object : ", text);
            console.log("the type of text object : ", typeof text);
            console.log("first character : ", text[0]);

            if (text.startsWith("{", 0)) {
                let arr = text.split(" /// ");
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = JSON.parse(arr[i]);
                }
                console.log("the array of objects : ", arr);
                console.log("the type of array of objects : ", typeof arr);
            }

        }).catch (err => console.log("an error with fetching customer query one + ", err))
    }).catch (err => console.log("an error with fetching customer query + ", err))
}
// --------------------------------------------------------------------------------------------------------------

// Modal invoice display
let warningModal = new bootstrap.Modal(document.getElementById("warning-modal"));
warningModal.show();

// Set loading for the dashboard tables
let html_body = `
<div class="w-100 row justify-content-center my-2">
    <div id="spinner" class="spinner-border z-3" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
`
let sortableInvoiceElements = document.querySelectorAll(".sortable");
for (let ele of sortableInvoiceElements) {
    ele.innerHTML = html_body;
}

// --------------------------------------------------------------------------------------------------------------

// Fetch Dashboard Invoices
function queryInvoices() {
    fetch("/queryInvoices")
    .then(response => response.text())
    .then(text => {

        let data = text.split(" /// ");
        for (let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        console.log("data from api for invoice : ", data);
        originalApiArray = data;

        displayApiArray = JSON.parse(JSON.stringify(data));

        // Filter and sort the invoices
        if (title != "Admin") {
            displayApiArray = displayApiArray.filter(obj => obj.customerRef.name == title)
        }
        displayApiArray = displayApiArray.filter(obj => checkStatus(obj) != "Paid");
        displayApiArray.sort((a, b) => b.balance - a.balance);

        html_body = "";

        // Display the dashboard invoices
        for (let idx in displayApiArray) {
            console.log("the index ininvoice display array is : ", idx)
            if (idx == 8) {
                break;
            }

            if (idx == 3) {
                console.log("here where idx : ", idx);
                for (let ele of warningInvoiceElements) {
                    ele.innerHTML = html_body;
                }
                html_body = "";
            }
            html_body += (title != "Admin") ? `
            <div class="payable-invoice-item`+idx+` row rounded border bg-light shadow-sm mb-3 mx-2 p-2 align-items-center justify-content-center">
                <div class="warning-invoices col d-flex justify-content-center border-end">`+ displayApiArray[idx].docNumber +`</div>
                <div class="warning-invoices col d-flex justify-content-center border-end">$`+ displayApiArray[idx].balance +`</div>
                <div class="warning-invoices col d-flex justify-content-center border-end">`+ checkStatus(displayApiArray[idx]) +`</div>
                <div class="warning-invoices col d-flex justify-content-center "> 
                    <button role="button" class="btn btn-outline-success" onclick="checkoutProcess(`+idx+`, this)"> Pay
                    </button>
                    <div class="dropdown-menu">
                        <form class="p-4" aria-labelledby="payDropdown">
                            <button id="pay-bal" type="button" class="mb-3 btn btn-primary" 
                                onclick="chargeProcessCard(`+ idx +`, this)"> Pay Balance
                            </button>
                            <br>
                            <label for="pay-amt" class="mb-1 form-label"><b>Enter Other Amount: </b></label>
                            <input id="pay-amt" class="mb-1 form-control">
                            <button id="pay-inp-amt" type="button" class="btn btn-secondary" 
                                onclick="chargeProcessCard(`+ idx +`, this)"> 
                                Pay Other Amount
                            </button>
                        </form>
                    </div>
                </div>
                
            </div>
            ` : `
            <div class="payable-invoice-item`+idx+` row rounded border bg-light shadow-sm mb-3 mx-2 p-2 align-items-center justify-content-center">
                <div class="warning-invoices col d-flex justify-content-center border-end">`+ displayApiArray[idx].docNumber +`</div>
                <div class="warning-invoices col d-flex justify-content-center border-end">$`+ displayApiArray[idx].balance +`</div>
                <div class="warning-invoices col d-flex justify-content-center border-end">`+ checkStatus(displayApiArray[idx]) +`</div>
                <div class="warning-invoices col-5 d-flex justify-content-center">`+ displayApiArray[idx].customerRef.name +`</div>
            </div>
            `
        }
        // id="payDropdown" data-bs-toggle="dropdown" aria-expanded="true"
        if (displayApiArray.length < 4) {
            for (let ele of warningInvoiceElements) {
                ele.innerHTML = html_body;
            }
            document.getElementById("other-invoices").innerHTML = "";
        } else {
            document.getElementById("other-invoices").innerHTML = html_body;
        }

    })
    .catch(err => console.log("the error : ", err))
}
queryInvoices()

// -----------------------------------------------------------------------------------------------------------------------

// checkout function
function checkoutProcess(idx, ele) {
    window.location.href="/checkout?id=" + displayApiArray[idx].id;
}

// -----------------------------------------------------------------------------------------------------------------------

// Compare Function
function compareFn(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

// -----------------------------------------------------------------------------------------------------------------------

// Fetch Payments
function queryPayments() {
    fetch("/queryPayments")
    .then(response => response.text())
    .then(text => {

        let data = text.split(" /// ");
        for (let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        console.log("data from api for payments: ", data);
        originalApiArray = data;

        displayApiArray = JSON.parse(JSON.stringify(data));

        // Filter and sort the invoices
        if (title != "Admin") {
            displayApiArray = displayApiArray.filter(obj => obj.customerRef.name == title)
        }
        displayApiArray.sort((a, b) =>b.txnDate - a.txnDate);

        html_body = "";

        // Display the dashboard invoices
        for (let idx in displayApiArray) {
            if (idx == 8) {
                break;
            }
            html_body += (title != "Admin") ? `
            <div class="payable-payment-item`+idx+` row rounded border bg-light shadow-sm mb-3 mx-2 px-2 py-3 align-items-center justify-content-center">
                <div class="recent-payments col d-flex justify-content-center border-end">`+ dateConvert(new Date(displayApiArray[idx].txnDate)) +`</div>
                <div class="recent-payments col d-flex justify-content-center border-end">$`+ displayApiArray[idx].totalAmt +`</div>
                <div class="recent-payments col d-flex justify-content-center border-end text-center">`+ checkType(displayApiArray[idx]) +`</div>
                <div class="recent-payments col d-flex justify-content-center "> `+ invoiceIdFromPayment(displayApiArray[idx]) +` </div>
            </div>
            ` : `
            <div class="payable-payment-item`+idx+` row rounded border bg-light shadow-sm mb-3 mx-2 px-2 py-3 align-items-center justify-content-center">
                <div class="recent-payments col d-flex justify-content-center border-end">`+ dateConvert(new Date(displayApiArray[idx].txnDate)) +`</div>
                <div class="recent-payments col d-flex justify-content-center border-end">$`+ displayApiArray[idx].totalAmt +`</div>
                <div class="recent-payments col-5 d-flex justify-content-center border-end text-center">`+ displayApiArray[idx].customerRef.name +`</div>
                <div class="recent-payments col d-flex justify-content-center "> `+ invoiceIdFromPayment(displayApiArray[idx]) +` </div>
            </div>
            `
        }

        paymentsTable.innerHTML = html_body;

    })
    .catch(err => console.log("the error : ", err))
}
queryPayments()

// --------------------------------------------------------------------------------------------------------------

// Pay invoice api functionality
function payInvoice(idx) {

    warningModal.hide();

    let load_html = `
    <div class="w-100 row justify-content-center">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    document.querySelector(".payable-invoice-item" + idx).innerHTML = load_html;
    // payments-and-graph
    fetch("payInvoice?id=" + displayApiArray[idx].id)
        .then(response => response.text())
        .then(text => {

            console.log("the text from api -> ", text);
            let data = text.split(" /// ");
            for (let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
            console.log("data from api : ", data);
            originalApiArray = data;

            // display payed sign for the invoice
            document.querySelector(".payable-invoice-item" + idx).innerHTML = `
            <div class="alert alert-success alert-dismissible fade show m-0" role="alert">
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    <strong class="me-2">Payment Successful!</strong> Check the invoice and payments history for updates.
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            `;

            document.querySelector(".alert").addEventListener("animationend", function() {
                displayApiArray = JSON.parse(JSON.stringify(data));

                // Filter and sort the invoices
                displayApiArray = displayApiArray.filter(obj => checkStatus(obj) != "Paid");
                displayApiArray.sort((a, b) => b.balance - a.balance);

                html_body = "";

                // Display the dashboard invoices
                for (let idx in displayApiArray) {
                    if (idx == 8) {
                        break;
                    }

                    if (idx == 3) {
                        console.log("here where idx : ", idx);
                        for (ele of warningInvoiceElements) {
                            ele.innerHTML = html_body;
                        }
                        html_body = "";
                    }
                    html_body +=  `
                    <div class="payable-invoice-item`+idx+` row rounded border bg-light shadow-sm mb-3 mx-2 p-2 align-items-center justify-content-center">
                        <div class="warning-invoices col d-flex justify-content-center border-end">`+ displayApiArray[idx].docNumber +`</div>
                        <div class="warning-invoices col d-flex justify-content-center border-end">$`+ displayApiArray[idx].balance +`</div>
                        <div class="warning-invoices col d-flex justify-content-center border-end">`+ checkStatus(displayApiArray[idx]) +`</div>
                        <div class="warning-invoices col d-flex justify-content-center "> <button type="button" class="btn btn-success" onclick="payInvoice(`+ idx +`)">Pay</button> </div>
                    </div>
                    `
                }

                document.getElementById("other-invoices").innerHTML = html_body;
            })

        })
        .catch(err => console.log(err))

}

// -----------------------------------------------------------------------------------------------------------------------

