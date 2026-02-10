import FlowContainer from "@/components/home/FlowContainer";
import Sidebar from "@/components/home/Sidebar";

const Page = () => {
  return (
    <div className="h-screen w-full relative">
      <Sidebar />
      <FlowContainer />
    </div>
  );
};

export default Page;
