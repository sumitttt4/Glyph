/**
 * Sound Visualization Algorithm
 *
 * Converts brand name phonetics to visual rhythm:
 * - WAVEFORM - audio waveform based on phonetic energy
 * - FREQUENCY BARS - equalizer-style bars from syllable patterns
 * - SOUND RIPPLE - concentric waves from phonetic impact
 * - VOICE PRINT - spectrogram-inspired visual signature
 * - RHYTHM PULSE - heartbeat-like pattern from word cadence
 * - ECHO PATTERN - repeating diminishing forms
 * - HARMONIC RINGS - overlapping frequency circles
 * - AMPLITUDE PEAKS - mountain-like peaks from volume
 *
 * Each brand name produces a unique "audio fingerprint" visualized as abstract mark.
 */

import { createHash } from 'crypto';
import { LogoParameters, GeneratedLogo } from '../types';

// Phonetic categories for sound analysis
const PHONETICS = {
  // Plosives - sharp, percussive sounds
  plosives: ['p', 'b', 't', 'd', 'k', 'g'],
  // Fricatives - sustained, hissing sounds
  fricatives: ['f', 'v', 's', 'z', 'h', 'th', 'sh'],
  // Nasals - resonant, humming sounds
  nasals: ['m', 'n', 'ng'],
  // Liquids - flowing, smooth sounds
  liquids: ['l', 'r'],
  // Glides - transitional sounds
  glides: ['w', 'y'],
  // Vowels - open, sustained sounds
  vowels: ['a', 'e', 'i', 'o', 'u']
};

// Sound visualization types
type SoundType = 'waveform' | 'frequency-bars' | 'sound-ripple' | 'voice-print' | 'rhythm-pulse' | 'echo-pattern' | 'harmonic-rings' | 'amplitude-peaks';

interface PhoneticAnalysis {
  energy: number[];      // Energy level per character position
  rhythm: number[];      // Rhythm pattern (syllable timing)
  frequency: number[];   // Frequency distribution
  totalEnergy: number;
  dominantType: 'percussive' | 'sustained' | 'resonant' | 'flowing';
  soundType: SoundType;
}

/**
 * Analyze brand name phonetics to generate sound data
 */
function analyzePhonetics(brandName: string): PhoneticAnalysis {
  const name = brandName.toLowerCase();
  const hash = createHash('sha256').update(brandName).digest();

  const energy: number[] = [];
  const rhythm: number[] = [];
  const frequency: number[] = [];

  let plosiveCount = 0;
  let fricativeCount = 0;
  let nasalCount = 0;
  let liquidCount = 0;
  let vowelCount = 0;

  // Analyze each character
  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    let charEnergy = 0.3; // base energy

    if (PHONETICS.plosives.includes(char)) {
      charEnergy = 0.9 + (hash[i % 32] / 255) * 0.1;
      plosiveCount++;
    } else if (PHONETICS.fricatives.includes(char)) {
      charEnergy = 0.6 + (hash[i % 32] / 255) * 0.2;
      fricativeCount++;
    } else if (PHONETICS.nasals.includes(char)) {
      charEnergy = 0.5 + (hash[i % 32] / 255) * 0.15;
      nasalCount++;
    } else if (PHONETICS.liquids.includes(char)) {
      charEnergy = 0.4 + (hash[i % 32] / 255) * 0.2;
      liquidCount++;
    } else if (PHONETICS.vowels.includes(char)) {
      charEnergy = 0.5 + (hash[i % 32] / 255) * 0.3;
      vowelCount++;
    }

    energy.push(charEnergy);

    // Rhythm based on vowel positions (syllables)
    if (PHONETICS.vowels.includes(char)) {
      rhythm.push(1);
    } else {
      rhythm.push(0.3);
    }

    // Frequency mapping (higher for front vowels/consonants)
    const freqMap: Record<string, number> = {
      'i': 0.9, 'e': 0.8, 'a': 0.5, 'o': 0.3, 'u': 0.2,
      's': 0.95, 'f': 0.85, 't': 0.7, 'k': 0.6, 'p': 0.5,
      'm': 0.3, 'n': 0.4, 'l': 0.45, 'r': 0.5
    };
    frequency.push(freqMap[char] || 0.5);
  }

  // Determine dominant sound type
  const counts = [
    { type: 'percussive' as const, count: plosiveCount },
    { type: 'sustained' as const, count: fricativeCount },
    { type: 'resonant' as const, count: nasalCount + vowelCount },
    { type: 'flowing' as const, count: liquidCount }
  ];
  const dominantType = counts.sort((a, b) => b.count - a.count)[0].type;

  // Map to sound visualization type
  let soundType: SoundType;
  switch (dominantType) {
    case 'percussive':
      soundType = hash[0] > 128 ? 'frequency-bars' : 'amplitude-peaks';
      break;
    case 'sustained':
      soundType = hash[1] > 128 ? 'waveform' : 'voice-print';
      break;
    case 'resonant':
      soundType = hash[2] > 128 ? 'harmonic-rings' : 'sound-ripple';
      break;
    case 'flowing':
      soundType = hash[3] > 128 ? 'rhythm-pulse' : 'echo-pattern';
      break;
  }

  return {
    energy,
    rhythm,
    frequency,
    totalEnergy: energy.reduce((a, b) => a + b, 0) / energy.length,
    dominantType,
    soundType
  };
}

