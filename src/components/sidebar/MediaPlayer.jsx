import { useLocation, useNavigate } from "react-router-dom";
import Tabs, { Tab } from "react-best-tabs";
import { useEffect, useRef, useState } from "react";
import {
  convertMsToMinutesSeconds,
  secondsToMinSecPadded,
} from "../helpers/helpers";
import {
  useGetLibraryQuery,
  useRemoveStoryAPIMutation,
  useSaveStoryAPIMutation,
} from "../../store/user/userApiSlice";
import { toast } from "react-toastify";
import AudioControls from "./AudioControls";

const MediaPlayer = () => {
  const location = useLocation();

  const { episodeList, storyInfo } = location.state || {};

  const navigate = useNavigate();
  const listInnerRef = useRef();

  const [saveStoryAPI] = useSaveStoryAPIMutation();
  const [removeStoryAPI] = useRemoveStoryAPIMutation();

  const [episodeProgress, setEpisodeProgress] = useState(0);
  const [episodeIndex, setEpisodeIndex] = useState(0);
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

  const {
    data: library,
    isLoading: libraryIsLoading,
    refetch: refetchLibrary,
  } = useGetLibraryQuery();

  const goBack = () => {
    navigate(-1);
  };

  const startTimer = () => {
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
    clearInterval(intervalRef.current);
    audioRef.current.currentTime = value;
    setEpisodeProgress(audioRef.current.currentTime);
    setIsPlaying(true);
  };

  const onScrubEnd = () => {
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

  const onScroll = () => {
    const episodeListDiv = document.getElementById("listepisodes");

    const maxScrollPosition =
      episodeListDiv.scrollHeight - episodeListDiv.clientHeight;

  
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
     
      if (scrollTop + clientHeight === scrollHeight + 20) {
        // TO SOMETHING HERE
     
      }
    }
  };

  const handleEpisodeClick = (episode, index) => {
    setEpisodeProgress(0);
    setCurrentEpisode(episode);
    setEpisodeIndex(index);
  };

  const changeEpisodeData = () => {
    const { duration_ms, audio_preview_url } = episodeList[episodeIndex];
    const convertedDuration = convertMsToMinutesSeconds(duration_ms);
    setEpisodeAudioSrc(audio_preview_url);
    setEpisodeDuration(convertedDuration);
  };

  useEffect(() => {
    if (episodeList.length) {
      changeEpisodeData();
    }
  }, [episodeList, episodeIndex]);

  useEffect(() => {
    if (episodeList.length > 0) {
      setCurrentEpisode(episodeList[0]);
      setEpisodeAudioSrc(episodeList[0].audio_preview_url);
      const convertedDuration = convertMsToMinutesSeconds(
        episodeList[0].duration_ms
      );
      setEpisodeDuration(convertedDuration);
    }
  }, [episodeList]);

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

  const episodes = episodeList.map((episode, index) => {
    return (
      <div
        key={index}
        className="hover:bg-cyan-500 mb-4"
        role="button"
        onClick={() => {
          handleEpisodeClick(episode, index);
        }}
      >
        <div
          className={`${
            index === episodeIndex
              ? "flex items-stretch selectedEpisodeBg"
              : "flex items-stretch"
          }`}
        >
          <img
            className="object-cover w-16 h-16 rounded-xl"
            src={episode.images[1].url}
          />
          &nbsp;
          <span className="pt-3">{episode.name}</span>
        </div>
      </div>
    );
  });

  return (
    <div className="mt-10 p-2">
      <div className="container mx-auto">
        <div className="player-bgcolor rounded-xl px-3 my-4 mt-5">
          <div className="flow-root ml-2 mr-2">
            <p
              className="float-left hover:cursor-pointer mt-2"
              onClick={goBack}
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

            <p className="float-right hover:cursor-pointer mt-2">
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
          <div className="track-info2">
            <div className="grid grid-cols-2">
              <div>
                <div className="mr-8 pt-4">
                  <img
                    className="object-cover mx-auto my-2 rounded-xl h-96 w-96"
                    src={currentEpisode ? currentEpisode.images[1].url : ""}
                    alt={`track artwork for by`}
                  />
                </div>
              </div>

              <div
                id="listepisodes"
                onScroll={() => onScroll()}
                ref={listInnerRef}
                className="pt-4 pr-8"
              >
                <Tabs
                  activeTab="1"
                  className=""
                  ulClassName=""
                  activityClassName="bg-success"
                >
                  <Tab title="About" className="mr-3 text-xl">
                    <div className="mt-4 h-64 overflow-auto">
                      <h2 className="text-3xl mb-4">
                        {currentEpisode ? currentEpisode.name : ""}
                      </h2>
                      <div className="p-4 rounded-xl border border-white border-opacity-20 text-base mb-4">
                        <p className="mt-8">Duration: {episodeDuration}</p>
                        <p>Total Episodes: {episodeList.length}</p>
                      </div>
                      <p>Author:</p>
                      <div className="p-2 bg-white bg-opacity-5 rounded-xl w-56 h-16 flex items-center">
                        {currentEpisode ? currentEpisode.name : ""}
                      </div>
                    </div>
                  </Tab>
                  <Tab title="CC" className="mr-3 text-xl">
                    <div className="mt-3 text-s h-64 overflow-auto">
                      {currentEpisode ? currentEpisode.description : ""}
                    </div>
                  </Tab>
                  <Tab title="Up Next" className="mr-3 text-xl">
                    <div>
                      <h2 className="text-xl mb-4"> Episodes </h2>
                      <div
                        className="mt-3 h-64 overflow-auto"
                        id="listepisodes"
                      >
                        {episodes}
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
            </div>
            <div className="flex items-center mb-2  px-8">
              <div className="pr-2">
                {secondsToMinSecPadded(parseInt(audioRef.current.currentTime))}
              </div>
              <div className="flex-grow">
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
                  style={{ background: trackStyling }}
                />
              </div>
              <div className="pl-2">
                {secondsToMinSecPadded(parseInt(duration))}
              </div>
              <div className="flex items-center justify-center px-8">
                <div className="flex-1">
                  <div className="flex justify-start">
                    <div className=" mb-2 mr-2">
                      {!libraryIsLoading &&
                      library.stories.includes(storyInfo.id) ? (
                        <div
                          className="hover:cursor-pointer"
                          onClick={removeStory}
                        >
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

                            <span className="absolute left-0 right-5 bottom-10 scale-0 rounded bg-gray-800 p-1.5 w-32 text-xs text-white group-hover:scale-100">
                              Remove from Library
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="hover:cursor-pointer"
                          onClick={saveStory}
                        >
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

                            <span className="absolute left-0 right-5 bottom-10 scale-0 rounded bg-gray-800 p-1.5 w-32 text-xs text-white group-hover:scale-100">
                              Save to Library
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="w-96">
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

                <div className="flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
