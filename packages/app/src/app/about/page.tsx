import styles from "./about.module.css";
import Image from "next/image";

const AboutPage = () => {
    return (
        <div>
            <div className={styles.imgContainer}>
                <Image src="/about.png" alt="About" width={400} height={400} />
            </div>
        </div>
    );
};

export default AboutPage;
