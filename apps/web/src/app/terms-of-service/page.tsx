import { TracingBeam } from '@/components/ui/tracing-beam'

export default function Terms() {
  return (
    <TracingBeam className='px-6 mt-8 mb-32'>
      <div className='min-h-screen px-4'>
        <div className='prose prose-a:text-[#4682B4] prose-strong:text-white prose-li:text-white/80 prose-p:text-white/80 prose-headings:text-amber-100 mx-auto prose-lg p-6'>
          <h1>Terms of Service</h1>
          <p>
            By signing up or using the app, you agree to comply with these
            Terms.
          </p>

          <h2>1. Use of the App</h2>
          <ul>
            <li>
              You must be at least <strong>18</strong> years old to use this
              app.
            </li>
            <li>
              You agree to provide accurate and up-to-date information when
              signing up.
            </li>
          </ul>

          <h2>2. Your Account</h2>
          <ul>
            <li>
              You are responsible for keeping your login credentials secure.
            </li>
            <li>
              Notify us immediately if you suspect unauthorized access to your
              account.
            </li>
          </ul>

          <h2>3. Prohibited Activities</h2>
          <ul>
            <li>Use the app for illegal activities or purposes.</li>
            <li>Provide false information or impersonate someone else.</li>
          </ul>

          <h2>4. Data Usage</h2>
          <p>
            We collect and use your information as described in our{' '}
            <a
              href='/privacy-policy'
              className='text-blue-600 hover:underline'>
              Privacy Policy
            </a>
            . You agree to our use of your data as outlined in the Privacy
            Policy.
          </p>

          <h2>5. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at any
            time if you violate these Terms.
          </p>

          <h2>6. Changes to These Terms</h2>
          <p>
            We may update these Terms occasionally. If we make significant
            changes, we&apos;ll notify you via the app or email.
          </p>

          <h2>7. Contact Us</h2>
          <p>
            For any questions or concerns about these Terms, contact us at:{' '}
            <a
              href='mailto:contact@seminar-assess.tech'
              className='text-blue-600 hover:underline'>
              contact@seminar-assess.tech
            </a>
            .
          </p>
        </div>
      </div>
    </TracingBeam>
  )
}
