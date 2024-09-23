import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { IoIosArrowBack } from 'react-icons/io';
import { FaPause, FaPlay } from 'react-icons/fa';

const SurahPage = () => {
  const { surahName } = useParams();
  const [surahData, setSurahData] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [surahMeta, setSurahMeta] = useState([]);
  const [audio, setAudio] = useState(null); // New state for audio
  const playAyah = (audioUrl) => {
    if (audio) {
      if (audio.src === audioUrl) {
        audio.paused ? audio.play() : audio.pause();
      } else {
        audio.pause(); 
        const newAudio = new Audio(audioUrl);
        newAudio.play();
        setAudio(newAudio);
      }
    } else {
      const newAudio = new Audio(audioUrl);
      newAudio.play();
      setAudio(newAudio);
    }
  };

  // Pause function to stop audio
  const pauseAyah = () => {
    if (audio) {
      audio.pause();
      setAudio(null); // Optionally reset audio state
    }
  };
  


  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah');
        const surahs = response.data.data;
        const surah = surahs.find(
          (s) => s.englishName.toLowerCase() === surahName.toLowerCase()
        );

        if (surah) {
          const [arabicResponse, bengaliResponse] = await Promise.all([
            axios.get(`https://api.alquran.cloud/v1/surah/${surah.number}/ar.alafasy`),
            axios.get(`https://api.alquran.cloud/v1/surah/${surah.number}/bn.bengali`)
          ]);

          setSurahData(surah);
          
          const combinedAyahs = arabicResponse.data.data.ayahs.map((ayah, index) => ({
            arabic: ayah.text,
            bengali: bengaliResponse.data.data.ayahs[index].text,
            numberInSurah: ayah.numberInSurah,
            audio: ayah.audio // Assuming audio URL is part of the ayah object
          }));

          setAyahs(combinedAyahs);
        } else {
          console.log('Surah not found');
        }
      } catch (error) {
        console.log('Error fetching surah data:', error);
      }
    };

    const fetchSurahMetadata = async () => {
      try {
        const metaResponse = await axios.get('https://api.alquran.cloud/v1/meta');
        setSurahMeta(metaResponse.data.data.surahs.references);
      } catch (error) {
        console.log('Error fetching surah metadata:', error);
      }
    };

    fetchSurahData();
    fetchSurahMetadata();
  }, [surahName]);

  if (!surahData) return <div>Loading...</div>;

  const currentSurahMeta = Array.isArray(surahMeta)
    ? surahMeta.find(meta => meta.number === surahData.number)
    : null;

  if (!currentSurahMeta) return <div>Loading...</div>;
  const translateRevelationType = (type) => {
    if (type === 'Meccan') {
      return 'মক্কা';
    } else if (type === 'Medinan') {
      return 'মদিনা';
    } 
    return type;
  };
  const numberToBengali = (number) => {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(number).split('').map(digit => bengaliNumbers[digit]).join('');
  };
  
