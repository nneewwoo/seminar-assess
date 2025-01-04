import { FlipWords } from '@/components/ui/flip-words'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { Button } from '@/components/ui/moving-border'
import { WavyBackground } from '@/components/ui/wavy-background'

export default function Home() {
  return (
    <WavyBackground className='font-[family-name:var(--font-inter-sans)]'>
      <main className='max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-24'>
        <div className='mt-5 max-w-3xl text-center mx-auto'>
          <h1 className='block font-bold text-4xl text-white sm:text-5xl md:text-6xl lg:text-7xl text-white'>
            Your Opinion, <br /> Your{' '}
            <FlipWords
              className='text-amber-300'
              words={[
                'Seminar',
                'Experience',
                'Adventure',
                'Growth',
                'Learning'
              ]}
            />
          </h1>
        </div>
        <div className='mt-5 max-w-3xl text-center mx-auto'>
          <p className='text-md text-white/75 font-[family-name:var(--font-geist-mono)]'>
            Vote for the seminar topics that interest you most, and ensure the
            content aligns with your learning goals. Help us assess and meet
            your training needs.
          </p>
        </div>

        <div className='mt-8 gap-3 flex justify-center'>
          <Button
            borderClassName='rounded-full'
            className='px-6 h-full bg-black font-bold text-amber-300'>
            Download
          </Button>
        </div>
      </main>
    </WavyBackground>
  )
}
