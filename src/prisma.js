import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
})

export { prisma as default }

prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
    console.log(JSON.stringify(data, undefined, 2))
})

prisma.query.comments(null, '{ id text author { name } post { title } }').then((data) =>{
    console.log(JSON.stringify(data, undefined, 2))
})