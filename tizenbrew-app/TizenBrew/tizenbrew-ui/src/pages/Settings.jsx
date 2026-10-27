import { setFocus } from '@noriginmedia/norigin-spatial-navigation'
import { useContext } from 'react';
import { GlobalStateContext } from '../components/ClientContext.jsx';
import { Events } from '../components/WebSocketClient.js';
import { useLocation } from 'preact-iso';
import { useTranslation } from 'react-i18next';
import Card, { PageTitle } from '../components/Card.jsx';

function ItemBasic({ children, onClick, shouldFocus }) {
    return <Card onClick={onClick} shouldFocus={shouldFocus} className="setting-card">{children}</Card>;
}
export default function Settings() {
    const { state } = useContext(GlobalStateContext);
    const loc = useLocation();
    const { t } = useTranslation();

    return (
        <div className="px-[5vw] pt-[3vh]">
            <PageTitle title="Ajustes" subtitle="Mexe à vontade, mas com carinho." />
            <div className="flex flex-wrap">
                <ItemBasic onClick={() => {
                    if (state.sharedData.modules?.length === 0) return alert(t('settings.noModules'));
                    loc.route('/tizenbrew-ui/dist/index.html/settings/change?type=autolaunch');
                }}>
                    <h3 className='text-[#A9B4F5] text-[2.8vh] font-bold'>
                        {t('settings.autolaunch')}
                    </h3>
                    <p className='text-[#D9D7D0] mt-[1.5vh] text-[2.2vh] leading-snug'>
                        {t('settings.autolaunchDesc')}
                    </p>
                </ItemBasic>
                <ItemBasic onClick={() => {
                    if (state.sharedData.modules?.length === 0) return alert(t('settings.noModules'));
                    loc.route('/tizenbrew-ui/dist/index.html/settings/change?type=autolaunchService');
                }}>
                    <h3 className='text-[#A9B4F5] text-[2.8vh] font-bold'>
                        {t('settings.autolaunchService')}
                    </h3>
                    <p className='text-[#D9D7D0] mt-[1.5vh] text-[2.2vh] leading-snug'>
                        {t('settings.autolaunchServiceDesc')}
                    </p>
                </ItemBasic>
                <ItemBasic onClick={() => {
                    loc.route('/tizenbrew-ui/dist/index.html/settings/change-ua');
                }}>
                    <h3 className='text-[#A9B4F5] text-[2.8vh] font-bold'>
                        {t('settings.useragent')}
                    </h3>
                    <p className='text-[#D9D7D0] mt-[1.5vh] text-[2.2vh] leading-snug'>
                        {t('settings.useragentDesc')}
                    </p>
                </ItemBasic>
            </div>
        </div>
    )
}

function Change() {
    const loc = useLocation();
    const { state } = useContext(GlobalStateContext);
    const { t } = useTranslation();

    return (
        <div className="px-[5vw] pt-[3vh]">
            <PageTitle title={loc.query.type === 'autolaunchService' ? 'Serviço que liga sozinho' : 'App que abre sozinho'} subtitle="Escolhe um. Segura a seta pra cima ao abrir se quiser pular." />
            <div className="flex flex-wrap">
                {state?.sharedData?.modules?.map((module, idx) => {
                    if (loc.query.type === 'autolaunchService' && !module.serviceFile) return null;
                    return (
                        <ItemBasic state={state}
                            shouldFocus={idx === 0}
                            key={idx}
                            onClick={() => {
                                if (confirm(t('settings.enableAutolaunchPrompt', { packageName: module.appName }))) {
                                    state.client.send({
                                        type: Events.ModuleAction,
                                        payload: {
                                            action: loc.query.type,
                                            module: module.fullName
                                        }
                                    });
                                    loc.route('/tizenbrew-ui/dist/index.html/settings');
                                    setFocus('nav-home');
                                }
                            }}>
                            <h3
                                className='text-[#A9B4F5] text-[2.8vh] font-bold'
                            >
                                {module.appName} ({module.version})
                            </h3>
                            <p className='text-[#D9D7D0] mt-[1.5vh] text-[2.2vh] leading-snug'>
                                {module.description}
                            </p>
                        </ItemBasic>
                    )
                })}
                <ItemBasic
                    shouldFocus={state?.sharedData?.modules?.length === 0}
                    onClick={() => {
                        if (confirm(t('settings.disableAutolaunchPrompt'))) {
                            state.client.send({
                                type: Events.ModuleAction,
                                payload: {
                                    action: loc.query.type,
                                    module: ''
                                }
                            });
                            loc.route('/tizenbrew-ui/dist/index.html/settings');
                            setFocus('nav-home');
                        }
                    }}>
                    <h3 className='text-[#A9B4F5] text-[2.8vh] font-bold'>
                        {t('settings.disableAutolaunch')}
                    </h3>
                </ItemBasic>
            </div>
        </div>
    )
}

export {
    Change
}