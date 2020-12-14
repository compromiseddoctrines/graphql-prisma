import getUserId from '../utils/getUserId'

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
    async post(parent, args, { prisma, req}, info){
        const userId = getUserId(req, false)

        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                    published: true
                },{
                    author: {
                        id: userId
                    }
                }]
            }
        }, info)

        if(posts.length === 0){
            throw new Error("Post not found!")
        }

        return posts[0]
    },
    me(parent, args, {prisma, req}, info) {
        const userId = getUserId(req)

        return prisma.query.user({
           where: {
               id: userId
           }
        })
   },
   myPosts(parent, args, {prisma, req}, info){
        const userId = getUserId(req);
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }

        if(args.query){
            opArgs.where.OR =[{
                title_contains: args.query
            },{
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info)
   },
   posts(parent, args, {db, prisma}, info) {

        const opArgs = {
            where: {
                published: true
            }
        }

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