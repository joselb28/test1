import './App.css'
import HEADER from './components/head/HEADER.jsx'
import ds from './data/yes.jsx'
import MainS from './components/main/MainS.jsx'
import Footer from './components/footer/Footer.jsx'

const profiledata = ds[1];
const positems = ds.map((item, id) => (id >1 ? item : false)).filter(Boolean);

function App() {

  return (
    <>
      <HEADER/>
      <MainS user ={profiledata} List={positems}/>
      <Footer/>
    </>
  )

}
export default App

