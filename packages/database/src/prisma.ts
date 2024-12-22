import { PrismaClient, type User } from '@prisma/client'

declare global {
  var __prisma: PrismaClient
  var Bun: typeof import('bun')
}

const prisma =
  globalThis.__prisma ??
  new PrismaClient().$extends({
    query: {
      user: {
        async $allOperations({ operation, args, query }) {
          if ('data' in args) {
            const data = args.data as Partial<User>
            if (
              ['create', 'update'].includes(operation) &&
              data.password &&
              typeof data.password === 'string'
            ) {
              data.password = await Bun.password.hash(data.password)
            }
          }
          return await query(args)
        }
      }
    }
  })

if (process.env.NODE_ENV === 'development') {
  globalThis.__prisma = prisma
}

export default prisma
