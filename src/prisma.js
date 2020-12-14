import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    fragmentReplacements
})

export { prisma as default }

// prisma.exists.Comment({
//     id: "ckikjgfh600jv0942lololfuo",
//     text: "test",
//     author: {
//         id: "testid"
//     }
// }).then((exists) => {
//     console.log(exists)
// })

// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({
//         id: authorId
//     });

//     if (!userExists) {
//         throw new Error("User doesn't Exists!");
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             title: data.title,
//             body: data.body,
//             published: data.published,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author { id name email posts { id title published } } }')

//     return post.author
// }

// createPostForUser('ckik7ng5p00bc0942nibo7vr5',{
//     title: "testing for async await",
//     body: "This is tested with async await promise",
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message);
// });


// const updatePostForUser = async (postId, data) => {

//     const postExists = await prisma.exists.Post({
//         id: postId
//     })

//     if(!postExists) {
//         throw new Error('Post does not Exist!')
//     }

//     const post = await prisma.mutation.updatePost({
//         where: {
//             id: postId
//         },
//         data
//     }, '{ author { id name email posts { id title published } }}')

//     return post.author
// }

// updatePostForUser('ckik7p8w800bn0942dlk99apo', { published: true}).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })



//// This is for querying via then
// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// })
// prisma.query.comments(null, '{ id text author { name } post { title } }').then((data) =>{
//     console.log(JSON.stringify(data, undefined, 2))
// })
// prisma.mutation.createPost({
//     data: {
//         title: "This is created by prisma mutation",
//         body: "You can find this on postgres db",
//         published: true,
//         author: {
//             connect: {
//                 id: "ckik7ng5p00bc0942nibo7vr5"
//             }
//         }
//     }
// }, '{ id title body}').then((data) => {
//     console.log(data)
//     prisma.query.users(null, '{ id name posts {id title} }')
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2))
// });
// prisma.mutation.updatePost({
//     where: {
//         id: "ckik7p8w800bn0942dlk99apo"
//     },
//     data: {
//         body: "This is how to get state with graphql...",
//         published: true
//     }
// }, '{ id }').then((data) => {
//     return prisma.query.posts(null, '{ id title body published }')
// }).then((data) => {
//     console.log(data);
// })