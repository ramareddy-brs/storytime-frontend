import { useDispatch } from "react-redux";
import ImageBanner from "../components/home/ImageBanner";
import PopularStories from "../components/home/PopularStories";
import ShowsOfWeek from "../components/home/ShowsOfWeek";
import TopStories from "../components/home/TopStories";
import { setUserProfile } from "../store/user/authSlice";
import { useGetUserProfileAPIQuery } from "../store/user/userApiSlice";
import {
  useGetPopularShowsQuery,
  useGetShowsOfTheWeekQuery,
  useGetTopStoriesQuery,
} from "../store/spotify/spotifyApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import { useState, useEffect } from "react";

const HomePage = () => {
  const dispatch = useDispatch();
  const { data: userProfileData, refetch: refetchUserProfileData } = useGetUserProfileAPIQuery();

  const [popularStories, setPopularStories] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [showsOfTheWeek, setShowsOfTheWeek] = useState([]);

  const { data: popularShowsData, isLoading: popularShowsLoading } =
    useGetPopularShowsQuery({
      queryParams: {
        q: '"popular stories" "popular podcasts" "kids-stories"  language:"tamil" "telugu" "english"  "hindi" ',
        type: "show",
        include_external: "audio",
        market: "IN",
        limit: "25",
      },
    });

  const { data: topStoriesData, isLoading: topStoriesLoading } =
    useGetTopStoriesQuery({
      queryParams: {
        q: '"top-stories" "top-podcasts" language: "tamil" "telugu" "english" "hindi" ',
        type: "show",
        include_external: "audio",
        market: "IN",
        limit: "25",
      },
    });

  const { data: showsOfWeekData, isLoading: showsOfWeekLoading } =
    useGetShowsOfTheWeekQuery({
      queryParams: {
        q: '"shows-of-the-week" "this-week-shows" language: "tamil" "telugu" "english" "hindi" ',
        type: "show",
        include_external: "audio",
        market: "IN",
        limit: "25",
      },
    });

  useEffect(() => {
    if (popularShowsData) {
      const nonExplicitPopularStories = popularShowsData.shows.items.filter(
        (story) => !story.explicit
      );
      setPopularStories(nonExplicitPopularStories.slice(0, 6));
    }

    if (topStoriesData) {
      const nonExplicitTopStories = topStoriesData.shows.items.filter(
        (story) => !story.explicit
      );
      setTopStories(nonExplicitTopStories.slice(0, 4));
    }
    if (showsOfWeekData) {
      const nonExplicitShowsOfWeek = showsOfWeekData.shows.items.filter(
        (story) => !story.explicit
      );
      setShowsOfTheWeek(nonExplicitShowsOfWeek.slice(0, 3));
    }
  }, [popularShowsData, topStoriesData, showsOfWeekData]);

  useEffect(() => {
    if (userProfileData) {
      dispatch(setUserProfile({ ...userProfileData }));
    }
  }, [userProfileData]);

  useEffect(() => {
    refetchUserProfileData()
  }, [])

  return (
    <>
      <div className="container mx-auto p-2">
        <ImageBanner />
        <section>
          <div className="container mx-auto">
            <div>
              <header className="flex items-center justify-between mb-2 mt-6">
                <div className="text-2xl text-white font-semibold tracking-tight hover:underline hover:cursor-pointer">
                  Popular
                </div>

                <div className="text-xs hover:underline font-semibold uppercase text-link tracking-wider hover:cursor-pointer">
                  SEE ALL
                </div>
              </header>

              {/* <PopularStories stories={popularStoryList} /> */}
              {popularShowsLoading ? (
                <LoadingSpinner />
              ) : (
                popularStories && <PopularStories stories={popularStories} />
              )}
            </div>

            <div>
              <header className="flex items-center justify-between mb-2">
                <div className="text-2xl text-white font-semibold tracking-tight hover:underline hover:cursor-pointer">
                  Top Stories & Podcasts
                </div>

                <div className="text-xs hover:underline font-semibold uppercase text-link tracking-wider hover:cursor-pointer">
                  SEE ALL
                </div>
              </header>
              {topStoriesLoading ? (
                <LoadingSpinner />
              ) : (
                topStories && <TopStories stories={topStories} />
              )}
            </div>

            <div>
              <header className="flex items-center justify-between mb-2">
                <div className="text-2xl text-white font-semibold tracking-tight hover:underline hover:cursor-pointer">
                  Shows of the week
                </div>

                <div className="text-xs hover:underline font-semibold uppercase text-link tracking-wider hover:cursor-pointer">
                  SEE ALL
                </div>
              </header>
              {showsOfWeekLoading ? (
                <LoadingSpinner />
              ) : (
                showsOfTheWeek && <ShowsOfWeek stories={showsOfTheWeek} />
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
