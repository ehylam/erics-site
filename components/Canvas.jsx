import ImageTransition from '../lib/utils/ImageTransition';
import { useEffect } from 'react';

const Canvas = () => {

  useEffect(() => {
    new ImageTransition('canvas');
  },[]);

  return (
    <>
      <section className="canvas">
        <canvas>
        </canvas>
      </section>

      <div className="fullscreen"></div>
    </>
   );
}

export default Canvas;