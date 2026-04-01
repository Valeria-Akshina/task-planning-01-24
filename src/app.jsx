import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext.jsx';
import Index from './pages/Index.jsx';
import NotFound from './pages/NotFound.jsx';

const App = () => (
  <TaskProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TaskProvider>
);

export default App;
