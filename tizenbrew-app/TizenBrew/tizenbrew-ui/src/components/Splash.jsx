import { BrandIcon } from './brand.jsx';

export default function Splash() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center splash">
            <BrandIcon id="seraflix" className="w-[16vh] h-[16vh] pulse" />
            <h1 className="text-white text-[5vh] font-bold mt-[4vh]">
                Seraflix<span className="text-sky-400">+</span> carregando…
            </h1>
            <p className="text-slate-400 text-[2.4vh] mt-[1.5vh]">Pega a pipoca que já já começa.</p>
        </div>
    );
}
