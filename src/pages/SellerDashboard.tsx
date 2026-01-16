import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Plus, 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Eye, 
  Package,
  Loader2,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Listing = Tables<"listings">;

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyListings();
    }
  }, [user]);

  const fetchMyListings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to load your listings");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!listingToDelete) return;
    
    setDeleting(true);
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listingToDelete.id);

      if (error) throw error;
      
      setListings(listings.filter(l => l.id !== listingToDelete.id));
      toast.success("Listing deleted successfully");
    } catch (error) {
      console.error("Error deleting listing:", error);
      toast.error("Failed to delete listing");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  const handleStatusToggle = async (listing: Listing) => {
    const newStatus = listing.status === "available" ? "sold" : "available";
    
    try {
      const { error } = await supabase
        .from("listings")
        .update({ status: newStatus })
        .eq("id", listing.id);

      if (error) throw error;
      
      setListings(listings.map(l => 
        l.id === listing.id ? { ...l, status: newStatus } : l
      ));
      toast.success(`Listing marked as ${newStatus}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.error("Failed to update listing status");
    }
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
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success/10 text-success border-success/20">Available</Badge>;
      case "sold":
        return <Badge className="bg-muted text-muted-foreground">Sold</Badge>;
      case "reserved":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Reserved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Calculate stats
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === "available").length;
  const totalValue = listings.reduce((sum, l) => sum + (l.price * l.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                Seller <span className="text-gradient-flame">Dashboard</span>
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your gas cylinder listings
              </p>
            </div>
            <Link to="/create-listing">
              <Button variant="flame">
                <Plus className="h-4 w-4 mr-2" />
                New Listing
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="bg-background rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                  <p className="text-2xl font-bold">{totalListings}</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                  <p className="text-2xl font-bold">{activeListings}</p>
                </div>
              </div>
            </div>
            <div className="bg-background rounded-xl p-6 border shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">{formatPrice(totalValue)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Listings Table */}
          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-display font-semibold">Your Listings</h2>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : listings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                              {listing.image_url ? (
                                <img
                                  src={listing.image_url}
                                  alt={listing.title}
                                  className="h-full w-full object-cover rounded-lg"
                                />
                              ) : (
                                <span className="text-xl">{listing.is_refill ? "⛽" : "🔥"}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{listing.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {listing.brand || "Generic"} • {listing.location || "No location"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{listing.cylinder_size}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(listing.price)}
                        </TableCell>
                        <TableCell>{listing.quantity}</TableCell>
                        <TableCell>{getStatusBadge(listing.status)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(listing.created_at)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => navigate(`/listing/${listing.id}`)}
                                className="cursor-pointer"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusToggle(listing)}
                                className="cursor-pointer"
                              >
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Mark as {listing.status === "available" ? "Sold" : "Available"}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => {
                                  setListingToDelete(listing);
                                  setDeleteDialogOpen(true);
                                }}
                                className="cursor-pointer text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">No listings yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Start selling by creating your first gas cylinder listing.
                </p>
                <Link to="/create-listing">
                  <Button variant="flame">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Listing
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{listingToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SellerDashboard;
