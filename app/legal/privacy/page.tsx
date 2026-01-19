// app/legal/privacy/page.tsx
import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-24 leading-relaxed text-stone-700">
            <h1 className="text-4xl font-bold mb-8 text-stone-900">Privacy Policy</h1>
            <p className="mb-4 text-stone-500 text-sm">Last updated: January 2026</p>

            <div className="space-y-6">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-stone-900">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account, generate a brand, or communicate with us. This may include your email address, project names, and generation preferences (&quot;vibe&quot;, &quot;prompt&quot;).
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-stone-900">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Provide, maintain, and improve our Services.</li>
                        <li>Process your brand generation requests.</li>
                        <li>Send you technical notices and support messages.</li>
                        <li>Monitor and analyze trends and usage.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-stone-900">3. Data Storage and Security</h2>
                    <p>
                        We use industry-standard security measures to protect your personal information. Your generation data is stored securely and is associated with your account. We do not sell your personal data to third parties.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-stone-900">4. Third-Party Services</h2>
                    <p>
                        We may use third-party services (such as authentication providers like Supabase or analytics tools) that collect, monitor, and analyze this type of information in order to increase our Service&apos;s functionality. These third-party service providers have their own privacy policies addressing how they use such information.
                    </p>

                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-stone-900">5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. You can manage your account settings directly within the application or contact us for assistance.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-stone-900">6. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-stone-900">7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at privacy@glyph.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
