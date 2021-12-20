const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLInt, GraphQLID, GraphQLNonNull } = graphql
const connection = require('../utils/connection')
const { defaultListArg } = require('../utils/handle_args')
const { ObjectID } = require('mongodb')
const { InsertType } = require('./common')

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: ()=>({
    _id: { type: GraphQLID },
    first_name: { type: GraphQLString },
    last_name: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GraphQLString },
    dob: { type: GraphQLString },
    user_info: { type: GraphQLString },
    profile_pic: { type: GraphQLString }
  })
})

const UserQueryFields = {
  users: {
    type: new GraphQLList(UserType),
    args: {
      skip: { type: GraphQLInt },
      limit: { type: GraphQLInt }
    },
    async resolve(parent, args){
      const conn = await connection('user')
      .catch((err)=>{ return null })
      const { skip, limit } = defaultListArg(args)
      return conn? await conn.db.find({})
      .skip(skip).limit(limit).toArray(): []
    }
  },
  userDetail: {
    type: UserType,
    args: { _id: { type: GraphQLID }, },
    async resolve(parent, args){
      const conn = await connection('user')
      .catch((err)=>{ return null })
      return conn? await conn.db.findOne(new ObjectID(args._id)): null
    }
  }
}

const UserMutationFields = {
  addUser: {
    type: InsertType,
    args:{
      first_name: { type: new GraphQLNonNull(GraphQLString) },
      last_name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      gender: { type: new GraphQLNonNull(GraphQLString) },
      dob: { type: new GraphQLNonNull(GraphQLString) },
      user_info: { type: new GraphQLNonNull(GraphQLString) },
      profile_pic: { type: GraphQLString }
    },
    async resolve(parent, args){
      const conn = await connection('user')
      .catch((err)=>{ return null })
      const { first_name, last_name, email, gender, dob, user_info, profile_pic } = args
      return conn? await conn.db.insertOne({
        first_name, last_name, email, gender, dob, user_info, profile_pic
      }) : { acknowledged: false }
    }
  },
}

module.exports = {
  UserType,
  UserQueryFields,
  UserMutationFields
}
