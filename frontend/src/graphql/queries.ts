export const GET_CATEGORIES = `
  query {
    categories {
      name
    }
  }
`;

export const GET_PRODUCTS = `
  query GetProducts($category: String) {
    products(category: $category) {
      id
      name
      inStock
      brand
      gallery
      prices {
        amount
        currencyLabel
        currencySymbol
      }
      attributes {
        id
        name
        type
        items {
          displayValue
          value
        }
      }
    }
  }
`;

export const GET_PRODUCT = `
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      description
      brand
      gallery
      prices {
        amount
        currencyLabel
        currencySymbol
      }
      attributes {
        id
        name
        type
        items {
          displayValue
          value
        }
      }
    }
  }
`;

export const PLACE_ORDER = `
  mutation PlaceOrder($items: [OrderItemInput!]!) {
    placeOrder(items: $items)
  }
`;
