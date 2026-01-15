-- Create enum for cylinder sizes
CREATE TYPE public.cylinder_size AS ENUM ('3kg', '6kg', '13kg', '22kg', '45kg');

-- Create enum for listing status
CREATE TYPE public.listing_status AS ENUM ('available', 'sold', 'reserved', 'inactive');

-- Create listings table
CREATE TABLE public.listings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    brand TEXT,
    cylinder_size cylinder_size NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    status listing_status NOT NULL DEFAULT 'available',
    location TEXT,
    is_refill BOOLEAN NOT NULL DEFAULT false,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX idx_listings_seller_id ON public.listings(seller_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_cylinder_size ON public.listings(cylinder_size);

-- RLS Policies

-- Anyone can view available listings
CREATE POLICY "Anyone can view available listings"
ON public.listings
FOR SELECT
USING (status = 'available');

-- Sellers can view all their own listings regardless of status
CREATE POLICY "Sellers can view their own listings"
ON public.listings
FOR SELECT
USING (auth.uid() = seller_id);

-- Only users with seller or station role can create listings
CREATE POLICY "Sellers and stations can create listings"
ON public.listings
FOR INSERT
WITH CHECK (
    auth.uid() = seller_id 
    AND (has_role(auth.uid(), 'seller') OR has_role(auth.uid(), 'station'))
);

-- Sellers can update their own listings
CREATE POLICY "Sellers can update their own listings"
ON public.listings
FOR UPDATE
USING (auth.uid() = seller_id);

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete their own listings"
ON public.listings
FOR DELETE
USING (auth.uid() = seller_id);

-- Trigger to auto-update updated_at
CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();