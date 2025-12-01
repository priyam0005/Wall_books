import { Outlet } from 'react-router-dom';
import ClassicSocialHeader from './components/header';
import ExclusiveHomepage from './components/home';
import SimpleSidebar from './components/sidebar';

function App() {
  return (
    <>
      <div className="w-full flex space-x-0">
        <SimpleSidebar />
        <div className=" w-full items-center bg-slate-900">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
