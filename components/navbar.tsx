import { signOut } from "firebase/auth";
import { MainNav } from "./main-nav";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/firebaseApp";

const Navbar = () => {
    const router = useRouter();
    // logout function
    const logout = async () => {
        await signOut(auth);
        router.push('/login');
    };
    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <div>
                    <h1 className="text-2xl font-bold">Thrifty G</h1>
                </div>

                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <Button className="
                    hover:bg-red-500
                    " onClick={() => auth.signOut()}>Sign-out</Button>

                </div>

            </div>
        </div>
    );
}

export default Navbar;