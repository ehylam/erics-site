import { useEffect, useState } from 'react';

const Hero = props => {
  const [isLoaded, setLoaded] = useState(false);

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
    setLoaded(true);
  },[props.heading]);



  return (
    <section className={isLoaded ? 'hero active' : 'hero'}>
      <div className="hero__wrapper">
        <h5 className="hero__subheading"></h5>
        <h1 className="hero__heading">
          <div>
            {handleSplitHeading(props.heading, 1)}
          </div>
          <div>
            {handleSplitHeading(props.heading, 2)}
          </div>
        </h1>
      </div>
    </section>
  );
}

export default Hero;