import prisma from '../src/prisma'

const main = async () => {
  await prisma.participation.deleteMany()
  await prisma.evaluationAnswer.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.session.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.option.deleteMany()
  await prisma.question.deleteMany()
  await prisma.seminar.deleteMany()
  await prisma.course.deleteMany()
  await prisma.cycle.deleteMany()
  await prisma.user.deleteMany()
  await prisma.evaluationQuestion.deleteMany()
  await prisma.evaluation.deleteMany()

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

  const cycle = await prisma.cycle.create({
    data: {
      endsAt: new Date(Date.now() + 1000 * 60 * 5)
    }
  })

  const createdUsers = []
  for (const user of users) {
    const createdUser = await prisma.user.create({
      data: user
    })
    await prisma.participation.create({data: {
      userId: createdUser.id,
      cycleId: cycle.id
    }})
    createdUsers.push(createdUser)
  }

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

  type Evaluation = {
    title: string
    type: 'RATING' | 'FEEDBACK'
    questions: string[]
    description: string
  }

  const evaluations: Evaluation[] = [
    {
      title: 'The Topic',
      description:
        'Evaluate the relevance, organization, and presentation of the training topic.',
      questions: [
        'The topic is relevant to my personal or work needs.',
        'The delivery of the topic is well-organized and systematic.',
        'The presentation or demo shown aligns with the training objectives.',
        'There are opportunities to ask questions for better understanding.'
      ],
      type: 'RATING'
    },
    {
      title: 'The Trainer',
      description:
        'Assess the trainer’s knowledge, delivery, and ability to engage participants.',
      questions: [
        'The trainer demonstrates knowledge of the topic.',
        'The trainer ensures that the information provided is accurate and credible.',
        'The trainer delivers the topic clearly and understandably.',
        'The trainer explains well and speaks smoothly.',
        'The trainer answers questions clearly and makes the answers understandable to the participants.',
        'The trainer inspires participants to become interested in the topic.'
      ],
      type: 'RATING'
    },
    {
      title: 'The Facilitators',
      description:
        'Evaluate the professionalism, helpfulness, and group management of the facilitators.',
      questions: [
        'The facilitators show professionalism in assisting with the training or seminar.',
        'The facilitators are respectful, patient, and helpful to the participants.',
        'The facilitators create a conducive and comfortable environment for learning new information.',
        'The facilitators manage the entire group to ensure a smooth flow of the training.'
      ],
      type: 'RATING'
    },
    {
      title: 'The Accommodation and Food',
      description:
        'Provide feedback on the quality of the food and the comfort of the accommodations.',
      questions: [
        'The food provided is of good quality and nutritious.',
        'The accommodations ensure the comfort of the training participants.',
        'The training venue is appropriate and comfortable. (There are no distractions for the participants.)'
      ],
      type: 'RATING'
    },
    {
      title: 'General Satisfaction',
      description:
        'Rate your overall satisfaction with the training experience.',
      questions: [
        'This training has met my expectations.',
        'This training is one of the best I have attended.',
        'This training has improved my knowledge, and I will continue applying what I have learned.'
      ],
      type: 'RATING'
    },
    {
      title: 'Feedback',
      description:
        'Share your personal feedback and suggestions for improvement.',
      questions: [
        'What part of the training did you like the most?',
        'What else would you like us to improve or add to our training?'
      ],
      type: 'FEEDBACK'
    }
  ]

  for (let i = 0; i < evaluations.length; i++) {
    const evaluation = await prisma.evaluation.create({
      data: {
        title: evaluations[i].title,
        type: evaluations[i].type,
        description: evaluations[i].description
      }
    })
    for (let j = 0; j < evaluations[i].questions.length; j++) {
      await prisma.evaluationQuestion.create({
        data: {
          text: evaluations[i].questions[j],
          evaluationId: evaluation.id
        }
      })
    }
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