/**
 * Generate waveform visualization
 */
function generateWaveform(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const width = size * 0.8;
  const height = size * 0.4;
  const startX = cx - width / 2;

  // Generate smooth waveform from energy data
  const points = Math.max(analysis.energy.length * 3, 20);
  let topPath = `M ${startX} ${cy}`;
  let bottomPath = `M ${startX} ${cy}`;

  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const x = startX + t * width;

    // Interpolate energy
    const energyIndex = t * (analysis.energy.length - 1);
    const e1 = analysis.energy[Math.floor(energyIndex)] || 0.5;
    const e2 = analysis.energy[Math.ceil(energyIndex)] || 0.5;
    const blend = energyIndex % 1;
    const energy = e1 * (1 - blend) + e2 * blend;

    // Add wave modulation
    const wave = Math.sin(t * Math.PI * 4 + hash[10] / 255 * Math.PI) * 0.3;
    const amplitude = (energy + wave) * height / 2;

    topPath += ` L ${x} ${cy - amplitude}`;
    bottomPath += ` L ${x} ${cy + amplitude}`;
  }

  // Close the waveform shape
  paths.push(`<path d="${topPath}" fill="none" stroke="currentColor" stroke-width="${size * 0.02}" stroke-linecap="round"/>`);
  paths.push(`<path d="${bottomPath}" fill="none" stroke="currentColor" stroke-width="${size * 0.02}" stroke-linecap="round"/>`);

  // Center line
  paths.push(`<line x1="${startX}" y1="${cy}" x2="${startX + width}" y2="${cy}" stroke="currentColor" stroke-width="${size * 0.005}" opacity="0.3"/>`);

  return paths.join('\n');
}

/**
 * Generate frequency bars (equalizer style)
 */
function generateFrequencyBars(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const barCount = Math.max(analysis.energy.length, 5);
  const totalWidth = size * 0.7;
  const barWidth = totalWidth / barCount * 0.7;
  const gap = totalWidth / barCount * 0.3;
  const maxHeight = size * 0.5;
  const startX = cx - totalWidth / 2;
  const baseY = cy + maxHeight / 2;

  for (let i = 0; i < barCount; i++) {
    const energy = analysis.energy[i % analysis.energy.length] || 0.5;
    const freq = analysis.frequency[i % analysis.frequency.length] || 0.5;

    // Bar height based on energy and frequency
    const barHeight = maxHeight * (energy * 0.7 + freq * 0.3);
    const x = startX + i * (barWidth + gap);

    // Main bar
    paths.push(`<rect x="${x}" y="${baseY - barHeight}" width="${barWidth}" height="${barHeight}" fill="currentColor" rx="${barWidth * 0.2}"/>`);

    // Reflection (subtle)
    paths.push(`<rect x="${x}" y="${baseY + size * 0.02}" width="${barWidth}" height="${barHeight * 0.3}" fill="currentColor" opacity="0.2" rx="${barWidth * 0.2}"/>`);
  }

  return paths.join('\n');
}

