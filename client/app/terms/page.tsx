// components/TermsAndConditions.tsx

import React from 'react';

const TermsAndConditions: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-[158px] px-4 py-8 text-sm md:text-base leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">📜 Terms & Conditions</h1>
      <p className="text-gray-500 mb-4">Last updated: July 2025</p>

      <p className="mb-4">
        These Terms and Conditions apply to the <strong>StreamFutbol</strong>{' '}
        mobile application (the “Application”), created and maintained by{' '}
        <strong>Techistry Integrated</strong> (the “Service Provider”) as an{' '}
        <strong>Ad-Supported Service</strong>.
      </p>

      <p className="mb-6">
        By downloading or using the Application, you agree to the following
        terms:
      </p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">1. 📲 Application Usage</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            The Application is provided “as is” for personal, non-commercial
            use.
          </li>
          <li>
            Reverse engineering or modification of the Application is
            prohibited.
          </li>
          <li>
            All intellectual property rights remain the sole property of the
            Service Provider.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          2. 🔒 Intellectual Property
        </h2>
        <p>
          The Service Provider retains full ownership of all source code,
          designs, trademarks, and logos. Repurposing or redistributing any part
          of the Application is strictly prohibited.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          3. 💼 Changes to the App or Services
        </h2>
        <p>
          We may update or discontinue any part of the Application at any time.
          If future charges are introduced, you’ll be notified in advance.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          4. 🔐 Data Collection & Privacy
        </h2>
        <p>
          The Application may store or process limited user data to improve the
          service. Please refer to our{' '}
          <span className="underline">Privacy Policy</span> for more
          information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">5. 🚫 Limitations</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Do not use the Application for illegal purposes.</li>
          <li>Do not disrupt or abuse the streaming infrastructure.</li>
          <li>Do not attempt to extract stream URLs or content unlawfully.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">6. 📍 Governing Law</h2>
        <p>
          These terms are governed by the laws of <strong>Nigeria</strong>.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">7. 📧 Contact</h2>
        <p className="mb-2">For any questions or support, contact us at:</p>
        <p>
          Email:{' '}
          <a
            href="mailto:support@streamfutball.com"
            className="underline text-blue-600"
          >
            support@streamfutball.com
          </a>
        </p>
        <p>Company: Techistry Integrated</p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
