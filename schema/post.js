const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull } = graphql
const connection = require('../utils/connection')
const { CategoryType } = require('./category')
const { TagType } = require('./tag')
const { UserType } = require('./user')
const { defaultListArg } = require('../utils/handle_args')
const { ObjectID } = require('mongodb')
const { InsertType } = require('./common')

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: ()=>({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    image: { type: GraphQLString },
    intro: { type: GraphQLString },
    body: { type: GraphQLString },
    publish_at: { type: GraphQLString },
    likes: { type: GraphQLInt },
    comments: { type: GraphQLInt },
    tags: {
      type: new GraphQLList(TagType),
      async resolve(parent, args){
        const conn = await connection('tag')
        .catch((err)=>{ return null })
        return conn? await conn.db.find({ _id: { $in: [...parent.tags] } }).toArray(): []
      }
    },
    author: {
      type: UserType,
      async resolve(parent, args){
        const conn = await connection('user')
        .catch((err)=>{ return null })
        return conn? await conn.db.findOne(parent.author_id): null
      }
    },
    category: {
      type: CategoryType,
      async resolve(parent, args){
        const conn = await connection('category')
        .catch((err)=>{ return null })
        return conn? await conn.db.findOne(parent.category_id): null
      }
    }
  })
})

const PostQueryFields = {
  posts: {
    type: new GraphQLList(PostType),
    args: {
      skip: { type: GraphQLInt },
      limit: { type: GraphQLInt }
    },
    async resolve(parent, args){
      const conn = await connection('post')
      .catch((err)=>{ return null })
      const { skip, limit } = defaultListArg(args)
      return conn? await conn.db.find({})
      .skip(skip).limit(limit).toArray(): []
    }
  },
  postDetail: {
    type: PostType,
    args: { _id: { type: GraphQLID }, },
    async resolve(parent, args){
      const conn = await connection('post')
      .catch((err)=>{ return null })
      return conn? await conn.db.findOne(new ObjectID(args._id)): null
    }
  }
}

const PostMutationFields = {
  addPost: {
    type: InsertType,
    args:{
      title: { type: new GraphQLNonNull(GraphQLString) },
      image: { type: new GraphQLNonNull(GraphQLString) },
      intro: { type: new GraphQLNonNull(GraphQLString) },
      body: { type: new GraphQLNonNull(GraphQLString) },
      tags: { type: new GraphQLList(GraphQLID) },
      category_id: { type: new GraphQLNonNull(GraphQLID) },
      author_id: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args){
      const conn = await connection('post')
      .catch((err)=>{ return null })
      const { title, image, intro, body, category_id, author_id } = args
      const tags = args.tags.length > 0? args.tags.map((e)=>{
        return new ObjectID(e)
      }) : []
      return conn? await conn.db.insertOne({
        title, image, intro, body,
        publish_at: "2020/05/05", likes: 0, comments: 0,
        tags,
        category_id: new ObjectID(category_id),
        author_id: new ObjectID(author_id)
      }) : { acknowledged: false }
    }
  },
}

module.exports = {
  PostType,
  PostQueryFields,
  PostMutationFields
}
