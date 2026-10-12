import {
    Smartphone, Shirt, HomeIcon, BookOpen, Sparkles, Dumbbell,
    ShoppingBasket, Gamepad2, Car, HeartPulse, Gem, PawPrint,
} from "../components/common/Icons";

export const categories = [
    {
        name: "Electronics",
        icon: Smartphone,
        subcategories: ["Smartphones", "Laptops", "Headphones", "Cameras"],
    },
    {
        name: "Fashion",
        icon: Shirt,
        subcategories: ["Men's Wear", "Women's Wear", "Shoes", "Accessories"],
    },
    {
        name: "Home & Living",
        icon: HomeIcon,
        subcategories: ["Furniture", "Kitchenware", "Decor", "Bedding"],
    },
    {
        name: "Books",
        icon: BookOpen,
        subcategories: ["Fiction", "Non-Fiction", "Academic", "Comics"],
    },
    {
        name: "Beauty",
        icon: Sparkles,
        subcategories: ["Skincare", "Makeup", "Haircare", "Fragrance"],
    },
    {
        name: "Sports",
        icon: Dumbbell,
        subcategories: ["Fitness", "Outdoor", "Team Sports", "Yoga"],
    },
    {
        name: "Groceries",
        icon: ShoppingBasket,
        subcategories: ["Fresh Produce", "Snacks", "Beverages", "Organic"],
    },
    {
        name: "Toys & Kids",
        icon: Gamepad2,
        subcategories: ["Toys", "Baby Care", "School Supplies", "Games"],
    },
    {
        name: "Automotive",
        icon: Car,
        subcategories: ["Car Accessories", "Motorbike Gear", "Tools", "Care Products"],
    },
    {
        name: "Health & Wellness",
        icon: HeartPulse,
        subcategories: ["Supplements", "Personal Care", "Medical Devices", "Fitness Trackers"],
    },
    {
        name: "Jewelry",
        icon: Gem,
        subcategories: ["Rings", "Necklaces", "Earrings", "Watches"],
    },
    {
        name: "Pet Supplies",
        icon: PawPrint,
        subcategories: ["Pet Food", "Toys", "Grooming", "Accessories"],
    },
];