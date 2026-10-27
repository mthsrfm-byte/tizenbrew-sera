import { Events } from './WebSocketClient.js';

// Repositório que já vem preenchido na tela "Adicionar do GitHub".
export const DEFAULT_REPO = 'mthsrfm-byte/stremio-sera';

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
                <rect width="512" height="512" rx="110" fill="#ff0033" />
                <rect x="86" y="146" width="340" height="220" rx="60" fill="#fff" />
                <path d="M220 200l100 56-100 56z" fill="#ff0033" />
            </svg>
        );
    }
    return (
        <svg viewBox="0 0 512 512" className={className}>
            <rect width="512" height="512" rx="110" fill="#334155" />
            <text x="256" y="330" font-family="sans-serif" font-weight="bold" font-size="220" fill="#e2e8f0" text-anchor="middle">
                {(name || '?').charAt(0).toUpperCase()}
            </text>
        </svg>
    );
}