const translateSurahName = (name) => {
  const surahNames = {
    'Al-Faatiha': 'আল-ফাতিহা',
    'Al-Baqara': 'আল-বাকারা',
    'Aali Imran': 'আল-ইমরান',
    'An-Nisa': 'আন-নিসা',
    'Al-Maidah': 'আল-মায়িদাহ',
    'Al-Anam': 'আল-আনআম',
    'Al-Araf': 'আল-আরাফ',
    'Al-Anfal': 'আল-আনফাল',
    'At-Tawbah': 'আত-তাওবাহ',
    'Yunus': 'ইউনুস',
    'Hud': 'হুদ',
    'Yusuf': 'ইউসুফ',
    'Ar-Ra’d': 'আর-রাদ',
    'Ibrahim': 'ইব্রাহিম',
    'Al-Hijr': 'আল-হিজর',
    'An-Nahl': 'আন-নাহল',
    'Al-Isra': 'আল-ইসরাআ',
    'Al-Kahf': 'আল-কাহফ',
    'Maryam': 'মারিয়াম',
    'Ta-Ha': 'তাহা',
    'Al-Anbiya': 'আল-আনবিয়া',
    'Al-Hajj': 'আল-হজ',
    'Al-Mu’minun': 'আল-মুমিনুন',
    'An-Nur': 'আন-নূর',
    'Al-Furqan': 'আল-ফুরকান',
    'Ash-Shuara': 'আশ-শুআরা',
    'An-Naml': 'আন-নমল',
    'Al-Qasas': 'আল-কাসাস',
    'Al-Ankabut': 'আল-আনকাবুত',
    'Ar-Rum': 'আর-রূম',
    'Luqman': 'লুকমান',
    'As-Sajda': 'আস-সাজদা',
    'Al-Ahzab': 'আল-আহজাব',
    'Saba': 'সাবা',
    'Fatir': 'ফাতির',
    'Ya-Sin': 'ইয়া-সিন',
    'As-Saffat': 'আস-সাফফাত',
    'Sad': 'সাদ',
    'Az-Zumar': 'আয-জুমার',
    'Ghafir': 'ঘাফির',
    'Fussilat': 'ফুসসিলাত',
    'Ash-Shura': 'আশ-শুরা',
    'Az-Zukhruf': 'আয-জুখরুফ',
    'Ad-Dukhan': 'আদ-দুখান',
    'Al-Jathiya': 'আল-জাথিয়া',
    'Al-Ahqaf': 'আল-আহকাফ',
    'Muhammad': 'মুহাম্মদ',
    'Al-Fath': 'আল-ফাতহ',
    'Al-Hujurat': 'আল-হুজুরাত',
    'Qaf': 'কাফ',
    'Adh-Dhariyat': 'আধ-ধারিয়াত',
    'At-Tur': 'আত-তুর',
    'An-Najm': 'আন-নাজম',
    'Al-Qamar': 'আল-কমার',
    'Ar-Rahman': 'আর-রহমান',
    'Al-Waqia': 'আল-ওয়াকিয়া',
    'Al-Hadid': 'আল-হাদিদ',
    'Al-Mujadila': 'আল-মুজাদিলা',
    'Al-Hashr': 'আল-হাশর',
    'Al-Mumtahana': 'আল-মুমতাহনা',
    'As-Saff': 'আস-সাফ',
    'Al-Jumu’a': 'আল-জুমু’আ',
    'Al-Munafiqun': 'আল-মুনাফিকুন',
    'At-Taghabun': 'আত-তাঘাবুন',
    'At-Talaq': 'আত-তালাক',
    'At-Tahrim': 'আত-তাহরিম',
    'Al-Mulk': 'আল-মুলক',
    'Al-Qalam': 'আল-কলাম',
    'Al-Haaqqa': 'আল-হাক্কা',
    'Al-Ma’arij': 'আল-মাআরিজ',
    'Nuh': 'নুহ',
    'Al-Jinn': 'আল-জিন',
    'Al-Muzzammil': 'আল-মুজাম্মিল',
    'Al-Muddaththir': 'আল-মুদ্দাথির',
    'Al-Qiyama': 'আল-কিয়ামাহ',
    'Al-Insan': 'আল-ইনসান',
    'Al-Mursalat': 'আল-মুরসালাত',
    'An-Naba': 'আন-নাবা',
    'An-Nazi’at': 'আন-নাজিয়াত',
    'Abasa': 'আবাসা',
    'At-Takwir': 'আত-তাকবীর',
    'Al-Infitar': 'আল-ইনফিতার',
    'Al-Mutaffifin': 'আল-মুতাফফিফিন',
    'Al-Inshiqaq': 'আল-ইনশিকাক',
    'Al-Burooj': 'আল-বুরুজ',
    'At-Tariq': 'আত-তারিक़',
    'Al-A’la': 'আল-আলা',
    'Al-Ghashiya': 'আল-গাশিয়া',
    'Al-Fajr': 'আল-ফজর',
    'Al-Balad': 'আল-বালাদ',
    'Ash-Shams': 'আশ-শামস',
    'Al-Lail': 'আল-লাইল',
    'Ad-Duha': 'আদ-দুহা',
    'Al-Inshirah': 'আল-ইনশিরাহ',
    'At-Tin': 'আত-তিন',
    'Al-Alaq': 'আল-আলাক',
    'Al-Qadr': 'আল-কদর',
    'Al-Bayyina': 'আল-বায়্যিনা',
    'Az-Zalzala': 'আয-জলযালা',
    'Al-Adiyat': 'আল-আদিয়াত',
    'Al-Qari’a': 'আল-ক্বারিয়া',
    'At-Takathur': 'আত-তকাসুর',
    'Al-Asr': 'আল-আসর',
    'Al-Humaza': 'আল-হুমাযাহ',
    'Al-Fil': 'আল-ফিল',
    'Quraish': 'কুরাইশ',
    'Al-Ma’un': 'আল-মাউন',
    'Al-Kawthar': 'আল-কাউসার',
    'Al-Kafirun': 'আল-কাফিরুন',
    'An-Nasr': 'আন-নস্র',
    'Al-Lahab': 'আল-লহাব',
    'Al-Ikhlas': 'আল-ইখলাস',
    'Al-Falaq': 'আল-ফালাক',
    'An-Nas': 'আন-নাস',
  };
  
  return surahNames[name] || name; // Return the Bengali name or the original if not found
};



  return (
    <div className="w-full bg-customBG">
      <div className="container mx-auto p-4">
        <nav className="border-b px-5 flex justify-between items-center border-yellow-600 p-2">
          <div className="">
            <Link to={'/'} className=''>
            <IoIosArrowBack className='w-8 h-8 hover:bg-cardBg rounded-full'/>
            </Link>
          </div>
          <div className="text-center font-Bangla text-2xl">
            <h2 className="">
            {translateSurahName(surahData.englishName)}
            ({currentSurahMeta.englishNameTranslation})
            </h2>
            <div className="text-lg flex justify-center gap-2">
              <span>সূরাঃ {numberToBengali(currentSurahMeta.number)}</span>
              <span className=""> | </span>
              <span> আয়াতঃ {numberToBengali(currentSurahMeta.numberOfAyahs)} টি</span>
              <span className=""> | </span>
              <span> অবতীর্ণঃ {translateRevelationType(currentSurahMeta.revelationType)} </span>
            </div>
          </div>
          <div className=""></div>
        </nav>
        <div className="">
          <div onClick='' className="flex items-center gap-2 p-2 rounded-lg bg-gray-300 justify-center cursor-pointer my-2">
            <span className='text-white text-lg'>পুরো সূরা শুনুন</span>
            <FaPlay className='text-white'/>
          </div>
        </div>
        <div className="mt-4">
          <ul className="list-none list-inside mt-2">
            {ayahs.map((ayah, index) => (
              <li key={index} className="text-[12px] p-6 m-6 border-gray-300 border-b">
                <div className="ml-2 text-3xl text-right py-3 font-Amiri_Quran">{ayah.arabic}</div> 
                <div className="font-Bangla w-3/4 text-lg py-3">
                  <span className="text-2xl">
                      {numberToBengali(ayah.numberInSurah)}.  
                  </span>
                  <span className="text-xl text-">
                  {ayah.bengali}
                  </span>
                </div> 
                <div className="flex ml-auto items-center gap-2 p-2 rounded-lg justify-center w-full font-Bangla">
                <div onClick={() => playAyah(ayah.audio)} className="flex ml-auto items-center gap-2 p-2 rounded-lg bg-slate-400 justify-center w-28 font-Bangla cursor-pointer">
                  <span className='text-white text-lg'>আয়াত শুন</span>
                  <FaPlay className='text-white'/>
                </div>
                <div onClick={pauseAyah} className="flex items-center gap-2 p-2 rounded-lg bg-red-400 justify-center w-28 font-Bangla cursor-pointer">
                    <span className='text-white text-lg'>পজ</span>
                    <FaPause className='text-white'/>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SurahPage;
