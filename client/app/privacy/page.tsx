// components/PrivacyPolicy.tsx

import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto mt-[158px] px-4 py-8 text-sm md:text-base leading-relaxed">
      <h1 className="text-2xl font-bold mb-6">🔐 Privacy Policy</h1>
      <p className="text-gray-500 mb-4">Effective Date: July 10, 2025</p>

      <p className="mb-4">
        This privacy policy applies to the <strong>StreamFutball</strong> mobile
        app (hereafter referred to as the “Application”), created by{' '}
        <strong>Techistry Integrated</strong>
        (the “Service Provider”) as an <strong>Ad-Supported</strong> service.
        This service is intended for use <em>“as is.”</em>
      </p>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          📊 Information Collection and Use
        </h2>
        <p className="mb-2">
          The Application may collect certain information automatically,
          including:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Your device’s IP address</li>
          <li>Pages visited within the app</li>
          <li>Date, time, and duration of usage</li>
          <li>Your mobile operating system</li>
        </ul>
        <p className="mt-2">
          The Application{' '}
          <strong>does not collect precise location data</strong> from your
          device.
        </p>
        <p className="mt-2">
          The Service Provider may occasionally contact you with updates,
          critical notices, or marketing promotions.
        </p>
        <p className="mt-2">
          You may be asked to provide personally identifiable information (e.g.{' '}
          <em>admin@streamfutball.com</em>) to enhance your experience. This
          data is securely retained and used solely as described here.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🤝 Third-Party Access</h2>
        <p className="mb-2">
          Aggregated, anonymized data may be shared with external services for
          service improvement. Examples of potential disclosures include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Complying with legal obligations</li>
          <li>Protecting rights, safety, or investigating fraud</li>
          <li>
            Trusted third-party service providers under strict confidentiality
            terms
          </li>
        </ul>
        <p className="mt-2">
          The Application may also use third-party services such as{' '}
          <strong>Google Play Services</strong> which have their own privacy
          policies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🚫 Opt-Out Rights</h2>
        <p>
          You can stop all information collection by uninstalling the
          Application using your device’s standard uninstall processes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🗃️ Data Retention</h2>
        <p>
          Data is retained as long as you use the Application and for a
          reasonable period afterward. If you’d like your data deleted, contact
          us at <strong>Lagos</strong> and we will respond within a reasonable
          time.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">👶 Children’s Privacy</h2>
        <p className="mb-2">
          The Application is not intended for children under 13. The Service
          Provider does not knowingly collect data from children under this age.
        </p>
        <p>
          If you are a parent or guardian and believe your child has submitted
          personal data, please contact the Service Provider at{' '}
          <strong>Lagos</strong> for immediate removal.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">🔐 Security</h2>
        <p>
          The Service Provider takes appropriate steps to protect your data
          through physical, electronic, and procedural safeguards.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          🔁 Changes to This Policy
        </h2>
        <p>
          This Privacy Policy may be updated periodically. Continued use of the
          Application implies acceptance of any updates. Please check this page
          regularly for changes.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">✅ Your Consent</h2>
        <p>
          By using the Application, you consent to the terms outlined in this
          Privacy Policy.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📧 Contact Us</h2>
        <p>
          If you have any questions about this policy or your data, please
          contact the Service Provider at <strong>Lagos</strong> or via email at{' '}
          <a
            href="mailto:admin@streamfutball.com"
            className="underline text-blue-600"
          >
            admin@streamfutball.com
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
