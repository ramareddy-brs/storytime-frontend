import { useEffect, useState } from "react";
import { useGetSeveralShowsQuery } from "../store/spotify/spotifyApiSlice";
import { useGetLibraryQuery } from "../store/user/userApiSlice";
import LoadingSpinner from "../components/LoadingSpinner";
import LibraryList from "../components/LibraryList";

const LibraryPage = () => {
  const [showIds, setShowIds] = useState("");
  const { data, isLoading } = useGetLibraryQuery();
  const { data: shows, isLoading: showsLoading } = useGetSeveralShowsQuery(
    { ids: showIds },
    { skip: !showIds } // true or false
  );

  useEffect(() => {
    if (data?.stories?.length > 0) {
      const storyIds = data.stories.map((story) => story).join(",");
      setShowIds(storyIds);

    }
  }, [data, isLoading]);

  return (
    <div className="container mx-auto px-6 mt-8">
      {showsLoading ? (
        <LoadingSpinner />
      ) : shows?.shows.length > 0 ? (
        <LibraryList library={shows.shows} />
      ) : (
        <p className="text-center my-16">No library items</p>
      )}
    </div>
  );
};

export default LibraryPage;
