// A resolver is an object that we can pass to our client that lets it know what values to 'resolve'
// depending on what mutations or queries gets called from the local client side
import { gql } from 'apollo-boost'

// We copied the cart.utils from Redux into the graphql folder to use it here
import { addItemToCart, getCartItemCount } from './cart.utils'

// Define the schema that the local side is going to use
// extend the types of mutation that might exists in the back end
export const typeDefs = gql`
# Add item to cart
  extend type Item {
    quantity: Int
  }

# Toggle Cart display
  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [Item]!
  }
`;

// @client tells apollo that it its something to look for in the local cache
const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`;

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`


const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`;

/*
root = top level object that holds the actual type - like collections inside the item
the collections is the parent of the items, so it is the root
args = the arguments that we could possibily get access to / the variables that get passed
context = the apollo client has access to, like the cache and the client itself we are using { cache } because it is the only thing we need
info = information about our query. Example:
Mutation: {
  toggleCartHidden: (_root, _args, _context, _info) =>
} */

// CHECK the HEADER component to see it in use
// toggleCartHidden is not capitalized because only the above is a type definition
export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, { cache }) => {
      // data = cartHidden
      const { cartHidden } = cache.readQuery({
        query: GET_CART_HIDDEN
      });

      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: { cartHidden: !cartHidden }
      });

      return !cartHidden;
    },

    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS
      });

      const newCartItems = addItemToCart(cartItems, item)

      cache.writeQuery({
        query: GET_ITEM_COUNT,
        data: { itemCount: getCartItemCount(newCartItems) }
      });

      cache.writeQuery({
        query: GET_CART_ITEMS,
        data: { cartItems: newCartItems }
      });

      return newCartItems;
    }
  }
}