import './MainS.css'
import CardL from '../cardl/CardL'
import Profile from '../profile/Profile'
export default function MainS({user, List}) {
  return (
    <main>
    <Profile user ={user} PostCount = {List.length}/>
    <CardL items={List}/>
    </main>
  )

}
