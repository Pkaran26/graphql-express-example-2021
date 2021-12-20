const graphql = require('graphql');
const connection = require('../utils/connection')
const { GraphQLObjectType, GraphQLID, GraphQLSchema, GraphQLList } = graphql
const { CategoryType, CategoryQueryFields, CategoryMutationFields } = require('./category')
const { TagType, TagQueryFields, TagMutationFields } = require('./tag')
const { UserType, UserQueryFields, UserMutationFields } = require('./user')
const { PostType, PostQueryFields, PostMutationFields } = require('./post')

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...CategoryQueryFields,
    ...TagQueryFields,
    ...UserQueryFields,
    ...PostQueryFields
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...CategoryMutationFields,
    ...TagMutationFields,
    ...UserMutationFields,
    ...PostMutationFields
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
