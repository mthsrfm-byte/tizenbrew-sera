import { setFocus } from '@noriginmedia/norigin-spatial-navigation'
import { useContext, useState, useRef } from 'react';
import { GlobalStateContext } from '../components/ClientContext.jsx';
import { Events } from '../components/WebSocketClient.js';
import { useLocation } from 'preact-iso';
import { useTranslation } from 'react-i18next';
import Card, { PageTitle } from '../components/Card.jsx';
import { brand, sortModules, BrandIcon, DEFAULT_REPO } from '../components/brand.jsx';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function ModuleManager() {
    const { state } = useContext(GlobalStateContext);
    const loc = useLocation();
    const { t } = useTranslation();

    function remove(module) {
        if (!confirm(t('moduleManager.confirmDelete', { packageName: brand(module).name }))) return;
        state.client.send({
            type: Events.ModuleAction,
            payload: { action: 'remove', module: module.fullName }
        });
        state.client.send({ type: Events.GetModules, payload: true });
        setFocus('nav-home');
    }

    return (
        <div className="px-[5vw] pt-[3vh]">
            <PageTitle title="Seus apps" subtitle="OK num app pra tirar ele daqui. Pra colocar um novo, vai nos cartões com +." />
            <div className="flex flex-wrap">
                <Card shouldFocus onClick={() => loc.route('/tizenbrew-ui/dist/index.html/module-manager/add?type=gh')} className="small-card add-card">
                    <PlusIcon className="h-[6vh] w-[6vh] shrink-0 text-sky-400" />
                    <div className="ml-[1.2vw]">
                        <h3 className="text-[2.8vh] font-bold">{t('moduleManager.addGH')}</h3>
                        <p className="text-[2vh] text-slate-400">{t('moduleManager.addGHDesc')}</p>
                    </div>
                </Card>
                <Card onClick={() => loc.route('/tizenbrew-ui/dist/index.html/module-manager/add?type=npm')} className="small-card add-card">
                    <PlusIcon className="h-[6vh] w-[6vh] shrink-0 text-slate-400" />
                    <div className="ml-[1.2vw]">
                        <h3 className="text-[2.8vh] font-bold">{t('moduleManager.addNPM')}</h3>
                        <p className="text-[2vh] text-slate-400">{t('moduleManager.addNPMDesc')}</p>
                    </div>
                </Card>
                {sortModules(state?.sharedData?.modules).map((module) => {
                    const b = brand(module);
                    return (
                        <Card onClick={() => remove(module)} className="small-card">
                            <BrandIcon id={b.id} name={b.name} className="h-[7vh] w-[7vh] shrink-0" />
                            <div className="ml-[1.2vw] min-w-0">
                                <h3 className="text-[2.8vh] font-bold truncate">{b.name} <span className="text-slate-500 text-[2vh] font-normal">{module.version}</span></h3>
                                <p className="text-[2vh] text-slate-400 truncate">{module.fullName}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    )
}

// Tecla "Concluído"/"Cancelar" do teclado virtual da Samsung.
const DONE_KEYS = [13, 65376, 65385];

function Field({ label, value, onChange, placeholder, hint, shouldFocus }) {
    const inputRef = useRef(null);
    return (
        <Card shouldFocus={shouldFocus} onClick={() => inputRef.current.focus()} className="field">
            <label className="text-[2.2vh] text-slate-400 font-semibold">{label}</label>
            <input
                type="text"
                ref={inputRef}
                value={value}
                placeholder={placeholder}
                onInput={(e) => onChange(e.target.value)}
                onKeyDown={(e) => { if (DONE_KEYS.includes(e.keyCode)) e.target.blur(); }}
                className="field-input"
            />
            {hint ? <p className="text-[1.9vh] text-slate-500 mt-[0.8vh]">{hint}</p> : null}
        </Card>
    );
}

function cleanRepo(value) {
    return value.trim().replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\.git$/i, '').replace(/^\/+|\/+$/g, '');
}

function AddModule() {
    const loc = useLocation();
    const { state } = useContext(GlobalStateContext);
    const isGH = loc.query.type !== 'npm';
    const [repo, setRepo] = useState(DEFAULT_REPO);
    const [folder, setFolder] = useState('');
    const [pkg, setPkg] = useState('');

    const cleanFolder = folder.trim().replace(/^\/+|\/+$/g, '');
    const target = isGH
        ? (cleanRepo(repo).split('/').length >= 2 ? `gh/${cleanRepo(repo)}${cleanFolder ? '/' + cleanFolder : ''}` : '')
        : (pkg.trim() ? `npm/${pkg.trim()}` : '');

    function add() {
        if (!target) return alert(isGH ? 'Faltou o repositório, no formato usuario/repositorio.' : 'Faltou o nome do pacote.');
        state.client.send({
            type: Events.ModuleAction,
            payload: { action: 'add', module: target }
        });
        state.client.send({ type: Events.GetModules, payload: true });
        loc.route('/tizenbrew-ui/dist/index.html/module-manager');
        setFocus('nav-home');
    }

    return (
        <div className="px-[5vw] pt-[3vh] max-w-[70vw]">
            {isGH ? (
                <>
                    <PageTitle title="Adicionar do GitHub" subtitle="Já deixei o seu repositório preenchido. É só dizer a pasta do app." />
                    <Field
                        label="Repositório"
                        value={repo}
                        onChange={setRepo}
                        placeholder="usuario/repositorio"
                        hint="Quer outro? Troca aqui, no formato usuario/repositorio."
                    />
                    <Field
                        label="Pasta do app (opcional)"
                        value={folder}
                        onChange={setFolder}
                        placeholder="ex.: meu-app-novo"
                        hint="Deixa vazio se o app está na raiz do repositório (é o caso do Seraflix)."
                        shouldFocus
                    />
                </>
            ) : (
                <>
                    <PageTitle title="Adicionar do NPM" subtitle="Pra apps publicados no NPM, tipo o TizenTube." />
                    <Field label="Nome do pacote" value={pkg} onChange={setPkg} placeholder="ex.: @foxreis/tizentube" shouldFocus />
                </>
            )}
            <p className="text-[2.2vh] text-slate-400 mt-[3vh]">
                Vai instalar: <span className="text-white font-mono">{target || '—'}</span>
            </p>
            <Card onClick={add} className="primary-btn mt-[2vh]">Adicionar app</Card>
        </div>
    )
}

export {
    AddModule
}
