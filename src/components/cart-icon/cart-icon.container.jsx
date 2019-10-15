import React from 'react'
// import { Mutation, Query } from 'react-apollo'
import { graphql } from 'react-apollo'
import { flowRight } from 'lodash'
import { gql } from 'apollo-boost'

import CartIcon from './cart-icon.component'

const TOGGLE_CART_HIDDEN = gql`
  mutation ToggleCartHidden {
    toggleCartHidden @client
  }
`

const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`

// Default way using query and mutation from 'react-apollo'
/* const CartIconContainer = () => (
  <Query query={GET_ITEM_COUNT}>
    {({data: { itemCount } }) => (
        <Mutation mutation={TOGGLE_CART_HIDDEN}>
        {toggleCartHidden => (
          <CartIcon toggleCartHidden={toggleCartHidden} itemCount={itemCount}/>
        )}
      </Mutation>
    )}
  </Query>
)

export default CartIconContainer
*/

// The other way, using flowRight from 'lodash'
const CartIconContainer = ({ data: { itemCount }, toggleCartHidden }) => {
  // console.log(props)
  return (
    <CartIcon toggleCartHidden={toggleCartHidden} itemCount={itemCount}/>
  )
}

export default flowRight(
  graphql(GET_ITEM_COUNT),
  graphql(TOGGLE_CART_HIDDEN, { name: 'toggleCartHidden' })
)(CartIconContainer)