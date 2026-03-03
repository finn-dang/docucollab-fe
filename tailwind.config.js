module.exports = {
  theme: {
    extend: {
      colors: {
        "table-header": "#f9fafb",
        "table-border": "#e5e7eb",
        "table-hover": "#fef3c7",
        "table-selected": "#dbeafe",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-from-bottom-4": {
          from: { transform: "translateY(16px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in-from-bottom-4": "slide-in-from-bottom-4 0.3s ease-out",
      },
    },
  },
};
