import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";
import { useGetCategoriesQuery } from "../store/category/categoryApiSlice";
import { useGetLanguagesQuery } from "../store/language/languageApiSlice";
import { useUpdateLanguageAPIMutation } from "../store/user/userApiSlice";
import { toggleLanguageSelection } from "../store/user/authSlice";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [languageNames, setLanguageNames] = useState([]);  
  const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();
  const { userData } = useSelector((state) => state.auth);
  const [updateLanguageAPI, { isLoading: languageUpdateLoading }] =
    useUpdateLanguageAPIMutation();
  const {
    data: languages,
    isLoading: isLanguagesLoading,
    error: languagesError,
  } = useGetLanguagesQuery();



  const isLanguageSelected = (languageId) =>
    userData.languages && userData.languages.includes(languageId);

  const handleLanguageClick = async (languageId) => {
    try {
      const response = await updateLanguageAPI({
        languageIds: userData.languages,
      }).unwrap();
      dispatch(toggleLanguageSelection(languageId));
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const categoryHandler = (categoryName) => {
    navigate("/stories", { state: { categoryName, languageNames } });
  };

  useEffect(() => {
    if (languages) {
      const selectedLanguageNames = languages
        .filter((language) => userData.languages.includes(language._id))
        .map((item) => item.name);
  
      setLanguageNames(selectedLanguageNames);
    }
  }, [languages, userData.languages]);

  useEffect(() => {
    const updateLanguage = async () => {
      try {
        const response = await updateLanguageAPI({
          languageIds: userData.languages,
        }).unwrap();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    };
    updateLanguage();
  }, [userData.languages]);

  return (
    <>
      <div style={{ backgroundColor: "#443280" }}>
        <div className="container mx-auto px-6">
          <section>
            <div className="py-6 rounded-xl mt-5">
              <header className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold tracking-tight text-white hover:underline">
                  Languages
                </h3>
              </header>

              <div className="flex mb-10">
                {isLanguagesLoading ? (
                  <LoadingSpinner />
                ) : languagesError ? (
                  <p>Unable to load languages. Please try again later</p>
                ) : (
                  languages &&
                  languages.map((language) => (
                    <div key={language._id}>
                      <button
                        className={`flex ${
                          isLanguageSelected(language._id)
                            ? "bg-white text-black"
                            : "text-white"
                        }  px-3 py-1 rounded-full mr-3`}
                        onClick={() => handleLanguageClick(language._id)}
                      >
                        {language.name}
                        {isLanguageSelected(language._id) ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 ml-3"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        ) : (
                          ""
                        )}
                      </button>
                    </div>
                  ))
                )}
              </div>

              <header className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold tracking-tight text-white hover:underline">
                  Catergories
                </h3>
              </header>

              <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                {isLoading ? (
                  <LoadingSpinner />
                ) : error ? (
                  <p>Unable to load categories. Please try again later.</p>
                ) : (
                  categoriesData.map((category, index) => (
                    <div
                      key={category._id}
                      className={`p-6 rounded-xl hover:bg-active group active h-64 text-3xl flex items-end siraledge category-${
                        index + 1
                      }`}
                      onClick={() => categoryHandler(category.category)}
                    >
                      <button className="text-left">{category.category}</button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
