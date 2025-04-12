import './App.css';
import BackFrontint from './componets/BackFrontInt';
import BasicMultiUserChat from './componets/BasicMultiUserChat';
import Feature from './componets/Feature';
import Footer from './componets/Footer';
import Header from './componets/Header';
import Hero from './componets/Hero';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <>
        {/* <BackFrontint /> */}
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Feature />
              <Footer />
            </>
          } />
          <Route path="/room" element={<BasicMultiUserChat />} />
        </Routes>
      </>
    </Router>
  );
}

export default App;
