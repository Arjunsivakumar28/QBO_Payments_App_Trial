console.log("check Invoices works!");

console.log("making an update to invoices");

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

let statusTable;
let dateTable;
let filterTable;

let currPage = 1;
let pageSize = 4;

let final_page = 1;

let page_num = document.getElementById("page-number");

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
if (title == "Admin") {
    document.getElementById("customer-action-col").innerHTML = `
    <div class="d-flex justify-content-center">
        <span class="me-3 px-0 pb-2 pt-1">Customer</span>

        <a
        type="button"
        class="link-body-emphasis d-flex flex-column p-0"
        onclick="tableColSort(this)"
        >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-caret-up-fill"
            viewBox="0 0 16 10"
        >
            <path
            d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
            />
        </svg>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-caret-down-fill"
            viewBox="0 0 16 16"
        >
            <path
            d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
            />
        </svg>
        </a>
    </div>
    `
}

// -----------------------------------------------------------------------------------------------------------------------
// signout
function signOut() {
    accounts.forEach(obj => obj.isActive = false)
    sessionStorage.setItem("accounts", JSON.stringify(accounts));
    window.location.href = "/"
}

// -----------------------------------------------------------------------------------------------------------------------
// Display function
function displayRows() {

    final_page = Math.ceil(apiArray.length / pageSize);

    let Html_rows = "";

    let idx = 0;

    for (idx in apiArray) {

        let start = (currPage - 1) * pageSize;

        let end = currPage * pageSize;

        if (idx >= start && idx < end) {

            let createDateString = dateConvert(new Date(apiArray[idx].metaData.createTime));

            let dueDateString = dateConvert(new Date(apiArray[idx].dueDate));

            let pay_btn;
            let status_sign;
            let cus_or_act;

            if (apiArray[idx].balance == 0) { pay_btn = ""; } else { 
                pay_btn = `<button class="btn btn-outline-success z-2" 
                                id="payDropdown" data-bs-toggle="dropdown" 
                                aria-expanded="true"> Pay </button>
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
                            
                            `; }


            if (checkStatus(apiArray[idx]) == "Paid") {
                status_sign = `
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25"
                viewBox="0 0 30 30" style="fill:#40C057;">
                <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z">
                </path>
            </svg>
            `
            } else if (checkStatus(apiArray[idx]) == "Over Due") {
                status_sign = `
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30"
                viewBox="0 0 48 48">
                <path fill="#f44336"
                    d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z">
                </path>
                <path fill="#fff"
                    d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z">
                </path>
                <path fill="#fff"
                    d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z">
                </path>
            </svg>
            `
            } else if (checkStatus(apiArray[idx]) == "Not Due") {
                status_sign = `
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                class="bi bi-exclamation-circle" viewBox="0 0 16 16">
                <path
                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                    d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
            </svg>
            `
            }

            if (title != "Admin") {
                cus_or_act = `
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
                        `+ pay_btn + `
                    </div>
                </div>
                `
            } else {
                cus_or_act = `
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">`+ apiArray[idx].customerRef.name + `</div>
                </div>
                `
            }

            Html_rows += `
            <div class="invoice-table-row row align-items-center position-relative border-bottom m-0" id="invoice-table-row`+ idx + `">
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2">
                        <input class="form-check-input z-2" type="checkbox" value="" id="row-check`+ idx + `"
                        aria-label="row-check" style="padding: .8rem;" onchange="checkboxAction(this)">
                    </div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">` + createDateString + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">`+ apiArray[idx].id + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">$`+ apiArray[idx].balance + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2 fs-5">`+ dueDateString + `</div>
                </div>
                <div class="col my-2">
                    <div class="d-flex justify-content-center align-items-center my-2">` + status_sign + ` 
                        <span class="ms-2 fs-5"> ` + checkStatus(apiArray[idx]) + ` </span>
                    </div>
                </div>
                `+cus_or_act+`
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

    document.getElementById("invoice-table-body").innerHTML = Html_rows;

    console.log("reached here invocie table body : ", apiArray);

    page_num.innerText = currPage + " / " + final_page;

}

// --------------------------------------------------------------------------------------------------------------

// Creating charge for card token
function chargeProcessCard(idx, ele) {

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
    document.getElementById("invoice-table-body").innerHTML = load_html;

    fetch("/chargeProcess?id=" + apiArray[idx].id + "&amt=" + amount)
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
                document.getElementById("invoice-table-body").innerHTML = `
                <div class="alert alert-success alert-dismissible fade show m-0" role="alert">
                    <div class="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                        </svg>
                        <strong class="me-2">Payment Successful!</strong> Check the invoice and payments history for updates.
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                ` + document.getElementById("invoice-table-body").innerHTML;
            })
        })
        .catch(err => console.log("an error with fetch for creditCardToken : ", err))
}

// --------------------------------------------------------------------------------------------------------------

function collapseInvoiceAction(ele) {

    console.log("ele check : ", ele.parentElement.parentElement.parentElement.nextSibling.nextSibling.children[0].children[1].children[0].children[0]);
    console.log("ele check : ", ele.parentElement.parentElement.previousSibling.previousSibling.children[0].children[1].innerText);

    let status = ele.parentElement.parentElement.previousSibling.previousSibling.children[0].children[1].innerText;
    let collapse_invoice_btn = ele.parentElement.parentElement.parentElement.nextSibling.nextSibling.children[0].children[1].children[0].children[0];

    if (status == "Paid") {
        collapse_invoice_btn.setAttribute("disabled", "");
        collapse_invoice_btn.children[0].innerText = "Paid";
    } else {
        collapse_invoice_btn.removeAttribute("disabled");
        collapse_invoice_btn.children[0].innerText = "Pay Now";
    }

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

function dateConvert(dateObj) {

    let year = dateObj.getFullYear();
    let month = dateObj.getMonth() + 1;
    let day = dateObj.getDate();

    if (day < 10) { day = "0" + day; }
    if (month < 10) { month = "0" + month; }

    return [month, day, year].join('/');
}

// --------------------------------------------------------------------------------------------------------------

function compareArrays(sObj) {
    for (let dObj of dateTable) {
        if (dObj.id == sObj.id) {
            console.log("check obj print : ", dObj);
            console.log("check status obj print : ", sObj);
            return true;
        }
    }
}

// --------------------------------------------------------------------------------------------------------------

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

// Api call querry invoice script
let load_html = `
<div class="w-100 row justify-content-center">
    <div id="spinner" class="spinner-border z-3" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</div>
`
document.getElementById("invoice-table-body").innerHTML = load_html;
function queryInvoices() {
    fetch("/queryInvoices")
    .then(response => response.text())
    .then(text => {

        let data = text.split(" /// ");
        for (let i = 0; i < data.length; i++) {
            data[i] = JSON.parse(data[i]);
        }
        console.log("data from api : ", data);
        apiOrgArray = data;

        // filter the display apiArray
        if (title != "Admin") {
            apiOrgArray = apiOrgArray.filter(obj => obj.customerRef.name == title)
        }

        statusTable = apiOrgArray.filter((obj) => obj.balance != 0 && Date.now() <= obj.dueDate);
        dateTable = JSON.parse(JSON.stringify(apiOrgArray));
        filterTable = JSON.parse(JSON.stringify(statusTable));

        apiArray = JSON.parse(JSON.stringify(filterTable));

        currPage = 1;
        pageSize = 4;

        // Display the default table
        displayRows();

    })
    .catch(err => console.log(err))
}
queryInvoices()


// --------------------------------------------------------------------------------------------------------------

// Api call delete invoice script
function deleteFirstInvoice() {
    let load_html = `
    <div class="w-100 row justify-content-center">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    document.getElementById("invoice-table-body").innerHTML = load_html;
    fetch("/deleteInvoice")
        .then(response => response.text())
        .then(text => {
            let data = text.split(" /// ");
            for (let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
            console.log("data from api : ", data);
            apiOrgArray = data;

            // filter the display apiArray
            if (title != "Admin") {
                apiOrgArray = apiOrgArray.filter(obj => obj.customerRef.name == title)
            }

            apiArray = apiOrgArray;

            currPage = 1;
            pageSize = 4;

            // Display the default table
            displayRows();
            document.getElementById("invoice-table-body").innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle me-2" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    <strong class="me-2">Invoice Deleted!</strong> Invoice has been successfully removed.
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            ` + document.getElementById("invoice-table-body").innerHTML;

        })
        .catch(err => console.log(err))


}

// API call create invoice script
function createInvoice() {
    let load_html = `
    <div class="w-100 row justify-content-center">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    document.getElementById("invoice-table-body").innerHTML = load_html;
    fetch("/createInvoice")
        .then(response => response.text())
        .then(text => {
            let data = text.split(" /// ");
            for (let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
            console.log("data from api : ", data);
            apiOrgArray = data;

            // filter the display apiArray
            if (title != "Admin") {
                apiOrgArray = apiOrgArray.filter(obj => obj.customerRef.name == title)
            }

            currPage = 1;
            pageSize = 4;

            apiArray = apiOrgArray;

            // Display the default table
            displayRows();
            document.getElementById("invoice-table-body").innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle me-2" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    <strong class="me-2">Invoice Created!</strong> Check at the top for the newely created invoice.
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            ` + document.getElementById("invoice-table-body").innerHTML;

        })
        .catch(err => console.log(err))

}

// --------------------------------------------------------------------------------------------------------------

// Pay invoice api functionality
function payInvoice(idx) {
    let load_html = `
    <div class="w-100 row justify-content-center">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `
    document.getElementById("invoice-table-body").innerHTML = load_html;
    console.log(apiArray[idx].docNumber);
    fetch("/payInvoice?id=" + apiArray[idx].id)
        .then(response => response.text())
        .then(text => {

            console.log("the text from api -> ", text);
            let data = text.split(" /// ");
            for (let i = 0; i < data.length; i++) {
                data[i] = JSON.parse(data[i]);
            }
            console.log("data from api : ", data);
            apiArray = data;
            apiOrgArray = data;

            currPage = 1;
            pageSize = 4;

            // filter the display apiArray
            if (title != "Admin") {
                apiArray = apiArray.filter(obj => obj.customerRef.name == title)
            }

            // Display the default table
            displayRows();
            document.getElementById("invoice-table-body").innerHTML = `
            <div class="alert alert-success alert-dismissible fade show m-0" role="alert">
                <div class="d-flex align-items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill me-2" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                    <strong class="me-2">Payment Successful!</strong> Check the invoice and payments history for updates.
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
            ` + document.getElementById("invoice-table-body").innerHTML;

        })
        .catch(err => console.log(err))

}

// --------------------------------------------------------------------------------------------------------------

function statusChange(ele) {
    currPage = 1;
    pageSize = 4;

    let select = document.getElementById("invoice-type-filter");

    if (ele.id == "over-due-bar") {
        select.options.selectedIndex = 1;
    } else if (ele.id == "not-due-bar") {
        select.options.selectedIndex = 0;
    } else if (ele.id == "paid-bar") {
        select.options.selectedIndex = 2;
    }

    switch (select.options.selectedIndex) {

        case 0:

            statusTable = apiOrgArray.filter((obj) => checkStatus(obj) == "Not Due");
            break;

        case 1:

            statusTable = apiOrgArray.filter((obj) => checkStatus(obj) == "Over Due");
            break;

        case 2:

            statusTable = apiOrgArray.filter((obj) => checkStatus(obj) == "Paid");
            break;

        case 3:

            statusTable = JSON.parse(JSON.stringify(apiOrgArray));
            break;

        default:

            console.log("I should not be here");

            break;
    }

    console.log("filter table pre check : ", filterTable);

    filterTable = statusTable.filter(compareArrays);

    console.log("filter table status check : ", filterTable);

    console.log("Status table status check : ", statusTable);

    apiArray = JSON.parse(JSON.stringify(filterTable));

    displayRows();

}

// --------------------------------------------------------------------------------------------------------------

function dateChange() {

    currPage = 1;
    pageSize = 4;

    let dateRange = document.getElementById("invoice-date-filter");

    let today = new Date();

    let date_limit = new Date();

    switch (dateRange.options.selectedIndex) {

        case 0:

            dateTable = JSON.parse(JSON.stringify(apiOrgArray));
            break;

        case 1:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 1);
            dateTable = apiOrgArray.filter((obj) => obj.metaData.createTime >= date_limit.getTime());
            break;

        case 2:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 7);
            dateTable = apiOrgArray.filter((obj) => obj.metaData.createTime >= date_limit.getTime());
            break;

        case 3:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 31);
            dateTable = apiOrgArray.filter((obj) => obj.metaData.createTime >= date_limit.getTime());
            break;

        case 4:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 183);
            dateTable = apiOrgArray.filter((obj) => obj.metaData.createTime >= date_limit.getTime());
            break;

        case 5:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 365);
            dateTable = apiOrgArray.filter((obj) => obj.metaData.createTime >= date_limit.getTime());
            break;

        default:

            console.log("I should not be here!!!");
            break;

    }


    console.log("filter table pre check : ", filterTable);

    filterTable = statusTable.filter(compareArrays);

    console.log("filter table status check : ", filterTable);

    console.log("date table status check : ", dateTable);

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

    let resultTable = searchTableContents.filter(obj => dateConvert(new Date(obj.metaData.createTime)).toLowerCase().includes(searchTerm) ||
        JSON.stringify(obj.id).toLowerCase().includes(searchTerm) || JSON.stringify(obj.balance).toLowerCase().includes(searchTerm) ||
        dateConvert(new Date(obj.dueDate)).toLowerCase().includes(searchTerm) || checkStatus(obj).toLowerCase().includes(searchTerm) || 
        (title == "Admin" && obj.customerRef.name.toLowerCase().includes(searchTerm)));

    console.log("filter table pre check : ", searchTableContents);

    searchTableContents = resultTable.filter((obj) => JSON.stringify(filterTable).includes(JSON.stringify(obj)));

    console.log("filter table status check : ", searchTableContents);

    console.log("result table status check : ", resultTable);

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

    let tableRows = document.getElementById("invoice-table-body").children;

    let boxChecked = true;

    for (let i = 0; i < tableRows.length; i++) {

        if (!tableRows[i].className.includes("invoice-table-row")) { continue; }

        if (!tableRows[i].children[0].children[0].children[0].checked) {
            boxChecked = false;
            tableRows[i].children[0].children[0].children[0].checked = true;
        }
        tableRows[i].setAttribute("style", "--bs-table-bg: #d5d5d5; background-color: #d5d5d5");
    }

    if (boxChecked) {
        for (let i = 0; i < tableRows.length; i++) {

            if (!tableRows[i].className.includes("invoice-table-row")) { continue; }

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
    { name: "date", sort: 0 },
    { name: "id", sort: 0 },
    { name: "balance", sort: 0 },
    { name: "dueDate", sort: 0 },
    { name: "status", sort: 0 },
    { name: "customer", sort: 0}
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

    if (attri == "invoice no.") { 
        attri = "id"; 
    } else if (attri == "due date") { 
        attri = "dueDate";
    }

    console.log("attri:", attri);

    let index = sortWatch.findIndex((obj) => obj.name == attri);

    if (sortWatch[index].sort == 0) {
        if (sortWatch[index].name == "date") {
            apiArray.sort((a, b) => compareFn(b.metaData.createTime, a.metaData.createTime));
        } else if (sortWatch[index].name == "status") {
            apiArray.sort((a, b) => compareFn(checkStatus(b), checkStatus(a)))
        } else if (sortWatch[index].name == "id") {
            apiArray.sort((a, b) => compareFn( parseInt(b[attri]), parseInt(a[attri]) ))
        } else if (sortWatch[index].name == "customer") {
            apiArray.sort((a, b) => compareFn( b.customerRef.name, a.customerRef.name ))
        } else {
            apiArray.sort((a, b) => compareFn(b[attri], a[attri]));
        }

        up_arrow.classList.add("d-none");
        down_arrow.classList.add("mt-2");

        sortWatch[index].sort = 1;
    }
    else if (sortWatch[index].sort == 1) {

        if (sortWatch[index].name == "date") {
            apiArray.sort((a, b) => compareFn(a.metaData.createTime, b.metaData.createTime));
        } else if (sortWatch[index].name == "status") {
            apiArray.sort((a, b) => compareFn(checkStatus(a), checkStatus(b)))
        } else if (sortWatch[index].name == "id") {
            apiArray.sort((a, b) => compareFn( parseInt(a[attri]), parseInt(b[attri]) )) 
        } else if (sortWatch[index].name == "customer") {
            apiArray.sort((a, b) => compareFn( a.customerRef.name, b.customerRef.name ))
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
