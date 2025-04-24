import styles from "../styles/CharacterCard.module.css";
import Image from "next/image";

export default function CharacterCard({ character, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <Image
                src={character.image}
                alt={character.name}
                width={225}
                height={225}
                className={styles.avatar}
            />

            <div className={styles.info}>
                <h3 className={styles.title}>{character.name}</h3>
                <p className={styles.text}>Status: {character.status}</p>
                <p className={styles.text}>Specie: {character.species}</p>
                <p className={styles.text}>Type: {character.type || "Null"}</p>
                <p className={styles.text}>Gender: {character.gender}</p>
            </div>
        </div>
    );
}
