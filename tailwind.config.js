/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#1B1F3B",
                amber: "#E8A33D",
                paper: "#FAF9F5",
                slate: "#5B6072",
            },
            fontFamily: {
                display: ["Fraunces", "serif"],
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};