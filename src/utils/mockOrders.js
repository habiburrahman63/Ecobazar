export const mockOrders = [
    {
        _id: "ORD1001",
        date: "2026-07-01",
        status: "delivered",
        paymentMethod: "bKash",
        total: 5200,
        customer: { name: "Ashraf Hossain", email: "ashraf@example.com", phone: "01712345678" },
        address: "House 12, Road 5, Dhanmondi, Dhaka",
        items: [
            { _id: "1", name: "Wireless Noise-Cancelling Headphones", price: 4500, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" },
            { _id: "4", name: "The Design of Everyday Things", price: 950, quantity: 1, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200" },
        ],
    },
    {
        _id: "ORD1002",
        date: "2026-07-05",
        status: "shipped",
        paymentMethod: "Cash on Delivery",
        total: 3200,
        customer: { name: "Nusrat Jahan", email: "nusrat@example.com", phone: "01898765432" },
        address: "Flat 3B, Road 11, Banani, Dhaka",
        items: [
            { _id: "2", name: "Minimalist Leather Backpack", price: 3200, quantity: 1, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200" },
        ],
    },
    {
        _id: "ORD1003",
        date: "2026-07-07",
        status: "processing",
        paymentMethod: "Card",
        total: 1800,
        customer: { name: "Rakibul Islam", email: "rakibul@example.com", phone: "01922334455" },
        address: "House 45, Sector 7, Uttara, Dhaka",
        items: [
            { _id: "3", name: "Ceramic Pour-Over Coffee Set", price: 1800, quantity: 1, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200" },
        ],
    },
    {
        _id: "ORD1004",
        date: "2026-06-20",
        status: "cancelled",
        paymentMethod: "Nagad",
        total: 1500,
        customer: { name: "Farhana Akter", email: "farhana@example.com", phone: "01555667788" },
        address: "House 8, Road 2, Mirpur, Dhaka",
        items: [
            { _id: "6", name: "Adjustable Yoga Mat & Strap Set", price: 1500, quantity: 1, image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=200" },
        ],
    },
    {
        _id: "ORD1005",
        date: "2026-07-08",
        status: "processing",
        paymentMethod: "bKash",
        total: 2100,
        customer: { name: "Nusrat Jahan", email: "nusrat@example.com", phone: "01898765432" },
        address: "Flat 3B, Road 11, Banani, Dhaka",
        items: [
            { _id: "5", name: "Matte Skincare Gift Set", price: 2100, quantity: 1, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200" },
        ],
    },
];