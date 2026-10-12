import { useState, useMemo, useEffect } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import ImageUploader from "./ImageUploader";
import { fetchCategories } from "../../api/categoryApi";
import { createProductApi, updateProductApi } from "../../api/productApi";
import { PRODUCT_SECTIONS } from "../../utils/productSections";
import { useParams } from "react-router";

const statusOptions = ["pending", "active", "inactive"];
const discountTypes = ["none", "percentage", "flat"];

// DB থেকে আসা image গুলোকে একটি নির্দিষ্ট অবস্থায় আনা হয় — ঠিক একটি Main Image থাকবে।
// আগের থেকে থাকা product-এ কোনো image-ই main না হলে (legacy data) প্রথমটিকে main
// করা হয়, যাতে edit form খুললে ভুলভাবে "কোনো image-ই main নেই" দেখানো না হয়।
const normalizeInitialImages = (images) => {
  const list = (images || [])
    .filter((img) => img && img.url)
    .map((img) => ({ url: img.url, isMain: Boolean(img.isMain) }));
  if (list.length === 0) return list;
  const mainIndex = list.findIndex((img) => img.isMain);
  const resolvedMainIndex = mainIndex === -1 ? 0 : mainIndex;
  return list.map((img, index) => ({ ...img, isMain: index === resolvedMainIndex }));
};

