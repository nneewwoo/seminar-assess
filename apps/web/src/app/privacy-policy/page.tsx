import { TracingBeam } from '@/components/ui/tracing-beam'

export default function PrivacyPolicy() {
  return (
    <TracingBeam className='px-6 mt-8 mb-32'>
      <div className='min-h-screen px-4'>
        <div className='prose prose-sm md:prose-lg prose-a:text-[#4682B4] prose-strong:text-white prose-li:text-white/80 prose-p:text-white/80 prose-headings:text-amber-100 mx-auto p-4'>
          <h1>Privacy Policy</h1>

          <p>
            Your privacy is important to us. This Privacy Policy explains how we
            collect, use, and protect your personal information.
          </p>

          <h2>1. Information We Collect</h2>
          <ul>
            <li>
              <strong>Personal Information:</strong> Name, email address, phone
              number, age, and physical address.
            </li>
            <li>
              <strong>Other Data:</strong> Any additional details you provide
              during your interaction with our app.
            </li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Facilitate your sessions and personalize your experience.</li>
            <li>Maintain and improve our app’s functionality.</li>
            <li>Communicate with you, if necessary.</li>
          </ul>
          <p>
            We <strong>do not</strong> sell, share, or disclose your information
            to third parties, unless required by law.
          </p>

          <h2>3. Your Rights</h2>
          <ul>
            <li>
              Access, update, or delete your personal information stored with
              us.
            </li>
            <li>Contact us with questions or concerns about your data.</li>
          </ul>

          <h2>4. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make
            significant changes, we&apos;ll notify you via the app or email.
          </p>

          <h2>6. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:{' '}
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
