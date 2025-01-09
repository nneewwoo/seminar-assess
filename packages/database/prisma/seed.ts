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
