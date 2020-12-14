// creates random ID for ID schema
//import { v4 as uuidv4 } from 'uuid';

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'

const Mutation = {
    async login(parent, args, {prisma, req}, info){
        
        const user = await prisma.query.user({
            where: {
                email: args.data.email
            }
        })

        if(!user){
            throw new Error("Unable to login")
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)
        
        if(!isMatch){
            throw new Error('Unable to Login')
        }

        return {
            user,
            token: jwt.sign({
                userId: user.id
            },'thisisasecret')
        }
    
    },
    async createUser(parent, args, {db, prisma}, info){

        const password = await hashPassword(args.data.password)

        const user = await prisma.mutation.createUser({
            data: {
                ...args.data,
                password
            }
        })

        return {
            user,
            token: jwt.sign({
                userId: user.id
            }, 'thisisasecret')
        }
      
    },
    createPost(parent, args, {db, pubsub, prisma, req}, info){
        
        const userId = getUserId(req)

        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect:{
                        id: userId
                    }
                }
            }
        }, info)
        
    },
    async createComment(parent, args, {db, pubsub, prisma, req}, info){
        
        const userId = getUserId(req)
        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })

        if(!postExists){
            throw new Error('Unable to find post!')
        }

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post:{
                    connect:{
                        id: args.data.post
                    }
                }
            }
        }, info)
    },
    async updateUser(parents, args, {db, prisma, req}, info){
        
        const userId = getUserId(req)

        if(typeof args.data.password === 'string'){
            args.data.password = await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where:{
                id: userId
            },
            data: args.data
        }, info)
        
    },
    async updatePost(parent, args, {db, pubsub, prisma, req}, info){

        const userId = getUserId(req)
        const postExists = await prisma.exists.Post({
            id: args.id,
            author:{
                id: userId
            }
        })

        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })

        if(isPublished && args.data.published === false){
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }

        if (!postExists){
            throw new Error("Unable to update post!")
        }

        return prisma.mutation.updatePost({
            where:{
                id: args.id
            },
            data: args.data
        }, info)

    },
    async updateComment(parent, args, {db, pubsub, prisma, req}, info){
        
        const userId = getUserId(req)
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author:{
                id: userId
            }
        })

        return prisma.mutation.updateComment({
            where:{
                id: args.id
            },
            data: args.data
        }, info)
        
    },
    async deleteUser(parent, args, {db, prisma, req}, info){

        const userId = getUserId(req);

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info)

    },
    async deletePost(parent, args, {db, pubsub, prisma, req}, info){
        
        const userId = getUserId(req);
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        })

        if(!postExists){
            throw new Error('Unable to Delete Post!')
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
        
    },
    async deleteComment(parent, args, {db, pubsub, prisma, req}, info){

        const userId = getUserId(req);
        const commentExists = await prisma.exists.Comment({
            id: args.id,
            author:{
                id: userId
            }
        })

        if(!commentExists){
            throw new Error('Unable to delete comment');
        }

        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)

    }
}

export { Mutation as default }