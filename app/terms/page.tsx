import Link from 'next/link';

export default function TermsOfService() {
    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <div className="pt-32 pb-12 bg-stone-50 border-b border-stone-200">
                <div className="max-w-3xl mx-auto px-6">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#FF4500] mb-4">Legal Document</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-stone-950 tracking-tight mb-4">Terms of Service</h1>
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
                        By accessing or using <strong>Glyph</strong>, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
                    </p>

                    <hr className="border-stone-200 my-12" />

                    <h2>1. License & Ownership</h2>

                    <h3 className="text-stone-900">Free Users (Explorer)</h3>
                    <p>
                        You may use the tool to generate designs for evaluation purposes ("Try before you buy"). You do <strong>not</strong> have a commercial license to use assets generated on the free plan for business purposes, logo trademarks, or production environments. High-resolution exports are locked.
                    </p>

                    <h3 className="text-stone-900">Founder Pass (Paid)</h3>
                    <p>
                        Upon purchasing the Founder Pass, you are granted a <strong>perpetual, non-exclusive, worldwide commercial license</strong> to use, modify, and display the assets you generate for any purpose, including:
                    </p>
                    <ul>
                        <li>Corporate logos and branding.</li>
                        <li>Marketing materials and merchandise.</li>
                        <li>Digital products and websites.</li>
                    </ul>
                    <p>
                        You own the exports. We do not claim copyright over your specific generated output once purchased.
                    </p>

                    <h2>2. Refund Policy</h2>
                    <p>
                        <strong>All sales are final.</strong> Because Glyph offers a "Try 3 Free" model allowing you to test the quality of our generation engine before purchase, and because the product is a digital lifetime license granted instantly, we do not generally offer refunds.
                    </p>
                    <p>
                        Exceptions may be made in cases of technical failure where the product does not function as described, at our sole discretion.
                    </p>

                    <h2>3. Usage Limits</h2>
                    <p>
                        "Unlimited Generations" is subject to a fair use policy to prevent abuse of our API resources. Automated scraping or bot-driven generation is strictly prohibited and may result in account termination.
                    </p>

                    <h2>4. Disclaimer</h2>
                    <p>
                        The AI generates designs based on patterns and geometric primitives. Due to the nature of AI generative models, we cannot guarantee that a generated logo will not inadvertently resemble existing trademarks. You are responsible for clearing any trademarks for your final selected design.
                    </p>

                    <h2>5. Limitation of Liability</h2>
                    <p>
                        Glyph is provided "as is". We are not liable for any damages arising from the use of generated assets, including but not limited to trademark disputes or business losses.
                    </p>
                </div>

                <div className="mt-16 pt-8 border-t border-stone-200 flex justify-between items-center">
                    <Link href="/" className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 text-sm font-medium transition-colors">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Home
                    </Link>
                    <Link href="/privacy" className="text-stone-500 hover:text-[#FF4500] text-sm font-medium transition-colors">
                        View Privacy Policy →
                    </Link>
                </div>
            </div>
        </div>
    );
}
