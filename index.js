const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");
const util = require("util");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1111",
  database: "employee_db",
});

db.query = util.promisify(db.query).bind(db);

async function viewAllDepartments() {
  const departmentData = await db.query("SELECT * FROM department");
  console.table(departmentData);
}

async function viewAllRoles() {
  const roleData = await db.query("SELECT * FROM `role`");
  console.table(roleData);
}

async function viewAllEmployees() {
  const employeeData = await db.query("SELECT * FROM `employee`");
  console.table(employeeData);
}

async function addDepartment() {
  const departmentQuestion = {
    type: "input",
    name: "departmentName",
    message: "What is the name of the new department?",
  };

  const userInput = await inquirer.prompt(departmentQuestion);

  const insertData = await db.query(
    "INSERT INTO `department` (name) VALUES (?)",
    userInput.departmentName
  );
}

async function addRole() {
  const departmentData = await db.query("SELECT * FROM department");
  const departmentNames = departmentData.map((x) => x.name);

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

  const departmentElement = departmentData.find(
    (element) => element.name === answers.roleDepartment
  );
  const roleInsert = await db.query(
    "INSERT INTO `role` (title, salary, department_id) VALUES (?, ?, ?)",
    [answers.roleName, answers.roleSalary, departmentElement.id]
  );
}

async function addEmployee() {
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

  const roleId = roleNames.find(
    (element) => element.name === employeeAnswers.employeeRole
  ).id;
  const managerId = employeeNames.find(
    (element) => element.name === employeeAnswers.employeeManager
  ).id;

  const employeeInsert = db.query(
    "INSERT INTO `employee` (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
    [
      employeeAnswers.employeeFirstName,
      employeeAnswers.employeeLastName,
      roleId,
      managerId,
    ]
  );

  viewAllEmployees();
}

async function updateEmployeeRole() {
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

  const roleId = roleNames.find(
    (element) => element.name === userAnswers.newRole
  ).id;
  const employeeId = employeeNames.find(
    (element) => element.name === userAnswers.employee
  ).id;

  const employeeUpdate = db.query(
    "UPDATE `employee` SET role_id = ? WHERE id = ?",
    [roleId, employeeId]
  );

}

async function init() {
  // Run cool into logo page print
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
  // See you next time :) screen
}

// User launches the program we start with init()
init();
