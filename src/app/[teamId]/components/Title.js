


const Title = ({title, text, className}) => {

  return(
    <div className={className}>
      <p className="text-lg font-bold mb-1">
        {title}
      </p>
      <p className="text-sm mb-5 font-semibold ">
        {text}
      </p>
    
    </div>
  )
}

export default Title