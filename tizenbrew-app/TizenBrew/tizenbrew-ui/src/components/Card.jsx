import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import { useEffect } from 'react';

// Cartão focável pelo controle remoto. Todas as telas usam ele.
export default function Card({ children, onClick, shouldFocus, className = '', style }) {
    const { ref, focused, focusSelf } = useFocusable();

    useEffect(() => {
        if (shouldFocus) focusSelf();
    }, []);

    useEffect(() => {
        if (focused) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'center',
            });
        }
    }, [focused, ref]);

    return (
        <div
            ref={ref}
            onClick={onClick}
            style={style}
            className={`card ${focused ? 'focus' : ''} ${className}`}
        >
            {children}
        </div>
    );
}

export function PageTitle({ title, subtitle }) {
    return (
        <div className="mb-[4vh]">
            <h1 className="text-[4.6vh] font-bold leading-tight">{title}</h1>
            {subtitle ? <p className="text-slate-400 text-[2.4vh] mt-[0.8vh]">{subtitle}</p> : null}
        </div>
    );
}
