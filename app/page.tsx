import FlowContainer from "@/components/home/FlowContainer";
import Sidebar from "@/components/home/Sidebar";
import { ReactFlowProvider } from "@xyflow/react";

const Page = () => {
  return (
    <ReactFlowProvider>
      <div className="h-screen w-full relative">
        <Sidebar />
        <FlowContainer />
      </div>
    </ReactFlowProvider>
  );
};

export default Page;
