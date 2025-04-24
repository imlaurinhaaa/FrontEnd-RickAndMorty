"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./Home.module.css";
import CharacterCard from "../../components/CharacterCard";
import Loader from "../../components/Loader"

export default function Home() {
    const [characters, setCharacters] = useState([]);
    const [notFound, setNotFound] = useState(false);

    const [loading, setLoading] = useState(true);

    const cacheRef = useRef(new Map());

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchCharacters = async (name = "", pageNumber = 1) => {
        setLoading(true);
        const cache = cacheRef.current;
        const cacheKey = `${name}_${pageNumber}`;
        const nextPageNumber = pageNumber + 1;
        const nextCacheKey = `${name}_${nextPageNumber}`;

        const cleanCacheIfNeeded = () => {
            while (cache.size >= 5) {
                const firstKey = cache.keys().next().value;
                cache.delete(firstKey);
                console.log(`🚮 Removido do cache: ${firstKey}`);
            }
        };

        console.log(
            "\n====================== INICIO DA BUSCA ======================"
        );
        console.log(`Cache anterior: ${cache.size} pages`);

        let total = totalPages;

        if (cache.has(cacheKey)) {
            const cached = cache.get(cacheKey);
            setCharacters(cached.results);
            setTotalPages(cached.totalPages);
            total = cached.totalPages;
            setNotFound(false);
            setLoading(false);
            console.log(`🌐 Cache sendo utilizado: ${cacheKey}`);
        } else {
            try {
                const { data } = await axios.get(
                    `https://rickandmortyapi.com/api/character/?page=${pageNumber}&name=${name}`
                );
                cleanCacheIfNeeded();
                cache.set(cacheKey, {
                    results: data.results,
                    totalPages: data.info.pages,
                });
                setCharacters(data.results);
                setTotalPages(data.info.pages);
                total = data.info.pages;
                setNotFound(false);
                console.log(`✅ Cache salvo: ${cacheKey}`);
            } catch (error) {
                setCharacters([]);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }

        if (nextPageNumber <= total && !cache.has(nextCacheKey)) {
            try {
                const res = await axios.get(
                    `https://rickandmortyapi.com/api/character/?page=${nextPageNumber}&name=${name}`
                );
                cleanCacheIfNeeded();
                cache.set(nextCacheKey, {
                    results: res.data.results,
                    totalPages: res.data.info.pages,
                });
                console.log(`📲 Prefetch salvo: ${nextCacheKey}`);
            } catch (error) {
                console(`Erro em salvar prefetch: ${nextCacheKey}`, error);
            }
        } else {
            console.log(`Prefetch ignorado`);
        }

        console.log(`🔒 Cache final: ${cache.size} páginas`);
        for (const [key, val] of cache.entries()) {
            console.log(`👩‍💻 ${key}: ${val.results.length} personagens`);
        }
        console.log("====================== FIM DA BUSCA ======================\n");
    };

    useEffect(() => {
        fetchCharacters();
    }, []);

    const handleSearch = () => {
        const name = search.trim();
        setPage(1);
        fetchCharacters(name, 1);
        toast.success(`Você buscou por: ${name}`, { position: "top-right" });
    };

    const handleReset = () => {
        setSearch("");
        setPage(1);
        fetchCharacters("", 1);
        toast.success("Filtro foi resetado", { position: "top-right" });
    };

    const handleCardClick = (name) => {
        toast.info(`Você clicou no personagem: ${name}`, {});
    };

    console.log(characters);

    useEffect(() => {
        fetchCharacters(search, page);
    }, [page]);

    return (
        <div className={styles.container}>
            <ToastContainer
                position="top-right"
                autoClose={7500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <h1 className={styles.title}>Personagens | Rick and Morty 🚀🧪</h1>
            <div className={styles.search}>
                <input
                    className={styles.searchbar}
                    type="text"
                    placeholder="Pesquise por um personagem"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <button onClick={handleSearch} className={styles.buttonSearch}>
                    Buscar
                </button>

                <button onClick={handleReset} className={styles.buttonReset}>
                    Resetar
                </button>
            </div>

            <div className={styles.navControls}>
                <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1}
                    className={styles.buttonNav}
                >
                    Página Anterior
                </button>

                <span className={styles.pageIndicator}>
                    Página {page} de {totalPages}
                </span>

                <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages}
                    className={styles.buttonNav}
                >
                    Próxima Página
                </button>
            </div>

            {notFound && (
                <h1 className={styles.notFound}>
                    Nenhum personagem identificado. Tente novamente.
                </h1>
            )}

            {loading ? (
                <div className={`${styles.loaderWrapper} ${loading ? "" : styles.hidden}`}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.grid}>
                {characters.map((char) => (
                <CharacterCard key={char.id} character={char} onClick={() => handleCardClick(char.name)} />
                ))}
            </div>
            )}
        </div>
    );
}