/**
 * Generate sound ripple (concentric waves)
 */
function generateSoundRipple(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const maxRadius = size * 0.4;
  const rings = Math.min(analysis.energy.length, 6);

  for (let i = 0; i < rings; i++) {
    const energy = analysis.energy[i] || 0.5;
    const radius = maxRadius * ((i + 1) / rings);

    // Distorted circle based on energy
    const points = 60;
    let ringPath = '';

    for (let p = 0; p <= points; p++) {
      const angle = (p / points) * Math.PI * 2;
      const distortion = 1 + Math.sin(angle * 3 + hash[i * 2]) * energy * 0.15;
      const r = radius * distortion;

      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      ringPath += p === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    ringPath += ' Z';

    const opacity = 1 - (i / rings) * 0.6;
    const strokeWidth = size * 0.015 * (1 - i / rings * 0.5);
    paths.push(`<path d="${ringPath}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" opacity="${opacity}"/>`);
  }

  // Center impact point
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.03}" fill="currentColor"/>`);

  return paths.join('\n');
}

/**
 * Generate voice print (spectrogram style)
 */
function generateVoicePrint(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const width = size * 0.7;
  const height = size * 0.5;
  const startX = cx - width / 2;
  const startY = cy - height / 2;

  const columns = Math.max(analysis.energy.length, 8);
  const rows = 6;
  const cellWidth = width / columns;
  const cellHeight = height / rows;

  for (let col = 0; col < columns; col++) {
    const energy = analysis.energy[col % analysis.energy.length] || 0.5;
    const freq = analysis.frequency[col % analysis.frequency.length] || 0.5;

    for (let row = 0; row < rows; row++) {
      const x = startX + col * cellWidth;
      const y = startY + row * cellHeight;

      // Intensity based on frequency distribution
      const freqMatch = Math.abs((row / rows) - freq);
      const intensity = energy * (1 - freqMatch * 1.5);

      if (intensity > 0.2) {
        const segHeight = cellHeight * intensity;
        paths.push(`<rect x="${x}" y="${y + (cellHeight - segHeight) / 2}" width="${cellWidth * 0.8}" height="${segHeight}" fill="currentColor" opacity="${intensity}"/>`);
      }
    }
  }

  return paths.join('\n');
}

/**
 * Generate rhythm pulse (heartbeat style)
 */
function generateRhythmPulse(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const width = size * 0.8;
  const height = size * 0.3;
  const startX = cx - width / 2;

  let pulsePath = `M ${startX} ${cy}`;
  const segments = analysis.rhythm.length * 2;

  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    const x = startX + t * width;
    const rhythmIndex = Math.floor(t * analysis.rhythm.length);
    const isAccent = analysis.rhythm[rhythmIndex] > 0.5;

    if (isAccent) {
      // Sharp peak for accented syllables
      const peakHeight = height * analysis.energy[rhythmIndex % analysis.energy.length];
      pulsePath += ` L ${x} ${cy}`;
      pulsePath += ` L ${x + width / segments * 0.2} ${cy - peakHeight}`;
      pulsePath += ` L ${x + width / segments * 0.4} ${cy + peakHeight * 0.3}`;
      pulsePath += ` L ${x + width / segments * 0.6} ${cy}`;
    } else {
      // Gentle wave for non-accented
      const waveHeight = height * 0.1;
      pulsePath += ` L ${x + width / segments * 0.5} ${cy + Math.sin(t * Math.PI * 4) * waveHeight}`;
    }
  }
  pulsePath += ` L ${startX + width} ${cy}`;

  paths.push(`<path d="${pulsePath}" fill="none" stroke="currentColor" stroke-width="${size * 0.025}" stroke-linecap="round" stroke-linejoin="round"/>`);

  // Baseline
  paths.push(`<line x1="${startX}" y1="${cy}" x2="${startX + width}" y2="${cy}" stroke="currentColor" stroke-width="${size * 0.005}" opacity="0.2"/>`);

  return paths.join('\n');
}

