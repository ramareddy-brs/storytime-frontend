// Sidebar Component
// Lists the episode data of a selected show (based on show id)
// Has the player functionality (playing the episode)
import { useGetEpisodesByShowIdQuery } from "../../store/spotify/spotifyApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setStoryInfo, toggleSidebar } from "../../store/user/authSlice";
import { useState, useEffect, useRef } from "react";
import {
  useGetLibraryQuery,
  useRemoveStoryAPIMutation,
  useSaveStoryAPIMutation,
} from "../../store/user/userApiSlice";
import { toast } from "react-toastify";
import "./sidebar.css";
import {
  convertMsToMinutesSeconds,
  secondsToMinSecPadded,
} from "../helpers/helpers";
import AudioControls from "./AudioControls";
import { useNavigate } from "react-router-dom";

const SidebarPlayer = ({}) => {
  const navigate = useNavigate()
  const [episodeProgress, setEpisodeProgress] = useState(0);
  const [episodeIndex, setEpisodeIndex] = useState(0);
  const [episodeList, setEpisodesList] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [episodeAudioSrc, setEpisodeAudioSrc] = useState(currentEpisode);
  const [episodeDuration, setEpisodeDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlaytime] = useState(episodeDuration);
  const audioRef = useRef(new Audio(episodeAudioSrc));

  const intervalRef = useRef();
  const isReady = useRef(false);

  // Destructure for conciseness
  const { duration } = audioRef.current;

  const currentPercentage = duration
    ? `${(episodeProgress / duration) * 100}%`
    : "0%";
  const trackStyling = `
    -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(${currentPercentage}, #777), color-stop(${currentPercentage}, #777))
  `;

  const dispatch = useDispatch();

  const { storyInfo } = useSelector((state) => state.auth);


  const { data, isLoading } = useGetEpisodesByShowIdQuery(storyInfo.id);
  const {
    data: library,
    isLoading: libraryIsLoading,
    refetch: refetchLibrary,
  } = useGetLibraryQuery();

  const [saveStoryAPI] = useSaveStoryAPIMutation();
  const [removeStoryAPI] = useRemoveStoryAPIMutation();

  const showSidebar = () => {
    dispatch(setStoryInfo({ s_id: null, s_name: null }));
    dispatch(toggleSidebar());
  };

  const handleEpisodeClick = (episode, index) => {
    setCurrentEpisode(episode);
    setEpisodeIndex(index);
  };

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        toNextTrack();
      } else {
        setEpisodeProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  };

  const onScrub = (value) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setEpisodeProgress(audioRef.current.currentTime);
    setIsPlaying(true);
  };

  const onScrubEnd = () => {
    // If not already playing, start
    setIsPlaying(true);

    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const toNextTrack = () => {
    setEpisodeProgress(0);
    if (episodeIndex < episodeList.length - 1) {
      setEpisodeIndex(episodeIndex + 1);
      setCurrentEpisode(episodeList[episodeIndex + 1]);
    } else {
      setEpisodeIndex(0);
    }
  };

  const toPrevTrack = () => {
    setEpisodeProgress(0);
    if (episodeIndex - 1 < 0) {
      setEpisodeIndex(episodeList.length - 1);
      setCurrentEpisode(episodeList[episodeList.length - 1]);
    } else {
      setEpisodeIndex(episodeIndex - 1);
      setCurrentEpisode(episodeList[episodeIndex - 1]);
    }
  };

  const saveStory = async () => {
    try {
      const response = await saveStoryAPI({ storyId: storyInfo.id }).unwrap();
  
      if (response.message) {
        toast.success(response.message);
        refetchLibrary();
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const removeStory = async () => {
    try {
      const response = await removeStoryAPI({ storyId: storyInfo.id }).unwrap();

      if (response.message) {
        toast.success(response.message);
        refetchLibrary();
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const list_episodes = episodeList.map((episode, index) => (
    <div
      key={index}
      className="mb-4 mx-1 gro"
      role="button"
      onClick={() => handleEpisodeClick(episode, index)}
    >
      {index === 0 ? (
        <>
          <div className="flex rounded-xl bg-red items-center p-2 hover:bg-white hover:bg-opacity-5 bg-opacity-5">
            <img
              className="w-12 h-12 mr-2"
              src={episode.images[0].url}
              alt={episode.name}
            />
            &nbsp;
            <span className="truncate flex-grow w-52">{episode.name}</span>
            <div className="self-end">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </>
      ) : (
        <div className="flex rounded-xl items-center p-2 hover:bg-white hover:bg-opacity-5">
          <img
            className="w-14 mr-2"
            src={episode.images[0].url}
            alt={episode.name}
          />
          &nbsp;
          <span className="truncate flex-grow w-52">{episode.name}</span>
          <div className="content-end">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  ));

  useEffect(() => {
    if (data?.items) {
      const list = data?.items?.filter((episode) => episode);

      setEpisodesList(list);
      if (list.length > 0) {
        setCurrentEpisode(list[0]);
        setEpisodeAudioSrc(list[0].audio_preview_url);
        const convertedDuration = convertMsToMinutesSeconds(
          list[0].duration_ms
        );
        setEpisodeDuration(convertedDuration);
      }
    }
  }, [data]);

  const changeEpisodeData = () => {
    const { duration_ms, audio_preview_url } = episodeList[episodeIndex];
    const convertedDuration = convertMsToMinutesSeconds(duration_ms);
    setEpisodeAudioSrc(audio_preview_url);
    setEpisodeDuration(convertedDuration);
  };

  const mediaPlayer = () => {
    navigate("/player", {
      state: {
        episodeList: episodeList,
        storyInfo: storyInfo,
      },
    });
    dispatch(toggleSidebar());
  };

  useEffect(() => {
    if (episodeList.length) {
      changeEpisodeData();
    }
  }, [episodeList, episodeIndex]);

  useEffect(() => {
    refetchLibrary();
  }, [storyInfo.id]);

  useEffect(() => {
    audioRef.current.pause();
    audioRef.current = new Audio(episodeAudioSrc);
    audioRef.current.addEventListener("loadedmetadata", () => {
      setEpisodeDuration(audioRef.current.duration);
      setEpisodeProgress(audioRef.current.currentTime);
    });
    // Clear any timers already running
    clearInterval(intervalRef.current);
    if (episodeProgress) {
      audioRef.current.currentTime = episodeProgress;
    }

    setEpisodeProgress(audioRef.current.currentTime);
    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }

    if (isPlaying) {
      setIsPlaying(true);

      audioRef.current.play();
    } else {
      setIsPlaying(false);
      audioRef.current.pause();
    }
  }, [episodeIndex, episodeList]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      audioRef.current.pause();
    }
    return () => {
      audioRef.current.pause();
    };
  }, [isPlaying]);


  return (
    <div className="player-bgcolor rounded-xl m-2 px-2 w-96 h-fullCustom flex flex-col">
      <div className="flow-root ml-2 mr-2 mb-5">
        <p
          className="float-left hover:cursor-pointer mt-2"
          onClick={() => showSidebar()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </p>

        <p
          className="float-right hover:cursor-pointer mt-2"
          onClick={() => mediaPlayer()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
            />
          </svg>
        </p>
      </div>
      <p className="text-center mb-3">{storyInfo.name}</p>

      <div className="flex justify-center my-3">
        {currentEpisode ? (
          <img
            src={currentEpisode.images[0].url}
            className="object-cover w-64 h-50 rounded-xl"
            alt={currentEpisode.name}
          />
        ) : (
          <p>No episode selected</p>
        )}
      </div>
      <p className="text-center mb-3">
        {currentEpisode ? currentEpisode.name : "No episode"}
      </p>

      <div>
        <div className="mx-4 flex justify-between">
          <div className="text-xs mt-2">
            {secondsToMinSecPadded(parseInt(audioRef.current.currentTime))}
          </div>
          <div>
            <input
              type="range"
              value={episodeProgress}
              step="1"
              min="0"
              max={duration ? duration : `${duration}`}
              className="progress"
              onChange={(e) => onScrub(e.target.value)}
              onMouseUp={onScrubEnd}
              onKeyUp={onScrubEnd}
              style={{ background: trackStyling, width: "250px" }}
            />
          </div>

          <div className="text-xs mt-2">
            {secondsToMinSecPadded(parseInt(duration))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="flex-1"></div>
        <div className="w-64 mt-4">
          <AudioControls
            crossOrigin="anonymous"
            isPlaying={isPlaying}
            onPrevClick={toPrevTrack}
            onNextClick={toNextTrack}
            onPlayPauseClick={setIsPlaying}
            playTime={playTime}
            playerType="audio-controls"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-end">
            <div className="mb-2 mr-2">
              {!libraryIsLoading && library.stories.includes(storyInfo.id) ? (
                <div className="hover:cursor-pointer" onClick={removeStory}>
                  <div className="group relative mt-4 flex justify-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                        clipRule="evenodd"
                      />
                    </svg>

                    <span className="absolute bottom-10 scale-0 rounded bg-gray-800 p-1.5 w-32 text-xs text-white group-hover:scale-100">
                      Remove from Library
                    </span>
                  </div>
                </div>
              ) : (
                <div className="hover:cursor-pointer" onClick={saveStory}>
                  <div className="group relative mt-4 flex justify-end">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                      />
                    </svg>

                    <span className="absolute bottom-10 scale-0 rounded bg-gray-800 p-1.5 w-32 text-xs text-white group-hover:scale-100">
                      Save to Library
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {
        <div id="listepisodes" className="mt-3 overflow-auto h-36 flex-grow">
          {!isLoading && episodeList.length > 0 && list_episodes}
        </div>
      }
    </div>
  );
};

export default SidebarPlayer;
