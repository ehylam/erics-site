import Image from 'next/image';

const Content = (props) => {
  return (
    <section className="content_block">
      <h2>{props.heading}</h2>
      <p>{props.content}</p>
    </section>
   );
}

export default Content;