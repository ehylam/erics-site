import Image from 'next/image';

const Hero = () => {
  return (
    <section className="section hero">
      <h1>Welcome <span className="hi">👋</span></h1>

      <div className="hero__image">
        <Image
          src="/images/pic3.jpeg"
          alt="hero"
          layout="fill"
          quality={100} />

      </div>
    </section>
  );
}

export default Hero;