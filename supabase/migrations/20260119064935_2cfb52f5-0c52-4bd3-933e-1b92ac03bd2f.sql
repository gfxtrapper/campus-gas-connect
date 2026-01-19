-- Add images column to store multiple image URLs as JSONB array
ALTER TABLE public.listings 
ADD COLUMN images JSONB DEFAULT '[]'::jsonb;

-- Migrate existing image_url data to images array
UPDATE public.listings 
SET images = jsonb_build_array(image_url) 
WHERE image_url IS NOT NULL AND image_url != '';

-- Add comment for documentation
COMMENT ON COLUMN public.listings.images IS 'Array of image URLs for the listing';