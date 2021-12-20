const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLID, GraphQLNonNull } = graphql
const connection = require('../utils/connection')
const { defaultListArg } = require('../utils/handle_args')
const { ObjectID } = require('mongodb')
const { InsertType } = require('./common')

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: ()=>({
    _id: { type: GraphQLID },
    category: { type: GraphQLString }
  })
})

const CategoryQueryFields = {
  categories: {
    type: new GraphQLList(CategoryType),
    args: {
      skip: { type: GraphQLInt },
      limit: { type: GraphQLInt }
    },
    async resolve(parent, args){
      const conn = await connection('category')
      .catch((err)=>{ return null })
      const { skip, limit } = defaultListArg(args)
      return conn? await conn.db.find({})
      .skip(skip).limit(limit).toArray(): []
    }
  },
  categoryDetail: {
    type: CategoryType,
    args: { _id: { type: GraphQLID }, },
    async resolve(parent, args){
      const conn = await connection('category')
      .catch((err)=>{ return null })
      return conn? await conn.db.findOne(new ObjectID(args._id)): null
    }
  }
}

const CategoryMutationFields = {
  addCategory: {
    type: InsertType,
    args:{
      category: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args){
      const conn = await connection('category')
      .catch((err)=>{ return null })
      return conn? await conn.db.insertOne({ category: args.category }) : { acknowledged: false }
    }
  },
}

module.exports = {
  CategoryType,
  CategoryQueryFields,
  CategoryMutationFields
}
