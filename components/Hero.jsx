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


    const heroTl = gsap.timeline();


    heroTl.to('.hero__heading div:first-child span', {
      y: '0%',
      opacity: 1,
      stagger: 0.18
    }).to('.hero__heading div:last-child span', {
      y: '0%',
      opacity: 1,
      stagger: 0.18
    },0).to('.hero__heading span', {
      scale: 200,
      duration: 2,
      delay: 2
    }).to('.hero__heading div', {
      backgroundColor: '#fff',
    });

    // TODO: Turn the hero heading into a 'infinite' animation

    heroTl.play();
  },[]);



  return (
    <section className="hero">
      <div className="hero__wrapper">
        <h5 className="hero__subheading"></h5>
        <h1 className="hero__heading">
          <div className="light">
            {handleSplitHeading(props.heading, 1)}
          </div>
          <div className="light">
            {handleSplitHeading(props.heading, 2)}
          </div>
          <div className="dark">
            {handleSplitHeading(props.heading, 1)}
          </div>
          <div className="dark">
            {handleSplitHeading(props.heading, 2)}
          </div>
        </h1>
      </div>
    </section>
  );
}

export default Hero;