-- Remove foreign key constraint on seller_id to allow sample data
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_seller_id_fkey;

-- Make seller_id nullable for sample listings
ALTER TABLE public.listings ALTER COLUMN seller_id DROP NOT NULL;