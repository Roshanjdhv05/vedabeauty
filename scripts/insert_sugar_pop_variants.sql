-- INSERT PRODUCT VARIANTS FOR SUGAR POP
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('844ae177-9e21-4df9-bcc1-4d2b1b109087', '75 ml', 'volume', 99, 79, 79, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('844ae177-9e21-4df9-bcc1-4d2b1b109087', '200 ml', 'volume', 259, 207, 207, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('250b7343-4016-4685-b67f-09a4b0f9158d', '75 ml', 'volume', 99, 79, 79, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('250b7343-4016-4685-b67f-09a4b0f9158d', '200 ml', 'volume', 239, 191, 191, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('51ffcd06-2513-4760-b239-16e3265e8cd3', '30g', 'size', 199, 159, 159, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('51ffcd06-2513-4760-b239-16e3265e8cd3', '50g', 'size', 249, 199, 199, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('de4d5f15-7e55-401d-9ef6-e600ed171901', '40 ml', 'volume', 99, 79, 79, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('de4d5f15-7e55-401d-9ef6-e600ed171901', '80 ml', 'volume', 159, 127, 127, 100)
ON CONFLICT DO NOTHING;

