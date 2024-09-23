import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const SurahList = () => {
  const [surahs, setSurahs] = useState([]);
  const numberToBengali = (number) => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(number).split('').map(digit => bengaliNumbers[digit]).join('');
  };

  useEffect(() => {
    // Fetching Surah list from the API
    axios
      .get("https://api.alquran.cloud/v1/surah")
      .then((response) => {
        setSurahs(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching Surah list:", error);
      });
  }, []);

  return (
    <div className="bg-customBG">
      <div className=" lg:flex flex-col hidden justify-center items-center p-10">
        <h1 className="text-4xl font-Bangla text-orange-400 font-extrabold">কুরআনুল কারীম</h1>
        <h4 className="text-xl font-Bangla">বাংলা অনুবাদ ও সংক্ষিপ্ত তাফসীর</h4>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-[90%] mx-auto ">
        {surahs.map((surah) => (
          <div
            key={surah.number}
            className="
              surah__card 
              relative flex justify-between items-center 
              p-3 mx-2 mt-2 h-[80px] 
              rounded-md cursor-pointer 
              hover:shadow-[0_0px_40px_0px_rgba(1,0,0,0.2)] 
              ease-out duration-300 active:scale-95
              bg-cardBg"
          >
            <div className="left-part flex justify-between items-center">
              <ul className="flex shadow-inner w-[2.7rem] h-[2.7rem] rounded-full items-center justify-center mr-4 bg-customBG">
                <li className="text-[18px] font-Bangla">{numberToBengali(surah.number)}</li>
              </ul>
              <div className="flex flex-col justify-center">
                <h2 className="text-[18px] hind-siliguri-light">{surah.englishName}</h2>
                <h4 className="flex sub__title text-[14px] mt-[-1px] ">
                  {surah.englishNameTranslation}
                </h4>
              </div>
            </div>
            <div className="right-part mr-2 flex flex-col items-end">
              <h3 className="text-[22px] font-Amiri_Quran">{surah.name}</h3>
              <NavLink
                className="absolute top-0 left-0 right-0 bottom-0 z-10"
                to={`/quran/${surah.englishName.toLowerCase()}`}
              ></NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SurahList;