/**
 * Generate echo pattern (diminishing repeats)
 */
function generateEchoPattern(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const baseSize = size * 0.15;
  const echoes = 4;

  // Base shape from dominant phonetic type
  const shapeType = hash[10] % 3;

  for (let e = 0; e < echoes; e++) {
    const scale = 1 - e * 0.2;
    const offset = e * size * 0.1;
    const opacity = 1 - e * 0.2;
    const echoX = cx + offset;
    const echoY = cy;
    const echoSize = baseSize * scale;

    switch (shapeType) {
      case 0: {
        // Triangle echo
        const h = echoSize * Math.sqrt(3) / 2;
        paths.push(`<path d="M ${echoX} ${echoY - h * 0.6} L ${echoX + echoSize / 2} ${echoY + h * 0.4} L ${echoX - echoSize / 2} ${echoY + h * 0.4} Z" fill="none" stroke="currentColor" stroke-width="${size * 0.015 * scale}" opacity="${opacity}"/>`);
        break;
      }
      case 1: {
        // Circle echo
        paths.push(`<circle cx="${echoX}" cy="${echoY}" r="${echoSize / 2}" fill="none" stroke="currentColor" stroke-width="${size * 0.015 * scale}" opacity="${opacity}"/>`);
        break;
      }
      default: {
        // Square echo
        paths.push(`<rect x="${echoX - echoSize / 2}" y="${echoY - echoSize / 2}" width="${echoSize}" height="${echoSize}" fill="none" stroke="currentColor" stroke-width="${size * 0.015 * scale}" opacity="${opacity}" transform="rotate(${e * 5}, ${echoX}, ${echoY})"/>`);
      }
    }
  }

  // Sound wave lines connecting echoes
  for (let i = 0; i < 3; i++) {
    const y = cy + (i - 1) * size * 0.08;
    const startX = cx - size * 0.05;
    const endX = cx + size * 0.35;
    paths.push(`<line x1="${startX}" y1="${y}" x2="${endX}" y2="${y}" stroke="currentColor" stroke-width="${size * 0.008}" opacity="0.3" stroke-dasharray="${size * 0.02} ${size * 0.01}"/>`);
  }

  return paths.join('\n');
}

/**
 * Generate harmonic rings (overlapping frequency circles)
 */
function generateHarmonicRings(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const baseRadius = size * 0.15;

  // Generate rings based on frequency content
  const harmonics = Math.min(analysis.frequency.length, 5);

  for (let h = 0; h < harmonics; h++) {
    const freq = analysis.frequency[h];
    const energy = analysis.energy[h];

    // Position based on frequency (higher = further out)
    const angle = (h / harmonics) * Math.PI * 2 - Math.PI / 2;
    const distance = size * 0.15 * (1 - freq * 0.5);
    const ringCx = cx + Math.cos(angle) * distance;
    const ringCy = cy + Math.sin(angle) * distance;

    // Size based on energy
    const ringR = baseRadius * (0.5 + energy * 0.8);

    paths.push(`<circle cx="${ringCx}" cy="${ringCy}" r="${ringR}" fill="none" stroke="currentColor" stroke-width="${size * 0.015}" opacity="${0.4 + energy * 0.4}"/>`);

    // Inner resonance ring
    if (energy > 0.5) {
      paths.push(`<circle cx="${ringCx}" cy="${ringCy}" r="${ringR * 0.5}" fill="none" stroke="currentColor" stroke-width="${size * 0.01}" opacity="0.3"/>`);
    }
  }

  // Central harmonic point
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.04}" fill="currentColor"/>`);

  return paths.join('\n');
}

