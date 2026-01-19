import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onUpload: (file: File) => Promise<string | null>;
  uploading: boolean;
  disabled?: boolean;
  maxImages?: number;
}

const MultiImageUpload = ({
  images,
  onImagesChange,
  onUpload,
  uploading,
  disabled = false,
  maxImages = 5,
}: MultiImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = await onUpload(file);
    if (url) {
      onImagesChange([...images, url]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-3">
      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden border bg-muted",
              index === 0 && "col-span-2 row-span-2"
            )}
          >
            <img
              src={image}
              alt={`Upload ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={() => handleRemoveImage(index)}
              disabled={disabled || uploading}
            >
              <X className="h-3 w-3" />
            </Button>
            {index === 0 && (
              <span className="absolute bottom-1 left-1 bg-background/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-medium">
                Main
              </span>
            )}
          </div>
        ))}

        {/* Add Button */}
        {canAddMore && (
          <div
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors",
              (disabled || uploading) && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <Plus className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload images
            </p>
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP or GIF (max 5MB each, up to {maxImages} images)
            </p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} images uploaded. First image will be the main display image.
      </p>
    </div>
  );
};

export default MultiImageUpload;
