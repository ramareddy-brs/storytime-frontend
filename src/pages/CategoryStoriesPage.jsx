import { Link, useLocation } from "react-router-dom";
import { useGetCategoryStoriesQuery } from "../store/spotify/spotifyApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";
import CategoryStoriesList from "../components/category/CategoryStoriesList";

const CategoryStoriesPage = () => {
  const location = useLocation();
  const { categoryName, languageNames } = location.state;
  const [langNames, setLangNames] = useState(languageNames);
  const [categoryStories, setCategoryStories] = useState([]);

  const { data, isLoading } = useGetCategoryStoriesQuery({
    queryParams: {
      q: `${categoryName} languages: ${langNames}`,
      type: "show",
      include_external: "audio",
      market: "IN",
      limit: "25",
    },
  });

  useEffect(() => {
    if (data) {
      const nonExplicitCategoryStories = data.shows.items.filter(
        (story) => !story.explicit
      );

      setCategoryStories(nonExplicitCategoryStories);
    }
  }, [data]);

  useEffect(() => {
    if (languageNames.length > 0) {
      const formattedLanguageNames = langNames
        .map((name) => `"${name}"`)
        .join(" ");
      setLangNames(formattedLanguageNames);
   
    } else {
      setLangNames("English");
    }
  }, [languageNames, categoryName]);

  return (
    <div className="mx-6">
      <nav className="text-black font-bold pt-10" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex text-white">
          <li className="inline-flex items-center text-white">
            <Link to="/home" className="hover:text-blue-500 text-white">
              <svg
                className="w-5 h-auto fill-current mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#FFFFFF"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
              </svg>
            </Link>
          </li>
          <li className="flex items-center text-white">
            <svg
              className="fill-current w-3 h-3 mx-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>

          <li className="flex items-center text-white">
            <Link to="/categories" className="text-white" aria-current="page">
              Categories
            </Link>
            <svg
              className="fill-current w-3 h-3 mx-3"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
            >
              <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z" />
            </svg>
          </li>
          <li>{categoryName}</li>
        </ol>
      </nav>

      {isLoading ? (
        <LoadingSpinner />
      ) : categoryStories?.length > 0 ? (
        <CategoryStoriesList stories={categoryStories} />
      ) : (
        <p className="text-center my-16">
          No Stories to load, please try later
        </p>
      )}
    </div>
  );
};

export default CategoryStoriesPage;
