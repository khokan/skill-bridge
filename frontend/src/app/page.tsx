import HomePage from "@/components/modules/home/page";
import { Footer } from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";


export const dynamic = "force-dynamic";

export default function HomePageMain() {  
    return (
            <>
             <Navbar />
             <HomePage />   
             <Footer /> 
            </>)
}   