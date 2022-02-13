const Section = (props) => {
  return (
    <section className={props.id ? `section ${props.id}` : 'section'}>
      {props.children}
    </section>
   );
}

export default Section;