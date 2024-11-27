"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

type Trans = {
  id: number;
  phrase_id: number;
  language_id: number;
  user_id: number;
  trans: string;
};

const Home = () => {
  const [searchParams, setSearchParams] = useState("");
  const [searched, setSearched] = useState(false);
  const [language, setLanguage] = useState(1);
  const [translations, setTranslations] = useState<Trans[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslation = async () => {
    try {
      const phrase = encodeURIComponent(searchParams);
      const response = await fetch(
        `http://127.0.0.1:8001/translations/?phrase=${phrase}&language_id=${language}`
      );

      if (response.status === 200) {
        const data: Trans[] = await response.json();
        setTranslations(data);
      } else if (response.status === 404) {
        setError("No results found");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const langId = event.target.value;

    setSearched(false);
    setLanguage(Number(langId));
  };

  const handleSearch = async () => {
    if (!searchParams || !language) {
      setError("Both phrase and language are required.");
      return;
    }

    setTranslations([]);
    setSearched(true);
    setLoading(true);
    setError(null);

    fetchTranslation();
  };

  return (
    <div className="bg-cyan-600 items-center justify-items-center min-h-screen">
      <div className="babellyn container flex flex-col justify-center">
        <div className="flex flex-row w-full mt-16 mb-16 justify-center">
          <div className="logo"></div>
        </div>
        <div className="flex flex-row w-full">
          <Input
            className="
              search
              rounded-full
              w-full
              h-18
              bg-transparent
              px-5
              py-4
              outline-none
              border-2
              border-gray-100
              shadow-md
              text-white
              text-center
              hover:outline-none
              focus:outline-none
            "
            placeholder="Type a word or phrase..."
            value={searchParams}
            onChange={(e) => setSearchParams(e.target.value)}
          />
        </div>
        <div className="flex flex-col md:flex-row w-full my-8 gap-4">
          <div className="flex w-full justify-center md:w-1/2 md:justify-end sm:w-full">
            <select
              onChange={(e) => handleLanguage(e)}
              className="bg-blue-900 text-white px-3 py-2 border-2 border-white rounded select-montserrat"
            >
              <option value="1">Tagalog</option>
              <option value="2">Cebuano</option>
              <option value="3">Hiligaynon</option>
              <option value="4">Ilocano</option>
              <option value="5">Kapampangan</option>
              <option value="6">Waray</option>
              <option value="7">Chavacano</option>
            </select>
          </div>
          <div className="flex w-full justify-center md:w-1/2 md:justify-start">
            <button
              onClick={handleSearch}
              disabled={searched}
              className="
                inline-flex
                items-center
                md:h-12
                px-4
                py-2
                text-sm
                bg-blue-900
                text-white
                transition
                duration-300
                ease-in-out
                rounded-full
                outline-none
                right-3
                top-3
                bg-cool-indigo-600
                sm:px-6
                sm:text-base
                hover:bg-blue-800
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-cool-indigo-500
              "
            >
              <svg
                className="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col mt-5 px-5 justify-center">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {searchParams &&
            translations.length === 0 &&
            !loading &&
            !error &&
            searched && <p>No results found.</p>}
          <ul className="list-disc pl-5">
            {translations.map((trans) => (
              <li key={trans.id} className="mt-1">
                <p>{trans.trans}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
