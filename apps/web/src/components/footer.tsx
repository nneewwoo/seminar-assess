export default function Footer() {
  return (
    <footer className='w-full mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='py-12 border-t border-white/5'>
        <div className='flex flex-wrap justify-between items-start gap-2'>
          <div className='w-full md:w-fit block'>
            <a
              className='flex-none font-semibold text-xl text-amber-300 focus:outline-none focus:opacity-80'
              href='/'
              aria-label='Brand'>
              Seminar Assess
            </a>
            <p className='mt-3 text-xs sm:text-sm text-white/80'>© 2025</p>
            <p className='mt-3 text-xs sm:text-sm text-white/80'>
              A project of students from Capiz State University - Dayao
              Satellite College
            </p>
          </div>

          <ul className='flex flex-wrap items-center mt-8 md:mt-0'>
            <li className='inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-gray-400 dark:text-neutral-500 dark:before:bg-neutral-600'>
              <a
                className='text-xs text-[#E2725B] underline hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400'
                href='/terms-of-service'>
                Terms
              </a>
            </li>
            <li className='inline-block relative pe-4 text-xs last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-1.5 before:-translate-y-1/2 before:size-[3px] before:rounded-full before:bg-gray-400 dark:text-neutral-500 dark:before:bg-neutral-600'>
              <a
                className='text-xs text-[#E2725B] underline hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400'
                href='/privacy-policy'>
                Privacy
              </a>
            </li>
            <li className='inline-block text-xs'>
              <a
                className='text-xs text-[#E2725B] underline hover:decoration-2 focus:outline-none focus:decoration-2 dark:text-neutral-500 dark:hover:text-neutral-400'
                href='/health'>
                Status
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
