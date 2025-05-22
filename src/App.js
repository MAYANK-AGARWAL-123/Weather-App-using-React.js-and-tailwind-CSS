import  { useState, useEffect } from 'react';

// Import axios for making HTTP requests
import axios from 'axios';

// Import various weather icons from react-icons
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from 'react-icons/io';

import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
  // BsCloudDrizzle,
} from 'react-icons/bs';

import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';

// API key for accessing weather data
const APIkey = '26edab4b8f42e584ae9810c2d0674bdd';

// The main functional component
const App = () => {
  // State variables using React's useState hook
  const [data, setData] = useState(null); // Holds weather data
  const [location, setLocation] = useState('Bucharest'); // Holds the location for weather data
  const [inputValue, setInputValue] = useState(''); // Holds user input for location search
  const [animate, setAnimate] = useState(false); // Used for animation
  const [loading, setLoading] = useState(false); // Tracks whether data is being loaded
  const [errorMsg, setErrorMsg] = useState(''); // Holds error messages

  // Event handler for user input
  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  // Event handler for submitting the search form
  const handleSubmit = (e) => {
    // If the input value is not empty, set the location
    if (inputValue !== '') {
      setLocation(inputValue);
    }

    // Select the input element
    const input = document.querySelector('input');

    // If the input value is empty, set the animate state to true and reset it after 500ms
    if (input.value === '') {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    // Clear the input field and prevent the default form submission behavior
    input.value = '';
    e.preventDefault();
  };

  // Fetch weather data using the useEffect hook
  useEffect(() => {
    // Set the loading state to true
    setLoading(true);
    
    // Construct the URL for the weather API
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    // Make an HTTP GET request using axios
    axios.get(url).then((res) => {
      // Set the weather data after a delay of 1500ms and set loading to false
      setTimeout(() => {
        setData(res.data);
        setLoading(false);
      }, 1500);
    }).catch(err => {
      // If there's an error, set loading to false and store the error message
      setLoading(false);
      setErrorMsg(err);
    });
  }, [location]);

  // Handle error messages and clear them after 2000ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('');
    }, 2000);
    
    // Clear the timer when the component unmounts or when the error message changes
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // If there is no weather data, display a loader
  if (!data) {
    return (
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
        <div>
          <ImSpinner8 className='text-5xl animate-spin text-white' />
        </div>
      </div>
    );
  }

  // Determine which weather icon to display based on the weather condition
  let icon;

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]' />;
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]' />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
    default:
      break;
  }

  // Create a date object
  const date = new Date();

  return (
    <div className='w-full h-screen bg-gradientBg
      bg-no-repeat bg-cover bg-center flex flex-col items-center
      justify-center px-4 lg:px-0'>
      
      {/* This div sets up the background image and container for the entire app */}
      
      {errorMsg && (
        // Display an error message if errorMsg is not empty
        <div className='w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] relative z-10 text-white top-2 lg:top-10 p-4 capitalize rounded-md m-12'>
          {`${errorMsg.response.data.message}`}
        </div>
      )}
  
      {/* This div displays an error message if there is one. It's conditionally rendered based on the errorMsg state. */}
      
      {/* Search form */}
      <form className={`${animate ? 'animate-shake' : 'animate-none'} h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}>
        <div className='h-full relative flex items-center justify-between p-2'>
          <input
            onChange={(e) => handleInput(e)}
            className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full'
            type='text'
            placeholder='Search by City or Country'
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition'
          >
            <IoMdSearch className='text-2xl text-white' />
          </button>
        </div>
      </form>
      
      {/* This div contains the search input field and a search button. The `animate-shake` class is added for animation based on the animate state. */}
      
      {/* Weather card */}
      <div className='w-full max-w-[450px] bg-black/20
        min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px]
        py-12 px-6'>
        {loading ? (
          // Display a loading spinner if loading is true
          <div className='w-full h-full flex justify-center items-center'>
            <ImSpinner8 className='text-white text-5xl animate-spin' />
          </div>
        ) : (
          <div>
            {/* Card top section */}
            <div className='flex items-center gap-x-5'>
              {/* Weather icon */}
              <div className='text-[87px]'>{icon}</div>
              <div>
                {/* City name and date */}
                <div className='text-2xl font-semibold'>{data.name}, {data.sys.country}</div>
                {/* Date */}
                <div>
                  {date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}
                </div>
              </div>
            </div>
            
            {/* This section displays the weather icon, city name, and date. */}
            
            {/* Card body section */}
            <div className='my-20'>
              <div className='flex justify-center items-center'>
                {/* Temperature */}
                <div className='text-[144px] leading-none font-light'>{parseInt(data.main.temp)}</div>
                {/* Celsius icon */}
                <div className='text-4xl'>
                  <TbTemperatureCelsius />
                </div>
              </div>
              {/* Weather description */}
              <div className='capitalize text-center'>{data.weather[0].description}</div>
            </div>
            
            {/* This section displays the temperature, weather description, and the "feels like" temperature. */}
            
            {/* Card bottom section */}
            <div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  {/* Water droplet icon and humidity percentage */}
                  <div className='text-[20px]'><BsWater /></div>
                  <div>
                    Humidity <span className='ml-2'>{data.main.humidity}%</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  {/* Wind icon and wind speed */}
                  <div className='text-[20px]'><BsWind /></div>
                  <div>
                    Wind <span className='ml-2'>{data.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  {/* Eye icon and visibility in kilometers */}
                  <div className='text-[20px]'><BsEye /></div>
                  <div>
                    Visibility{' '} <span className='ml-2'>{data.visibility / 1000}km</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  {/* Thermometer icon and "Feels like" temperature */}
                  <div className='text-[20px]'><BsThermometer /></div>
                  <div className='flex'>
                    Feels like <div className='flex ml-2'>{parseInt(data.main.feels_like)}<TbTemperatureCelsius /></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* This section displays information about humidity, wind speed, visibility, and "feels like" temperature. */}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
