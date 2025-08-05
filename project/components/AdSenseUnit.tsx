'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface AdSenseUnitProps {
    slot: string;
    format?: 'horizontal' | 'vertical' | 'rectangle';
    responsive?: boolean;
    style?: React.CSSProperties;
}

export function AdSenseUnit({
    slot,
    format = 'horizontal',
    responsive = true,
    style = {}
}: AdSenseUnitProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            if (typeof window !== 'undefined' && (window as any).adsbygoogle && adRef.current) {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (err) {
            if (process.env.NODE_ENV === 'development') {
                console.log('AdSense error:', err);
            }
        }
    }, [slot]);

    const getAdDimensions = () => {
        switch (format) {
            case 'horizontal':
                return { width: '728px', height: '90px', maxWidth: '100%' };
            case 'vertical':
                return { width: '160px', height: '600px' };
            case 'rectangle':
                return { width: '300px', height: '250px' };
            default:
                return { width: '728px', height: '90px', maxWidth: '100%' };
        }
    };

    const dimensions = getAdDimensions();

    // In production, render actual AdSense ad
    if (process.env.NODE_ENV === 'production') {
        return (
            <div className="w-full flex justify-center my-4" style={style}>
                <ins
                    ref={adRef}
                    className="adsbygoogle"
                    style={{
                        display: 'block',
                        ...dimensions,
                    }}
                    data-ad-client="ca-pub-8588865009381819"
                    data-ad-slot={slot}
                    data-ad-format={responsive ? 'auto' : undefined}
                    data-full-width-responsive={responsive ? 'true' : 'false'}
                />
            </div>
        );
    }

    // In development, show placeholder
    return (
        <div className="w-full flex justify-center my-4" style={style}>
            <div
                className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400"
                style={dimensions}
            >
                <div className="text-center">
                    <div className="text-sm font-medium">Google AdSense</div>
                    <div className="text-xs opacity-75">{format.charAt(0).toUpperCase() + format.slice(1)} Ad Unit</div>
                    <div className="text-xs opacity-50 mt-1">Slot: {slot}</div>
                </div>
            </div>
        </div>
    );
}