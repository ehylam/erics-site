
const Content = () => {
  const data = [{
    heading: 'Japan. "19',
    subheading: 'Lorem ipsum'
  },
  {
    heading: 'Macau. "19',
    subheading: 'Lorem ipsum'
  },
  {
    heading: 'Australia. "21',
    subheading: 'Lorem ipsum'
  }];

  // Fixed component that utilises ScrollTrigger to fetch the currently displaying picture.
  return (
    <section className="content_block">
      <div className="content_block__content">
        <h2>{data[0].heading}</h2>
        <h4>{data[0].subheading}</h4>
      </div>
    </section>
   );
}

export default Content;