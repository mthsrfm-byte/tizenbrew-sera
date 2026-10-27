import { Events } from './WebSocketClient.js';

import YouTubeLogoUrl from '../assets/youtube-logo.svg';

// Usuário do GitHub que já vem preenchido na tela "Adicionar do GitHub".
export const DEFAULT_OWNER = 'mthsrfm-byte';
export { YouTubeLogoUrl };

// Os apps da casa: nome, texto e cara de cada um. O resto aparece com o que vier do package.json.
const BRANDS = [
    {
        id: 'seraflix',
        match: (m) => /^gh\/mthsrfm-byte\/stremio-sera(@[^/]*)?$/i.test(m.fullName),
        name: 'Seraflix',
        tagline: 'Filmes e séries',
        description: 'Seus addons do Stremio, sua pipoca, seu sofá. A gente só aperta o play.',
        order: 0
    },
    {
        id: 'youtube',
        match: (m) => m.fullName === 'npm/@foxreis/tizentube',
        name: 'YouTube',
        tagline: 'Sem propaganda no meio',
        description: 'O YouTube de sempre, só que sem anúncio interrompendo o vídeo do gatinho.',
        order: 1
    }
];

export function brand(module) {
    const found = BRANDS.find((b) => b.match(module));
    if (found) return { ...found, version: module.version };
    return {
        id: 'other',
        name: module.appName,
        tagline: module.fullName,
        description: module.description,
        version: module.version,
        order: 9
    };
}

export function sortModules(modules) {
    return [...(modules || [])].sort((a, b) => brand(a).order - brand(b).order);
}

export function launchModule(module, state) {
    if (!module.appPath) return;
    for (const key of module.keys) {
        tizen.tvinputdevice.registerKey(key);
    }

    state.client.send({
        type: Events.LaunchModule,
        payload: module
    });

    if (!module.evaluateScriptOnDocumentStart) {
        location.href = module.appPath;
    }
}

export function BrandIcon({ id, name, className = '' }) {
    if (id === 'seraflix') {
        return (
            <svg viewBox="0 0 512 512" className={className}>
                <defs>
                    <linearGradient id="sf-g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stop-color="#3b82f6" />
                        <stop offset="1" stop-color="#0b2a6b" />
                    </linearGradient>
                </defs>
                <rect width="512" height="512" rx="110" fill="url(#sf-g)" />
                <text x="256" y="360" font-family="sans-serif" font-weight="bold" font-size="300" fill="#fff" text-anchor="middle">S</text>
                <path d="M330 300l70 40-70 40z" fill="#facc15" />
            </svg>
        );
    }
    if (id === 'youtube') {
        return (
            <svg viewBox="0 0 512 512" className={className}>
                <rect width="512" height="512" rx="110" fill="#1C1C1A" />
                <g transform="translate(96 96) scale(13.333)">
                    <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" />
                    <path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </g>
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 512 512" className={className}>
            <rect width="512" height="512" rx="110" fill="#1C1C1A" />
            <text x="256" y="330" font-family="sans-serif" font-weight="bold" font-size="220" fill="#A9B4F5" text-anchor="middle">
                {(name || '?').charAt(0).toUpperCase()}
            </text>
        </svg>
    );
}

// Logo de matheusserafim.com (o mesmo do Seraflix), em currentColor.
export function SeraMark({ className = '' }) {
    return (
        <svg className={className} viewBox="9.45 13.36 305.55 98.86" fill="currentColor">
            <path d="M189.18 13.37 L9.45 13.37 L9.45 22.36 L9.45 112.22 L18.43 112.22 L18.43 22.36 L189.18 22.36Z" />
            <path d="M189.18 94.24 L189.18 40.32 L189.18 31.34 L162.22 31.34 L153.24 31.34 L153.24 94.24 L162.22 94.24 L162.22 40.32 L180.2 40.32 L180.2 94.24Z" />
            <path d="M198.17 13.36 L198.17 22.35 L198.17 94.24 L207.16 94.24 L207.16 49.31 L234.12 49.31 L234.12 40.32 L207.16 40.32 L207.16 22.35 L252.09 22.35 L252.09 94.24 L261.08 94.24 L261.08 22.35 L306.01 22.35 L306.01 103.23 L18.43 103.23 L18.43 112.22 L306.01 112.22 L315 112.22 L315 22.35 L315 13.36Z" />
            <path d="M136.26 67.28 L144.25 67.28 L144.25 40.32 L144.25 31.34 L135.26 31.34 L27.42 31.34 L27.42 40.32 L27.42 67.28 L36.41 67.28 L54.38 67.28 L54.38 85.26 L27.42 85.26 L27.42 94.24 L54.38 94.24 L63.37 94.24 L63.37 67.28 L63.37 58.3 L36.41 58.3 L36.41 40.32 L135.26 40.32 L135.26 58.3 L109.3 58.3 L109.3 67.28 L109.44 67.28 L136.4 94.24 L144.25 94.24 L144.25 89.39 L122.15 67.28 L135.26 67.28Z" />
            <path d="M72.36 58.3h26.96v8.99h-26.96Z" />
            <path d="M72.36 85.26h26.96v8.99h-26.96Z" />
            <path d="M225.13 67.28h8.99v26.96h-8.99Z" />
            <path d="M279.05 40.32h8.99v53.92h-8.99Z" />
        </svg>
    );
}

// Logo do Seraflix: marca SERA + "flix" (e o "+" do launcher, quando plus=true).
export function SeraflixLogo({ className = '', plus = false }) {
    return (
        <span className={`sera-logo ${className}`}>
            <SeraMark className="sera-mark" />
            <b>flix</b>
            {plus ? <i>+</i> : null}
        </span>
    );
}
