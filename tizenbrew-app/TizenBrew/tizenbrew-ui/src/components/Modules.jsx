import { useContext } from 'react';
import { GlobalStateContext } from './ClientContext.jsx';
import Card from './Card.jsx';
import { brand, sortModules, launchModule, BrandIcon, SeraflixLogo, YouTubeLogoUrl } from './brand.jsx';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Corujão liberado';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function FeaturedLogo({ b }) {
  if (b.id === 'seraflix') return <SeraflixLogo className="text-[9vh]" />;
  if (b.id === 'youtube') return <img src={YouTubeLogoUrl} className="h-[9vh] w-auto" />;
  return <h2 className="font-display text-[7vh] font-extrabold leading-none">{b.name}</h2>;
}

function FeaturedCard({ module, state, shouldFocus }) {
  const b = brand(module);
  return (
    <Card
      shouldFocus={shouldFocus}
      onClick={() => launchModule(module, state)}
      className={`featured featured-${b.id}`}
    >
      <div className="featured-glow" />
      <div className="featured-logo">
        <FeaturedLogo b={b} />
      </div>
      <div className="relative">
        <p className="eyebrow">{b.tagline}</p>
        <p className="text-[2.5vh] text-[#A3A19A] mt-[1.2vh] leading-snug">{b.description}</p>
      </div>
      <span className="play-hint">OK para abrir</span>
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
        <p className="text-[2vh] text-[#A3A19A] line-clamp-2">{b.description}</p>
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
      <h1 className="font-display text-[5vh] font-extrabold tracking-tight">{greeting()}! Bora assistir o quê?</h1>
      <p className="text-[#A3A19A] text-[2.4vh] mt-[0.6vh]">Escolhe aí que o controle é seu.</p>

      {modules.length === 0 ? (
        <p className="text-[#D9D7D0] text-[2.6vh] mt-[6vh]">
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
          <h2 className="text-[2.8vh] font-semibold text-[#D9D7D0] mt-[5vh] mb-[2vh]">Outros apps</h2>
          <div className="flex flex-wrap">
            {others.map((module) => <SmallCard module={module} state={state} />)}
          </div>
        </>
      ) : null}
    </div>
  );
}
