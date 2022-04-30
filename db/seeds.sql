INSERT INTO department (name)
VALUES ("test1"),
        ("test2"),
        ("test3");

INSERT INTO role (title, salary, department_id)
VALUES ("pos1", 1000, 1),
        ("pos2", 34.00, 1),
        ("pos3", 67.00, 2),
        ("pos5", 82.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("bill", "nye", 1, NULL),
        ("ted", "moss", 2, 1),
        ("joe", "mama", 3, 1),
        ("jared", "smith", 2, NULL),
        ("chris", "lanely", 1, 4);