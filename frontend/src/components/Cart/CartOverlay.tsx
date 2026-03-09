import type { CartItem } from "../../types";
import { graphqlRequest } from "../../graphql/client";
import { PLACE_ORDER } from "../../graphql/queries";
import "./CartOverlay.css";

interface CartOverlayProps {
  cartItems: CartItem[];
  updateQuantity: (index: number, delta: number) => void;
  onClose: () => void;
}

function CartOverlay({ cartItems, updateQuantity, onClose }: CartOverlayProps) {
  const total = cartItems.reduce((sum, item) => {
    const price = item.product.prices[0]?.amount ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const symbol = cartItems[0]?.product.prices[0]?.currencySymbol ?? "$";

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    const items = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    await graphqlRequest(PLACE_ORDER, { items });
    alert("Order placed successfully!");
    onClose();
  };

  return (
    <div className="cart-overlay">
      <h3 className="cart-title">
        <strong>My Bag</strong>, {totalItems}{" "}
        {totalItems === 1 ? "Item" : "Items"}
      </h3>

      <div className="cart-items">
        {cartItems.map((item, index) => (
          <div key={index} className="cart-item">
            <div className="cart-item-info">
              <p className="cart-item-brand">{item.product.brand ?? ""}</p>
              <p className="cart-item-name">{item.product.name ?? ""}</p>
              <p className="cart-item-price">
                {symbol}
                {item.product.prices[0]?.amount.toFixed(2)}
              </p>

              {item.product.attributes.map((attr) => {
                const attrName = attr.name ?? "";
                const kebabAttr = attrName.toLowerCase().replace(/\s+/g, "-");
                return (
                  <div
                    key={attr.id}
                    data-testid={`cart-item-attribute-${kebabAttr}`}
                    className="cart-attr"
                  >
                    <p className="cart-attr-name">{attrName}:</p>
                    <div className="cart-attr-items">
                      {attr.items.map((attrItem) => {
                        const attrValue = attrItem.value ?? "";
                        const kebabValue = attrValue
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        const isSelected =
                          item.selectedAttributes[attr.id] === attrItem.value;
                        return attr.type === "swatch" ? (
                          <div
                            key={attrItem.value}
                            data-testid={
                              isSelected
                                ? `cart-item-attribute-${kebabAttr}-${kebabValue}-selected`
                                : `cart-item-attribute-${kebabAttr}-${kebabValue}`
                            }
                            className={`swatch-item ${isSelected ? "selected" : ""}`}
                            style={{ backgroundColor: attrItem.value ?? "" }}
                          />
                        ) : (
                          <div
                            key={attrItem.value}
                            data-testid={
                              isSelected
                                ? `cart-item-attribute-${kebabAttr}-${kebabValue}-selected`
                                : `cart-item-attribute-${kebabAttr}-${kebabValue}`
                            }
                            className={`text-item ${isSelected ? "selected" : ""}`}
                          >
                            {attrItem.value}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-item-controls">
              <button
                data-testid="cart-item-amount-increase"
                className="qty-btn"
                onClick={() => updateQuantity(index, 1)}
              >
                +
              </button>
              <span data-testid="cart-item-amount">{item.quantity}</span>
              <button
                data-testid="cart-item-amount-decrease"
                className="qty-btn"
                onClick={() => updateQuantity(index, -1)}
              >
                -
              </button>
            </div>

            <img
              src={item.product.gallery[0]}
              alt={item.product.name ?? ""}
              className="cart-item-image"
            />
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total</span>
          <span data-testid="cart-total">
            {symbol}
            {total.toFixed(2)}
          </span>
        </div>
        <button
          className={`place-order-btn ${cartItems.length === 0 ? "disabled" : ""}`}
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          PLACE ORDER
        </button>
      </div>
    </div>
  );
}

export default CartOverlay;
