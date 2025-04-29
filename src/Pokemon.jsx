import { useEffect, useState } from "react";
import "./index.css";
import { PokemonCards } from "./PokemonCards";

export const Pokemon=()=>{
    const[Pokemon,setPokemon]=useState([]);
    const[loading,setloading]=useState(true);
    const[Error,seterror]=useState(null);
    const [search,setSearch]=useState("");
    const API = "https://pokeapi.co/api/v2/pokemon?limit=500";
    const fetchPokemon= async()=>{
        try {
            const res= await fetch(API);
            const data= await res.json();
            const detailedPokemonData = data.results.map(async (curPokemon)=>{
                const res = await fetch(curPokemon.url);
                const data = await res.json();
                return data;
            });
            const detailedResponses = await Promise.all(detailedPokemonData);
            setPokemon(detailedResponses);
            setloading(false);
        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(error);
            
        }
    }

    useEffect(()=>{
        fetchPokemon();
    },[]);
    const searchData = Pokemon.filter((curPokemon)=>
    curPokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    if(loading){
        return(
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }
    if(Error){
        return(
            <div>
                <h1>{Error.message}</h1>
            </div>
        );
    }
    return (
        <>
            <section className="container">
                <header>
                    <h1>
                        Lets Catch Pokemon
                    </h1>
                </header>
                <div className="pokemon-search">
                    <input type="text" placeholder="search Pokemon" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                </div>
                <div>
                    <ul className="cards">
                        {
                            searchData.map((curPokemon)=>{
                                return<PokemonCards  key={curPokemon.id} pokemonData={curPokemon}/>
                            })
                        }
                    </ul>
                </div>
            </section>
        </>
    );
}