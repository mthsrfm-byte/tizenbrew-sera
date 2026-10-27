import { SeraflixLogo } from './brand.jsx';

export default function Splash() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center splash">
            <div className="splash-glow" />
            <SeraflixLogo plus className="text-[10vh] relative" />
            <p className="splash-text">SerafimFlix+ carregando…</p>
            <div className="load-bar"><i /></div>
        </div>
    );
}
