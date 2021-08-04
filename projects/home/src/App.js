import { useState, useRef, useEffect } from 'react'
import Canvas from './components/Canvas'
import Humidity from './components/Humidity'

// import useFetch from './utils/useFetch'


const CircularData = ({width, height, color, colorStep, name, data, focusCallback}) => {
  return(
    <div
      className={`
        absolute rounded-full transition-all p-5 transform hover:scale-110
        ${color ? `bg-${color}-${colorStep ? `${colorStep}` : '500'}` : 'bg-blue-500'}
      `}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        animationDuration: ''
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        focusCallback(name.toLowerCase())
      }}
    >
      <div className="text-white w-full text-center flex flex-col">
        <span className="uppercase opacity-70 text-xs tracking-wider">{name}</span> <br/>
        <span>Current: {data.slice(-1)[0]}</span>
        <span>Average: {data.reduce((acc, curr) => acc + curr) / data.length}</span>
      </div>
    </div>
  )
}

const GraphBar = ({value, divisor}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [])

  return(
    <div 
      className="w-full bg-gradient-to-b from-green-400 to-green-600 bg-opacity-30 hover:bg-opacity-80 grid place-items-center h-0 transition-all"
      style={{
        height: `${isMounted && value ? `${value / divisor * 100}%` : '0px'}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`opacity-0 transition-opacity font-bold text-black ${isHovered ? 'opacity-100' : ''}`}>{value}</span>
    </div>
  )
}


function useInterval(callback, delay) {
  const savedCallback = useRef()
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if(delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const useFetchFeed = ({feedName}) => {
  const aioKey = 'aio_bOWR24A1ismCRm8SvNYqOZEjVNt1'
  const url = feedName 
    ? `https://io.adafruit.com/api/v2/mattiel/feeds/${feedName}/data?limit=24`
    : `https://io.adafruit.com/api/v2/mattiel/groups/default/feeds?x-aio-key=${aioKey}`

  const fetch = () => {
    fetch(url).then(response => response.json())
    .then((data) => { return data })
    .catch((error) => {
      console.error(error);
    });
  }

  return fetch();
}

function App() {
  const [focus, setFocus] = useState('temperature')
  // const [temperature, setTemperature] = useState(null);
  // const [humidity, setHumidity] = useState(null)
  const [data, setData] = useState(null)
  const [unit, setUnit] = useState('')


  const delay = 6000;
  useInterval(() => {
    fetch(`https://io.adafruit.com/api/v2/mattiel/feeds/${focus}/data?limit=24`)
      .then(response => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, delay)

  useEffect(() => {
    fetch(`https://io.adafruit.com/api/v2/mattiel/feeds/${focus}/data?limit=24`)
      .then(response => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])
  
  function getUnit(name) {
    switch (name.toLowerCase()) {
      case 'temperature':
        return setUnit('°F')
      case 'humidity':
        return setUnit('%')
      default:
        return setUnit('')
    }
  }

  function handleFocus(name) {
    setFocus(name);
    setData(null);
    fetch(`https://io.adafruit.com/api/v2/mattiel/feeds/${name}/data?limit=24`)
      .then(response => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
    });
  }

  return (
    <div 
      className={`bg-gray-900 h-screen relative grid w-full`}
    > 
      <div className="absolute inline-grid gap-6 top-8 right-8 p-8 rounded-xl border-gray-800 shadow-md bg-gray-900 z-10">
        <h3 className="text-white text-2xl font-semibold capitalize">
          Current {focus}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <span className="text-gray-400 text-xs tracking-wider uppercase">Current</span>
            <span className="text-white font-bold text-2xl">
              { data ? `${Math.round(data[0].value)} ` : 'loading... '}
              { () => getUnit(focus) }
            </span>
          </div>
        </div>
      </div>

      {/* {focus && 
        <div className={`absolute left w-full max-h-0 overflow-hidden top ${focus ? 'max-h-full h-full' : ''}`}>
          <div className="absolute top-0 left-0 grid gap-1 place-items-end z-0 w-full h-full" style={{gridTemplateColumns: 'repeat(24, minmax(0, 1fr))'}}>
            {data.map((value, index) => {
              return(
                <GraphBar 
                  value={value}
                  divisor={manifest[focus].reduce((acc, curr) => Math.max(acc, curr)) * 1.25}
                  key={index}
                />
              )
            })}
          </div>
          <div className="absolute inline-grid gap-6 top-20 right-8 p-8 rounded-xl border-gray-700 shadow-md bg-gray-800">
            <h3 className="text-white text-2xl font-semibold capitalize">
              {focus}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <span className="text-gray-400 text-xs tracking-wider uppercase">Current</span>
                <span className="text-white font-bold text-2xl">{manifest[focus].slice(-1)[0]} °C</span>
              </div>

              <div className="grid gap-1">
                <span className="text-gray-400 text-xs tracking-wider uppercase">Average</span>
                <span className="text-white font-bold text-2xl">
                  {manifest[focus].reduce((acc, curr) => acc + curr) / manifest[focus].length} °C
                </span>
              </div>
            </div>
          </div>
          <button 
            className="text-white top-8 right-8 absolute"
            onClick={() => setFocus(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      } */}

      {/* <div className={`grid place-items-center transition-all z-10 ${focus ? '-translate-x-1/2 -translate-y-1/2 left-50 rotate-90 scale-50 transform' : ''}`}>
        <CircularData 
          color="blue" 
          width="700"
          height="700"
          name="Temperature"
          colorStep={600}
          data={manifest.temperature}
          focusCallback={handleFocus}
        />
        <CircularData 
          color="gray" 
          width="500" 
          height="500"
          name="Humidity"
          data={manifest.humidity}
          focusCallback={handleFocus}
        />
        <CircularData
          color="red"
          width="300"
          height="300"
          name="Movements"
          data={manifest.movements}
          focusCallback={handleFocus}
        />
      </div> */}

      <Canvas 
        temperature={data ? data[0].value : 0}
      />
      
      <div className="absolute bottom-12 transform -translate-x-1/2 left-1/2 z-10 bg-gray-800 rounded-xl overflow-hidden flex">
        <div className="bg-gray-800 shadow-xl text-gray-300 flex w-96">
          <div className="inline-block px-8 py-4 cursor-pointer text-center flex-1 hover:text-white" onClick={() => handleFocus('temperature')}>
            Temperature
          </div>
          <div className="inline-block px-8 py-4 cursor-pointer text-center flex-1 hover:text-white" onClick={() => handleFocus('humidity')}>
            Humidity
          </div>
          {/* <div className="inline-block px-8 py-4 cursor-pointer text-center flex-1 hover:text-white">
            Light
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
