import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { BrandHeader } from "@/components/BrandHeader";
import Onboarding from "@/pages/Onboarding";
import Founders from "@/pages/Founders";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-neutral-950">
      <BrandHeader />
      {children}
      <footer className="border-t border-neutral-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="overline text-neutral-500">
            © 2026 NEXUS AI COMMUNITY HUB · UAE
          </span>
          <span className="overline text-neutral-500">
            Engine · Claude Sonnet 4.5 · PDPL Compliant
          </span>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/founders" element={<Founders />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
