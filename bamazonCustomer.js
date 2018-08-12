var mysql = require("mysql");
var inquirer = require("inquirer");




var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    readProducts();
    var inventory = "";
    var quantity = "";
    var prod;
});

function readProducts() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        console.log("Selecting all products...\n");
        if (err) throw err;
        // Log all results of the SELECT statement
        for (var i = 0; i < res.length; i++) {
            console.log("Product id: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
        }
        inventory = res;
        selectProducts();
    });
}

function selectProducts() {
    inquirer
        .prompt(
            {
                name: "product",
                type: "input",
                message: "Enter the Product id you want to buy?",
            },
        )
        .then(function (answer) {
            var productId = parseInt(answer.product);
            //console.log(answer.product + typeof(answer.product));
            if (productId > 0 && productId <= 10) {
                productSelection = productId;
                askQuantity(productSelection);
            }
            else {
                console.log("Select a valid product id");
                selectProducts();
            }
        });
};

function askQuantity(productSelection){
    inquirer
        .prompt(
            {
                name: "quantity",
                type: "input",
                message: "How much quantiy you want to buy for product id " + productSelection + "?",
            },
        )
        .then(function (answer) {
            prod = productSelection-1;
            quantity = parseInt(answer.quantity);
            //console.log("---------------------"+ inventory[prod].item_id);
            //console.log("---------------------"+inventory[prod].stock_quantity);
            if(quantity <= inventory[prod].stock_quantity && quantity > 0){
                console.log("Congrats, your order has been placed");
                
                console.log(quantity + typeof(quantity));
                updateRemainingStock();
            }else{
                console.log("Available quantity is " + inventory[prod].stock_quantity);
                askQuantity(productSelection);
            }  
        });
}

function updateRemainingStock(){
    var newQuantiy = inventory[prod].stock_quantity - quantity;
    // console.log("Updating all quantities...\n");
    // console.log("inventory[prod].stock_quantity" + inventory[prod].stock_quantity);
    // console.log("quantity" + quantity);
    // console.log("new " + newQuantiy + typeof(newQuantiy));
    // console.log("prod" + prod + typeof(prod));
   prod = prod+1
    connection.query("UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newQuantiy
            },
            {
                item_id: prod
            }
        ],                                            
        function(err, res) 
        {
            console.log(" products updated!\n"); 
            readUpdatedProducts();
            
        });
        
};

function readUpdatedProducts() {
    console.log("Selecting updated products...\n");
    connection.query("SELECT * FROM products where ?", 
        {
            item_id: prod
        },
        function(err, res) {
            if (err) throw err;
            console.log(res);
            connection.end();
    })
}
  

  

