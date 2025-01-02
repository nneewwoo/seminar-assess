import prisma from '../src/prisma'

const main = async () => {
  await prisma.user.create({
    data: {
      givenName: 'Juan',
      familyName: 'Dela Cruz',
      email: 'email@email.com',
      password: 'password',
      phone: '(0912) 3456789'
    }
  })

  await prisma.cycle.create({
    data: {
      endsAt: new Date('2025-01-31T23:59:59.999Z')
    }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    await prisma.$disconnect()
    console.error(error)
    process.exit(1)
  })
