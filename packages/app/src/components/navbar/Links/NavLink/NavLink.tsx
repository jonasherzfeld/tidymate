"use client";

import Link from 'next/link';
import styles from './navLink.module.css';
import { usePathname } from 'next/navigation';
import type {LinkItem} from '../Links';


const NavLink = ({ path, title }: LinkItem)  => {
    const pathName = usePathname();

    return (
        <Link
            href={path}
            className={`${styles.container} ${
                pathName === path && styles.active
            }`}
        >
            {title}
        </Link>
    );
};

export default NavLink;
