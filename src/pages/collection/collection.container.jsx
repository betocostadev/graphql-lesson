// HOC component that we will use to pass the collection data for the collection page
// We will be using it on the Shop Page Component
import React from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

import CollectionPage from './collection.component'
import Spinner from '../../components/spinner/spinner.component'

const GET_COLLECTION_BY_TITLE = gql`
  query getCollectionsByTitle($title: String!) {
    getCollectionsByTitle(title: $title) {
      id
      title
      items {
        id
        name
        price
        imageUrl
      }
    }
  }
`

// The variables are the way we pass the variables that our query is expecting
// as above in the getCollectionsByTitle($title: String!)
const CollectionPageContainer = ({ match }) => (
  <Query query={GET_COLLECTION_BY_TITLE} variables={{ title : match.params.collectionId }}>
    {
      ({loading, data}) => {
        // loading
        // ? return <Spinner />
        // : return <CollectionPage />
        if (loading) return <Spinner />
        const { getCollectionsByTitle } = data
        return <CollectionPage collection={getCollectionsByTitle} />
      }
    }
  </Query>
)

export default CollectionPageContainer