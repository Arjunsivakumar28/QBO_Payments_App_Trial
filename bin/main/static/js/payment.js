console.log("check Payments works!");

console.log("making an update to payments");

// Spinner to Load Page
let date = new Date();
console.log("the js starts here : ", date);
window.onload = (event) => {
    console.log("loading is complete : ", date);
}
// --------------------------------------------------------------------------------------------------------------

// Defining Global variables 
let apiOrgArray;

let apiArray;

let typeTable;
let dateTable;
let filterTable;

let currPage = 1;
let pageSize = 4;

let final_page = 1;

let page_num = document.getElementById("page-number");

// Display function
function displayRows() {

    final_page = Math.ceil(apiArray.length / pageSize);

    let Html_rows = "";

    let idx = 0;

    for (idx in apiArray) {

        let start = (currPage - 1) * pageSize;

        let end = currPage * pageSize;

        if (idx >= start && idx < end) {

            let txnDateString = dateConvert(new Date(apiArray[idx].txnDate));

            Html_rows += `
            <div class="payment-table-row row align-items-center position-relative border-bottom m-0" id="payment-table-row`+ idx + `">
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2">
                        <input class="form-check-input z-2" type="checkbox" value="" id="row-check`+ idx + `"
                        aria-label="row-check" style="padding: .8rem;" onchange="checkboxAction(this)">
                    </div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">` + apiArray[idx].id + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">$`+ apiArray[idx].totalAmt + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">`+ txnDateString + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5 text-center">`+ checkType(apiArray[idx]) + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">`+ invoiceIdFromPayment(apiArray[idx]) + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2">
                        <a id="collapse-row`+ idx + `" class="stretched-link z-1" role="button" data-bs-toggle="collapse" 
                        href="#more-details-collapse`+ idx + `" aria-expanded="false" aria-controls="more-details-collapse` + idx + `"
                        onclick="collapseInvoiceAction(this)"></a>
                        <a class="me-2 z-2 fs-5" href="../../docs/Miner_Body Rituals Among the Nacirema.pdf">
                            pdf
                        </a>
                        <a class="me-2 z-2 fs-5" href="#">
                            view
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="collapse" id="more-details-collapse`+ idx + `">
                <div class="invoice-body rounded overflow-auto" style="background-color: cornsilk; height: 400px;">
                    <div class="pe-3 pt-2 top_buttons d-flex justify-content-end align-items-center">
                        
                        <button href="#more-details-collapse`+ idx + `" type="button" class="btn btn-primary me-3" aria-label="open-popup" target="popup"
                        onclick="window.open('#more-details-collapse`+ idx + `', 'name', 'width=600, height=1000')">Open Side</button>
                        
                        <button type="button" class="btn-close" aria-label="close-invoice" 
                            onclick="this.parentElement.parentElement.parentElement.classList.toggle('show')">
                        </button>
                    </div>
                    <div class="main_r row mt-3">
                        <div class="col-4 d-flex justify-content-center mb-3">
                            <button id="collapse-invoice-pay-btn" class="btn btn-outline-success my-3 px-5">
                                <h3>Pay Now</h3>
                            </button>
                        </div>
                        <div class="col-8 d-flex">
                            <div class="d-flex flex-column justify-content-start ms-2 mb-3">
                                <h6 class="sub-title fw-lighter">From: </h6>
                                <h6 class="amount"><b>Computer Solutions East, Inc.</b><br>
                                    481 Main Street, Suite 100 <br>
                                    New Rochelle, NY 10801 <br>
                                    +1 9148934076<br>
                                    bills@computersolutionseast.com<br>
                                    www.computersolutionseast.com</h6>
                            </div>
                            <div class="d-flex flex-column justify-content-start ms-5 mb-3">
                                <h6 class="sub-title fw-lighter">Client: </h6>
                                <h6 class="amount"><b>Client.Inc Technologies, LLC</b><br>
                                    402 abc Street Suite 909
                                    Chicago, IL 60101 US</h6>
                            </div>
                        </div>
                    </div>
                    <div class="main_r row mb-3">
                        <div class="col-4">
                            <div class="d-flex flex-column justify-content-center mb-3">
                                <h6 class="sub-title fw-lighter text-center">Invoice dates</h6>
                                <h6 class="amount text-center">11/12/2023 - 12/12/2023</h6>
                            </div>
                            <div class="d-flex flex-column">
                                <h6 class="sub-title fw-lighter text-center">Invoice number</h6>
                                <h6 class="amount text-center">#PD1224</h6>
                            </div>

                        </div>
                        <div class="col-8 d-flex flex-column justify-content-center">

                            <h6 class="sub-title fw-lighter text-left"><b>Description: </b>
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quasi placeat
                                doloribus laboriosam eos sit quisquam deserunt, veniam ipsam enim, quae
                                illum fugiat! Recusandae ducimus expedita, iusto officiis fugit
                                asperiores mollitia!
                            </h6>

                        </div>
                    </div>
                    <div class="main_row row mb-3 px-5">
                        <div class="col-12">
                            <h3>Price Description</h3>
                        </div>
                    </div>
                    <hr class="mx-5">
                    <div class="main_row row mb-3 px-5">
                        <div class="col-12">
                            <h5>Variable Cost Items</h5>
                        </div>
                    </div>
                    <div class="main_row row mb-3 px-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0 fw-lighter">Variable Cost Items</h6>
                        </div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">Quantity
                        </div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">Rate
                        </div>
                        <div class="due-date col d-flex justify-content-center fw-lighter">Amount</div>
                    </div>
                    <div class="main_row row mb-3 px-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0">Support</h6>
                        </div>
                        <div class="download-pdf col d-flex justify-content-center">6
                        </div>
                        <div class="due-date col d-flex justify-content-center">$2,500</div>
                        <div class="invoice-amount col d-flex justify-content-center">$15,000</div>
                    </div>
                    <div class="main_row row mb-3 px-5 mt-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0"></h6>
                        </div>
                        <div class="due-date col d-flex justify-content-center"></div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">Subtotal
                        </div>
                        <div
                            class="invoice-amount col d-flex justify-content-center border-top border-bottom border-2">
                            $15,000</div>
                    </div>
                    <hr class="mx-5">
                    <div class="main_row row mb-3 px-5">
                        <div class="col-12">
                            <h5>Fixed Cost Items</h5>
                        </div>
                    </div>
                    <div class="main_row row mb-3 px-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0 fw-lighter">Fixed Cost Items</h6>
                        </div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">
                        </div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">
                        </div>
                        <div class="due-date col d-flex justify-content-center fw-lighter">Amount</div>
                    </div>
                    <div class="main_row row mb-3 px-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0">abc</h6>
                        </div>
                        <div class="download-pdf col d-flex justify-content-center">
                        </div>
                        <div class="due-date col d-flex justify-content-center"></div>
                        <div class="invoice-amount col d-flex justify-content-center">$5,000</div>
                    </div>
                    <div class="main_row row mb-3 px-5 mt-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0"></h6>
                        </div>
                        <div class="due-date col d-flex justify-content-center"></div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">Subtotal
                        </div>
                        <div
                            class="invoice-amount col d-flex justify-content-center border-top border-bottom border-2">
                            $5,000</div>
                    </div>
                    <hr class="mx-5">
                    <div class="main_row row mb-3 px-5">
                        <div class="col-12">
                            <h5>Taxes and Discounts</h5>
                        </div>
                    </div>
                    <div class="main_row row mb-3 px-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0 fw-lighter">Tax / Discounts</h6>
                        </div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">
                        </div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">Percentage
                        </div>
                        <div class="due-date col d-flex justify-content-center fw-lighter">Amount</div>
                    </div>
                    <div class="main_row row mb-3 px-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0">IVA</h6>
                        </div>
                        <div class="download-pdf col d-flex justify-content-center">
                        </div>
                        <div class="due-date col d-flex justify-content-center">10%</div>
                        <div class="invoice-amount col d-flex justify-content-center">$2,000</div>
                    </div>
                    <div class="main_row row mb-3 px-5 mt-5 w-100">
                        <div class="col-5">
                            <h6 class="ms-5 mb-0"></h6>
                        </div>
                        <div class="due-date col d-flex justify-content-center"></div>
                        <div class="download-pdf col d-flex justify-content-center fw-lighter">Subtotal
                        </div>
                        <div
                            class="invoice-amount col d-flex justify-content-center border-top border-bottom border-2">
                            $2,000</div>
                    </div>
                    <hr class="mx-5">
                    <div class="main_row row mb-3 px-5">
                        <div class="col-12">
                            <h3>Total Invoiced</h3>
                        </div>
                    </div>
                    <div class="d-flex">
                        <div class="main_row row mb-3 px-5 w-100">
                            <div class="col-5">
                                <h6 class="ms-5 mb-0"></h6>
                            </div>
                            <div class="due-date col d-flex justify-content-center"></div>
                            <div class="download-pdf col d-flex justify-content-center fw-lighter">Total
                                Invoiced</div>
                            <div class="invoice-amount col d-flex justify-content-center">
                                $22,000</div>
                        </div>
                        <div class="vr"></div>
                    </div>
                    <div class="d-flex">
                        <div class="main_row row mb-3 px-5 mt-3 w-100">
                            <div class="col-5">
                                <h6 class="ms-5 mb-0"></h6>
                            </div>
                            <div class="due-date col d-flex justify-content-center"></div>
                            <div class="download-pdf col d-flex justify-content-center fw-lighter">Total
                                Paid</div>
                            <div class="invoice-amount col d-flex justify-content-center">$20,000</div>
                        </div>
                        <div class="vr mb-2 mt-2"></div>
                    </div>
                    <div class="d-flex">
                        <div class="main_row row mt-3 w-100">
                            <div class="col-5">
                                <h6 class="ms-5 mb-0"></h6>
                            </div>
                            <div class="due-date col d-flex justify-content-center"></div>
                            <div class="download-pdf col d-flex justify-content-center fw-lighter">Remaining
                                Balance</div>
                            <div class="invoice-amount col d-flex justify-content-center">
                                $2,000</div>
                        </div>
                        <div class="vr"></div>
                    </div>
                </div>
            </div>
            
            `
        }
    }

    document.getElementById("payment-table-body").innerHTML = Html_rows;

    console.log("reached here invocie table body : ", apiArray);

    page_num.innerText = currPage + " / " + final_page;

}

// --------------------------------------------------------------------------------------------------------------

function collapseInvoiceAction(ele) {

    console.log("ele check : ", ele.parentElement.parentElement.parentElement.nextSibling.nextSibling.children[0].children[1].children[0].children[0]);
    console.log("ele check : ", ele.parentElement.parentElement.previousSibling.previousSibling.children[0].children[1].innerText);

    let collapse_invoice_btn = ele.parentElement.parentElement.parentElement.nextSibling.nextSibling.children[0].children[1].children[0].children[0];

    collapse_invoice_btn.setAttribute("disabled", "");
    collapse_invoice_btn.children[0].innerText = "Paid";
    

}

// --------------------------------------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------------------------------------

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

function dateConvert(dateObj) {

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();

    if (day < 10) { day = "0" + day; }
    if (month < 10) { month = "0" + month; }

    return [month, day, year].join('/');
}

// --------------------------------------------------------------------------------------------------------------

function compareArrays(tObj) {
    for (let dObj of dateTable) {
        if (dObj.id == tObj.id) {
            console.log("check obj print : ", dObj);
            console.log("check type obj print : ", tObj);
            return true;
        }
    }
}

// --------------------------------------------------------------------------------------------------------------

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

// Api call querry payment script
let load_html = `
<div class="w-100 row justify-content-center">
    <div id="spinner" class="spinner-border z-3" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
`
document.getElementById("payment-table-body").innerHTML = load_html;

fetch("http://localhost:8080/queryPayments")
    .then(response => response.text())
    .then(text => {

        let data = text.split(" /// ");
        for (let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        console.log("data from api : ", data);
        apiOrgArray = data;

        typeTable = JSON.parse(JSON.stringify(apiOrgArray));
        dateTable = JSON.parse(JSON.stringify(apiOrgArray));
        filterTable = JSON.parse(JSON.stringify(typeTable));

        apiArray = JSON.parse(JSON.stringify(filterTable));

        currPage = 1;
        pageSize = 4;

        // Display the default table
        displayRows();

    })
    .catch(err => console.log(err))

// --------------------------------------------------------------------------------------------------------------

// Api call delete payment script
function deleteFirstPayment() {
    let load_html = `
    <div class="w-100 row justify-content-center">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    document.getElementById("payment-table-body").innerHTML = load_html;
    fetch("http://localhost:8080/deletePayment")
        .then(response => response.text())
        .then(text => {
            let data = text.split(" /// ");
            for (let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
            console.log("data from api : ", data);
            apiArray = data;
            apiOrgArray = data;

            currPage = 1;
            pageSize = 4;

            // Display the default table
            displayRows();
            document.getElementById("payment-table-body").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle me-2" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <strong class="me-2">Payment Deleted!</strong> Payment has been successfully removed.
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            ` + document.getElementById("payment-table-body").innerHTML;

        })
        .catch(err => console.log(err))


}

// API call create payment script
function createPayment() {
    let load_html = `
    <div class="w-100 row justify-content-center">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    document.getElementById("payment-table-body").innerHTML = load_html;
    fetch("http://localhost:8080/createPayment")
        .then(response => response.text())
        .then(text => {
            let data = text.split(" /// ");
            for (let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
            console.log("data from api : ", data);
            apiArray = data;
            apiOrgArray = data;

            currPage = 1;
            pageSize = 4;

            // Display the default table
            displayRows();
            document.getElementById("payment-table-body").innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle me-2" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    <strong class="me-2">Payment Created!</strong> Check at the top for the newely created payment.
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            ` + document.getElementById("payment-table-body").innerHTML;

        })
        .catch(err => console.log(err))

}

// --------------------------------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------------------------------

function typeChange(ele) {
    currPage = 1;
    pageSize = 4;

    let select = document.getElementById("payment-type-filter");

    switch (select.options.selectedIndex) {

        case 0:

            typeTable = JSON.parse(JSON.stringify(apiOrgArray));
            break;

        case 1:

            typeTable = apiOrgArray.filter((obj) => checkType(obj) == "Unapplied");
            break;

        case 2:

            typeTable = apiOrgArray.filter((obj) => checkType(obj) == "Applied");
            break;

        case 3:

            typeTable = apiOrgArray.filter((obj) => checkType(obj) == "Partially Applied");
            break;

        default:

            console.log("I should not be here");

            break;
    }

    console.log("filter table pre check : ", filterTable);

    filterTable = typeTable.filter(compareArrays);

    console.log("filter table type check : ", filterTable);

    console.log("type table type check : ", typeTable);

    apiArray = JSON.parse(JSON.stringify(filterTable));

    displayRows();

}

// --------------------------------------------------------------------------------------------------------------

function dateChange() {

    currPage = 1;
    pageSize = 4;

    let dateRange = document.getElementById("payment-date-filter");

    let today = new Date();

    let date_limit = new Date();

    switch (dateRange.options.selectedIndex) {

        case 0:

            dateTable = JSON.parse(JSON.stringify(apiOrgArray));
            break;

        case 1:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 1);
            dateTable = apiOrgArray.filter((obj) => obj.txnDate >= date_limit.getTime());
            break;

        case 2:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 7);
            dateTable = apiOrgArray.filter((obj) => obj.txnDate >= date_limit.getTime());
            break;

        case 3:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 31);
            dateTable = apiOrgArray.filter((obj) => obj.txnDate >= date_limit.getTime());
            break;

        case 4:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 183);
            dateTable = apiOrgArray.filter((obj) => obj.txnDate >= date_limit.getTime());
            break;

        case 5:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 365);
            dateTable = apiOrgArray.filter((obj) => obj.txnDate >= date_limit.getTime());
            break;

        default:

            console.log("I should not be here!!!");
            break;

    }


    console.log("filter table pre check : ", filterTable);

    filterTable = typeTable.filter(compareArrays);

    console.log("filter table type check : ", filterTable);

    console.log("date table type check : ", dateTable);

    apiArray = JSON.parse(JSON.stringify(filterTable));

    displayRows();

}

// --------------------------------------------------------------------------------------------------------------

let checkSearch = document.getElementById("table-search");

checkSearch.addEventListener("keyup", function () {

    currPage = 1;
    pageSize = 4;

    console.log("search Term : ", checkSearch.value);

    let searchTerm = checkSearch.value.toLowerCase();

    let searchTableContents = JSON.parse(JSON.stringify(apiOrgArray));

    let resultTable = searchTableContents.filter(obj => JSON.stringify(obj.id).toLowerCase().includes(searchTerm) ||
        JSON.stringify(obj.totalAmt).toLowerCase().includes(searchTerm) || dateConvert(new Date(obj.txnDate)).toLowerCase().includes(searchTerm) || 
        checkType(obj).toLowerCase().includes(searchTerm) ||  JSON.stringify(invoiceIdFromPayment(obj)).toLowerCase().includes(searchTerm) );

    console.log("filter table pre check : ", searchTableContents);

    searchTableContents = resultTable.filter((obj) => JSON.stringify(filterTable).includes(JSON.stringify(obj)));

    console.log("filter table type check : ", searchTableContents);

    console.log("result table type check : ", resultTable);

    apiArray = searchTableContents;

    displayRows();

})

// --------------------------------------------------------------------------------------------------------------

function checkboxAction(ele) {

    if (ele.checked) {
        ele.parentElement.parentElement.parentElement.setAttribute("style", "--bs-table-bg: #d5d5d5; background-color: #d5d5d5");
    } else {
        ele.parentElement.parentElement.parentElement.setAttribute("style", "--bs-table-bg:; background-color:");
    }

}

// --------------------------------------------------------------------------------------------------------------


function selectCheckboxClick(ele) {

    let tableRows = document.getElementById("payment-table-body").children;

    let boxChecked = true;

    for (let i = 0; i < tableRows.length; i++) {

        if (!tableRows[i].className.includes("payment-table-row")) { continue; }

        if (!tableRows[i].children[0].children[0].children[0].checked) {
            boxChecked = false;
            tableRows[i].children[0].children[0].children[0].checked = true;
        }
        tableRows[i].setAttribute("style", "--bs-table-bg: #d5d5d5; background-color: #d5d5d5");
    }

    if (boxChecked) {
        for (let i = 0; i < tableRows.length; i++) {

            if (!tableRows[i].className.includes("payment-table-row")) { continue; }

            tableRows[i].children[0].children[0].children[0].checked = false;
            tableRows[i].setAttribute("style", "--bs-table-bg:; background-color:");
        }
    }

}

// --------------------------------------------------------------------------------------------------------------

function recurringClick(ele) {

    console.log("test");

}

// --------------------------------------------------------------------------------------------------------------

let sortWatch = [
    { name: "txnDate", sort: 0 },
    { name: "id", sort: 0 },
    { name: "totalAmt", sort: 0 },
    { name: "invoice no.", sort: 0 },
    { name: "type", sort: 0 },
];

function compareFn(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
    // a must be equal to b
    return 0;
}

function tableColSort(ele) {

    let attri = ele.parentElement.children[0].innerText.toLowerCase();

    let up_arrow = ele.children[0];
    let down_arrow = ele.children[1];

    if (attri == "transaction no.") { attri = "id"; } else if (attri == "amount") { attri = "totalAmt"; } else if (attri == "transaction date") {attri = "txnDate";}

    console.log("attri:", attri);

    let index = sortWatch.findIndex((obj) => obj.name == attri);

    if (sortWatch[index].sort == 0) {
        if (sortWatch[index].name == "type") {
            apiArray.sort((a, b) => compareFn(checkType(b), checkType(a) ) );
        } else if (sortWatch[index].name == "invoice no.") {
            apiArray.sort( (a, b) =>  compareFn( parseInt(invoiceIdFromPayment(b)), parseInt(invoiceIdFromPayment(a)) ) );
        } else if (sortWatch[index].name == "id") {
            apiArray.sort((a, b) => compareFn( parseInt(b[attri]), parseInt(a[attri]) ));
        } else {
            apiArray.sort((a, b) => compareFn(b[attri], a[attri]));
        }

        up_arrow.classList.add("d-none");
        down_arrow.classList.add("mt-2");

        sortWatch[index].sort = 1;
    }
    else if (sortWatch[index].sort == 1) {

        if (sortWatch[index].name == "type") {
            apiArray.sort( (a, b) => compareFn( checkType(a), checkType(b) ) );
        } else if (sortWatch[index].name == "invoice no.") {
            apiArray.sort( (a, b) => compareFn( parseInt(invoiceIdFromPayment(a)), parseInt(invoiceIdFromPayment(b)) ) );
        } else if (sortWatch[index].name == "id") {
            apiArray.sort((a, b) => compareFn( parseInt(a[attri]), parseInt(b[attri]) ));
        } else {
            apiArray.sort((a, b) => compareFn(a[attri], b[attri]));
        }

        up_arrow.classList.remove("d-none");
        down_arrow.classList.remove("mt-2");

        up_arrow.classList.add("mt-1");
        down_arrow.classList.add("d-none");

        sortWatch[index].sort = 2;
    } else {

        apiArray = JSON.parse(JSON.stringify(filterTable));

        up_arrow.classList.remove("mt-1");
        down_arrow.classList.remove("d-none");

        sortWatch[index].sort = 0;
    }

    console.log("apiArray check : ", apiArray);

    displayRows();

}

// --------------------------------------------------------------------------------------------------------------

function displayNext() {

    if ((currPage * pageSize) < apiArray.length) {
        currPage++;
    }

    console.log("displaying next : ", currPage);

    page_num.innerText = currPage + " / " + final_page;
    displayRows();
}

function displayPrevious() {
    if (currPage > 1) {
        currPage--;
    }

    page_num.innerText = currPage + " / " + final_page;
    displayRows();
}

function displayFirst() {
    currPage = 1;
    page_num.innerText = currPage + " / " + final_page;
    displayRows();
}

function displayLast() {
    currPage = final_page;
    page_num.innerText = currPage + " / " + final_page;
    displayRows();
}

// --------------------------------------------------------------------------------------------------------------
