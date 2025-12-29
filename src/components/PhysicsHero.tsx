import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export const PhysicsHero = () => {
    const sceneRef = useRef<HTMLDivElement>(null);
    const engineRef = useRef<Matter.Engine | null>(null);

    useEffect(() => {
        if (!sceneRef.current) return;

        // Module aliases
        const Engine = Matter.Engine;
        const Render = Matter.Render;
        const World = Matter.World;
        const Bodies = Matter.Bodies;
        const Mouse = Matter.Mouse;
        const MouseConstraint = Matter.MouseConstraint;

        // Create engine with ZERO GRAVITY (anti-gravity effect!)
        const engine = Engine.create({
            gravity: { x: 0, y: 0, scale: 0 },
        });
        engineRef.current = engine;

        // Create renderer
        const render = Render.create({
            element: sceneRef.current,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
            },
        });

        // Google-style vibrant colors
        const colors = [
            '#EA4335', // Google Red
            '#4285F4', // Google Blue
            '#FBBC04', // Google Yellow
            '#34A853', // Google Green
            '#14B8A6', // Teal
            '#8B5CF6', // Purple
            '#EC4899', // Pink
            '#F59E0B', // Orange
        ];

        // Create floating shapes (40 random objects)
        const shapes: Matter.Body[] = [];
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const size = Math.random() * 40 + 20;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const shapeType = Math.floor(Math.random() * 3);

            let shape: Matter.Body;

            if (shapeType === 0) {
                // Circle
                shape = Bodies.circle(x, y, size / 2, {
                    restitution: 0.9, // High bounce
                    friction: 0.001,
                    frictionAir: 0.01, // Low air resistance for smooth floating
                    render: { fillStyle: color },
                });
            } else if (shapeType === 1) {
                // Rectangle
                shape = Bodies.rectangle(x, y, size, size, {
                    restitution: 0.9,
                    friction: 0.001,
                    frictionAir: 0.01,
                    render: { fillStyle: color },
                });
            } else {
                // Polygon (hexagon)
                shape = Bodies.polygon(x, y, 6, size / 2, {
                    restitution: 0.9,
                    friction: 0.001,
                    frictionAir: 0.01,
                    render: { fillStyle: color },
                });
            }

            // Add random initial velocity for floating effect
            Matter.Body.setVelocity(shape, {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
            });
            Matter.Body.setAngularVelocity(shape, (Math.random() - 0.5) * 0.05);

            shapes.push(shape);
        }

        // Create invisible walls to contain shapes
        const wallOptions = {
            isStatic: true,
            render: { fillStyle: 'transparent' },
        };

        const walls = [
            Bodies.rectangle(window.innerWidth / 2, -25, window.innerWidth, 50, wallOptions), // Top
            Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, wallOptions), // Bottom
            Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, wallOptions), // Left
            Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, wallOptions), // Right
        ];

        // Add all bodies to world
        World.add(engine.world, [...shapes, ...walls]);

        // Add mouse control
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false },
            },
        });

        World.add(engine.world, mouseConstraint);

        // Keep mouse in sync with rendering
        render.mouse = mouse;

        // Run engine and renderer
        Engine.run(engine);
        Render.run(render);

        // Handle window resize
        const handleResize = () => {
            render.canvas.width = window.innerWidth;
            render.canvas.height = window.innerHeight;
            render.options.width = window.innerWidth;
            render.options.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            Render.stop(render);
            World.clear(engine.world, false);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, []);

    return (
        <div
            ref={sceneRef}
            className="fixed inset-0 pointer-events-auto z-0"
            style={{ touchAction: 'none' }}
        />
    );
};
