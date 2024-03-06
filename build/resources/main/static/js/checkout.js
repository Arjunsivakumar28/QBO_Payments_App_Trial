console.log("check works!");

console.log("making sure checkout works");

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

// -----------------------------------------------------------------------------------------------------------------------

// querry the checkout form
function checkoutForm() {

    let url = window.location.href

    let start_idx = url.indexOf("?id=") + 4

    let id = url.slice(start_idx)

    let data;

    let html_body = `
    <div class="w-100 row justify-content-center my-2">
        <div id="spinner" class="spinner-border z-3" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
    `  
    document.getElementById("checkout-form").innerHTML = html_body;

    fetch("/querySingleInvoice?id=" + id)
        .then(response => {
            console.log("the response object : ", response);
            console.log("the type of response object : ", typeof response);
            response.text()
            .then(text => {
                console.log("the text object : ", text);
                console.log("the type of text object : ", typeof text);
                console.log("first character : ", text[0]);
                data = JSON.parse(text)
                console.log(data)
                html_body = `
                <form class="needs-validation" novalidate="">
                    <div class="d-flex flex-row py-2 justify-content-center">
                        <div class="w-50">
                            <h3>Checkout Invoice: </h3>
                            <div class="row rounded border bg-light shadow-sm mb-3 mx-2 p-2 align-items-center justify-content-center">
                                <div class="warning-invoices col d-flex justify-content-center border-end">Inv Number</div>
                                <div class="warning-invoices col d-flex justify-content-center border-end">Inv ID</div>
                                <div class="warning-invoices col d-flex justify-content-center ">Inv Balance</div>
                            </div>
                            <div class="row rounded border bg-light shadow-sm mb-3 mx-2 p-2 align-items-center justify-content-center">
                                <div class="warning-invoices col d-flex justify-content-center border-end">`+ data.docNumber +`</div>
                                <div class="warning-invoices col d-flex justify-content-center border-end">`+ data.id +`</div>
                                <div class="warning-invoices col d-flex justify-content-center ">$`+ data.balance +`</div>
                            </div>
                        </div>
                        <div class="w-50" id="enter-amt">
                            <h3>Enter Amount: </h3>
                            <input type="text" class="form-control" id="pay-amt" placeholder="enter amount" required="">
                        </div>
                    </div>
                    <div class="row gy-3">
                        <div class="col-md-6">
                            <label for="cc-name" class="form-label">Name on card</label>
                            <input type="text" class="form-control" id="cc-name" placeholder="" required="">
                            <small class="text-muted">Full name as displayed on card</small>
                            <div class="invalid-feedback">
                            Name on card is required
                            </div>
                        </div>

                        <div class="col-md-6">
                            <label for="cc-number" class="form-label">Credit card number</label>
                            <input type="text" class="form-control" id="cc-number" placeholder="" required="">
                            <div class="invalid-feedback">
                            Credit card number is required
                            </div>
                        </div>

                        <div class="col-md-3">
                            <label for="cc-expiration" class="form-label">Expiration</label>
                            <input type="text" class="form-control" id="cc-expiration" placeholder="" required="">
                            <div class="invalid-feedback">
                            Expiration date required
                            </div>
                        </div>

                        <div class="col-md-3">
                            <label for="cc-cvv" class="form-label">CVV</label>
                            <div class="d-flex">
                                <input type="text" class="form-control" id="cc-cvv" placeholder="" required="">
                                <a role="button" class="input-group-text" onclick="password_show_hide(this);">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-eye-fill" viewBox="0 0 16 16" id="show_eye">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                    <path
                                        d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                    </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-eye-slash-fill d-none" viewBox="0 0 16 16" id="hide_eye">
                                    <path
                                        d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                    <path
                                        d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                    </svg>
                                </a>
                            </div>
                            <div class="invalid-feedback">
                                Security code required
                            </div>
                        </div>
                    </div>

                    <hr class="my-4">

                    <button class="w-100 btn btn-primary btn-lg" type="button" onclick="chargeCard(this)">Continue to checkout</button>
                </form>
                `
                
                document.getElementById("checkout-form").innerHTML = html_body;
            })
        })
        .catch(err => console.log("the error : ", err))
}
checkoutForm()

// -----------------------------------------------------------------------------------------------------------------------

// charge card
function chargeCard(ele) {

    let url = window.location.href

    let start_idx = url.indexOf("?id=") + 4

    let id = url.slice(start_idx)

    console.log("chec charge card works")

    let exp_month = ele.parentElement.children[1].children[2].children[1].value.slice(0, 2)
    let exp_year = ele.parentElement.children[1].children[2].children[1].value.slice(3)

    let amt = ele.parentElement.children[0].children[1].children[1].value

    let card_json_string = `{"name":"`+ele.parentElement.children[1].children[0].children[1].value+`","number":"`+ele.parentElement.children[1].children[1].children[1].value+`","exp_month":"`+exp_month+`","exp_year":"`+exp_year+`","cvv":"`+String(ele.parentElement.children[1].children[3].children[1].children[0].value)+`"}`

    console.log("amt: ", amt)
    console.log("test: ", ele.parentElement.children[1].children[3].children[1].children[0].value)
    console.log("card: ", card_json_string)

    fetch("/chargeProcess?id=" + id + "&amt=" + amt, {
        method: 'POST',
        body: card_json_string
    })
        .then(response => {
            console.log("the response object : ", response);
            console.log("the type of response object : ", typeof response);
            response.text()
            .then(text => {
                console.log("the text object : ", text);
                console.log("the type of text object : ", typeof text);
                console.log("first character : ", text[0]);
                checkoutForm()
            })
        })
        .catch(err => console.log("an error with fetch for creditCardToken : ", err))
};