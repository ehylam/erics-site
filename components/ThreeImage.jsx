const ThreeImage = (props) => {
  return (
    <section className="image">
      <img className="interactable" src={props.src} alt="pic1" />
    </section>
   );
}

export default ThreeImage;