const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLID, GraphQLNonNull } = graphql
const connection = require('../utils/connection')
const { defaultListArg } = require('../utils/handle_args')
const { ObjectID } = require('mongodb')
const { InsertType } = require('./common')

const TagType = new GraphQLObjectType({
  name: 'Tag',
  fields: ()=>({
    _id: { type: GraphQLID },
    tags: { type: GraphQLString }
  })
})

const TagQueryFields = {
  tags: {
    type: new GraphQLList(TagType),
    args: {
      skip: { type: GraphQLInt },
      limit: { type: GraphQLInt }
    },
    async resolve(parent, args){
      const conn = await connection('tag')
      .catch((err)=>{ return null })
      const { skip, limit } = defaultListArg(args)
      return conn? await conn.db.find({})
      .skip(skip).limit(limit).toArray(): []
    }
  },
  tagDetail: {
    type: TagType,
    args: { _id: { type: GraphQLID }, },
    async resolve(parent, args){
      const conn = await connection('tag')
      .catch((err)=>{ return null })
      return conn? await conn.db.findOne(new ObjectID(args._id)): null
    }
  }
}

const TagMutationFields = {
  addTag: {
    type: InsertType,
    args:{
      tag: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(parent, args){
      const conn = await connection('tag')
      .catch((err)=>{ return null })
      return conn? await conn.db.insertOne({ tag: args.tag }) : { acknowledged: false }
    }
  },
}

module.exports = {
  TagType,
  TagQueryFields,
  TagMutationFields
}
