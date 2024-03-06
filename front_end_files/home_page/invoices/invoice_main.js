console.log("check Invoices works!");  

let table_contents = [];

let row = new Object();

row = {
    recurring: true,
    date: "09/10/2023",
    invoiceNo: 10000,
    amount: 100,
    dueDate: "10/23/2023",
    status: "Paid",
};

table_contents.push(row);

row = new Object();

row = {
    recurring: false,
    date: "09/11/2023",
    invoiceNo: 10001,
    amount: 200,
    dueDate: "09/24/2023",
    status: "Not Due",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: true,
    date: "09/12/2023",
    invoiceNo: 10002,
    amount: 300,
    dueDate: "09/25/2023",
    status: "Not Due",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: false,
    date: "09/08/2023",
    invoiceNo: 9999,
    amount: 50,
    dueDate: "09/10/2023",
    status: "Over Due",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: true,
    date: "09/01/2023",
    invoiceNo: 9998,
    amount: 150,
    dueDate: "09/11/2023",
    status: "Over Due",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: false,
    date: "08/25/2023",
    invoiceNo: 9997,
    amount: 250,
    dueDate: "09/11/2023",
    status: "Paid",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: true,
    date: "08/11/2023",
    invoiceNo: 9996,
    amount: 1250,
    dueDate: "11/11/2023",
    status: "Not Due",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: false,
    date: "07/28/2023",
    invoiceNo: 9995,
    amount: 1350,
    dueDate: "08/11/2023",
    status: "Over Due",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: true,
    date: "06/28/2023",
    invoiceNo: 9994,
    amount: 1999,
    dueDate: "08/21/2023",
    status: "Paid",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: false,
    date: "01/28/2023",
    invoiceNo: 9993,
    amount: 2999,
    dueDate: "09/21/2023",
    status: "Paid",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: false,
    date: "09/28/2022",
    invoiceNo: 9992,
    amount: 2250,
    dueDate: "11/21/2022",
    status: "Over Due",
}

table_contents.push(row);

row = new Object();

row = {
    recurring: true,
    date: "09/10/2022",
    invoiceNo: 9991,
    amount: 2350,
    dueDate: "12/21/2022",
    status: "Over Due",
}

table_contents.push(row);

console.log("table arr : ", table_contents);

// --------------------------------------------------------------------------------------------------------------


let statusTable = table_contents.filter((obj) => obj.status == "Not Due");
let dateTable = JSON.parse(JSON.stringify(table_contents));
let filterTable = JSON.parse(JSON.stringify(statusTable));

let displayArray = JSON.parse(JSON.stringify(filterTable));

let currPage = 1;
let pageSize = 4;

let page_num = document.getElementById("page-number");
let final_page = Math.ceil(displayArray.length / pageSize);

