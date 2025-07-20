import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import kyiv from '../../assets/Kyiv.jpg';
import lakePragsItaly from '../../assets/LakePragsItaly.jpg';
import london from '../../assets/london.jpg';
import newYorkCity from '../../assets/NewYorkCity.jpg';
import norway from '../../assets/Norway.jpg';
import paris from '../../assets/paris.jpg';
import japan from '../../assets/Japan.jpg';
import greece from '../../assets/Greece.jpg';
import bali from '../../assets/Bali.jpg';
import '../../App.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; 

const Slides = () => {
  return (
    <>
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={0}
      slidesPerView={1}
      navigation
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3000, 
        disableOnInteraction: false, 
      }}
      loop={true}
      className='slides-container -z-10 h-[30vh] lg:h-full'
    >
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={kyiv} alt="Kyiv" />
          <div className="absolute top-0 left-0 w-full h-full bg-[black] bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Відкрийте для себе Київ
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={lakePragsItaly} alt="Lake Prags Italy" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Відкрийте для себе озеро Прагс в Італії
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={london} alt="London" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Лондон — місто контрастів
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={newYorkCity} alt="New York City" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Нью-Йорк — місто, яке ніколи не спить
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={norway} alt="Norway" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Норвегія — природа в найкращому вигляді
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={paris} alt="Paris" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
          Париж — місто вогнів і мистецтва
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={japan} alt="Japan" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Японія — країна традицій і технологій
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={greece} alt="Greece" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Греція — стародавня культура
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative">
          <img className="w-full h-[30vh] lg:h-[50vh] object-cover" src={bali} alt="Bali" />
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-[#f1e8e6] text-xl lg:text-3xl font-bold">
            Балі — рай для мандрівників
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
    </>
  );
};


export default Slides;
