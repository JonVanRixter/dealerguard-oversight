import { Outlet } from "react-router-dom";
import TCGHeader from "@/components/tcg/TCGHeader";
import TCGSidebar from "@/components/tcg/TCGSidebar";
import TCGBreadcrumb from "@/components/tcg/TCGBreadcrumb";
import ImpersonationBanner from "@/components/tcg/ImpersonationBanner";

const TCGLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <TCGHeader />
      <ImpersonationBanner />
      <div className="flex flex-1">
        <TCGSidebar />
        <div className="flex-1 flex flex-col">
          <TCGBreadcrumb />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default TCGLayout;
