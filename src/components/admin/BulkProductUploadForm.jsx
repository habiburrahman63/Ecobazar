import { useRef, useState } from "react";
import { Link } from "react-router";
import axiosInstance from "../../api/axiosInstance";
import Button from "../common/Button";
import {
  Upload,
  FileSpreadsheet,
  Check,
  AlertTriangle,
} from "../common/Icons";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xlsx", ".xls"];

const validateFile = (file) => {
  const name = (file.name || "").toLowerCase();

  if (!ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return "Only .xlsx and .xls Excel files are supported.";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File is too large. Maximum size is 5 MB.";
  }
  if (file.size === 0) return "The selected file is empty.";
  return null;
};

export default function BulkProductUploadForm() {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState("");
  const [dragging, setDragging] = useState(false);

  const pickFile = (file) => {
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setFileError(error);
      setSelectedFile(null);
      setResult(null);
    } else {
      setFileError("");
      setSelectedFile(file);
      setResult(null);
      setServerError("");
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileError("");
    setResult(null);
    setServerError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading || !selectedFile) return;

    setUploading(true);
    setServerError("");
    setResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axiosInstance.post(
        "/bulk-product-upload",
        formData
      );

      setResult(data);
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          error.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const summary = result?.summary;
  const failedRows = (result?.rows || []).filter((r) => r.status === "failed");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* File picker */}
      <div className="bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 shadow-sm">
        <h2 className="font-display text-lg font-bold text-ink mb-1">
          Select Spreadsheet
        </h2>
        <p className="text-xs text-slate mb-6">
          .xlsx or .xls format, up to 5 MB. Each row creates or updates one catalog product.
        </p>

        {/* Drag & drop + click to browse */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (uploading) return;
            pickFile(e.dataTransfer.files?.[0]);
          }}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
            ${
              dragging
                ? "border-amber bg-amber/10 scale-[1.01]"
                : "border-ink/15 hover:border-amber/40 hover:bg-[#f8fafc]"
            }
            ${uploading ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-amber/10 border border-amber/20 flex items-center justify-center text-amber mx-auto mb-3.5 shadow-xs">
            <FileSpreadsheet size={26} />
          </div>
          <p className="text-sm font-bold text-ink">
            Drop your Excel file here, or click to browse
          </p>
          <p className="text-xs text-slate mt-1 max-w-sm mx-auto">
            Need a template? Click "Download Excel Template" above to export a pre-filled sheet with all existing fields.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => pickFile(e.target.files?.[0])}
          />
        </div>

        {/* Selected file card */}
        {selectedFile && (
          <div className="flex items-center justify-between gap-3 mt-4 px-4 py-3 rounded-2xl bg-amber/10 border border-amber/25">
            <div className="flex items-center gap-3 min-w-0">
              <FileSpreadsheet size={20} className="text-amber shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-ink truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-slate">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearFile}
              disabled={uploading}
              className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
            >
              Remove
            </button>
          </div>
        )}

        {fileError && (
          <p className="text-xs text-red-500 mt-3 font-medium">{fileError}</p>
        )}

        <div className="mt-6">
          <Button
            type="submit"
            loading={uploading}
            disabled={!selectedFile}
            className="w-auto px-7 text-xs font-bold"
          >
            <Upload size={15} /> Upload Products Now
          </Button>
        </div>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-xs text-red-600">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Upload failed</p>
            <p className="text-slate/80 mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Upload summary */}
      {summary && (
        <div className="bg-white rounded-3xl border border-ink/10 p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink mb-4">
            Upload Summary
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <SummaryStat label="Total rows" value={summary.totalRows} />
            <SummaryStat
              label="Successfully Uploaded"
              value={summary.uploaded}
              tone="success"
            />
            <SummaryStat
              label="Validation Errors"
              value={summary.failed}
              tone={summary.failed > 0 ? "danger" : "default"}
            />
            <SummaryStat label="Skipped Blank" value={summary.skippedEmpty} />
          </div>

          <p className="text-xs text-slate">{result.message}</p>

          {result.unknownHeaders?.length > 0 && (
            <p className="text-xs text-amber mt-2 font-medium">
              Ignored unmapped columns: {result.unknownHeaders.join(", ")}
            </p>
          )}

          {failedRows.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-bold text-ink mb-2">
                Failed Rows ({failedRows.length}):
              </p>

              <div className="border border-ink/10 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8fafc] text-slate font-bold">
                    <tr>
                      <th className="px-3.5 py-2.5">Row</th>
                      <th className="px-3.5 py-2.5">Title</th>
                      <th className="px-3.5 py-2.5">Problem Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                    {failedRows.map((row) => (
                      <tr key={row.rowNumber} className="align-top">
                        <td className="px-3.5 py-2.5 font-mono text-ink/70">
                          {row.rowNumber}
                        </td>
                        <td className="px-3.5 py-2.5 font-medium text-ink">
                          {row.title || <span>&mdash;</span>}
                        </td>
                        <td className="px-3.5 py-2.5 text-red-600">
                          {row.errors.join(", ")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {summary.uploaded > 0 && (
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 mt-5 text-xs font-bold text-amber hover:underline"
            >
              <Check size={15} /> View Updated Products in Catalog →
            </Link>
          )}
        </div>
      )}
    </form>
  );
}

function SummaryStat({ label, value, tone = "default" }) {
  const toneClass = {
    default: "text-ink",
    success: "text-emerald-600",
    danger: "text-red-500",
  }[tone];

  return (
    <div className="rounded-2xl bg-[#f8fafc] border border-ink/5 px-4 py-3">
      <p className="text-[11px] font-semibold text-slate uppercase tracking-wider">
        {label}
      </p>
      <p className={`text-2xl font-bold font-display mt-0.5 ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}
