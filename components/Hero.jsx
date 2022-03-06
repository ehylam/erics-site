import { useEffect, useState } from 'react';
import gsap from 'gsap';


const Hero = props => {
  const headings = props.headings;
  const [headingsToShow, setHeadingsToShow] = useState(headings.slice(0, 3));


  function handleSplitHeading (string) {
    const charArr = string.split('');

    return charArr.map((char, i) => {
      if(char === ' ') {
        return <span className="parent" key={i}><span>&nbsp;</span></span>;
      }
      return <span className="parent" key={i}><span>{char}</span></span>
    });
  }


  // Output the headings as a string
  const headingsString = headingsToShow.map((heading, i) => <h1 key={i} className="hero__heading">{handleSplitHeading(heading)}</h1>);

  useEffect(() => {
    const headings = gsap.utils.toArray('.hero__heading');
    const parentSpanTl = gsap.timeline();
    const childSpanTl = gsap.timeline();


    headings.forEach((heading) => {
      const parentSpans = gsap.utils.toArray('span.parent', heading);

      parentSpanTl.to(parentSpans, {
        opacity: 1,
        duration: 1.5,
        stagger: 0.02,
        onComplete: function(){
          const childSpans = gsap.utils.toArray('span:not(.parent)', heading);
          childSpanTl.to(childSpans, {
            x: '100%',
            opacity: 0,
            duration: 0.32,
            onComplete: function(){
              gsap.set(heading, {className: 'hero__heading right'});
              childSpanTl.to(childSpans, {
                x: '-100%',
                duration: 0,
                ease: 'ease-in-out'
              }).to(childSpans, {
                x: '0%',
                opacity: 1,
                duration: 0.32,
                ease: 'ease-in-out'
              });
            }
          });
        }
      });
    });

  },[]);


  return (
    <section className="hero">
      <div className="hero__wrapper">
        {headingsString}
      </div>
    </section>
  );
}

export default Hero;