export default function ProductForm({
  initialData,
  onSubmit,
  submitLabel = "Save Product",
}) {
  const [categories, setCategories] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchCats() {
      try {
        const cats = await fetchCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error("Failed to load categories in ProductForm:", err);
      }
    }
    fetchCats();
  }, []);

  const getInitialDiscountType = (rawType) => {
    if (rawType === "percent" || rawType === "percentage") return "percentage";
    if (rawType === "flat") return "flat";
    return "none";
  };

  const [form, setForm] = useState({
    title: initialData?.title || "",
    sku: initialData?.sku || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    price: initialData?.price ?? "",
    stock: initialData?.stock ?? "",
    category: initialData?.category || "",
    section: initialData?.section || "",
    brand: initialData?.brand || "",
    additionalInformation: initialData?.additionalInformation || initialData?.additionalInfo || "",
    status: initialData?.status || "pending",
    tag: Array.isArray(initialData?.tag)
      ? initialData.tag.join(", ")
      : (initialData?.tag || initialData?.tags?.join?.(", ") || ""),
    discountType: getInitialDiscountType(initialData?.discountType),
    discountValue: initialData?.discount ?? "",
    discountStart: initialData?.discountStartDate ? initialData.discountStartDate.split("T")[0] : "",
    discountEnd: initialData?.discountEndtDate ? initialData.discountEndtDate.split("T")[0] : "",
  });
  const [images, setImages] = useState(() =>
    normalizeInitialImages(initialData?.images),
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, 
      
      [e.target.name]:
       e.target.name == "images" ? e.target.files : e.target.value});
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // Live-calculated sale price preview — mirrors what the backend would compute
  const salePricePreview = useMemo(() => {
    const price = Number(form.price) || 0;
    const value = Number(form.discountValue) || 0;
    if (form.discountType === "percentage")
      return Math.max(0, price - (price * value) / 100);
    if (form.discountType === "flat") return Math.max(0, price - value);
    return price;
  }, [form.price, form.discountType, form.discountValue]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Product title is required";
    // SKU backend নিজে generate করে (create এ field disabled), তাই শুধু edit এ check
    if (id && !form.sku.trim()) errs.sku = "SKU is required";
    if (!form.price || Number(form.price) <= 0)
      errs.price = "Enter a valid price";
    if (form.stock === "" || Number(form.stock) < 0)
      errs.stock = "Enter a valid stock quantity";
    if (!form.description.trim()) errs.description = "Description is required";
    if (images.length === 0) errs.images = "At least one image is required";
    // ঠিক একটি image Main Image হতে হবে — নাহলে submit করা হবে না
    if (images.length > 0 && !images.some((img) => img.isMain)) {
      errs.images = "Please select a main image";
    }
    if (
      form.discountType !== "none" &&
      (!form.discountValue || Number(form.discountValue) <= 0)
    ) {
      errs.discountValue = "Enter a discount value";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs); 

    setSaving(true);

    // const payload = {
    //   title: form?.title || "",
    //   sku: form?.sku || "",
    //   shortDescription: form?.shortDescription || "",
    //   description: form?.description || "",
    //   price: form?.price ?? "",
    //   stock: form?.stock ?? "",
    //   category: form?.category || "",
    //   brand: form?.brand || "",
    //   additionalInfo: form?.additionalInformation || "",
    //   status: form?.status || "pending",
    //   tag: form?.tag?.split(",") || "",
    //   discountType: form?.discountType || "none",
    //   discount: form?.discountValue || "",
    //   discountStartDate: form?.discountStart || "",
    //   discountEndtDate: form?.discountEnd || "",
    //   images: images,
    // };

    // Backend (schema + multer) যে field name expect করে, ঠিক সেই নামেই পাঠানো হচ্ছে
    const formData = new FormData();
    formData.append("title", form.title.trim());
    formData.append("shortDescription", form.shortDescription);
    formData.append("description", form.description);
    formData.append("additionalInfo", form.additionalInformation);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("section", form.section || "");
    formData.append("brand", form.brand);
    formData.append("status", form.status);
    formData.append("tag", form.tag);
    formData.append(
      "discountType",
      form.discountType === "percentage" ? "percent" : form.discountType,
    );
    if (form.discountType !== "none") {
      formData.append("discount", form.discountValue);
      formData.append("discountStartDate", form.discountStart);
      formData.append("discountEndtDate", form.discountEnd);
    }

    // --- Image ও Main Image ---
    const toCleanPath = (url) => {
      if (!url || typeof url !== "string") return "";
      return url.replace(/^https?:\/\/[^\/]+\/?/i, "").replace(/^\/+/, "");
    };

    // নতুন select করা file গুলো "photos" নামে (backend: upload.array("photos"))
    const existingImages = images.filter((img) => !img.file && img.url);
    const newImages = images.filter((img) => img.file);
    newImages.forEach((img) => formData.append("photos", img.file));

    // রাখতে চাওয়া existing image গুলোর canonical relative url (order সহ)
    formData.append(
      "keepImages",
      JSON.stringify(existingImages.map((img) => toCleanPath(img.url))),
    );

    // Main Image reference: নতুন ফাইল হলে "new:<index>", existing হলে url।
    const mainImage = images.find((img) => img.isMain) || images[0];
    if (mainImage) {
      formData.append(
        "mainImage",
        mainImage.file
          ? `new:${newImages.indexOf(mainImage)}`
          : toCleanPath(mainImage.url),
      );
    }

    try {
      const data = id
        ? await updateProductApi(id, formData)
        : await createProductApi(formData);

      if (!data?.success) {
        setErrors({ form: data?.message || "Failed to save product" });
        return;
      }
      onSubmit?.(data);
    } catch (error) {
      setErrors({
        form:
          error.response?.data?.message ||
          error.message ||
          "Failed to save product",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="bg-white rounded-xl border border-ink/10 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-5">
          Product Images
        </h2>
        <ImageUploader images={images} onChange={setImages} />
        {errors.images && (
          <p className="text-xs text-red-500 mt-2">{errors.images}</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-ink/10 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-5">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <InputField
              label="Product title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g. Wireless Headphones"
            />
          </div>

          <InputField
            disabled
            label="SKU"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            error={errors.sku}
            placeholder="e.g. ELEC-HEAD-001"
          />
          <InputField
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. SoundCore"
          />

          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm
                focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-ink block mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm capitalize
                focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Section ---
            Category field-এর মতো একই select styling, কিন্তু নিচে full-width
            এ রাখা হয়েছে যাতে Category/Status-এর বিদ্যমান layout অপরিবর্তিত থাকে। */}
        <div className="mt-4">
          <label
            htmlFor="section"
            className="text-sm font-medium text-ink block mb-1.5"
          >
            Section
          </label>
          <select
            id="section"
            name="section"
            value={form.section}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm
              focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
          >
            <option value="">No section</option>
            {PRODUCT_SECTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {/* কোন section-এ যাবে সেটা admin-কে স্পষ্ট করে দেখানো হয় */}
          <p className="text-xs text-slate mt-1.5">
            {form.section
              ? PRODUCT_SECTIONS.find((o) => o.value === form.section)
                  ?.description
              : "This product will not be limited to any specific section."}
          </p>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-ink block mb-1.5">
            Short description
          </label>
          <input
            type="text"
            name="shortDescription"
            value={form.shortDescription}
            onChange={handleChange}
            placeholder="One-line summary shown on product cards"
            className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm placeholder:text-slate/40
              focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-ink block mb-1.5">
            Full description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the product..."
            className={`w-full px-3.5 py-2.5 rounded-lg border bg-white text-sm placeholder:text-slate/40 resize-none
              focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all
              ${errors.description ? "border-red-400" : "border-ink/15"}`}
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-ink block mb-1.5">
            Additional information
          </label>
          <textarea
            name="additionalInformation"
            value={form.additionalInformation}
            onChange={handleChange}
            rows={2}
            placeholder="Specs, care instructions, etc."
            className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm placeholder:text-slate/40 resize-none
              focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
          />
        </div>

        <div className="mt-4">
          <InputField
            label="Tag (comma separated)"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="e.g. audio, wireless, noise-cancelling"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-ink/10 p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-ink mb-5">
          Pricing & Stock
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Price (৳)"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
            placeholder="0.00"
          />
          <InputField
            label="Stock quantity"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            error={errors.stock}
            placeholder="0"
          />
        </div>

        <div className="mt-5 pt-5 border-t border-ink/10">
          <p className="text-sm font-medium text-ink mb-3">Discount</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-ink block mb-1.5">
                Type
              </label>
              <select
                name="discountType"
                value={form.discountType}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-lg border border-ink/15 bg-white text-sm capitalize
                  focus:outline-none focus:ring-4 focus:ring-amber/15 focus:border-amber transition-all"
              >
                {discountTypes.map((t) => (
                  <option key={t} value={t} className="capitalize">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {form.discountType !== "none" && (
              <>
                <InputField
                  label={
                    form.discountType === "percentage"
                      ? "Discount (%)"
                      : "Discount (৳)"
                  }
                  name="discountValue"
                  type="number"
                  value={form.discountValue}
                  onChange={handleChange}
                  error={errors.discountValue}
                  placeholder="0"
                />
                <div className="flex flex-col justify-end">
                  <label className="text-sm font-medium text-ink block mb-1.5">
                    Sale price preview
                  </label>
                  <div className="px-3.5 py-2.5 rounded-lg bg-amber/10 text-sm font-semibold text-ink">
                    ৳{salePricePreview.toLocaleString()}
                  </div>
                </div>
              </>
            )}
          </div>

          {form.discountType !== "none" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <InputField
                label="Discount start date"
                name="discountStart"
                type="date"
                value={form.discountStart}
                onChange={handleChange}
              />
              <InputField
                label="Discount end date"
                name="discountEnd"
                type="date"
                value={form.discountEnd}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </div>

      {errors.form && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs font-semibold text-red-700 flex items-center gap-2">
          <span>⚠️ {errors.form}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" loading={saving} className="w-auto px-6">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
