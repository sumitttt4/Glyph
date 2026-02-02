import Link from 'next/link';



export default function PrivacyPolicy() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <div className="pt-32 pb-12 bg-stone-50 border-b border-stone-200">
                <div className="max-w-3xl mx-auto px-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#FF4500] mb-4">Legal Document</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-stone-950 tracking-tight mb-4">Privacy Policy</h1>
                    <p className="text-stone-500 font-mono text-sm">
                        Last updated: <span className="text-stone-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto px-6 py-16">
                <div className="prose prose-lg prose-stone max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-stone-950
                    prose-p:text-stone-600 prose-p:leading-relaxed
                    prose-li:text-stone-600
                    prose-strong:text-stone-900 prose-strong:font-semibold
                    prose-a:text-[#FF4500] prose-a:font-medium prose-a:no-underline hover:prose-a:underline">

                    <p className="lead text-xl text-stone-500 mb-12">
                        At <strong>Glyph</strong> ("we", "our", or "us"), we value your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our AI Design Engineer service.
                    </p>

                    <hr className="border-stone-200 my-12" />

                    <h2>1. Information We Collect</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong>Input Data:</strong> Brand names, descriptions, and keywords you enter into the generator.
                        </li>
                        <li>
                            <strong>Generated Assets:</strong> Logos, color palettes, and other brand assets created by our AI.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> Analytics on how you interact with our tools (via Vercel Analytics).
                        </li>
                        <li>
                            <strong>Payment Information:</strong> We do not store credit card details. All payments are processed securely by our merchant of record, Dodo Payments.
                        </li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use your information strictly to:
                    </p>
                    <ul>
                        <li>Generate and deliver your unique brand identity assets.</li>
                        <li>Process transactions for the Founder Pass.</li>
                        <li>Improve our AI algorithms and user experience.</li>
                        <li>Store your generation history (locally or in your account) for your future access.</li>
                    </ul>

                    <h2>3. Artificial Intelligence</h2>
                    <p>
                        Our service uses advanced algorithms to generate designs. The input data you provide is processed programmatically to create visual outputs. We do not use your personal brand data to train public models without your consent, ensuring your business ideas remain private.
                    </p>

                    <h2>4. Data Storage</h2>
                    <p>
                        Generated assets and user preferences may be stored using local browser storage and cloud databases to facilitate the "History" feature. You can clear your local data at any time via your browser settings.
                    </p>

                    <h2>5. Third-Party Services</h2>
                    <p>
                        We use trusted third-party services for specific functions:
                    </p>
                    <ul>
                        <li><strong>Dodo Payments:</strong> For secure payment processing.</li>
                        <li><strong>Vercel:</strong> For hosting and analytics.</li>
                    </ul>

                    <h2>6. Contact Us</h2>
                    <p>
                        If you have questions about this policy, please contact us at <a href="mailto:support@glyph.software">support@glyph.software</a>.
                    </p>
                </div>

                <div className="mt-16 pt-8 border-t border-stone-200 flex justify-between items-center">
                    <Link href="/" className="group flex items-center gap-2 text-stone-500 hover:text-stone-950 text-sm font-medium transition-colors">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
                    </Link>
                    <Link href="/terms" className="text-stone-500 hover:text-[#FF4500] text-sm font-medium transition-colors">
                        View Terms of Service →
                    </Link>
                </div>
            </div>
        </div>
    );
}
