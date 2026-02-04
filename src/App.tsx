import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import Explore from './pages/Explore';
import Discover from './pages/Discover';
import SourceDetail from './pages/SourceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Exhibitions from './pages/Exhibitions';
import ExhibitionDetail from './pages/ExhibitionDetail';
import ExhibitionPart from './pages/ExhibitionPart';
import ExhibitionObject from './pages/ExhibitionObject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="explore" element={<Explore />} />
          <Route path="discover" element={<Discover />} />
          <Route path="source/:slug" element={<SourceDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="exhibitions" element={<Exhibitions />} />
          <Route path="exhibition/:slug" element={<ExhibitionDetail />} />
          <Route path="exhibition/:exhibitionSlug/part/:partId" element={<ExhibitionPart />} />
          <Route path="exhibition/:exhibitionSlug/object/:objectSlug" element={<ExhibitionObject />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
