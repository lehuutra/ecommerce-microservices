import { getInitials } from "@/lib/format";

const getSafeImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) {
    return null;
  }

  try {
    const url = new URL(imageUrl);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
};

export const ProductVisual = ({
  imageUrl,
  name,
  className = "",
}: {
  imageUrl: string | null;
  name: string;
  className?: string;
}) => {
  const safeImageUrl = getSafeImageUrl(imageUrl);

  return (
    <div
      aria-label={safeImageUrl ? name : undefined}
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-emerald-100 ${className}`}
      role={safeImageUrl ? "img" : undefined}
      style={
        safeImageUrl
          ? {
              backgroundImage: `url(${JSON.stringify(safeImageUrl)})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }
          : undefined
      }
    >
      {!safeImageUrl && (
        <span className="text-4xl font-black tracking-tight text-indigo-300">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};
