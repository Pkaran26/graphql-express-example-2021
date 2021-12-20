const defaultListArg = (args)=>{
  let payload = { skip: 0, limit: 10 }

  if(args.skip)
    payload.skip = args.skip

  if(args.limit)
    payload.limit = args.limit

  return payload
}

module.exports = {
  defaultListArg
}
