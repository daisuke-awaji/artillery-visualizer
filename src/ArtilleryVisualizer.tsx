import { Content, Sidebar, Toolbar } from './components';

const ArtilleryVisualizer: React.FC = () => {
  return (
    <div className="flex flex-col h-full w-full h-screen">
      <Toolbar />
      <div className="flex flex-row flex-1 overflow-hidden">
        <Sidebar />
        <Content />
      </div>
      {/* <Toaster position="bottom-center" reverseOrder={false} /> */}
      {/* <ConvertToLatestModal /> */}
    </div>
  );
};

export default ArtilleryVisualizer;
