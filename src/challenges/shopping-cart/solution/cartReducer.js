export const initialCartState = { items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const { product } = action;
      const exists = state.items.some((item) => item.id === product.id);
      if (exists) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { id: product.id, name: product.name, price: product.price, quantity: 1 },
        ],
      };
    }
    case "increment":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      };
    case "decrement":
      return {
        ...state,
        items: state.items
          .map((item) => (item.id === action.id ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0),
      };
    case "remove":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "clear":
      return { ...state, items: [] };
    default:
      return state;
  }
}
