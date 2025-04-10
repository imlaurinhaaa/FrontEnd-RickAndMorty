"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import CharacterCard from "../../components/CharacterCard";
import styles from "./Home.module.css";

export default function Home() {
    const [characters, setCharacters] = useState([]);

    useEffect(() => {
        axios.get("https://rickandmortyapi.com/api/character/")
            .then(response => {
                setCharacters(response.data.results);
            })
            .catch(error => {
                console.log("Erro ao buscar os personagens", error);
            });
    }, []);

    console.log(characters);

    return(
        <div className={styles.container}>
            <h1 className={styles.title}>Rick and Morty | Personagens 🧪🚀</h1>
            <div className={styles.grid}>
            {characters.map((char) => (
                <CharacterCard key={char.id} character={char} />
            ))}
            </div>
        </div>
    );
}