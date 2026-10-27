import { SeraflixLogo } from '../components/brand.jsx';

function info(fn) {
    try { return fn(); } catch (e) { return '—'; }
}

export default function About() {
    const tizenVersion = info(() => tizen.systeminfo.getCapability('http://tizen.org/feature/platform.version'));
    const tvModel = info(() => tizen.systeminfo.getCapability('http://tizen.org/system/model_name'));
    const appVersion = info(() => tizen.application.getCurrentApplication().appInfo.version);

    return (
        <div className="flex flex-col items-center pt-[8vh]">
            <SeraflixLogo plus className="text-[11vh]" />
            <p className="text-[#A3A19A] text-[2.4vh] mt-[4vh]">Feito com carinho (e muita pipoca) em cima do TizenBrew.</p>
            <div className="about-box mt-[5vh]">
                <p>Versão do app <b>{appVersion}</b></p>
                <p>Tizen <b>{tizenVersion}</b></p>
                <p>Modelo da TV <b>{tvModel}</b></p>
            </div>
        </div>
    )
}
