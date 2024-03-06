console.log("Check Payments works!");

let table_contents = [];

let row = new Object();

row = {
    balance: 0,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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
    balance: 20,
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

let payment_table = [];

let payment_obj = new Object();

payment_obj = {
    recurring: true,
    amount: 100,
    transactionDate: "10/23/2023",
    type: "",
    invoiceNo: [10000],
    transactionId: "70000ABC"
}

console.log("some check : ", payment_obj.invoiceNo.includes(10000))

if (payment_obj.invoiceNo.length != 0) {

    let idx = table_contents.findIndex((inv) => payment_obj.invoiceNo.includes(inv.invoiceNo) );

    if (idx != -1) {

        if (table_contents[idx].status == "paid") {
            if (payment_obj.amount == table_contents[idx].amount) {
                payment_obj.type = "applied fully-closed"
            } else if (payment_obj.amount > table_contents[idx].amount)
            payment_obj.type = "applied over-closed";
        } else {
            if (table_contents[idx].balance < table_contents[idx].amount) {
                payment_obj.type = "applied partially-open";
            }
            
        }
    } else {
        
        payment_obj.type = "unapplied";
    }

}

payment_table.push(payment_obj);

payment_obj = new Object();

payment_obj = {
    recurring: false,
    amount: 3250,
    transactionDate: "10/23/2023",
    type: "applied over-closed",
    invoiceNo: [9993, 9997],
    transactionId: "70001ABC"
}

payment_table.push(payment_obj);

payment_obj = new Object();

payment_obj = {
    recurring: true,
    amount: 1999,
    transactionDate: "07/23/2023",
    type: "applied open",
    invoiceNo: [9994],
    transactionId: "70002ABC"
}

payment_table.push(payment_obj);

payment_obj = new Object();

payment_obj = {
    recurring: false,
    amount: 100,
    transactionDate: "09/13/2023",
    type: "applied",
    invoiceNo: [10001],
    transactionId: "70003ABC"
}

payment_table.push(payment_obj);

payment_obj = new Object();

payment_obj = {
    recurring: true,
    amount: 100,
    transactionDate: "09/15/2023",
    type: "credit memo",
    invoiceNo: [10002],
    transactionId: "40000ABC"
}

payment_table.push(payment_obj);

payment_obj = new Object();

payment_obj = {
    recurring: false,
    amount: 30,
    transactionDate: "09/15/2023",
    type: "applied",
    invoiceNo: [9999],
    transactionId: "70004ABC"
}

payment_table.push(payment_obj);

payment_obj = new Object();

payment_obj = {
    recurring: false,
    amount: 2000,
    transactionDate: "05/30/2022",
    type: "unapplied",
    invoiceNo: [],
    transactionId: "70004ABC"
}

payment_table.push(payment_obj);

console.log("payments table array : ", payment_table);

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

function detailForm() {
    console.log("detailForm function works!");
    let main_body = document.getElementById("main_bar");
    console.log("main_body : ", main_body);

    let side_body = document.getElementById("side_body");
    console.log("side_body : ", side_body);

    side_body.classList.remove("d-none");

    if (side_body.style.display === "none") {
        side_body.style.display = "flex";
        main_body.style.width = "50%";
    } else {
        side_body.style.display = "none";
        main_body.style.width = "100%";
    }
}