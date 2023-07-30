import React from "react";
import Link from "next/link";

const Header = () => {
    return (
        <section className="bg-rose-500 grid grid-cols-2 ">
        <Link href="/"
             className="text-2xl font-bold">T-Drop
        </Link>
        <nav className="grid grid-cols-1 ">
            <ul className="grid grid-cols-3 justify-around">
            <li><Link href="/about"
             className="text-lg ">Categories
            </Link></li>

            <li><Link href="/contact" className="text-lg">Contact
            </Link></li>
            <li><Link href="/login" className="text-lg bg-sky-500">Login</Link></li>
            </ul>
        </nav>
        </section>
    );
    }

export default Header;

