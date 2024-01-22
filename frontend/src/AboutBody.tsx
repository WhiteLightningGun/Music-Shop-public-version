/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { draw } from './AboutBodyCanvasDraw';
import { CreateParticlesArray } from './AboutBodyCanvasDraw';
import AboutBodyFrame from './AboutBodyFrame';

function AboutBody() {
  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    let particles = CreateParticlesArray(150, canvas.width, canvas.height);
    let animationFrameId: number;

    if (context) {
      const animate = (time: number) => {
        draw(context, canvas, time, particles);
        animationFrameId = requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, []);
  return (
    <>
      {' '}
      <canvas
        css={css`
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 100vh;
          width: auto;
          object-fit: contain;
          z-index: -1;
        `}
        id="myCanvas"
        width="2200"
        height="1080"
      ></canvas>
      <div
        css={css`
          min-height: 88vh;
          z-index: 1;
          background: radial-gradient(
            circle at center,
            transparent 10%,
            rgb(255, 255, 255) 85%
          );
        `}
      >
        <AboutBodyFrame />
      </div>
    </>
  );
}

export default AboutBody;
