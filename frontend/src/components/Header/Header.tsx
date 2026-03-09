import type { Category, CartItem } from "../../types";
import CartOverlay from "../Cart/CartOverlay";
import "./Header.css";

interface HeaderProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  updateQuantity: (index: number, delta: number) => void;
}

function Header({
  categories,
  activeCategory,
  onCategoryChange,
  cartItems,
  cartOpen,
  setCartOpen,
  updateQuantity,
}: HeaderProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <nav className="header-nav">
        {categories.map((cat) => (
          <a
            key={cat.name}
            data-testid={
              cat.name === activeCategory
                ? "active-category-link"
                : "category-link"
            }
            className={`nav-link ${cat.name === activeCategory ? "active" : ""}`}
            onClick={() => onCategoryChange(cat.name)}
          >
            {cat.name}
          </a>
        ))}
      </nav>

      <div className="header-logo">
        <img
          src="/logo.png"
          alt="logo"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      </div>

      <div className="header-actions">
        <button
          data-testid="cart-btn"
          className="cart-btn"
          onClick={() => setCartOpen(!cartOpen)}
        >
          🛒
          {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </button>
      </div>

      {cartOpen && (
        <CartOverlay
          cartItems={cartItems}
          updateQuantity={updateQuantity}
          onClose={() => setCartOpen(false)}
        />
      )}
    </header>
  );
}

export default Header;