/**
 * Generate amplitude peaks (mountain style)
 */
function generateAmplitudePeaks(
  cx: number,
  cy: number,
  size: number,
  analysis: PhoneticAnalysis,
  hash: Buffer
): string {
  const paths: string[] = [];
  const width = size * 0.8;
  const maxHeight = size * 0.45;
  const startX = cx - width / 2;
  const baseY = cy + maxHeight / 3;

  // Generate peaks from energy data
  const peaks = Math.max(analysis.energy.length, 4);
  let peakPath = `M ${startX} ${baseY}`;

  for (let i = 0; i < peaks; i++) {
    const energy = analysis.energy[i % analysis.energy.length];
    const peakWidth = width / peaks;
    const peakX = startX + i * peakWidth + peakWidth / 2;
    const peakHeight = maxHeight * energy;

    // Rising edge
    const riseX = peakX - peakWidth * 0.3;
    peakPath += ` L ${riseX} ${baseY - peakHeight * 0.3}`;

    // Peak
    peakPath += ` L ${peakX} ${baseY - peakHeight}`;

    // Falling edge
    const fallX = peakX + peakWidth * 0.3;
    peakPath += ` L ${fallX} ${baseY - peakHeight * 0.3}`;

    // Valley
    if (i < peaks - 1) {
      const valleyX = startX + (i + 1) * peakWidth;
      peakPath += ` L ${valleyX} ${baseY}`;
    }
  }

  peakPath += ` L ${startX + width} ${baseY}`;

  paths.push(`<path d="${peakPath}" fill="none" stroke="currentColor" stroke-width="${size * 0.025}" stroke-linecap="round" stroke-linejoin="round"/>`);

  // Baseline
  paths.push(`<line x1="${startX}" y1="${baseY}" x2="${startX + width}" y2="${baseY}" stroke="currentColor" stroke-width="${size * 0.01}"/>`);

  return paths.join('\n');
}

/**
 * Main Sound Visualization generation function
 */
