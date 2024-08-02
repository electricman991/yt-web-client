import Image from "next/image";
import Link from "next/link";
import Upload from "./upload"
import { getServerAuthSession } from "@/server/auth";

import styles from "./navbar.module.css";

export default async function Navbar() {
    const session = await getServerAuthSession();
    return (
      <nav className={styles.nav}>
        <Link href="/">
          <Image width={90} height={20}
            src="/youtube-logo.svg" alt="YouTube Logo"/>
        </Link>

        { 
          session?.user && <Upload />
      }
      </nav>
    );
}