function displayRows() {

    final_page = Math.ceil(displayArray.length / pageSize);

    let Html_rows = "";

    let idx = 0;

    let sum_val = document.getElementById("amount-sum");

    sum_val.innerText = displayArray.reduce((accum, currVal) => accum + currVal.amount, 0);

    for (idx in displayArray) {

        let start = (currPage - 1) * pageSize;

        let end = currPage * pageSize;

        console.log("start : ", start, "\n end : ", end, "\n currrent page: ", currPage, "\n page size : ", pageSize);

        if (idx >= start && idx < end) {

            let recur_sign = "";

            let status_sign = "";

            let pay_btn;

            if (displayArray[idx].recurring) {
                recur_sign = `
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25"
            viewBox="0 0 30 30" id="recur-sign">
            <path
                d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z">
            </path>
        </svg>
        `
            } else {
                recur_sign = `
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
            class="bi bi-slash-circle-fill" viewBox="0 0 16 16" id="no-recur-sign">
            <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.646-2.646a.5.5 0 0 0-.708-.708l-6 6a.5.5 0 0 0 .708.708l6-6z" />
        </svg>
        `
            }

            if (displayArray[idx].status == "Paid") {
                status_sign = `
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25"
                viewBox="0 0 30 30" style="fill:#40C057;">
                <path
                    d="M 15 3 C 8.373 3 3 8.373 3 15 C 3 21.627 8.373 27 15 27 C 21.627 27 27 21.627 27 15 C 27 12.820623 26.409997 10.783138 25.394531 9.0214844 L 14.146484 20.267578 C 13.959484 20.454578 13.705453 20.560547 13.439453 20.560547 C 13.174453 20.560547 12.919422 20.455578 12.732422 20.267578 L 8.2792969 15.814453 C 7.8882969 15.423453 7.8882969 14.791391 8.2792969 14.400391 C 8.6702969 14.009391 9.3023594 14.009391 9.6933594 14.400391 L 13.439453 18.146484 L 24.240234 7.3457031 C 22.039234 4.6907031 18.718 3 15 3 z M 24.240234 7.3457031 C 24.671884 7.8662808 25.053743 8.4300516 25.394531 9.0195312 L 27.707031 6.7070312 C 28.098031 6.3150312 28.098031 5.6839688 27.707031 5.2929688 C 27.316031 4.9019687 26.683969 4.9019688 26.292969 5.2929688 L 24.240234 7.3457031 z">
                </path>
            </svg>
            `
            } else if (displayArray[idx].status == "Over Due") {
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
            } else if (displayArray[idx].status == "Not Due") {
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

            if (displayArray[idx].status == "Paid") {
                pay_btn = "";
            } else {
                pay_btn = `
            <button class="btn btn-outline-success z-2">Pay</button>
            `;
            }

            Html_rows += `
        <div class="invoice-table-row row align-items-center position-relative border-bottom m-0" id="invoice-table-row`+ idx + `">
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">
                    <input class="form-check-input z-2" type="checkbox" value="" id="row-check"
                    aria-label="row-check" style="padding: .8rem;" onchange="checkboxAction(this)">
                </div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">` + recur_sign + `</div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">` + displayArray[idx].date + `</div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2"> INV`+ displayArray[idx].invoiceNo + `</div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">$`+ displayArray[idx].amount + `</div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">`+ displayArray[idx].dueDate + `</div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">
                    `+ status_sign + `
                    <span class="ms-2">`+ displayArray[idx].status + `</span>
                </div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">
                    <a id="collapse-row`+ idx + `" class="stretched-link z-1" role="button" data-bs-toggle="collapse" 
                    href="#more-details-collapse`+ idx + `" aria-expanded="false" aria-controls="more-details-collapse` + idx + `"
                    onclick="collapseInvoiceAction(this)"></a>
                    <a class="me-2 z-2" href="../../docs/Miner_Body Rituals Among the Nacirema.pdf">
                        pdf
                    </a>
                    <a class="me-2 z-2" href="#">
                        view
                    </a>
                    `+ pay_btn + `
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

        document.getElementById("invoice-table-body").innerHTML = Html_rows;

    }

    if (displayArray.length == 0) {
        console.log("0 idx>>>>>")
        let Html_rows = `
        <div class="row align-items-center">
            <div class="col">
                
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">
                </div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2"></div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2"></div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2"></div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2"></div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">
                    
                    <span class="ms-2"></span>
                </div>
            </div>
            <div class="col">
                <div class="d-flex justify-content-center align-items-center my-2">
                    
                </div>
            </div>
        </div>
        `
        document.getElementById("invoice-table-body").innerHTML = Html_rows;
    }

    page_num.innerText = currPage + " / " + final_page;

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

function compareArrays(sObj) {
    for (let dObj of dateTable) {
        if (dObj.invoiceNo == sObj.invoiceNo) {
            console.log("check obj print : ", dObj);
            console.log("check status obj print : ", sObj);
            return true;
        }
    }
}

// Display the default table
displayRows();

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

            statusTable = table_contents.filter((obj) => obj.status == "Not Due");
            break;

        case 1:

            statusTable = table_contents.filter((obj) => obj.status == "Over Due");
            break;

        case 2:

            statusTable = table_contents.filter((obj) => obj.status == "Paid");
            break;

        case 3:

            statusTable = JSON.parse(JSON.stringify(table_contents));
            displayArray = table_contents
            displayRows();
            break;

        default:

            console.log("I should not be here");

            break;
    }

    console.log("filter table pre check : ", filterTable);

    filterTable = statusTable.filter(compareArrays);

    console.log("filter table status check : ", filterTable);

    console.log("Status table status check : ", statusTable);

    displayArray = JSON.parse(JSON.stringify(filterTable));

    displayRows();

}

// --------------------------------------------------------------------------------------------------------------

function dateConvert(dateString) {

    let month_index = dateString.slice(0, 2) - 1;
    let day = dateString.slice(3, 5);
    let year = dateString.slice(6);

    let date_obj = new Date(year, month_index, day);

    return date_obj;
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

            dateTable = JSON.parse(JSON.stringify(table_contents));
            displayArray = table_contents
            displayRows();
            break;

        case 1:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 1);
            dateTable = table_contents.filter((obj) => dateConvert(obj.date) >= date_limit);
            break;

        case 2:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 7);
            dateTable = table_contents.filter((obj) => dateConvert(obj.date) >= date_limit);
            break;

        case 3:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 31);
            dateTable = table_contents.filter((obj) => dateConvert(obj.date) >= date_limit);
            break;

        case 4:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 183);
            dateTable = table_contents.filter((obj) => dateConvert(obj.date) >= date_limit);
            break;

        case 5:

            date_limit = new Date();
            date_limit.setDate(today.getDate() - 365);
            dateTable = table_contents.filter((obj) => dateConvert(obj.date) >= date_limit);
            break;

        default:

            console.log("I should not be here!!!");
            break;

    }


    console.log("filter table pre check : ", filterTable);

    filterTable = statusTable.filter(compareArrays);

    console.log("filter table status check : ", filterTable);

    console.log("date table status check : ", dateTable);

    displayArray = JSON.parse(JSON.stringify(filterTable));

    displayRows();

}

// --------------------------------------------------------------------------------------------------------------

let checkSearch = document.getElementById("table-search");

checkSearch.addEventListener("keyup", function () {

    currPage = 1;
    pageSize = 4;

    let searchTerm = checkSearch.value.toLowerCase();

    let searchTableContents = JSON.parse(JSON.stringify(table_contents));

    let resultTable = searchTableContents.filter((obj) => ((JSON.stringify(obj.date).toLowerCase().includes(searchTerm)) ||
        (JSON.stringify(obj.invoiceNo).toLowerCase().includes(searchTerm)) || (JSON.stringify(obj.amount).toLowerCase().includes(searchTerm)) ||
        (JSON.stringify(obj.dueDate).toLowerCase().includes(searchTerm)) || (JSON.stringify(obj.status).toLowerCase().includes(searchTerm))));

    console.log("filter table pre check : ", searchTableContents);

    searchTableContents = resultTable.filter((obj) => JSON.stringify(filterTable).includes(JSON.stringify(obj)));

    console.log("filter table status check : ", searchTableContents);

    console.log("result table status check : ", resultTable);

    displayArray = searchTableContents;

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

    for (let i = 0; i < tableRows.length; i += 2) {

        if (!tableRows[i].children[0].children[0].children[0].checked) {
            boxChecked = false;
            tableRows[i].children[0].children[0].children[0].checked = true;
        }
        tableRows[i].setAttribute("style", "--bs-table-bg: #d5d5d5; background-color: #d5d5d5");
    }

    if (boxChecked) {
        for (let i = 0; i < tableRows.length; i += 2) {
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
    { name: "recurring", sort: 0 },
    { name: "date", sort: 0 },
    { name: "invoiceNo", sort: 0 },
    { name: "amount", sort: 0 },
    { name: "dueDate", sort: 0 },
    { name: "status", sort: 0 },
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

    if (attri == "invoice no.") { attri = "invoiceNo"; } else if (attri == "due date") { attri = "dueDate"; }

    console.log("attri:", attri);

    console.log("attri prop check : ", row[attri]);

    let index = sortWatch.findIndex((obj) => obj.name == attri);

    if (sortWatch[index].sort == 0) {
        if (sortWatch[index].name == "date" || sortWatch[index].name == "dueDate") {
            displayArray.sort((a, b) => compareFn(dateConvert(b[attri]).getTime(), dateConvert(a[attri]).getTime()));
        } else {
            displayArray.sort((a, b) => compareFn(b[attri], a[attri]));
        }

        up_arrow.classList.add("d-none");
        down_arrow.classList.add("mt-2");

        sortWatch[index].sort = 1;
    }
    else if (sortWatch[index].sort == 1) {
        if (sortWatch[index].name == "date" || sortWatch[index].name == "dueDate") {
            displayArray.sort((a, b) => compareFn(dateConvert(a[attri]).getTime(), dateConvert(b[attri]).getTime()));
        } else {
            displayArray.sort((a, b) => compareFn(a[attri], b[attri]));
        }

        up_arrow.classList.remove("d-none");
        down_arrow.classList.remove("mt-2");

        up_arrow.classList.add("mt-1");
        down_arrow.classList.add("d-none");

        sortWatch[index].sort = 2;
    } else {

        displayArray = JSON.parse(JSON.stringify(filterTable));

        up_arrow.classList.remove("mt-1");
        down_arrow.classList.remove("d-none");

        sortWatch[index].sort = 0;
    }

    console.log("displayArray check : ", displayArray);

    displayRows();



}

// --------------------------------------------------------------------------------------------------------------

function displayNext() {

    if ((currPage * pageSize) < displayArray.length) {
        currPage++;
    }

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
