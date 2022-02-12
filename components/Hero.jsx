import { useEffect, useState } from 'react';
import gsap from 'gsap';


const Hero = props => {
  // const [isLoaded, setLoaded] = useState(false);

  const handleSplitHeading = (string, half) => {
    const charArr = string.split('');
    const firstHalf = charArr.slice(0, charArr.length / 2);
    const secondHalf = charArr.slice(charArr.length / 2, charArr.length);

    if(half === 1) {
      return firstHalf.map((char, i) => {
        if(char === ' ') {
          return <span key={i}>&nbsp;</span>;
        }
        return <span key={i}>{char}</span>
      });
    } else {
      return secondHalf.map((char, i) => {
        if(char === ' ') {
          return <span key={i}>&nbsp;</span>;
        }
        return <span key={i}>{char}</span>
      });
    }
  }


  useEffect(() => {
    handleSplitHeading(props.heading);
    // setLoaded(true);


    const heroLightTl = gsap.timeline();
    // const heroGreenTl = gsap.timeline({ paused: true });


    heroLightTl.to('.hero__heading .light--first span', {
      y: '0%',
      // opacity: 1,
      stagger: 0.18,
      onStart: function() {
        gsap.set('.hero__heading .light', { zIndex: 2 });
        gsap.set('.hero__heading .green', { zIndex: 1 });
      }
    }).to('.hero__heading .light--second span', {
      y: '0%',
      opacity: 1,
      stagger: -0.18
    },0)
    // .to('.hero__heading .light span', {
    //   scale: 200,
    //   duration: 2,
    //   delay: 2,
    //   // onComplete: function() {
    //   //   heroGreenTl.play();
    //   // }
    // });

    // heroGreenTl.to('.hero__heading .green--first span', {
    //   y: '0%',
    //   opacity: 1,
    //   stagger: 0.18,
    //   onStart: function() {
    //     gsap.set('.hero__heading .green', { zIndex: 2 });
    //     gsap.set('.hero__heading .light', { zIndex: 1 });
    //   }
    // }).to('.hero__heading .green--second span', {
    //   y: '0%',
    //   opacity: 1,
    //   stagger: -0.18
    // },0).to('.hero__heading .green span', {
    //   scale: 200,
    //   duration: 2,
    //   delay: 2,
    //   onComplete: function() {
    //     heroLightTl.time(0).play();
    //   }
    // });

    // TODO: Turn the hero heading into a 'infinite' animation

    heroLightTl.play();
  },[]);



  return (
    <section className="hero">
      <div className="hero__wrapper">
        <h5 className="hero__subheading"></h5>
        <h1 className="hero__heading">
          <div className="light light--first">
            {handleSplitHeading(props.heading, 1)}
          </div>
          <div className="light light--second">
            {handleSplitHeading(props.heading, 2)}
          </div>
          {/* <div className="green green--first">
            {handleSplitHeading(props.heading, 1)}
          </div>
          <div className="green green--second">
            {handleSplitHeading(props.heading, 2)}
          </div> */}
        </h1>
      </div>
    </section>
  );
}

export default Hero;