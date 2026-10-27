import { Cog6ToothIcon, Squares2X2Icon, HomeIcon, InformationCircleIcon } from '@heroicons/react/24/solid';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'preact/hooks';
import { useLocation } from 'preact-iso';
import { BrandIcon } from './brand.jsx';

function Button({ children, label, route, focus }) {
    const { ref, focusSelf, focused } = useFocusable(focus ? { focusKey: 'nav-home' } : {});
    const location = useLocation();
    const active = location.path === `/tizenbrew-ui/dist/index.html${route === '/' ? '' : route}`;

    useEffect(() => {
        if (focus) focusSelf();
    }, []);

    return (
        <button
            ref={ref}
            className={`nav-btn ${active ? 'nav-active' : ''} ${focused ? 'focus' : ''}`}
            onClick={() => location.route(`/tizenbrew-ui/dist/index.html${route}`)}
        >
            {children}
            <span>{label}</span>
        </button>
    );
}

export default function Header() {
    return (
        <header className="h-[11vh] px-[5vw] flex items-center justify-between">
            <div className="flex items-center">
                <BrandIcon id="seraflix" className="h-[6vh] w-[6vh]" />
                <span className="ml-[1.2vw] text-[3.6vh] font-bold tracking-tight text-white">
                    Seraflix<span className="text-sky-400">+</span>
                </span>
            </div>
            <nav className="flex items-center">
                <Button route="/" label="Início" focus={true}>
                    <HomeIcon className="h-[3vh] w-[3vh]" />
                </Button>
                <Button route="/module-manager" label="Apps">
                    <Squares2X2Icon className="h-[3vh] w-[3vh]" />
                </Button>
                <Button route="/settings" label="Ajustes">
                    <Cog6ToothIcon className="h-[3vh] w-[3vh]" />
                </Button>
                <Button route="/about" label="Sobre">
                    <InformationCircleIcon className="h-[3vh] w-[3vh]" />
                </Button>
            </nav>
        </header>
    );
}
