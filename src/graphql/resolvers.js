// A resolver is an object that we can pass to our client that lets it know what values to 'resolve'
// depending on what mutations or queries gets called from the local client side
import { gql } from 'apollo-boost'

// Define the schema that the local side is going to use
// extend the types of mutation that might exists in the back end
export const typeDefs = gql`
  extend type Mutation {
    ToggleCartHidden: Boolean!
  }
`

// @client tells apollo that it its something to look for in the local cache
const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`

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
      })

      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: { cartHidden: !cartHidden }
      })

      return !cartHidden
    }
  }
}