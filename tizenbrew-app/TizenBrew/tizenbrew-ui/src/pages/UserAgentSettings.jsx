import { useTranslation } from "react-i18next";
import Card, { PageTitle } from "../components/Card.jsx";

const UserAgents = [
    {
        name: 'UE50MU7000',
        worksOnTizen: 3,
        userAgent: 'Mozilla/5.0 (LINUX; Tizen/3.0/2017.1.0) Cobalt/9.lts-gold (unlike Gecko) gles Evergreen/1.0.0 Starboard/9, Samsung_TV_KANTM_2017/T-MDEUC-1420.0 (Samsung, UE50MU7000, Wired)'
    },
    {
        name: 'QN55Q80AAFXZA',
        worksOnTizen: 6,
        userAgent: 'Mozilla/5.0 (LINUX; Tizen/6.0/2021.1.3) Cobalt/21.lts.4.302899-gold (unlike Gecko) v8/7.7.299.8-jit gles Evergreen/1.4.3 Starboard/12, Samsung_TV_NIKEM2_2021/T-NKM2AKUC-2111.1 (Samsung, QN55Q80AAFXZA, Wired)'
    },
    {
        name: 'settings.uaBasedOnDevice',
        userAgent: () => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", "http://127.0.0.1:8001/api/v2/", false);
            xhr.send();

            let apiData = {};
            try {
                apiData = JSON.parse(xhr.responseText);
            } catch (e) {
                alert("Failed to parse API response:", e);
            }

            const firmware = tizen.systeminfo.getCapability("http://tizen.org/custom/sw_version"),
                model = tizen.systeminfo.getCapability("http://tizen.org/system/model_name"),
                chipsetModel = apiData.device.model.split('_')[1],
                deviceName = `_TV_${chipsetModel}`,
                newUserAgent = `${window.navigator.userAgent}, ${deviceName}/${firmware} (Samsung, ${model}, Wired)`;

            return newUserAgent;
        }
    }
];

function ItemBasic({ children, onClick, shouldFocus }) {
    return <Card onClick={onClick} shouldFocus={shouldFocus} className="setting-card">{children}</Card>;
}

export default function UserAgentSettings() {
    const { t } = useTranslation();
    return (
        <div className="px-[5vw] pt-[3vh]">
            <PageTitle title="User-Agent" subtitle="Coisa de nerd: muda como os apps enxergam a sua TV. Na dúvida, deixa no Padrão." />
            <div className="flex flex-wrap">
                {UserAgents.map((ua, idx) => {
                    return (
                        <ItemBasic key={idx} onClick={() => {
                            const userAgent = typeof ua.userAgent === 'function' ? ua.userAgent() : ua.userAgent;
                            if (confirm(`${t('settings.setUaTo', { userAgent: userAgent })}\n\n${t('settings.uaNegativeEffects')}`)) {
                                localStorage.setItem('userAgent', userAgent);
                                alert(t('settings.uaSetRelaunch'));
                                tizen.application.getCurrentApplication().exit();
                            }
                        }} shouldFocus={idx === 0}>
                            <h3 className='text-sky-400 text-[2.8vh] font-bold'>
                                {t(ua.name)}
                            </h3>
                            <p className='text-slate-300 mt-[1.5vh] text-[2.2vh] leading-snug'>
                                {ua.worksOnTizen ? t('settings.worksOnTizen', { version: ua.worksOnTizen }) : ''}
                            </p>
                        </ItemBasic>
                    )
                })}
                <ItemBasic onClick={() => {
                    localStorage.removeItem('userAgent');
                    alert(t('settings.uaSetRelaunch'));
                    tizen.application.getCurrentApplication().exit();
                }}>
                    <h3 className='text-sky-400 text-[2.8vh] font-bold'>
                        {t('settings.default')}
                    </h3>
                </ItemBasic>
            </div>
        </div>
    )
}