export function generateSoundVisualization(
  params: LogoParameters
): GeneratedLogo[] {
  const logos: GeneratedLogo[] = [];
  const brandName = params.brandName || 'Brand';
  const hash = createHash('sha256').update(brandName).digest();

  const size = 100;
  const cx = size / 2;
  const cy = size / 2;

  // Analyze brand name phonetics
  const analysis = analyzePhonetics(brandName);

  // Sound visualization types with descriptions
  const soundTypes: { type: SoundType; name: string; description: string }[] = [
    { type: 'waveform', name: 'Waveform', description: 'Audio waveform from phonetic energy' },
    { type: 'frequency-bars', name: 'Frequency Bars', description: 'Equalizer-style visualization' },
    { type: 'sound-ripple', name: 'Sound Ripple', description: 'Concentric waves from phonetic impact' },
    { type: 'voice-print', name: 'Voice Print', description: 'Spectrogram-inspired signature' },
    { type: 'rhythm-pulse', name: 'Rhythm Pulse', description: 'Heartbeat pattern from word cadence' },
    { type: 'echo-pattern', name: 'Echo Pattern', description: 'Diminishing repeat forms' },
    { type: 'harmonic-rings', name: 'Harmonic Rings', description: 'Overlapping frequency circles' },
    { type: 'amplitude-peaks', name: 'Amplitude Peaks', description: 'Mountain peaks from volume' }
  ];

  // Prioritize analyzed sound type
  const orderedTypes = [
    soundTypes.find(s => s.type === analysis.soundType)!,
    ...soundTypes.filter(s => s.type !== analysis.soundType).slice(0, 4)
  ];

  orderedTypes.forEach((sound, index) => {
    const variationHash = createHash('sha256')
      .update(brandName + sound.type + index)
      .digest();

    // Re-analyze with variation for diversity
    const varAnalysis = index === 0 ? analysis : analyzePhonetics(brandName + index);

    let soundSvg: string;

    switch (sound.type) {
      case 'waveform':
        soundSvg = generateWaveform(cx, cy, size, varAnalysis, variationHash);
        break;
      case 'frequency-bars':
        soundSvg = generateFrequencyBars(cx, cy, size, varAnalysis, variationHash);
        break;
      case 'sound-ripple':
        soundSvg = generateSoundRipple(cx, cy, size, varAnalysis, variationHash);
        break;
      case 'voice-print':
        soundSvg = generateVoicePrint(cx, cy, size, varAnalysis, variationHash);
        break;
      case 'rhythm-pulse':
        soundSvg = generateRhythmPulse(cx, cy, size, varAnalysis, variationHash);
        break;
      case 'echo-pattern':
        soundSvg = generateEchoPattern(cx, cy, size, varAnalysis, variationHash);
        break;
      case 'harmonic-rings':
        soundSvg = generateHarmonicRings(cx, cy, size, varAnalysis, variationHash);
        break;
      case 'amplitude-peaks':
        soundSvg = generateAmplitudePeaks(cx, cy, size, varAnalysis, variationHash);
        break;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  ${soundSvg}
</svg>`;

    logos.push({
      svg,
      concept: `${sound.name} - ${sound.description} for "${brandName}"`,
      algorithm: 'sound-visualization',
      metadata: {
        brandName,
        style: params.style,
        colorScheme: params.colorScheme,
        soundType: sound.type,
        dominantPhonetic: analysis.dominantType,
        totalEnergy: analysis.totalEnergy,
        brandAnalysis: index === 0 ? analysis : undefined
      }
    });
  });

  return logos;
}

/**
 * Generate a single sound visualization preview
 */
export function generateSingleSoundVisualizationPreview(
  brandName: string,
  soundType?: SoundType
): GeneratedLogo {
  const hash = createHash('sha256').update(brandName).digest();

  const size = 100;
  const cx = size / 2;
  const cy = size / 2;

  const analysis = analyzePhonetics(brandName);
  const type = soundType || analysis.soundType;

  let soundSvg: string;
  let soundName: string;

  switch (type) {
    case 'waveform':
      soundSvg = generateWaveform(cx, cy, size, analysis, hash);
      soundName = 'Waveform';
      break;
    case 'frequency-bars':
      soundSvg = generateFrequencyBars(cx, cy, size, analysis, hash);
      soundName = 'Frequency Bars';
      break;
    case 'sound-ripple':
      soundSvg = generateSoundRipple(cx, cy, size, analysis, hash);
      soundName = 'Sound Ripple';
      break;
    case 'voice-print':
      soundSvg = generateVoicePrint(cx, cy, size, analysis, hash);
      soundName = 'Voice Print';
      break;
    case 'rhythm-pulse':
      soundSvg = generateRhythmPulse(cx, cy, size, analysis, hash);
      soundName = 'Rhythm Pulse';
      break;
    case 'echo-pattern':
      soundSvg = generateEchoPattern(cx, cy, size, analysis, hash);
      soundName = 'Echo Pattern';
      break;
    case 'harmonic-rings':
      soundSvg = generateHarmonicRings(cx, cy, size, analysis, hash);
      soundName = 'Harmonic Rings';
      break;
    case 'amplitude-peaks':
      soundSvg = generateAmplitudePeaks(cx, cy, size, analysis, hash);
      soundName = 'Amplitude Peaks';
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  ${soundSvg}
</svg>`;

  return {
    svg,
    concept: `${soundName} - phonetic visualization for "${brandName}"`,
    algorithm: 'sound-visualization',
    metadata: {
      brandName,
      soundType: type,
      dominantPhonetic: analysis.dominantType,
      totalEnergy: analysis.totalEnergy
    }
  };
}
