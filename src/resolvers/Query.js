const Query = {
    users(parent, args, {db, prisma}, info){

        const opArgs = {}

        // Find name where ex: args.query == 'bon' then display in query users with 'bon names
        // Find OR email in query
        if (args.query){
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                },{
                    email_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info)

        // if(!args.query){
        //     return db.users
        // }

        // return db.users.filter((user) => {
        //     return user.name.toLowerCase().includes(args.query.toLowerCase())
        // })

    },
    me() {
       return{
           id: '5345fsdf43dff',
           name: 'Bon',
           email: 'compromiseddoctrines@gmail.com',
           age: 28
       }
   },
   posts(parent, args, {db, prisma}, info) {

        const opArgs ={}

        if(args.query){
            opArgs.where={
                OR: [{
                    title_contains: args.query
                },{
                    body_contains: args.query
                }]
            }
        }

        return prisma.query.posts(opArgs, info)

        // if(!args.query){
        //     return db.posts
        // }
   },
   comments(parent, args, {db, prisma}, info){

        return prisma.query.comments(null, info)

    //    return db.comments
   }

}

export { Query as default }