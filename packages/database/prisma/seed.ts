import prisma from '../src/prisma'

const main = async () => {
  await prisma.user.deleteMany()
  await prisma.cycle.deleteMany()
  await prisma.course.deleteMany()

  await prisma.user.create({
    data: {
      name: 'Juan S. Dela Cruz',
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

  const courses = [
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Criminology',
    'Bachelor of Elementary Education ',
    'Bachelor of Science in Food Technology',
    'Bachelor of Science in Fisheries'
  ]

  for (const course of courses) {
    await prisma.course.create({
      data: {
        name: course
      }
    })
  }
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
