import { mockProducts } from "./mockProducts";

// Pulls existing products and layers discount info on top —
// once wired to a real backend, this would come from a "deals" or "discounted products" endpoint
// export const mockOffers = [
//     { ...mockProducts[0], originalPrice: 6000, discount: 25 },
//     { ...mockProducts[1], originalPrice: 4200, discount: 24 },
//     { ...mockProducts[2], originalPrice: 2400, discount: 25 },
//     { ...mockProducts[4], originalPrice: 2800, discount: 25 },
//     { ...mockProducts[5], originalPrice: 2000, discount: 25 },
// ];

export const mockOffers = mockProducts.filter((p) => p.discountPrice?.type !== "none");