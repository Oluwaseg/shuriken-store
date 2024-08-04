import Sidebar from "./sidebar";
import Navbar from "../components/Navbar";
function RootLayout({ children }) {
  return (
    <div className="flex gap-2">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="max-w-5xl flex-1 mx-auto py-4 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default RootLayout;
