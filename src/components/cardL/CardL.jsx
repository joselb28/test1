import '/CardL.css'
import Card from '../Cardd/Card'
export default function CardL({items}){

    return(
        <ul className='cardList'>
            {items.map((item) => ( <Card key={item.id} card={item} />))}
            
        </ul>
    
    )
}