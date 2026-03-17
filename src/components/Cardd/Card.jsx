import '/Card.css'

export default function CardL({card}){

    return(
        <li className='card'>
            <img className='card-image' src={card.image} alt={card.desc}/>
            <div className='card-description'>
                <h2>{card.titre}</h2>
                <p>{card.texte}</p>
            </div> 
        </li>
    )
}