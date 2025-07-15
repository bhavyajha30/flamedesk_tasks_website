import {
  PersonStandingIcon,
  PlusIcon,
  Trash2,
  Trophy,
} from "lucide-react";
import ChallengeModal from "./ChallengeModal";
import React, { useEffect, useState } from "react";
import createAxiosInstance from "../Utils/axios";

function Challenges({challenges, setChallenges, onGoingChallenges, setOnGoingChallenges}) {
  
  const [addChallenge, setAddChallenge] = useState(false);
  const [challengeData, setChallengeData] = useState(null);
  const axios = createAxiosInstance();

  const getChallenges = async () => {
    const { data } = await axios.get("challenges/gp");
    setChallenges(data.challenges);
    const activeChallenges = data.challenges.filter((item) => item.isActive);
    setOnGoingChallenges(activeChallenges);
  };

  const activateChallenge = (data) => {
    if (data.isActive) return;
    setChallengeData(data);
    setAddChallenge(true);
  };

  const updateCount = async (item) => {
    if (item.doneToday) return;

    const start = new Date(item.startedOn.split("T")[0]);
    const today = new Date(new Date().toISOString().split("T")[0]);
    const diff = Math.floor((today - start) / (1000 * 60 * 60 * 24));

    if (diff < item.count || item.count >= item.day) return;

    try {
      await axios.put(`challenges/${item._id}/gp`, {
        ...item,
        count: item.count + 1,
        doneToday: true,
      });
      getChallenges();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteChallenge = async (id) => {
    const challenge = challenges.find((item) => item._id === id);
    if (!challenge) return console.log("Challenge Not Found");

    try {
      await axios.delete(`challenges/${challenge._id}/gp`);
      getChallenges();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteOnGoingChallenge = async (id) => {
    try {
      const challenge = challenges.find((c) => c._id === id);
      await axios.put(`challenges/${id}/gp`, {
        ...challenge,
        isActive: false,
        day: 0,
        count: 0,
        doneToday: false,
      });
      getChallenges();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getChallenges();
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#fdf6e3]/50 via-[#e5e9ff]/50 to-[#f9ecff]/50 rounded-xl">
      {/* Header */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <svg className="text-indigo-400 w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 6.99999C16.4183 6.99999 20 10.5817 20 15C20 19.4183 16.4183 23 12 23C7.58172 23 4 19.4183 4 15C4 10.5817 7.58172 6.99999 12 6.99999ZM12 8.99999C8.68629 8.99999 6 11.6863 6 15C6 18.3137 8.68629 21 12 21C15.3137 21 18 18.3137 18 15C18 11.6863 15.3137 8.99999 12 8.99999ZM12 10.5L13.3225 13.1797L16.2798 13.6094L14.1399 15.6953L14.645 18.6406L12 17.25L9.35497 18.6406L9.86012 15.6953L7.72025 13.6094L10.6775 13.1797L12 10.5ZM18 1.99999V4.99999L16.6366 6.13755C15.5305 5.5577 14.3025 5.17884 13.0011 5.04948L13 1.99899L18 1.99999ZM11 1.99899L10.9997 5.04939C9.6984 5.17863 8.47046 5.55735 7.36441 6.13703L6 4.99999V1.99999L11 1.99899Z"></path></svg>
            <span className="truncate">Challenges</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1 ml-10 truncate">Manage your tasks efficiently</p>
        </div>
        <span className="flex items-center gap-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base">
          <PersonStandingIcon size={18} />
          {onGoingChallenges.length} Active Challenge
        </span>
      </div>

      {/* Challenges */}
      <div className="border-dashed px-4">

        {/* Ongoing Challenges */}
        <div className="flex flex-col sm:flex-col gap-5 sm:gap-2 min-h-36">
          {onGoingChallenges.length > 0 ? (
            onGoingChallenges.map((item, index) => (
              <div
                key={item._id}
                className={`min-h-24 w-full rounded-xl  sm:flex items-center justify-between p-2 border border-[#8b91f3]/60 hover:shadow-md transition-transform duration-300 ease-in-out transform animate-fade-in ${
                  item.isFailed ? "bg-red-500/20" : item.count === item.day ? "bg-green-300/60" : ""
                }`}
              >
                <div className="flex gap-4 mb-2 sm:mb-0">
                  <div className="h-20 w-20 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img className="h-20 w-20 object-cover" src={item.image} alt="Challenge" />
                    ) : (
                      <div className="w-full h-full p-3">
                        <Trophy className="h-full w-full text-[#2FB6FD]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-3xl text-gray-600 font-bold">{item.title}</h1>
                    <p className="text-xs sm:text-sm text-purple-500 font-bold mt-1">Started On : {item.startedOn.split("T")[0]}</p>
                  </div>
                </div>
                <div className="flex flex-row-reverse sm:flex-row gap-2">
                  <div className="px-4 sm:px-2 py-1  sm:pl-4 h-full w-72 sm:w-48 text-zinc-100 font-semibold border-l  border-[#8b91f3]/60 flex flex-col">
                    <button
                      onClick={() => updateCount(item)}
                      className={`text-xs sm:text-sm sm:px-2 py-2 rounded-md transition-all duration-300 hover:brightness-110 ${
                        item.doneToday
                          ? "bg-gradient-to-br from-green-400 to-green-600"
                          : "bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500"
                      }`}
                    >
                      {item.count === item.day
                        ? "Completed"
                        : item.doneToday
                        ? `Day ${item.count} | Task Done`
                        : `Day ${item.count + 1} | Task Done?`}
                    </button>
                    <button
                      onClick={() => deleteOnGoingChallenge(item._id)}
                      className="text-red-500 mt-1 hover:underline transition-all duration-200"
                    >
                      {item.count === item.day ? "Close Challenge" : "Quit Challenge"}
                    </button>
                  </div>
                  <div className=" h-full w-48 sm:border-l border-[#8b91f3]/60 pt-1 sm:pt-0 px-5">
                    <h1 className="text-3xl leading:none sm:text-5xl text-center font-extrabold bg-gradient-to-br from-[#fdbd5c] to-yellow-500 bg-clip-text text-transparent">
                      {item.count}/{item.day}
                    </h1>
                    <p className="text-xs sm:text-regular text-purple-500 text-center sm:mt-2 font-bold tracking-wide">
                      {item.day - item.count} Days to complete
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center gap-8 animate-fade-in">
              <img className="h-32 w-32 object-contain" src="Images/NoChallenges.png" />
              <h1 className="text-3xl text-gray-800 font-bold">No Active Challenge</h1>
            </div>
          )}
        </div>

        {/* All Challenges */}
        <div className="mt-5">
          <div className="flex gap-5 p-4">
            <button
              onClick={() => setAddChallenge(true)}
              className="border border-dashed border-indigo-400 text-purple-400 bg-indigo-50 flex justify-center items-center h-20 w-20 rounded-xl shrink-0 my-2 hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse"
            >
              <PlusIcon className="h-8 w-8" />
            </button>
            <div className="flex gap-5 overflow-x-auto overflow-y-hidden py-2">
              {challenges.map((item, index) => (
                <div
                  key={index}
                  className="border border-[#8b91f3]/50 hover:shadow-md transition-all duration-300 flex items-center gap-2 h-20 w-52 rounded-xl shrink-0 p-1 animate-fade-in"
                >
                  <div className="h-16 w-16 rounded-md ml-1 bg-[#8b91f3]/10 hover:bg-[#8b91f3]/20">
                    {item.image ? (
                      <img className="h-16 w-16 rounded-md object-cover" src={item.image} alt="Challenge" />
                    ) : (
                      <div className="w-full h-full p-3">
                        <Trophy className="h-full w-full text-[#2FB6FD]" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-between h-full py-1">
                    <h5 className="text-xs font-bold tracking-wide ml-1">{item.title}</h5>
                    <div className="flex gap-2">
                      <button
                        onClick={() => activateChallenge(item)}
                        className={`text-xs font-semibold w-20 rounded-md text-white tracking-wide p-1 transition-all duration-200 ${
                          item.isActive
                            ? "bg-gradient-to-br from-green-400 to-green-600"
                            : "bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500"
                        }`}
                      >
                        {item.isActive ? "Active" : "Start Now"}
                      </button>
                      <button
                        onClick={() => deleteChallenge(item._id)}
                        className="bg-red-400 p-1 rounded-md transition-transform duration-200"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {addChallenge && (
        <ChallengeModal
          setData={setChallengeData}
          refreshChallenges={getChallenges}
          data={challengeData}
          addChallenge={addChallenge}
          setAddChallenge={setAddChallenge}
        />
      )}
    </div>
  );
}

export default Challenges;
