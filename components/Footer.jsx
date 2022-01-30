const Footer = (props) => {
  return (
    <footer className="footer">
      <span className="footer__content">
        {props.text}
      </span>
    </footer>
   );
}

export default Footer;