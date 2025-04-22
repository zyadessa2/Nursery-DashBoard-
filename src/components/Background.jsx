import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

const Background = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        console.log(container);
    }, []);

    return (
        <div>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={{
                    background: {
                        color: { value: '#030' },
                    },
                    fpsLimit: 120,
                    interactivity: {
                        events: {
                            onClick: { enable: true, mode: 'push' },
                            onHover: { enable: true, mode: 'repulse' },
                            resize: true,
                        },
                        modes: {
                            push: { quantity: 4 },
                            repulse: { distance: 200, duration: 0.4 },
                        },
                    },
                    particles: {
                        color: { value: '#ffafff' },
                        links: { color: '#ffafff', distance: 150, enable: true, opacity: 0.5, width: 1 },
                        move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 6, straight: false },
                        number: { density: { enable: true, area: 800 }, value: 80 },
                        opacity: { value: 0.5 },
                        shape: { type: 'circle' },
                        size: { value: { min: 1, max: 5 } },
                    },
                    detectRetina: true,
                }}
                style={{ position: 'absolute', width: '100%', height: '100vh' }}
            />
            <h1 style={{ position: 'relative', color: 'white', textAlign: 'center', paddingTop: '20%' }}>Hello, Particles!</h1>
        </div>
    );
};

export default Background;