
export interface BrandStrategy {
    archetype: string;
    tagline: string;
    mission: string;
    vision: string;
    values: string[];
    audience: string;
    voice: {
        tone: string;
        dos: string[];
        donts: string[];
    };
    marketing: {
        headline: string;
        subhead: string;
        about: string;
    };
}

const ARCHETYPES: Record<string, any> = {
    minimalist: {
        name: "The Essentialist",
        traits: ["Clarity", "Peace", "Simplicity"],
        values: ["Less is More", "Function over Form", "Mindfulness", "Subtraction"],
        audience: "Design-conscious leaders who value clarity and purpose.",
        voice: "Calm, concise, and intentional.",
        taglines: [
            "Simply better.",
            "Design for clarity.",
            "Less but better.",
            "Focus on the essential."
        ]
    },
    tech: {
        name: "The Innovator",
        traits: ["Future-focused", "Smart", "Efficient"],
        values: ["Innovation", "Speed", "Scale", "Disruption"],
        audience: "Early adopters and forward-thinking enterprises.",
        voice: "Visionary, technical, and confident.",
        taglines: [
            "Building the future.",
            "Accelerating what's possible.",
            "Intelligence inside.",
            "Beyond boundaries."
        ]
    },
    nature: {
        name: "The Guardian",
        traits: ["Organic", "Sustainable", "Grounded"],
        values: ["Sustainability", "Growth", "Balance", "Authenticity"],
        audience: "Eco-conscious consumers seeking genuine connection.",
        voice: "Warm, nurturing, and authentic.",
        taglines: [
            "Rooted in nature.",
            "Naturally superior.",
            "Earth first.",
            "Growth in harmony."
        ]
    },
    bold: {
        name: "The Maverick",
        traits: ["Fearless", "Loud", "Impactful"],
        values: ["Courage", "Impact", "Truth", "Power"],
        audience: "Trendsetters and those who refuse to blend in.",
        voice: "Provocative, energetic, and raw.",
        taglines: [
            "Defy expectation.",
            "Make some noise.",
            "Unapologetically us.",
            "Lead the pack."
        ]
    },
    modern: {
        name: "The Creator",
        traits: ["Polished", "Reliable", "Creative"],
        values: ["Quality", "Craftsmanship", "Trust", "Excellence"],
        audience: "Professionals who appreciate thoughtful design.",
        voice: "Professional, open, and stylish.",
        taglines: [
            "Designed for life.",
            "Quality in every detail.",
            "Elevate your day.",
            "The new standard."
        ]
    }
};

export function generateBrandStrategy(name: string, vibe: string): BrandStrategy {
    const archetypeData = ARCHETYPES[vibe] || ARCHETYPES.modern;

    // Deterministic randomness based on name length to keep it consistent for the same name
    const seed = name.length;
    const getRandom = (arr: string[]) => arr[seed % arr.length];

    return {
        archetype: archetypeData.name,
        tagline: getRandom(archetypeData.taglines),
        mission: `To bring ${archetypeData.traits[0].toLowerCase()} and ${archetypeData.traits[1].toLowerCase()} to a world that needs it.`,
        vision: `A future where ${name} defines the standard for ${vibe} innovation.`,
        values: archetypeData.values,
        audience: archetypeData.audience,
        voice: {
            tone: archetypeData.voice,
            dos: [
                `Be ${archetypeData.traits[0].toLowerCase()}`,
                "Focus on the user benefit",
                "Keep it simple"
            ],
            donts: [
                "Don't overcomplicate",
                `Don't be ${vibe === 'bold' ? 'timid' : 'aggressive'}`,
                "Avoid jargon"
            ]
        },
        marketing: {
            headline: `${archetypeData.traits[0]}. ${archetypeData.traits[1]}.`,
            subhead: `We are ${name}. We believe in ${archetypeData.traits[2].toLowerCase()} above all else.`,
            about: `${name} was founded on a simple premise: that ${vibe} design shouldn't be a luxury. We combine ${archetypeData.traits[0].toLowerCase()} thinking with ${archetypeData.traits[1].toLowerCase()} execution.`
        }
    };
}
