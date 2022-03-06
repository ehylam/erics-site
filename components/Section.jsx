const Section = (props) => {
  return (
    <section className={props.classLabel ? `section ${props.classLabel}` : 'section'}>
      { props.children }
    </section>
   );
}

export default Section;