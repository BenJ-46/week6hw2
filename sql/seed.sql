USE employee_db

INSERT INTO department (name)
VALUES ('Sales'), ('Development');

INSERT INTO role (title,salary, departmennt_id)
VALUES ('Sales Rep', 60000, 1),
    ('Sales Manager', 100000, 1),
    ('Jr Developer', 60000, 1),
    ('Sr Developer', 100000, 1);

    INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ('John', 'Doe', 2, NULL),
        ('Jane', 'Doe', 1, 1),
        ('Jack', 'Doe', 4, NULL),
        ('James', 'Doe', 3, 3 )