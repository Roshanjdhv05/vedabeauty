-- INSERT PRODUCT VARIANTS FOR FACES CANADA
INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('1e58c435-80d4-4cce-b066-63fcf3a1d87b', '30 ml', 'volume', 599, 479, 479, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('1e58c435-80d4-4cce-b066-63fcf3a1d87b', '18 ml', 'volume', 299, 239, 239, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('5b0f46cf-326f-427f-8177-beb4b874852e', '30 ml', 'volume', 599, 479, 479, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('5b0f46cf-326f-427f-8177-beb4b874852e', '18 ml', 'volume', 325, 260, 260, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('33f84154-b738-4981-a30b-b7293c0a8028', '30 g', 'size', 599, 479, 479, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('33f84154-b738-4981-a30b-b7293c0a8028', '18 g', 'size', 249, 199, 199, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('e856e3ca-1763-4760-aa39-c740c371a93d', '100 ml', 'volume', 649, 519, 519, 100)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)
VALUES ('e856e3ca-1763-4760-aa39-c740c371a93d', '50 ml', 'volume', 349, 279, 279, 100)
ON CONFLICT DO NOTHING;

