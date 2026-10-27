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
                behavior: 'auto',
                block: 'nearest',
                inline: 'nearest',
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
            <h1 className="font-display text-[4.8vh] font-extrabold tracking-tight leading-tight">{title}</h1>
            {subtitle ? <p className="text-[#A3A19A] text-[2.4vh] mt-[0.8vh]">{subtitle}</p> : null}
        </div>
    );
}
