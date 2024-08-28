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
  const [searchQuery, setSearchQuery] = useState(""); // State for managing the search query
  const [filteredAuthors, setFilteredAuthors] = useState([]); // State for managing the filtered authors

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

  // Filter the explicit stories based on explicit property (this property will be present in response data)
  useEffect(() => {
    if (authorsData) {
      const nonExplicitAuthorsStories = authorsData.shows.items.filter(
        (story) => !story.explicit
      );

      setAuthorsList(nonExplicitAuthorsStories);
    }
  }, [authorsData]);

  // Format the category names (joining all names with ,)
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

  // Filter authors list based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = authorsList.filter((author) =>
        author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAuthors(filtered);
    } else {
      setFilteredAuthors(authorsList);
    }
  }, [searchQuery, authorsList]);

  return (
    <div className="container mx-auto mt-5 px-5">
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-6/12 p-2 mt-5 ml-10 border text-black border-gray-300 rounded"
        />
      </div>
      {authorsIsLoading ? (
        <LoadingSpinner />
      ) : filteredAuthors?.length > 0 ? (
        <AuthorsList authors={filteredAuthors} />
      ) : (
        <p className="text-center my-16">
          No Stories to load, please try later
        </p>
      )}
    </div>
  );
};

export default AuthorsPage;
