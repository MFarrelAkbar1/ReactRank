export const initialCartState = { items: [] };

// Each cart item looks like: { id, name, price, quantity }
//
// Actions:
//   { type: "add", product }   add the product with quantity 1, or increase its quantity by 1
//   { type: "increment", id }  quantity + 1
//   { type: "decrement", id }  quantity - 1, remove the item when it reaches 0
//   { type: "remove", id }     remove the item
//   { type: "clear" }          empty the cart
//
// Never mutate `state`. Always return a new object.
export function cartReducer(state, action) {
  switch (action.type) {
    // TODO: handle every action
    default:
      return state;
  }
}
