// To render the /authors page component
import { useEffect, useState } from "react";
import AuthorsList from "../components/authors/AuthorsList";
import { useGetCategoriesQuery } from "../store/category/categoryApiSlice";
import { useGetLanguagesQuery } from "../store/language/languageApiSlice";
import { useGetAuthorsStoriesQuery } from "../store/spotify/spotifyApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthorsPage = () => {
  const [categoryNames, setCategoryNames] = useState([]);
  const [languageNames, setLanguageNames] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredAuthorsList, setFilteredAuthorsList] = useState([]); // State for filtered authors

  // API Query
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: languagesData } = useGetLanguagesQuery();
  const { data: authorsData, isLoading: authorsIsLoading } =
    useGetAuthorsStoriesQuery({
      queryParams: {
        q: `"${categoryNames}" languages: ${languageNames}`,
        type: "show",
        include_external: "audio",
        market: "IN",
        limit: "50",
      },
    });

  // Filter the explicit stories based on explicit property
  useEffect(() => {
    if (authorsData) {
      const nonExplicitAuthorsStories = authorsData.shows.items.filter(
        (story) => !story.explicit
      );

      setAuthorsList(nonExplicitAuthorsStories);
    }
  }, [authorsData]);

  // Format the category and language names
  useEffect(() => {
    if (categoriesData) {
  
      const formattedCategoryNames = categoriesData
        .map((category) => `"${category.category}"`)
        .join(", ");
   
      setCategoryNames(formattedCategoryNames);
    }
    if (languagesData) {
      const formattedLanguageNames = languagesData
        .map((language) => `"${language.name}"`)
        .join(", ");
  
      setLanguageNames(formattedLanguageNames);
    }
  }, [languagesData, categoriesData]);

  // Filter authors based on search query
  useEffect(() => {
    if (searchQuery) {
      const filteredAuthors = authorsList.filter((author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAuthorsList(filteredAuthors);
    } else {
      setFilteredAuthorsList(authorsList);
    }
  }, [searchQuery, authorsList]);

  return (
    <div className="container mx-auto mt-5 px-5">
      <input
        type="text"
        placeholder="Search authors..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-5 p-2 border border-gray-300 rounded w-full"
      />
      {authorsIsLoading ? (
        <LoadingSpinner />
      ) : filteredAuthorsList.length > 0 ? (
        <AuthorsList authors={filteredAuthorsList} />
      ) : (
        <p className="text-center my-16">
          No Stories to load, please try later
        </p>
      )}
    </div>
  );
};

export default AuthorsPage;
