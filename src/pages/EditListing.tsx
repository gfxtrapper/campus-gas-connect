import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame, Package, MapPin, DollarSign, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MultiImageUpload from "@/components/listings/MultiImageUpload";

const CYLINDER_SIZES = ["3kg", "6kg", "13kg", "22kg", "45kg"] as const;

const listingSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().trim().max(500, "Description must be less than 500 characters").optional(),
  brand: z.string().trim().max(50, "Brand must be less than 50 characters").optional(),
  cylinder_size: z.enum(CYLINDER_SIZES, { required_error: "Please select a cylinder size" }),
  price: z.number().positive("Price must be greater than 0").max(1000000, "Price is too high"),
  location: z.string().trim().max(100, "Location must be less than 100 characters").optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(1000, "Quantity is too high"),
  is_refill: z.boolean(),
});

type ListingFormData = z.infer<typeof listingSchema>;

const EditListing = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof ListingFormData, string>>>({});
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [cylinderSize, setCylinderSize] = useState<string>("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [isRefill, setIsRefill] = useState(false);

  useEffect(() => {
    if (!user || !id) {
      navigate("/seller-dashboard");
      return;
    }

    const fetchListing = async () => {
      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", id)
          .eq("seller_id", user.id)
          .single();

        if (error) throw error;
        
        if (!data) {
          toast({
            title: "Listing not found",
            description: "The listing you're trying to edit doesn't exist or you don't have permission.",
            variant: "destructive",
          });
          navigate("/seller-dashboard");
          return;
        }

        // Populate form with existing data
        setTitle(data.title);
        setDescription(data.description || "");
        setBrand(data.brand || "");
        setCylinderSize(data.cylinder_size);
        setPrice(data.price.toString());
        setLocation(data.location || "");
        setQuantity(data.quantity.toString());
        setIsRefill(data.is_refill);
        
        // Handle images - prefer images array, fallback to single image_url
        const existingImages = data.images && Array.isArray(data.images) && data.images.length > 0
          ? (data.images as string[])
          : data.image_url
          ? [data.image_url]
          : [];
        setImages(existingImages);
        setOriginalImages(existingImages);
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive",
        });
        navigate("/seller-dashboard");
      } finally {
        setFetching(false);
      }
    };

    fetchListing();
  }, [user, id, navigate, toast]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    if (!user) return null;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return null;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    try {
      // Create unique file path: user_id/timestamp_filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      toast({
        title: "Image uploaded!",
        description: "Your image has been uploaded successfully.",
      });

      return publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const formData = {
      title: title.trim(),
      description: description.trim() || undefined,
      brand: brand.trim() || undefined,
      cylinder_size: cylinderSize as typeof CYLINDER_SIZES[number],
      price: parseFloat(price) || 0,
      location: location.trim() || undefined,
      quantity: parseInt(quantity) || 1,
      is_refill: isRefill,
    };

    const result = listingSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ListingFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ListingFormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !id) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("listings")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          brand: brand.trim() || null,
          cylinder_size: cylinderSize as typeof CYLINDER_SIZES[number],
          price: parseFloat(price),
          location: location.trim() || null,
          quantity: parseInt(quantity),
          is_refill: isRefill,
          image_url: images[0] || null,
          images: images,
        })
        .eq("id", id)
        .eq("seller_id", user.id);

      if (error) throw error;

      toast({
        title: "Listing Updated!",
        description: "Your changes have been saved successfully.",
      });

      navigate("/seller-dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update listing",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-2xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Edit Listing</h1>
            <p className="text-muted-foreground mt-1">
              Update your gas cylinder listing details
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" />
                Listing Details
              </CardTitle>
              <CardDescription>
                Modify the details of your gas cylinder listing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 6kg K-Gas Cylinder"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={loading}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>

                {/* Cylinder Size and Type Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Cylinder Size *</Label>
                    <Select value={cylinderSize} onValueChange={setCylinderSize} disabled={loading}>
                      <SelectTrigger className={errors.cylinder_size ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {CYLINDER_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.cylinder_size && (
                      <p className="text-sm text-destructive">{errors.cylinder_size}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., K-Gas, Total"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      disabled={loading}
                      className={errors.brand ? "border-destructive" : ""}
                    />
                    {errors.brand && (
                      <p className="text-sm text-destructive">{errors.brand}</p>
                    )}
                  </div>
                </div>

                {/* Price and Quantity Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (KES) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="1200"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        disabled={loading}
                        className={`pl-10 ${errors.price ? "border-destructive" : ""}`}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Available *</Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={loading}
                        className={`pl-10 ${errors.quantity ? "border-destructive" : ""}`}
                        min="1"
                      />
                    </div>
                    {errors.quantity && (
                      <p className="text-sm text-destructive">{errors.quantity}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="location"
                      placeholder="e.g., Near UoN Main Campus, Nairobi"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={loading}
                      className={`pl-10 ${errors.location ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add details about the cylinder condition, delivery options, etc."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                    rows={3}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {description.length}/500 characters
                  </p>
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <MultiImageUpload
                    images={images}
                    onImagesChange={setImages}
                    onUpload={handleImageUpload}
                    uploading={uploading}
                    disabled={loading}
                    maxImages={5}
                  />
                </div>

                {/* Is Refill Toggle */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="is-refill" className="text-base">Refill Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle this if you're offering gas refills (customer brings their own cylinder)
                    </p>
                  </div>
                  <Switch
                    id="is-refill"
                    checked={isRefill}
                    onCheckedChange={setIsRefill}
                    disabled={loading}
                  />
                </div>

                {/* Info Alert */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your changes will be visible immediately after saving.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate("/seller-dashboard")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="flame" className="flex-1" disabled={loading || uploading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Flame className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EditListing;
