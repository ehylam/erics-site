import Image from 'next/image';

const Content = (props) => {
  return (
    <section className="content_block">
      <p>{props.content}</p>
    </section>
   );
}

export default Content;