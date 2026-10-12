import { useRef } from "react";
import { ImagePlus, X, Star } from "../common/Icons";
import { toAbsoluteImageUrl } from "../../api/productApi";

const MAX_IMAGES = 5;

// images: array of { file?, url?, preview?, isMain }
// নিয়ম: সবসময় হবে ঠিক একটি isMain:true — setMain ও removeImage দুটোই এটা ধরে রাখে।
export default function ImageUploader({ images, onChange }) {
  const inputRef = useRef();

  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).slice(
      0,
      MAX_IMAGES - images.length,
    );
    const newImages = files.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      // এখনো কোনো image নেই => প্রথম image স্বয়ংক্রিয়ভাবে Main Image হয়
      isMain: images.length === 0 && i === 0,
    }));
    onChange([...images, ...newImages].slice(0, MAX_IMAGES));
  };

  const removeImage = (index) => {
    const removed = images[index];
    if (removed?.preview) URL.revokeObjectURL(removed.preview);

    const wasMain = removed?.isMain;
    const next = images.filter((_, i) => i !== index);
    // main image মুছে গেলে => বাকি প্রথম image টি নতুন main হয়
    if (wasMain && next.length > 0) next[0] = { ...next[0], isMain: true };
    onChange(next);
  };

  // নির্বাচিত image-কে Main Image বানানো — আগের main স্বয়ংক্রিয়ভাবে normal হয়ে যায়
  const setMain = (index) => {
    onChange(images.map((img, i) => ({ ...img, isMain: i === index })));
  };

  const handleImageUp = (e) => {
    handleFiles(e.target.files);
    // input reset না করলে একই ফাইল আবার select করলে change event আসে না
    e.target.value = "";
  };

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden border border-ink/10 group"
          >
            <img
              src={img.preview || toAbsoluteImageUrl(img.url)}
              alt={`Product ${i + 1}`}
              className="w-full h-full object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(i)}
              aria-label={`Remove image ${i + 1}`}
              className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-ink/70 text-paper flex items-center justify-center
                opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={13} />
            </button>

            <button
              type="button"
              onClick={() => setMain(i)}
              aria-pressed={img.isMain}
              aria-label={
                img.isMain
                  ? `Image ${i + 1} is the main image`
                  : `Set image ${i + 1} as main image`
              }
              className={`absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full transition-colors ${
                img.isMain
                  ? "bg-amber text-ink"
                  : "bg-ink/60 text-paper opacity-0 group-hover:opacity-100"
              }`}
            >
              <Star size={10} fill={img.isMain ? "currentColor" : "none"} />
              {img.isMain ? "Main" : "Set main"}
            </button>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-ink/15 flex flex-col items-center justify-center
              gap-1.5 text-ink/40 hover:border-amber hover:text-amber transition-colors"
          >
            <ImagePlus size={20} />
            <span className="text-xs font-medium">Add image</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageUp}
      />

      <p className="text-xs text-slate/60 mt-2">
        Up to {MAX_IMAGES} images. Click the star to set the main product image.
      </p>
    </div>
  );
}
