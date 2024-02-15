-- Do NOT change this file!!
DROP table if EXISTS vending_machine CASCADE;
DROP table if EXISTS item CASCADE;
DROP table if EXISTS buttons CASCADE;

CREATE TABLE item (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(30), --The name of the delicious snack 
    price float --Dollars and cents
);
CREATE TABLE buttons (
    id SERIAL PRIMARY KEY NOT NULL,
    button_label varchar(4)
);

CREATE TABLE vending_machine (
    id SERIAL PRIMARY KEY NOT NULL,
    item_id INT NOT NULL REFERENCES item(id),
    row_number INT, --1 or 2 (machines are small, only have 2 rows, max of 4 items per row)
    position_number INT, --1,2,3 or 4.  Essentially the 'column'
    button_id INT NOT NULL REFERENCES buttons(id), --The label for the button that corresponds to the location of the item.  
    quantity int --Current # of that item in the vending machine.  Cannot be negative
);


INSERT INTO buttons(id, button_label)	--Each button corresponds to a snack item in the vending machine
        VALUES (1,'A'), (2,'B'),(3,'C'), (4,'D'),(5,'E'), (6,'F'),(7,'G'), (8,'H') ;

INSERT INTO item(id, name, price) -- Each item that could be in the vending machine.
VALUES
(1,'Cheezee-it',  3.50),
(2,'Layz', 3.10),
(3,'Doritoze', 4.15),
(4,'Fyre Chipz', 5.00),
(5,'Gummi Bearz', 6.10),
(6,'Gummy Wormz', 7.25),
(7,'Juicee Blobz', 5.35),
(8,'Herbal Gummies', 15.00),
(9, 'Beefy Jerky', 5.95),
(10, 'Minty Gum', 2.10)
;

ALTER SEQUENCE item_id_seq RESTART WITH 11;

INSERT INTO vending_machine(item_id, row_number, position_number, button_id, quantity)	
        VALUES 
         ('2', 1, 2, 2, 4),
         ('3', 1,3, 3, 9),
         ('5', 2, 1, 5, 8),
         ('7', 2, 3,7, 7),
         ('4', 1, 4, 4, 12),
         ('8', 2, 4, 8, 15),
         ('6', 2, 2, 6, 2),
        ('1', 1, 1,  1, 6)
;
