import Navbar from "./Navbar";
import Footer from "./Footer";
function Layout({children}){
  return (<>
    <div className="scroll-smooth min-h-screen flex flex-col overflow-x-hidden w-full ">
      <Navbar/>
      <main className="flex-1 overflow-x-hidden w-full">
        {children}
      </main>
      <Footer/>
    </div>
  </>);
}

export default Layout;