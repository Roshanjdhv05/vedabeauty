-- Add shipping_fee column to orders table
alter table public.orders 
add column if not exists shipping_fee numeric default 0;
