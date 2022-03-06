const Content = (props) => {
  return (
    <div className="content__wrapper" style={{width: props.data.width > 0 ? props.data.width : '50%' }}>
      <p>{ props.data.copy }</p>
    </div>
   );
}

export default Content;