import prisma from '../src/prisma'

const main = async () => {
  await prisma.vote.deleteMany()
  await prisma.session.deleteMany()
  await prisma.option.deleteMany()
  await prisma.question.deleteMany()
  await prisma.seminar.deleteMany()
  await prisma.course.deleteMany()
  await prisma.cycle.deleteMany()
  await prisma.user.deleteMany()

  const users = [
    {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password',
      phone: '(0912) 1234567'
    },
    {
      name: 'Jane Smith',
      email: 'janesmith@email.com',
      password: 'password',
      phone: '(0912) 2345678'
    },
    {
      name: 'Robert Brown',
      email: 'robertbrown@email.com',
      password: 'password',
      phone: '(0912) 3456789'
    },
    {
      name: 'Emily White',
      email: 'emilywhite@email.com',
      password: 'password',
      phone: '(0912) 4567890'
    },
    {
      name: 'Michael Johnson',
      email: 'michaeljohnson@email.com',
      password: 'password',
      phone: '(0912) 5678901'
    }
  ]

  const createdUsers = []
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user
    })
    createdUsers.push(createdUser)
  }

  const cycle = await prisma.cycle.create({
    data: {
      endsAt: new Date('2025-01-31T23:59:59.999Z')
    }
  })

  const courses = [
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Criminology',
    'Bachelor of Elementary Education',
    'Bachelor of Science in Food Technology',
    'Bachelor of Science in Fisheries'
  ]

  const createdCourses = []
  for (const courseName of courses) {
    const course = await prisma.course.create({
      data: {
        name: courseName
      }
    })
    createdCourses.push(course)
  }

  const seminarsData = [
    {
      title: 'Literacy',
      description: 'Enhancing reading, writing, and comprehension skills.',
      courseName: 'Bachelor of Elementary Education'
    },
    {
      title: 'Bakes and Pastries',
      description: 'Techniques in baking breads, cakes, and pastries.',
      courseName: 'Bachelor of Science in Food Technology'
    },
    {
      title: 'Fisheries Management',
      description: 'Knowledge and skills for sustainable fisheries management.',
      courseName: 'Bachelor of Science in Fisheries'
    },
    {
      title: 'Electronic Spreadsheet',
      description:
        'Basics and advanced features of electronic spreadsheets for data management.',
      courseName: 'Bachelor of Science in Computer Science'
    },
    {
      title: 'Self-Defense',
      description: 'Practical techniques for personal safety and self-defense.',
      courseName: 'Bachelor of Science in Criminology'
    }
  ]

  const createdSeminars = []
  for (const seminarData of seminarsData) {
    const course = createdCourses.find(
      (course) => course.name === seminarData.courseName
    )

    if (course) {
      const seminar = await prisma.seminar.create({
        data: {
          title: seminarData.title,
          description: seminarData.description,
          cycleId: cycle.id,
          courseId: course.id
        }
      })
      createdSeminars.push(seminar)
    }
  }

  const seminarToVoteFor = createdSeminars[0]

  await prisma.vote.createMany({
    data: [
      {
        userId: createdUsers[0].id,
        seminarId: seminarToVoteFor.id,
        cycleId: cycle.id
      },
      {
        userId: createdUsers[1].id,
        seminarId: seminarToVoteFor.id,
        cycleId: cycle.id
      },
      {
        userId: createdUsers[2].id,
        seminarId: seminarToVoteFor.id,
        cycleId: cycle.id
      },
      {
        userId: createdUsers[3].id,
        seminarId: createdSeminars[1].id,
        cycleId: cycle.id
      },
      {
        userId: createdUsers[4].id,
        seminarId: createdSeminars[2].id,
        cycleId: cycle.id
      }
    ]
  })

  const questionsData = [
    {
      title: 'Ano ang pinakamalawak na kahulugan ng literacy?',
      options: [
        { label: 'Kakayahang magsulat lamang', isCorrect: false },
        {
          label: 'Kakayahang magbasa, magsulat, at makaunawa',
          isCorrect: true
        },
        { label: 'Kakayahang magturo', isCorrect: false },
        { label: 'Kakayahang makinig', isCorrect: false }
      ]
    },
    {
      title:
        'Ano ang pangunahing benepisyo ng pagkakaroon ng mataas na literacy rate?',
      options: [
        { label: 'Mas maraming panahon sa paglalaro', isCorrect: false },
        { label: 'Mas malaking kita sa trabaho', isCorrect: false },
        {
          label: 'Mas malawak na oportunidad sa edukasyon at trabaho',
          isCorrect: true
        },
        { label: 'Mas maraming oras sa pakikipagkaibigan', isCorrect: false }
      ]
    }
  ]

  for (const question of questionsData) {
    await prisma.question.create({
      data: {
        text: question.title,
        seminarId: seminarToVoteFor.id,
        options: {
          create: question.options
        }
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
