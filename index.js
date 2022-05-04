const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const util = require("util");
const { env } = require("process");

// SQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "employee_db",
});

// Allows async SQL queries
db.query = util.promisify(db.query).bind(db);

// Queries for all departments
async function viewAllDepartments() {
  const departmentData = await db.query("SELECT * FROM department");
  console.table(departmentData);
}

// Queries for all roles
async function viewAllRoles() {
  const roleData = await db.query("SELECT * FROM `role`");
  console.table(roleData);
}

// Queries for all Employees
async function viewAllEmployees() {
  const employeeData = await db.query("SELECT * FROM `employee`");
  console.table(employeeData);
}

// Adds a new Department
async function addDepartment() {
  // Inquirer question
  const departmentQuestion = {
    type: "input",
    name: "departmentName",
    message: "What is the name of the new department?",
  };

  const userInput = await inquirer.prompt(departmentQuestion);

  // Takes in inquirer prompt to run insert SQL mutation
  const insertData = await db.query(
    "INSERT INTO `department` (name) VALUES (?)",
    userInput.departmentName
  );
}

// Adds a new role
async function addRole() {
  // Queries all departments and maps it to use name property tag for inquirer
  const departmentData = await db.query("SELECT * FROM department");
  const departmentNames = departmentData.map((x) => x.name);

  // Inquirer question
  const roleQuestions = [
    {
      type: "input",
      name: "roleName",
      message: "What is the name of the new role?",
    },
    {
      type: "input",
      name: "roleSalary",
      message: "What is the salary of the new role?",
    },
    {
      type: "list",
      name: "roleDepartment",
      message: "What is the department of the new role?",
      choices: departmentNames,
    },
  ];

  const answers = await inquirer.prompt(roleQuestions);

  // rematch with original data to find id
  const departmentElement = departmentData.find(
    (element) => element.name === answers.roleDepartment
  );

  // role SQL insert mutation
  const roleInsert = await db.query(
    "INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?)",
    [answers.roleName, answers.roleSalary, departmentElement.id]
  );
}

// Adds a new employee
async function addEmployee() {
  // Queries for data and maps it to use name property tag for inquirer
  const roleList = await db.query("SELECT * FROM `role`");
  const roleNames = roleList.map((element) => {
    return { id: element.id, name: element.title };
  });

  const employeeList = await db.query("SELECT * FROM `employee`");
  const employeeNames = employeeList.map((element) => {
    return {
      id: element.id,
      name: `${element.first_name} ${element.last_name}`,
    };
  });

  // inquirer question
  const employeeQuestions = [
    {
      type: "input",
      name: "employeeFirstName",
      message: "What is the first name of the new employee?",
    },
    {
      type: "input",
      name: "employeeLastName",
      message: "What is the last name of the new employee?",
    },
    {
      type: "list",
      name: "employeeRole",
      message: "What is the role of the new employee?",
      choices: roleNames,
    },
    {
      type: "list",
      name: "employeeManager",
      message: "Who is the manager of the new employee?",
      choices: employeeNames,
    },
  ];

  const employeeAnswers = await inquirer.prompt(employeeQuestions);

  // rematch with original data to find id
  const roleId = roleNames.find(
    (element) => element.name === employeeAnswers.employeeRole
  ).id;
  const managerId = employeeNames.find(
    (element) => element.name === employeeAnswers.employeeManager
  ).id;

  // employee SQL insert mutation
  const employeeInsert = db.query(
    "INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
    [
      employeeAnswers.employeeFirstName,
      employeeAnswers.employeeLastName,
      roleId,
      managerId,
    ]
  );
}

// updates an existing employee with a new role
async function updateEmployeeRole() {
  // queries data for list of employees and roles. maps data to use name property
  const roleList = await db.query("SELECT * FROM `role`");
  const roleNames = roleList.map((element) => {
    return { id: element.id, name: element.title };
  });

  const employeeList = await db.query("SELECT * FROM `employee`");
  const employeeNames = employeeList.map((element) => {
    return {
      id: element.id,
      name: `${element.first_name} ${element.last_name}`,
    };
  });

  // inquirer question
  const employeeQuestions = [
    {
      type: "list",
      name: "employee",
      message: "Which employee do you want to update?",
      choices: employeeNames,
    },
    {
      type: "list",
      name: "newRole",
      message: "What is this employee's new role?",
      choices: roleNames,
    },
  ];

  const userAnswers = await inquirer.prompt(employeeQuestions);

  // finds id of the role and employee selected for SQL update
  const roleId = roleNames.find(
    (element) => element.name === userAnswers.newRole
  ).id;
  const employeeId = employeeNames.find(
    (element) => element.name === userAnswers.employee
  ).id;

  // SQL update mutation
  const employeeUpdate = db.query(
    "UPDATE `employee` SET role_id = ? WHERE id = ?",
    [roleId, employeeId]
  );
}

// start function that asks the user what function to run
async function init() {
  const actionQuestion = {
    type: "list",
    name: "action",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "Add Department",
      "View All Roles",
      "Add Role",
      "View All Employees",
      "Add Employee",
      "Update Employee Role",
      "Quit",
    ],
  };

  let gate = true;
  while (gate) {
    const answer = await inquirer.prompt(actionQuestion);

    switch (answer.action) {
      case "View All Departments":
        await viewAllDepartments();
        break;
      case "Add Department":
        await addDepartment();
        break;
      case "View All Roles":
        await viewAllRoles();
        break;
      case "Add Role":
        await addRole();
        break;
      case "View All Employees":
        await viewAllEmployees();
        break;
      case "Add Employee":
        await addEmployee();
        break;
      case "Update Employee Role":
        await updateEmployeeRole();
        break;
      case "Quit":
        gate = false;
      default:
        db.end();
    }
  }
}

// User launches the program we start with init()
init();
