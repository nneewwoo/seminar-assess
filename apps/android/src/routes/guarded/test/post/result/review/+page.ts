import type { PageLoad } from './$types'

export const load: PageLoad = async ({ parent, url, depends }) => {
  const { review, over } = await parent()

  const index = Number(url.searchParams.get('index') || 0)
  depends('app:random')

  let lastIndex = false

  if (index >= over - 1) {
    lastIndex = true
  }

  return {
    index,
    lastIndex,
    question: review[index]
  }
}
