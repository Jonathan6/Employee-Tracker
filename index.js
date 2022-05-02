const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const util = require('util');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1111',
    database: 'employee_db'
});

db.query = util.promisify(db.query).bind(db);

function viewAllDepartments() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.log(err);
        }
        console.table(results);
    });
};

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
    const departmentQuestion = 
    {
        type: "input",
        name: "departmentName",
        messagae: "What is the name of the new department?",
    }

    inquirer
        .prompt(departmentQuestion)
        .then((answers) => {
            db.query('INSERT INTO `department` (name) VALUES (?)', answers.departmentName, (err, results) => {
                if (err) {
                    console.log(err);
                }
                viewAllDepartments();
            })
    }).catch((err) => {
        console.log(err);
    });
}

function addRole() {
    db.query('SELECT * FROM department', (err, results) => {
        if (err) {
            console.log(err);
        }

        const departmentData = results;
        const departmentNames = departmentData.map(x => x.name);

        const roleQuestions = 
        [
            {
                type: "input",
                name: "roleName",
                messagae: "What is the name of the new role?",
            },
            {
                type: "input",
                name: "roleSalary",
                messagae: "What is the salary of the new role?",
            },
            {
                type: "list",
                name: "roleDepartment",
                messagae: "What is the department of the new role?",
                choices: departmentNames
            },
        ]

        viewAllRoles();
        inquirer
        .prompt(roleQuestions)
        .then((answers) => {
            const departmentElement = departmentData.find(element => element.name === answers.roleDepartment);
            db.query('INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?)', [answers.roleName, answers.roleSalary, departmentElement.id], (err, results) => {
                if (err) {
                    console.log(err);
                }
                viewAllRoles();
            })
        }).catch((err) => {
            console.log(err);
        });
    });
}

async function addEmployee() {
    
    const roleList = await db.query('SELECT * FROM `role`');
    const roleNames = roleList.map((element) => {
        return {id: element.id, name: element.title}}
    );

    const employeeList = await db.query('SELECT * FROM `employee`');
    const employeeNames = employeeList.map((element) => {
        return {id: element.id, name: `${element.first_name} ${element.last_name}`}
    });


    const employeeQuestions =
    [
        {
            type: "input",
            name: "employeeFirstName",
            messagae: "What is the first name of the new employee?",
        },
        {
            type: "input",
            name: "employeeLastName",
            messagae: "What is the last name of the new employee?",
        },
        {
            type: "list",
            name: "employeeRole",
            messagae: "What is the role of the new employee?",
            choices: roleNames,
        },
        {
            type: "list",
            name: "employeeManager",
            messagae: "Who is the manager of the new employee?",
            choices: employeeNames,
        }
    ]

    const employeeAnswers = await inquirer.prompt(employeeQuestions);
            
    const roleId = roleNames.find(element => element.name === employeeAnswers.employeeRole).id;
    const managerId = employeeNames.find(element => element.name === employeeAnswers.employeeManager).id;

    const employeeInsert = db.query('INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
    [employeeAnswers.employeeFirstName, employeeAnswers.employeeLastName, roleId, managerId]);

    viewAllEmployees();
}

async function updateEmployeeRole() {
    const roleList = await db.query('SELECT * FROM `role`');
    const roleNames = roleList.map((element) => {
        return {id: element.id, name: element.title}}
    );

    const employeeList = await db.query('SELECT * FROM `employee`');
    const employeeNames = employeeList.map((element) => {
        return {id: element.id, name: `${element.first_name} ${element.last_name}`}
    });

    const employeeQuestions =
    [
        {
            type: "list",
            name: "employee",
            messagae: "Which employee do you want to update?",
            choices: employeeNames,
        },
        {
            type: "list",
            name: "newRole",
            messagae: "What is this employee's new role?",
            choices: roleNames,
        },
    ]

    const userAnswers = await inquirer.prompt(employeeQuestions);

             
    const roleId = roleNames.find(element => element.name === userAnswers.newRole).id;
    const employeeId = employeeNames.find(element => element.name === userAnswers.employee).id;

    const employeeUpdate = db.query('UPDATE `employee` SET role_id = ? WHERE id = ?', 
    [ roleId, employeeId]);
    
    viewAllEmployees();
}

function quit() {
    // Are you sure prompt
    // Return opposite of their answer
}

 function init() {
    // Run cool into logo page print 
    const actionQuestion = 
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Departments", "Add Department", "View All Roles", "Add Role", "View All Employees", "Add Employee", "Update Employee Role", "Quit"],
        }

    let gate = true;
    while (gate) {
        let answer = inquirer
        .prompt(actionQuestion)
        .then((answers) => {
            switch (answers.action) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "View All Roles":
                    viewAllRoles();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Quit":
                    break;
                default:
                    console.log('Something went wrong. Please try again');
            }
        })
        .catch((error) => {
            console.log(error);
        });
        // gate = answer.action !== "Quit";
        // Display them the different options
        // Get response back
        // Run a function depending on their answer
    }
    // See you next time :) screen
}

// User launches the program we start with init()
init();