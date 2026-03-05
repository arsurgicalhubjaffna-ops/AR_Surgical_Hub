import React, { useState } from 'react';

interface ProductImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    placeholderClassName?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = "", placeholderClassName = "" }) => {
    const [error, setError] = useState(false);
    const firstLetter = alt ? alt.charAt(0).toUpperCase() : '?';

    if (!src || error) {
        return (
            <div className={`flex items-center justify-center bg-brand-bg text-brand-green/30 font-900 tracking-widest uppercase select-none ${className} ${placeholderClassName}`}>
                <div className="flex flex-col items-center gap-1">
                    {/* <span className="text-xl">{firstLetter}</span> */}
                    <span className="text-[0.6rem] opacity-50 tracking-normal">AR SURGICAL</span>
                </div>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => {
                console.warn(`Failed to load image: ${src}`);
                setError(true);
            }}
        />
    );
};

export default ProductImage;
