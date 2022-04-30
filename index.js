const mysql = require('mysql2');
const cTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'employee_db'
});

// For example they chooose view all departments
function viewAllDepartments() {
    db.query(
        'SELECT * FROM `department`', (err, results) => {
            if (err) {
                console.log(err);
            }
            console.table(results);
        }
    );
    // we run a sql query to get all the departments info
    // this involves calling the right express route through JS
    // express route fills out a proper query and makes the call to SQL
    // gets the information then returns it back to here
    // we then display the info using the table package
}

function viewAllRoles() {
    db.query('SELECT * FROM `role`', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
    // Make express call for all the roles
    // express handles the rest
    // we run a sql query to get all the available roles
    // send the information back to JS
    // we then display the info using the table package
}

function viewAllEmployees() {
    db.query('SELECT * FROM `employee`', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
    // Make express call for all the current employees
    // express handles the rest
    // we run a sql query to get all the current employees
    // send the information back to JS
    // we then display the info using the table package
}

function addDepartment() {
    db.query('SELECT * FROM `employee`', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
    // Make express call to add a department
    // express handles the rest
    // we run a sql mutation to add a department to the list
    // send the information back to JS
    // we confirm or deny the request

}

function addRole() {
    db.query('INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?)', 
    ["pos4", 66.00, 2], (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
    // Make express call to add a role
    // express handles the rest
    // we run a sql mutation to add a role to the list
    // send the information back to JS
    // we confirm or deny the request

    // example pseudo
    // SELECT the existing roles out for the 'roles' table
    // .map() the results from 'roles' to question data for inquirer
    // THEN prompe the user for role information (inquirer)
        // Take the user's answers and go INSERT then into the 'role' table
    

}

function addEmployee() {
    db.query('INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
    ["joe", "mama", 1, 5], (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
    // Make express call to add a employee
    // express handles the rest
    // we run a sql mutation to add a employee to the list
    // send the information back to JS
    // we confirm or deny the request

}

function updateEmployeeRole() {
    db.query('UPDATE `employee` SET role_id = ? WHERE id = ?', 
    [ 2, 1], (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
    // Make express call to update an employee
    // express handles the rest
    // we run a sql mutation to update an employee based on id
    // send the information back to JS
    // we confirm or deny the request

}

function quit() {
    // Are you sure prompt
    // Return opposite of their answer
}

function init() {
    // Run cool into logo page print 
    let gate = true;
    // while (gate) {
        // Display them the different options
        // Get response back
        // Run a function depending on their answer
    // }
    // See you next time :) screen
    viewAllDepartments();
    viewAllRoles();
    viewAllEmployees();
    // addRole();
    // addEmployee();
    updateEmployeeRole();
    viewAllEmployees();
}


// User launches the program we start with init()
init();