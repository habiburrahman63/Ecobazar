import { useState } from "react";
import { Link } from "react-router";
import axiosInstance from "../../api/axiosInstance";
import BulkProductUploadForm from "../../components/admin/BulkProductUploadForm";
import {
  ArrowRight,
  Download,
  AlertTriangle,
  Loader2,
} from "../../components/common/Icons";

export default function BulkProductUpload() {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);
    setDownloadError("");

    try {
      const response = await axiosInstance.get(
        "/bulk-product-template",
        { responseType: "blob" }
      );

      const disposition = response.headers["content-disposition"] || "";
      const match = /filename="?([^"]+)"?/.exec(disposition);
      const fileName = match ? match[1] : "products-export.xlsx";

      const blobUrl = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      setDownloadError(
        error.response?.data?.message ||
          "Could not download the Excel template. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + template download */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-ink/10 shadow-sm">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Bulk Product Upload
          </h1>
          <p className="text-xs text-slate mt-1">
            Upload an Excel (.xlsx) spreadsheet to import dozens of catalog items at once.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 bg-white border border-ink/15 text-ink text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-ink/[0.03] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer self-start sm:self-auto"
        >
          {downloading ? (
            <>
              <Loader2 size={15} className="animate-spin text-amber" />
              <span>Preparing Spreadsheet...</span>
            </>
          ) : (
            <>
              <Download size={15} className="text-amber" />
              <span>Download Excel Template</span>
            </>
          )}
        </button>
      </div>

      {downloadError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-xs text-red-600">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Template download failed</p>
            <p className="text-slate/70 mt-0.5">{downloadError}</p>
          </div>
        </div>
      )}

      <BulkProductUploadForm />

      <div className="pt-2">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate hover:text-ink transition-colors"
        >
          <span>← Back to Products List</span>
        </Link>
      </div>
    </div>
  );
}
