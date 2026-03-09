import { useState, useEffect } from "react";
import type { Product, Category, CartItem } from "./types";
import { graphqlRequest } from "./graphql/client";
import { GET_CATEGORIES } from "./graphql/queries";
import Header from "./components/Header/Header.tsx";
import CategoryPage from "./pages/CategoryPage/CategoryPage.tsx";
import ProductPage from "./pages/ProductPage/ProductPage.tsx";
import "./app.css";

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<"category" | "product">(
    "category",
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    graphqlRequest<{ categories: Category[] }>(GET_CATEGORIES).then((data) => {
      setCategories(data.categories);
    });
  }, []);

  const addToCart = (
    product: Product,
    selectedAttributes: { [key: string]: string },
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.selectedAttributes) ===
            JSON.stringify(selectedAttributes),
      );
      if (existing) {
        return prev.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { product, selectedAttributes, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity += delta;
      if (updated[index].quantity <= 0) updated.splice(index, 1);
      return updated;
    });
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage("product");
    setCartOpen(false);
  };

  const navigateToCategory = (category: string) => {
    setActiveCategory(category);
    setCurrentPage("category");
    setCartOpen(false);
  };

  return (
    <div className="app">
      <Header
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={navigateToCategory}
        cartItems={cartItems}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        updateQuantity={updateQuantity}
      />
      {cartOpen && (
        <div className="overlay" onClick={() => setCartOpen(false)} />
      )}
      <main className="main-content">
        {currentPage === "category" ? (
          <CategoryPage
            category={activeCategory}
            onProductClick={navigateToProduct}
            onAddToCart={addToCart}
          />
        ) : (
          <ProductPage
            productId={selectedProductId!}
            onAddToCart={(product, attrs) => {
              addToCart(product, attrs);
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
