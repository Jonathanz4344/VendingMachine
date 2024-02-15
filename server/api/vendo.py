from flask_restful import Resource

from flask_restful import request
from flask_restful import reqparse
import json
from .swen_344_db_utils import *

class Vendo(Resource):
    def get(self):
        result = exec_get_all("""
            SELECT 
                item.name AS item_name, 
                vending_machine.quantity AS quantity, 
                item.price AS price, 
                buttons.button_label AS button_label 
            FROM vending_machine 
            JOIN item ON item.id = vending_machine.item_id 
            JOIN buttons ON buttons.id = vending_machine.button_id
            ORDER BY buttons.button_label
        """)
        return result
    
    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('button_label', type=str, required=True)
        args = parser.parse_args()
    
        button_label = args['button_label']
        result = exec_get_one(f"""
            SELECT item.id, vending_machine.quantity 
            FROM vending_machine 
            JOIN buttons ON buttons.id = vending_machine.button_id 
            JOIN item ON item.id = vending_machine.item_id 
            WHERE buttons.button_label = '{button_label}'
        """)
         
        if result:
            item_id, quantity = result
            new_quantity = max(quantity - 1, 0)
            exec_commit(f"""
                UPDATE vending_machine
                SET quantity = {new_quantity}
                WHERE item_id = {item_id}
            """)
            return {"message": "Quantity updated"}, 200
        else:
            return {"message": "Invalid button label"}, 400

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('name', type=str, required=True)
        parser.add_argument('price', type=float, required=True)
        parser.add_argument('quantity', type=int, required=True)
        parser.add_argument('button_label', type=str, required=True)
        args = parser.parse_args()

        button_label = args['button_label']
        item_name = args['name']
        item_price = args['price']
        item_quantity = args['quantity']
        
        result = exec_get_one(f"""
            SELECT id FROM buttons WHERE button_label = '{button_label}'
        """)
        if not result:
            return {'message': 'Invalid button label'}, 400
        
        button_id = result[0]

        # Insert the new item into the item table
        exec_commit(f"""
            INSERT INTO item (name, price) VALUES ('{item_name}', {item_price})
            RETURNING id
        """)
        result = exec_get_one(f"SELECT id FROM item WHERE name = '{item_name}' AND price = '{item_price}'")
        
        item_id = result[0]

        # Insert the new item into the vending machine table
        
        row_id = exec_get_one(f"SELECT row_number FROM vending_machine WHERE button_id = '{button_id}' ")
        position_id = exec_get_one(f"SELECT position_number FROM vending_machine WHERE button_id = '{button_id}' ")
    
        
        # result = exec_commit(f"""
        #     INSERT INTO vending_machine (item_id, row_number, position_number, button_id, quantity)
        #     VALUES ({item_id}, {row_id[0]}, {position_id[0]}, {button_id}, {item_quantity})
        # """)
        
        result = exec_commit(f""" UPDATE vending_machine SET item_id = '{item_id}', quantity = '{item_quantity}' WHERE button_id = '{button_id}'""")

        # return {'message': 'Item added successfully'}, 200
        return "button_id = " + str(button_id) + " item_id = " + str(item_id) + " row_id = " + str(row_id[0]) + " position_id = " + str(position_id[0])



