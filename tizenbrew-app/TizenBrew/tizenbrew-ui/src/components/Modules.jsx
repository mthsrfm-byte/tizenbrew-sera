import { useContext } from 'react';
import { GlobalStateContext } from './ClientContext.jsx';
import Card from './Card.jsx';
import { brand, sortModules, launchModule, BrandIcon } from './brand.jsx';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Corujão liberado';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function FeaturedCard({ module, state, shouldFocus }) {
  const b = brand(module);
  return (
    <Card
      shouldFocus={shouldFocus}
      onClick={() => launchModule(module, state)}
      className={`featured featured-${b.id}`}
    >
      <BrandIcon id={b.id} name={b.name} className="h-[13vh] w-[13vh] shrink-0" />
      <div className="mt-auto">
        <p className="text-[2.2vh] uppercase tracking-widest text-white/70 font-semibold">{b.tagline}</p>
        <h2 className="text-[6vh] font-extrabold leading-none mt-[0.6vh]">{b.name}</h2>
        <p className="text-[2.5vh] text-white/85 mt-[1.6vh] leading-snug">{b.description}</p>
      </div>
      <span className="play-hint">▶ OK para abrir</span>
    </Card>
  );
}

function SmallCard({ module, state }) {
  const b = brand(module);
  return (
    <Card onClick={() => launchModule(module, state)} className="small-card">
      <BrandIcon id={b.id} name={b.name} className="h-[7vh] w-[7vh] shrink-0" />
      <div className="ml-[1.2vw] min-w-0">
        <h3 className="text-[2.8vh] font-bold truncate">{b.name}</h3>
        <p className="text-[2vh] text-slate-400 line-clamp-2">{b.description}</p>
      </div>
    </Card>
  );
}

export default function Modules() {
  const { state } = useContext(GlobalStateContext);
  const modules = sortModules(state?.sharedData?.modules);
  const featured = modules.filter((m) => brand(m).order < 9);
  const others = modules.filter((m) => brand(m).order >= 9);

  return (
    <div className="px-[5vw] pt-[3vh]">
      <h1 className="text-[4.6vh] font-bold">{greeting()}! Bora assistir o quê?</h1>
      <p className="text-slate-400 text-[2.4vh] mt-[0.6vh]">Escolhe aí que o controle é seu.</p>

      {modules.length === 0 ? (
        <p className="text-slate-300 text-[2.6vh] mt-[6vh]">
          Nenhum app por aqui ainda. Vai em <b>Apps</b> lá em cima e adiciona o primeiro.
        </p>
      ) : null}

      <div className="flex gap-[2vw] mt-[4vh]">
        {featured.map((module, idx) => (
          <FeaturedCard module={module} state={state} shouldFocus={idx === 0} />
        ))}
      </div>

      {others.length > 0 ? (
        <>
          <h2 className="text-[2.8vh] font-semibold text-slate-300 mt-[5vh] mb-[2vh]">Outros apps</h2>
          <div className="flex flex-wrap">
            {others.map((module) => <SmallCard module={module} state={state} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}
