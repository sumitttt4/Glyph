/**
 * SVG Builder - Fluent API for SVG Generation
 * 
 * Provides a clean interface for constructing complex SVG documents
 */

import { Point, GradientDef, Rectangle, BezierCurve } from '../types';
import { roundedRectPath, squirclePath, bezierToPath } from './geometry';

// ============================================
// SVG ELEMENT TYPES
// ============================================

interface SVGElement {
    tag: string;
    attrs: Record<string, string | number>;
    children?: (SVGElement | string)[];
}

interface DefsElement {
    id: string;
    content: string;
}

// ============================================
// SVG BUILDER CLASS
// ============================================

export class SVGBuilder {
    private elements: SVGElement[] = [];
    private defs: DefsElement[] = [];
    private viewBox: string = '0 0 100 100';
    private width: number = 100;
    private height: number = 100;

    /**
     * Set the viewBox
     */
    setViewBox(x: number, y: number, width: number, height: number): this {
        this.viewBox = `${x} ${y} ${width} ${height}`;
        this.width = width;
        this.height = height;
        return this;
    }

    /**
     * Add a gradient definition
     */
    addGradient(id: string, gradient: GradientDef): this {
        let content: string;

        if (gradient.type === 'linear') {
            const angle = gradient.angle ?? 0;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 - 50 * Math.cos(rad);
            const y1 = 50 - 50 * Math.sin(rad);
            const x2 = 50 + 50 * Math.cos(rad);
            const y2 = 50 + 50 * Math.sin(rad);

            const stops = gradient.stops
                .map(s => `<stop offset="${s.offset * 100}%" stop-color="${s.color}" />`)
                .join('');

            content = `<linearGradient id="${id}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">${stops}</linearGradient>`;
        } else {
            const stops = gradient.stops
                .map(s => `<stop offset="${s.offset * 100}%" stop-color="${s.color}" />`)
                .join('');

            content = `<radialGradient id="${id}" cx="50%" cy="50%" r="50%">${stops}</radialGradient>`;
        }

        this.defs.push({ id, content });
        return this;
    }

    /**
     * Add a mask definition
     */
    addMask(id: string, content: string): this {
        this.defs.push({ id, content: `<mask id="${id}">${content}</mask>` });
        return this;
    }

    /**
     * Add a clip path definition
     */
    addClipPath(id: string, pathD: string): this {
        this.defs.push({ id, content: `<clipPath id="${id}"><path d="${pathD}" /></clipPath>` });
        return this;
    }

    /**
     * Add a filter definition
     */
    addFilter(id: string, filterContent: string): this {
        this.defs.push({ id, content: `<filter id="${id}">${filterContent}</filter>` });
        return this;
    }

    /**
     * Add a path element
     */
    path(d: string, attrs: Record<string, string | number> = {}): this {
        this.elements.push({
            tag: 'path',
            attrs: { d, ...attrs },
        });
        return this;
    }

    /**
     * Add a rectangle element
     */
    rect(rect: Rectangle, attrs: Record<string, string | number> = {}): this {
        this.elements.push({
            tag: 'rect',
            attrs: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
                rx: rect.rx ?? 0,
                ...attrs,
            },
        });
        return this;
    }

    /**
     * Add a circle element
     */
    circle(cx: number, cy: number, r: number, attrs: Record<string, string | number> = {}): this {
        this.elements.push({
            tag: 'circle',
            attrs: { cx, cy, r, ...attrs },
        });
        return this;
    }

    /**
     * Add an ellipse element
     */
    ellipse(cx: number, cy: number, rx: number, ry: number, attrs: Record<string, string | number> = {}): this {
        this.elements.push({
            tag: 'ellipse',
            attrs: { cx, cy, rx, ry, ...attrs },
        });
        return this;
    }

    /**
     * Add a line element
     */
    line(x1: number, y1: number, x2: number, y2: number, attrs: Record<string, string | number> = {}): this {
        this.elements.push({
            tag: 'line',
            attrs: { x1, y1, x2, y2, ...attrs },
        });
        return this;
    }

    /**
     * Add a polyline element
     */
    polyline(points: Point[], attrs: Record<string, string | number> = {}): this {
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
        this.elements.push({
            tag: 'polyline',
            attrs: { points: pointsStr, ...attrs },
        });
        return this;
    }

    /**
     * Add a polygon element
     */
    polygon(points: Point[], attrs: Record<string, string | number> = {}): this {
        const pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
        this.elements.push({
            tag: 'polygon',
            attrs: { points: pointsStr, ...attrs },
        });
        return this;
    }

    /**
     * Add a text element
     */
    text(content: string, x: number, y: number, attrs: Record<string, string | number> = {}): this {
        this.elements.push({
            tag: 'text',
            attrs: { x, y, ...attrs },
            children: [content],
        });
        return this;
    }

    /**
     * Add a group with transform
     */
    group(transform: string, callback: (builder: SVGBuilder) => void): this {
        const groupBuilder = new SVGBuilder();
        callback(groupBuilder);

        this.elements.push({
            tag: 'g',
            attrs: { transform },
            children: groupBuilder.elements as any,
        });

        return this;
    }

    /**
     * Add a squircle shape
     */
    squircle(cx: number, cy: number, size: number, n: number = 4, attrs: Record<string, string | number> = {}): this {
        const d = squirclePath(cx, cy, size, n);
        return this.path(d, attrs);
    }

    /**
     * Add a bezier curve
     */
    bezier(curve: BezierCurve, attrs: Record<string, string | number> = {}): this {
        const d = bezierToPath(curve);
        return this.path(d, { fill: 'none', ...attrs });
    }

    /**
     * Render element to string
     */
    private renderElement(el: SVGElement): string {
        const attrs = Object.entries(el.attrs)
            .map(([k, v]) => `${k}="${v}"`)
            .join(' ');

        if (el.children && el.children.length > 0) {
            const content = el.children
                .map(c => (typeof c === 'string' ? c : this.renderElement(c)))
                .join('');
            return `<${el.tag} ${attrs}>${content}</${el.tag}>`;
        }

        return `<${el.tag} ${attrs} />`;
    }

    /**
     * Build the final SVG string
     */
    build(): string {
        const defsContent = this.defs.length > 0
            ? `<defs>${this.defs.map(d => d.content).join('')}</defs>`
            : '';

        const elementsContent = this.elements
            .map(el => this.renderElement(el))
            .join('');

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${this.viewBox}">${defsContent}${elementsContent}</svg>`;
    }

    /**
     * Get current width
     */
    getWidth(): number {
        return this.width;
    }

    /**
     * Get current height
     */
    getHeight(): number {
        return this.height;
    }
}

/**
 * Create a new SVG builder
 */
export function createSVG(size: number = 100): SVGBuilder {
    return new SVGBuilder().setViewBox(0, 0, size, size);
}
