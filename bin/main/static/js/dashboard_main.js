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
    fetch("/bankAccountCheck")
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
    fetch("/creditCardCheck")
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
let warningInvoiceElements = document.querySelectorAll(".warning-invoices");
fetch("http://localhost:8080/queryInvoices")
    .then(response => response.text())
    .then(text => {

        let data = text.split(" /// ");
        for (let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        console.log("data from api : ", data);
        originalApiArray = data;

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
                for (let ele of warningInvoiceElements) {
                    ele.innerHTML = html_body;
                }
                html_body = "";
            }
            html_body +=  `
            <div class="payable-invoice-item`+idx+` row rounded border bg-light shadow-sm mb-3 mx-2 p-2 align-items-center justify-content-center">
                <div class="warning-invoices col d-flex justify-content-center border-end">`+ displayApiArray[idx].id +`</div>
                <div class="warning-invoices col d-flex justify-content-center border-end">$`+ displayApiArray[idx].balance +`</div>
                <div class="warning-invoices col d-flex justify-content-center border-end">`+ checkStatus(displayApiArray[idx]) +`</div>
                <div class="warning-invoices col d-flex justify-content-center "> <button type="button" class="btn btn-success" onclick="payInvoice(`+ idx +`)">Pay</button> </div>
            </div>
            `
        }

        document.getElementById("other-invoices").innerHTML = html_body;

    })
    .catch(err => console.log("the error : ", err))

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
let paymentsTable = document.querySelector(".recent-payments");
fetch("http://localhost:8080/queryPayments")
    .then(response => response.text())
    .then(text => {

        let data = text.split(" /// ");
        for (let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        console.log("data from api : ", data);
        originalApiArray = data;

        displayApiArray = JSON.parse(JSON.stringify(data));

        // Filter and sort the invoices
        displayApiArray.sort((a, b) =>b.txnDate - a.txnDate);

        html_body = "";

        // Display the dashboard invoices
        for (let idx in displayApiArray) {
            if (idx == 8) {
                break;
            }
            html_body +=  `
            <div class="payable-payment-item`+idx+` row rounded border bg-light shadow-sm mb-3 mx-2 px-2 py-3 align-items-center justify-content-center">
                <div class="recent-payments col d-flex justify-content-center border-end">`+ dateConvert(new Date(displayApiArray[idx].txnDate)) +`</div>
                <div class="recent-payments col d-flex justify-content-center border-end">$`+ displayApiArray[idx].totalAmt +`</div>
                <div class="recent-payments col d-flex justify-content-center border-end text-center">`+ checkType(displayApiArray[idx]) +`</div>
                <div class="recent-payments col d-flex justify-content-center "> `+ invoiceIdFromPayment(displayApiArray[idx]) +` </div>
            </div>
            `
        }

        paymentsTable.innerHTML = html_body;

    })
    .catch(err => console.log("the error : ", err))


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
    fetch("http://localhost:8080/payInvoice?id=" + displayApiArray[idx].id)
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
                        <div class="warning-invoices col d-flex justify-content-center border-end">`+ displayApiArray[idx].id +`</div>
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

