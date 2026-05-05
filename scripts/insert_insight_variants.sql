-- INSERT PRODUCT VARIANTS FOR INSIGHT
DELETE FROM product_variants WHERE product_id = '2579ebf4-0ace-4537-b5f6-09387fb7204b' AND name = '30ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('2579ebf4-0ace-4537-b5f6-09387fb7204b', '30ml', 'volume', 340, 255, 255, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '2579ebf4-0ace-4537-b5f6-09387fb7204b' AND name = '10ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('2579ebf4-0ace-4537-b5f6-09387fb7204b', '10ml', 'volume', 150, 113, 113, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ca918797-77be-443a-9337-b3b73f9b2e14' AND name = '30ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ca918797-77be-443a-9337-b3b73f9b2e14', '30ml', 'volume', 415, 311, 311, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ca918797-77be-443a-9337-b3b73f9b2e14' AND name = '10ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ca918797-77be-443a-9337-b3b73f9b2e14', '10ml', 'volume', 140, 105, 105, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '00c53236-8bfb-4cd1-93ee-eb5437d1ad37' AND name = '30ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('00c53236-8bfb-4cd1-93ee-eb5437d1ad37', '30ml', 'volume', 380, 285, 285, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '00c53236-8bfb-4cd1-93ee-eb5437d1ad37' AND name = '10ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('00c53236-8bfb-4cd1-93ee-eb5437d1ad37', '10ml', 'volume', 140, 105, 105, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'fbb43e9e-893a-427d-9d6c-07e8e129c1e2' AND name = 'Red';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('fbb43e9e-893a-427d-9d6c-07e8e129c1e2', 'Red', 'shade', 60, 45, 45, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'fbb43e9e-893a-427d-9d6c-07e8e129c1e2' AND name = 'Maroon';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('fbb43e9e-893a-427d-9d6c-07e8e129c1e2', 'Maroon', 'shade', 60, 45, 45, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '46cd195f-29bf-4271-9628-29957cab3b09' AND name = 'Red';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('46cd195f-29bf-4271-9628-29957cab3b09', 'Red', 'shade', 130, 98, 98, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '46cd195f-29bf-4271-9628-29957cab3b09' AND name = 'Maroon';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('46cd195f-29bf-4271-9628-29957cab3b09', 'Maroon', 'shade', 130, 98, 98, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '198af8d7-f8d2-4caf-a83a-4aea9cbff7a9' AND name = 'Black';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('198af8d7-f8d2-4caf-a83a-4aea9cbff7a9', 'Black', 'shade', 170, 128, 128, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '198af8d7-f8d2-4caf-a83a-4aea9cbff7a9' AND name = 'Brown';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('198af8d7-f8d2-4caf-a83a-4aea9cbff7a9', 'Brown', 'shade', 170, 128, 128, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '198af8d7-f8d2-4caf-a83a-4aea9cbff7a9' AND name = 'Grey';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('198af8d7-f8d2-4caf-a83a-4aea9cbff7a9', 'Grey', 'shade', 170, 128, 128, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ed8dac3b-f18d-4322-be5a-bb0d5b985b48' AND name = 'Black';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ed8dac3b-f18d-4322-be5a-bb0d5b985b48', 'Black', 'shade', 185, 139, 139, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ed8dac3b-f18d-4322-be5a-bb0d5b985b48' AND name = 'Colours';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ed8dac3b-f18d-4322-be5a-bb0d5b985b48', 'Colours', 'shade', 200, 150, 150, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'bb7d0b8d-f20c-40aa-81ad-81da9e6370a7' AND name = 'Shiny';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('bb7d0b8d-f20c-40aa-81ad-81da9e6370a7', 'Shiny', 'shade', 125, 94, 94, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'bb7d0b8d-f20c-40aa-81ad-81da9e6370a7' AND name = 'Matte';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('bb7d0b8d-f20c-40aa-81ad-81da9e6370a7', 'Matte', 'shade', 125, 94, 94, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ea2f2b77-d857-4745-b094-22e0c4581c05' AND name = 'Matte';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ea2f2b77-d857-4745-b094-22e0c4581c05', 'Matte', 'shade', 75, 56, 56, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ea2f2b77-d857-4745-b094-22e0c4581c05' AND name = 'Shiny';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ea2f2b77-d857-4745-b094-22e0c4581c05', 'Shiny', 'shade', 95, 71, 71, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'a9a9f339-dc61-4b1f-9db5-783edfb6d893' AND name = 'Black';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('a9a9f339-dc61-4b1f-9db5-783edfb6d893', 'Black', 'shade', 130, 98, 98, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'a9a9f339-dc61-4b1f-9db5-783edfb6d893' AND name = 'White';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('a9a9f339-dc61-4b1f-9db5-783edfb6d893', 'White', 'shade', 130, 98, 98, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'a9a9f339-dc61-4b1f-9db5-783edfb6d893' AND name = 'Colours';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('a9a9f339-dc61-4b1f-9db5-783edfb6d893', 'Colours', 'shade', 120, 90, 90, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '3f16ff83-174d-49ba-afc4-99689648899d' AND name = 'Black';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('3f16ff83-174d-49ba-afc4-99689648899d', 'Black', 'shade', 175, 131, 131, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '3f16ff83-174d-49ba-afc4-99689648899d' AND name = 'Colours';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('3f16ff83-174d-49ba-afc4-99689648899d', 'Colours', 'shade', 165, 124, 124, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '6a6fc2df-9148-4403-9725-cd771845e070' AND name = '30 pack';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('6a6fc2df-9148-4403-9725-cd771845e070', '30 pack', 'size', 60, 45, 45, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = '6a6fc2df-9148-4403-9725-cd771845e070' AND name = '40 pack';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('6a6fc2df-9148-4403-9725-cd771845e070', '40 pack', 'size', 80, 60, 60, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'c846f8cc-24ce-490b-bb5e-0b1cb1034c50' AND name = '60ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('c846f8cc-24ce-490b-bb5e-0b1cb1034c50', '60ml', 'volume', 59, 44, 44, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'c846f8cc-24ce-490b-bb5e-0b1cb1034c50' AND name = '100ml';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('c846f8cc-24ce-490b-bb5e-0b1cb1034c50', '100ml', 'volume', 85, 64, 64, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ac9ca1e4-b680-4221-b3dd-1c37839dd529' AND name = 'Beige';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ac9ca1e4-b680-4221-b3dd-1c37839dd529', 'Beige', 'shade', 145, 109, 109, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ac9ca1e4-b680-4221-b3dd-1c37839dd529' AND name = 'Pink';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ac9ca1e4-b680-4221-b3dd-1c37839dd529', 'Pink', 'shade', 145, 109, 109, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'ac9ca1e4-b680-4221-b3dd-1c37839dd529' AND name = 'Orange';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('ac9ca1e4-b680-4221-b3dd-1c37839dd529', 'Orange', 'shade', 145, 109, 109, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'cb0f76a5-6b8f-4b95-9eef-6905284da656' AND name = 'Flat';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('cb0f76a5-6b8f-4b95-9eef-6905284da656', 'Flat', 'size', 250, 188, 188, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'cb0f76a5-6b8f-4b95-9eef-6905284da656' AND name = 'Round';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('cb0f76a5-6b8f-4b95-9eef-6905284da656', 'Round', 'size', 130, 98, 98, 100)
ON CONFLICT DO NOTHING;

DELETE FROM product_variants WHERE product_id = 'cb0f76a5-6b8f-4b95-9eef-6905284da656' AND name = 'Round & Curl';
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('cb0f76a5-6b8f-4b95-9eef-6905284da656', 'Round & Curl', 'size', 240, 180, 180, 100)
ON CONFLICT DO NOTHING;

