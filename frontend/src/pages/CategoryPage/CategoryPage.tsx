import { useState, useEffect } from "react";
import type { Product } from "../../types";
import { graphqlRequest } from "../../graphql/client";
import { GET_PRODUCTS } from "../../graphql/queries";
import "./CategoryPage.css";

interface CategoryPageProps {
  category: string;
  onProductClick: (id: string) => void;
  onAddToCart: (
    product: Product,
    selectedAttributes: { [key: string]: string },
  ) => void;
}

function CategoryPage({
  category,
  onProductClick,
  onAddToCart,
}: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    graphqlRequest<{ products: Product[] }>(GET_PRODUCTS, { category }).then(
      (data) => {
        setProducts(data.products.filter((p) => p.name !== null));
      },
    );
  }, [category]);

  const handleQuickShop = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultAttributes: { [key: string]: string } = {};
    product.attributes.forEach((attr) => {
      defaultAttributes[attr.id] = attr.items[0]?.value ?? "";
    });
    onAddToCart(product, defaultAttributes);
  };

  return (
    <div className="category-page">
      <h1 className="category-title">{category}</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div
            key={product.id}
            data-testid={`product-${(product.name ?? "").toLowerCase().replace(/\s+/g, "-")}`}
            className={`product-card ${!product.inStock ? "out-of-stock" : ""}`}
            onClick={() => onProductClick(product.id)}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="product-image-wrapper">
              <img
                src={product.gallery[0]}
                alt={product.name}
                className={`product-image ${!product.inStock ? "greyed" : ""}`}
              />
              {!product.inStock && (
                <div className="out-of-stock-label">OUT OF STOCK</div>
              )}
              {product.inStock && hoveredId === product.id && (
                <button
                  className="quick-shop-btn"
                  onClick={(e) => handleQuickShop(e, product)}
                >
                  🛒
                </button>
              )}
            </div>
            <div className="product-info">
              <p className="product-name">
                {product.brand} {product.name}
              </p>
              <p className="product-price">
                {product.prices[0]?.currencySymbol}
                {product.prices[0]?.amount.toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
