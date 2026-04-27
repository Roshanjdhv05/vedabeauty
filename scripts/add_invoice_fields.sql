-- Run this in your Supabase SQL Editor
-- Add unique invoice IDs to the orders table

alter table public.orders 
add column if not exists order_id text,
add column if not exists purchase_order_id text,
add column if not exists invoice_id text;

-- (Optional but recommended) add unique constraints to ensure no duplicates
alter table public.orders
add constraint orders_order_id_key unique (order_id),
add constraint orders_purchase_order_id_key unique (purchase_order_id),
add constraint orders_invoice_id_key unique (invoice_id);
