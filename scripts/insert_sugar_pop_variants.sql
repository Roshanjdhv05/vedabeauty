-- INSERT PRODUCT VARIANTS FOR SUGAR POP
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('c9dfb786-1933-42c4-9c02-e48d39fa54ae', '75 ml', 'volume', 99, 79, 79, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('c9dfb786-1933-42c4-9c02-e48d39fa54ae', '200 ml', 'volume', 259, 207, 207, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('2842804e-4ae5-4e22-9019-e967077a5c48', '75 ml', 'volume', 99, 79, 79, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('2842804e-4ae5-4e22-9019-e967077a5c48', '200 ml', 'volume', 239, 191, 191, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('043776ab-5cf5-4332-b60f-57037bc4d9af', '30g', 'size', 199, 159, 159, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('043776ab-5cf5-4332-b60f-57037bc4d9af', '50g', 'size', 249, 199, 199, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('8c12a241-3529-49c8-80b2-96892d3ed69c', '40 ml', 'volume', 99, 79, 79, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) 
VALUES ('8c12a241-3529-49c8-80b2-96892d3ed69c', '80 ml', 'volume', 159, 127, 127, 100)
ON CONFLICT DO NOTHING;

