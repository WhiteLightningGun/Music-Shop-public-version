/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { keyframes } from '@emotion/react';
import { useEffect } from 'react';
import { draw } from './AboutBodyCanvasDraw';
import { CreateParticlesArray } from './AboutBodyCanvasDraw';
import AboutBodyFrame from './AboutBodyFrame';

function AboutBody() {
  useEffect(() => {
    const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    let particles = CreateParticlesArray(120, canvas.width, canvas.height);
    let animationFrameId: number;

    //disable the horizontal scroll bar
    document.body.style.overflowX = 'hidden';

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
        document.body.style.overflowX = 'auto';
      };
    }
  }, []);
  const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
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
          object-fit: contain;
          z-index: -1;
          animation: ${fadeIn} 1s ease-in-out; // Apply the animation
        `}
        id="myCanvas"
        width="2200"
        height="1080"
      ></canvas>
      <div className="container">
        <div
          className="row d-flex align-items-center justify-content-center"
          css={css`
            min-height: 88vh;
            z-index: 1;
          `}
        >
          <AboutBodyFrame />
        </div>
      </div>
    </>
  );
}

export default AboutBody;

//
