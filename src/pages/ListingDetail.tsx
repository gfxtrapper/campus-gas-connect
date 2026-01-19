import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  ShieldCheck, 
  Package, 
  Flame, 
  Calendar,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Loader2,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import ImageGallery from "@/components/listings/ImageGallery";

type Listing = Tables<"listings">;
type Profile = Tables<"profiles">;

const ListingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<Listing | null>(null);
  const [sellerProfile, setSellerProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchListing(id);
    }
  }, [id]);

  const fetchListing = async (listingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", listingId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError("Listing not found");
      } else {
        setListing(data);
        // Fetch seller profile
        if (data.seller_id) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", data.seller_id)
            .maybeSingle();
          
          if (profileData) {
            setSellerProfile(profileData);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
      setError("Failed to load listing");
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    // Remove all non-numeric characters
    let cleaned = phone.replace(/\D/g, "");
    
    // Handle Kenyan numbers
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.slice(1);
    } else if (!cleaned.startsWith("254") && cleaned.length === 9) {
      cleaned = "254" + cleaned;
    }
    
    return cleaned;
  };

  const handleWhatsAppContact = () => {
    if (!sellerProfile?.phone) {
      toast({
        title: "Contact unavailable",
        description: "The seller hasn't added their phone number yet.",
        variant: "destructive",
      });
      return;
    }

    const phone = formatPhoneForWhatsApp(sellerProfile.phone);
    const message = encodeURIComponent(
      `Hi! I'm interested in your listing "${listing?.title}" on GasBora. Is it still available?`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const handleCallSeller = () => {
    if (!sellerProfile?.phone) {
      toast({
        title: "Contact unavailable",
        description: "The seller hasn't added their phone number yet.",
        variant: "destructive",
      });
      return;
    }

    window.location.href = `tel:${sellerProfile.phone}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
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

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="font-display font-semibold text-xl mb-2">
              {error || "Listing not found"}
            </h2>
            <p className="text-muted-foreground mb-6">
              The listing you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/marketplace")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        {/* Breadcrumb */}
        <div className="bg-background border-b">
          <div className="container py-4">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                Marketplace
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate">{listing.title}</span>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative">
                {/* Get images array or fallback to single image_url */}
                <ImageGallery
                  images={
                    listing.images && Array.isArray(listing.images) && listing.images.length > 0
                      ? (listing.images as string[])
                      : listing.image_url
                      ? [listing.image_url]
                      : []
                  }
                  title={listing.title}
                  fallbackEmoji={listing.is_refill ? "⛽" : "🔥"}
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {listing.cylinder_size}
                  </Badge>
                  {listing.is_refill && (
                    <Badge className="bg-accent text-accent-foreground">
                      Refill Service
                    </Badge>
                  )}
                </div>
                
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{listing.brand || "Generic"}</Badge>
                  {listing.quantity > 0 && (
                    <div className="flex items-center gap-1 text-success text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      <span>In Stock</span>
                    </div>
                  )}
                </div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  {listing.title}
                </h1>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="font-display text-4xl font-bold text-primary">
                  {formatPrice(listing.price)}
                </p>
                {listing.is_refill && (
                  <p className="text-sm text-muted-foreground mt-2">
                    * Refill service - bring your empty cylinder
                  </p>
                )}
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-xl p-4 border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="h-4 w-4" />
                    <span className="text-sm">Quantity</span>
                  </div>
                  <p className="font-semibold">{listing.quantity} available</p>
                </div>
                <div className="bg-background rounded-xl p-4 border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Listed</span>
                  </div>
                  <p className="font-semibold">{formatDate(listing.created_at)}</p>
                </div>
              </div>

              {/* Location */}
              {listing.location && (
                <div className="bg-background rounded-xl p-4 border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="font-semibold">{listing.location}</p>
                </div>
              )}

              <Separator />

              {/* Description */}
              {listing.description && (
                <div>
                  <h3 className="font-display font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {listing.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Seller Info */}
              {sellerProfile && (
                <div className="bg-background rounded-xl p-4 border">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {sellerProfile.full_name?.charAt(0)?.toUpperCase() || "S"}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{sellerProfile.full_name || "Seller"}</p>
                      <p className="text-sm text-muted-foreground">
                        {sellerProfile.phone ? "Contact available" : "No contact info"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-3">
                <Button 
                  variant="flame" 
                  size="lg" 
                  className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white"
                  onClick={handleWhatsAppContact}
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp Seller
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="lg" onClick={handleCallSeller}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Seller
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleWhatsAppContact}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Safety Notice */}
              <div className="bg-accent/10 rounded-xl p-4 flex gap-3">
                <ShieldCheck className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Safety Tips</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Always verify the cylinder condition before purchase. Meet in public places and inspect the seal before payment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ListingDetail;
