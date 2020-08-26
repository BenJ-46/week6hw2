const {prompt} = require('inquirer');
const db = require('./db');
require('console.table')

const mainMenu = () => {
    prompt ([
        {
            type: 'list',
            name: 'choice',
            message: 'Choose an option',
            choices: [
                {
                    name: 'view employee',
                    value: 'viewEmployee'
                },
                {
                    name: 'add an Employee',
                    value: 'addEmployee',
                },
                {
                    name: `Update an Employee Role`,
                    value: 'updateEmployeeRole'
                },
                {
                    name: 'view departments',
                    value: 'viewDepartments'
                },
                {
                    name: 'add a department',
                    value: 'addDepartment'
                },
                {
                    name: 'View Roles',
                    value:'viewRoles'
                },
                {
                    name: 'Add a Role',
                    value: 'addRole'
                }
            ]
        }
    ])
    .then(({ choice }) => {
        switch (choice) {
          case 'viewEmployees':
            viewEmployees()
            break
          case 'addEmployee':
            addEmployee()
            break
          case 'updateEmployeeRole':
            updateEmployeeRole()
            break
          case 'viewDepartments':
            viewDepartments()
            break
          case 'addDepartment':
            addDepartment()
            break
          case 'viewRoles':
            viewRoles()
            break
          case 'addRole':
            addRole()
            break
        }
      })
      .catch(err => console.log(err))
  }
  
  const viewEmployees = () => {
    db.query(`
        SELECT employee.id, employee.first_name, employee.last_name,
        role.title, role.salary, department.name AS department,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee
        LEFT JOIN role
        ON employee.role_id = role.id
        LEFT JOIN department 
        ON role.department_id = department.id
        LEFT JOIN employee manager
        ON manager.id = employee.manager_id
    `, (err,data) => {
        if (err) {console.log(err)}
        console.table(data)
        mainMenu()
    })
  }
  
  const addEmployee = () => {
    db.query('SELECT * FROM role', (err, roles) => {
        if (err) { console.log(err) }
    
        roles = roles.map(role => ({
          name: role.title,
          value: role.id
        }))
    
        db.query('SELECT * FROM employee', (err, employees) => {
    
          employees = employees.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          }))
          
          employees.unshift({ name: 'None', value: null })
    
          prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'What is the employee first name?'
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'What is the employee last name?'
            },
            {
              type: 'list',
              name: 'role_id',
              message: 'Choose a role for the employee:',
              choices: roles
            },
            {
              type: 'list',
              name: 'manager_id',
              message: 'Choose a manager for the employee:',
              choices: employees
            }
          ])
            .then(employee => {
              db.query('INSERT INTO employee SET ?', employee, (err) => {
                if (err) { console.log(err) }
                console.log('Employee Created!')
                mainMenu()
              })
            })
            .catch(err => console.log(err))
        })
      })
    }
  
  const updateEmployeeRole = () => {
    db.query('SELECT * FROM role', (err, roles) => {
      if (err) { console.log(err) }
  
      roles = roles.map(role => ({
        name: role.title,
        value: role.id
      }))
  
      db.query('SELECT * FROM employee', (err, employees) => {
  
        employees = employees.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }))
        
        employees.unshift({ name: 'None', value: null })
  
        prompt([
          {
            type: 'list',
            name: 'Employee',
            message: 'Select an employee:',
            choices: employees
          },
          {
            type: 'list',
            name: 'EmployeeRole',
            message: 'Select a new role for the employee: ',
            choices: roles
          }
        ])
          .then(answers => {
            db.query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.EmployeeRole, answers.Employee], (err) => {
              if (err) { console.log(err) }

              console.log('Employee Role Updated!')
              mainMenu()
            })
          })
          .catch(err => console.log(err))
      })
    })
  }
  
  const viewDepartments = () => {
    db.query('SELECT * FROM department', function(err, data) {
      if (err) {console.log(err)}
      console.table(data)
      mainMenu()
    }
    )
  }
  
  const addDepartment = () => {
    prompt ([
      {
        type: 'input',
        name: 'name',
        message: 'What Department would you like to add?'
      }
    ])
      .then (answer => {
        db.query('INSERT INTO department SET ?', answer, err =>{
          if(err) {console.log(err)}
          console.log('Department has been added!')
          mainMenu()
        })
      })
      .catch(err => console.log(err))
    }
  
  
  
  const viewRoles = () => {
    db.query('SELECT id, title, salary FROM role', function(err, data) {
      if (err) {console.log(err)}
      console.table(data)
      mainMenu()
    }
    )
  }
  
  const addRole = () => {
    db.query('SELECT * FROM department', (err, department) => {
      if (err) { console.log(err) }
  
      department = department.map(dpt => ({
        name: dpt.name,
        value: dpt.id
      }))
  
        prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the title of the employee?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the current salary of the employee?'
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'What department does the employee work in?',
            choices: department
          }
          
          
         ])
          .then(data => {
            db.query('INSERT INTO role SET ?', data, (err) => {
              if (err) { console.log(err) }
              console.log('Role Created!')
              mainMenu()
            })
          })
          .catch(err => console.log(err))
      })
    }
  
  
  mainMenu()





// const questions = [
//     {
//         type: 'input',
//         name: 'department',
//         message: 'What is the name of the Department?'
//     },
//     {
//         type: 'input',
//         name: 'role',
//         message: 'What is the role?'
//     },
//     {
//         type: 'input',
//         name: 'employee',
//         message: 'who and what is the employee?'
//     }
// ]