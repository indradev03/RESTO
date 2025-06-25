    import React, { useEffect, useState } from 'react';
    import slide1 from '../../assets/slide1.jpg';
    import slide2 from '../../assets/slide2.jpg';
    import slide3 from '../../assets/slide3.jpg';
    import slide4 from '../../assets/slide4.jpg';
    import '../../css/Slideshow.css';

    const slides = [slide1, slide2, slide3, slide4];

    const Slideshow = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
        <div className="slideshow-container" aria-label="Slideshow">
            {slides.map((slide, index) => (
            <div
                className={`slide ${index === current ? 'active-slide' : ''}`}
                key={index}
                aria-hidden={index !== current}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${slides.length}`}
            >
                <img src={slide} alt={`Slide ${index + 1}`} />
            </div>
            ))}
        </div>

        <div className="dots-container" role="tablist" aria-label="Slide navigation">
            {slides.map((_, index) => (
            <span
                key={index}
                className={`dot ${index === current ? 'active' : ''}`}
                onClick={() => setCurrent(index)}
                role="tab"
                tabIndex={0}
                aria-selected={index === current}
                aria-label={`Go to slide ${index + 1}`}
                onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    setCurrent(index);
                }
                }}
            />
            ))}
        </div>
        </>
    );
    };

    export default Slideshow;
