"use client";

import NavLink from "./NavLink/NavLink";
import styles from "./links.module.css";
import { useState } from "react";

export interface LinkItem {
    path: string;
    title: string;
}
const links: Array<LinkItem> = [
    { path: "/", title: "Home" },
    { path: "/blog", title: "Blog" },
    { path: "/about", title: "About" },
    { path: "/contact", title: "Contact" }
    // { path: "https://tidymate-docs.vercel.com", title: "Docs ↗" }
];

const Links = () => {
    const [open, setOpen] = useState(false);

    const session = true;
    const isAdmin = true;

    return (
        <div className={styles.container}>
            <div className={styles.links}>
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        path={link.path}
                        title={link.title}
                    />
                ))}
                {session ? (
                    <>
                        {isAdmin && (
                            <NavLink key="/admin" path="/admin" title="Admin" />
                        )}
                        <button className={styles.logout}>Logout</button>
                    </>
                ) : (
                    <NavLink key="/login" path="/login" title="Login" />
                )}
            </div>
            <button
                className={styles.menuButton}
                onClick={() => setOpen((prev) => !prev)}
            >
                Menu
            </button>
            {open && (
                <div className={styles.mobileLinks}>
                    {links.map((link) => (
                        <NavLink
                            key={link.path}
                            path={link.path}
                            title={link.title}
                        />
                    ))}
                    {session ? (
                        <>
                            {isAdmin && (
                                <NavLink
                                    key="/admin"
                                    path="/admin"
                                    title="Admin"
                                />
                            )}
                            <button className={styles.logout}>Logout</button>
                        </>
                    ) : (
                        <NavLink key="/login" path="/login" title="Login" />
                    )}
                </div>
            )}
        </div>
    );
};

export default Links;
