import NextImage from 'next/image';
const Image = (props) => {
  return (
    <div className="image">
      <NextImage
        src={props.src}
        alt={props.alt ? props.alt : ''}
        layout="fill"
        objectFit="cover"
      />
    </div>
   );
}

export default Image;