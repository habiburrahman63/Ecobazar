/**
 * Product-এর storefront section option গুলো।
 * Backend (backend-ecobazar/utils/productSections.js) এর তালিকার
 * হুবহু মিল — যাতে dropdown আর server-side validation সবসময়
 * একই মান চেনে।
 */
export const PRODUCT_SECTIONS = [
    {
        value: "Today's Deals",
        label: "Today's Deals",
        description: "Limited-time offers — shows in the deals slider",
    },
    {
        value: "Featured Products",
        label: "Featured Products",
        description: "Hand-picked items shown in the Featured row",
    },
    {
        value: "Best Sellers",
        label: "Best Sellers",
        description: "Top selling products shown in the Best Sellers row",
    },
    {
        value: "New Arrivals",
        label: "New Arrivals",
        description: "Recently added products shown in the New Arrivals row",
    },
];

// কোনো section না বাছাই করা = "No section" (empty string)
export const NO_SECTION = "";

export const SECTION_VALUES = PRODUCT_SECTIONS.map((s) => s.value);

/**
 * নির্দিষ্ট section-এর product বেছে নেয়।
 *
 * Admin কোনো product-এ section বাছাই করলে সেটিই ঐ section-এ যায়।
 * তবে কোনো product-এ এখনো section দেওয়া হয়নি (পুরনো/mock data) — সেই
 * ক্ষেত্রে section খালি দেখাবে না, বর্তমান আগের মতো derived list
 * (fallback) দেখাবে, যাতে আগের কোনো functionality ভেঙে না যায়।
 *
 * @param {Array} products - সব active product
 * @param {string} section - যে section খুঁজছি (PRODUCT_SECTIONS এর কোনো value)
 * @param {Function} fallback - section-এ কিছু না থাকলে কী দেখাতে হবে
 */
export function pickBySection(products, section, fallback) {
    const inSection = (products || []).filter((p) => p.section === section);
    return inSection.length > 0 ? inSection : fallback;
}