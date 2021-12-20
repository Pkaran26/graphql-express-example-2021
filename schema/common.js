const graphql = require('graphql');
const { GraphQLObjectType,  GraphQLBoolean, GraphQLID } = graphql

const InsertType = new GraphQLObjectType({
  name: 'Insert',
  fields: ()=>({
    insertedId: { type: GraphQLID },
    acknowledged: { type: GraphQLBoolean }
  })
})

module.exports = {
  InsertType
}
