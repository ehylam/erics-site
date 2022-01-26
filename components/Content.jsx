import Text from './Text';
import Image from 'next/image';

const Content = (props) => {
  return (
    <section className="content_block">
      <Text text="Hello, this is my website that I finish before the end of this year (2022). Please do enjoy the jank construction that is being conducting in this site!" />

      <Image
        src="/images/pic1.jpeg"
        alt="Landscape picture"
        width={500}
        height={500}
      />


<Image
        src="/images/pic2.jpeg"
        alt="Landscape picture"
        width={500}
        height={500}
      />
    </section>
   );
}

export default Content;