import { useState, useEffect } from "react";
import type { Product } from "../../types";
import { graphqlRequest } from "../../graphql/client";
import { GET_PRODUCT } from "../../graphql/queries";
import "./ProductPage.css";

interface ProductPageProps {
  productId: string;
  onAddToCart: (
    product: Product,
    selectedAttributes: { [key: string]: string },
  ) => void;
}

function ProductPage({ productId, onAddToCart }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedAttributes, setSelectedAttributes] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    graphqlRequest<{ product: Product }>(GET_PRODUCT, { id: productId }).then(
      (data) => {
        setProduct(data.product);
        setSelectedImage(data.product.gallery[0]);
        setSelectedAttributes({});
      },
    );
  }, [productId]);

  if (!product) return <div>Loading...</div>;

  const allSelected = product.attributes.every(
    (attr) => selectedAttributes[attr.id] !== undefined,
  );

  const handleAddToCart = () => {
    if (!allSelected) return;
    onAddToCart(product, selectedAttributes);
  };

  const parseDescription = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="product-page">
      <div className="product-gallery" data-testid="product-gallery">
        <div className="gallery-thumbnails">
          {product.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${product.name} ${i}`}
              className={`thumbnail ${selectedImage === img ? "active" : ""}`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
        <div className="gallery-main">
          <button
            className="arrow left"
            onClick={() => {
              const idx = product.gallery.indexOf(selectedImage);
              setSelectedImage(
                product.gallery[
                  (idx - 1 + product.gallery.length) % product.gallery.length
                ],
              );
            }}
          >
            &#8249;
          </button>
          <img src={selectedImage} alt={product.name} className="main-image" />
          <button
            className="arrow right"
            onClick={() => {
              const idx = product.gallery.indexOf(selectedImage);
              setSelectedImage(
                product.gallery[(idx + 1) % product.gallery.length],
              );
            }}
          >
            &#8250;
          </button>
        </div>
      </div>

      <div className="product-details">
        <h1 className="product-brand">{product.brand}</h1>
        <h2 className="product-name">{product.name}</h2>

        {product.attributes.map((attr) => (
          <div
            key={attr.id}
            data-testid={`product-attribute-${(attr.name ?? "").toLowerCase().replace(/\s+/g, "-")}`}
            className="attribute-section"
          >
            <p className="attribute-name">{(attr.name ?? "").toUpperCase()}:</p>
            <div className="attribute-items">
              {attr.items.map((item) => {
                const isSelected = selectedAttributes[attr.id] === item.value;
                return attr.type === "swatch" ? (
                  <div
                    key={item.value}
                    className={`swatch-btn ${isSelected ? "selected" : ""}`}
                    style={{ backgroundColor: item.value }}
                    onClick={() =>
                      setSelectedAttributes({
                        ...selectedAttributes,
                        [attr.id]: item.value,
                      })
                    }
                    title={item.displayValue}
                  />
                ) : (
                  <button
                    key={item.value}
                    className={`size-btn ${isSelected ? "selected" : ""}`}
                    onClick={() =>
                      setSelectedAttributes({
                        ...selectedAttributes,
                        [attr.id]: item.value,
                      })
                    }
                  >
                    {item.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="price-section">
          <p className="price-label">PRICE:</p>
          <p className="price-value">
            {product.prices[0]?.currencySymbol}
            {product.prices[0]?.amount.toFixed(2)}
          </p>
        </div>

        <button
          data-testid="add-to-cart"
          className={`add-to-cart-btn ${!allSelected || !product.inStock ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={!allSelected || !product.inStock}
        >
          {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
        </button>

        <div data-testid="product-description" className="product-description">
          {parseDescription(product.description)}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
