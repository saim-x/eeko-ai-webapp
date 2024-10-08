'use client';
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaLocationArrow, FaCalendarAlt, FaSearch, FaGlobeAfrica, FaTemperatureHigh, FaSun, FaCheckCircle, FaSnowflake, FaCloudRain, FaCloudSunRain, FaWater, FaWind, FaTint, FaCloudSun, FaVolumeUp } from "react-icons/fa";
import { Inter } from 'next/font/google';
import { FaSatellite } from 'react-icons/fa';
import Header from '../components/Header';
const inter = Inter({ subsets: ['latin'] });

const presetLocations = [
    { name: "Nairobi, Kenya", subtitle: "Tropical savanna climate", lat: "-1.2921", lon: "36.8219" },
    { name: "Death Valley, USA", subtitle: "Extremely hot desert climate", lat: "36.5323", lon: "-116.9325" },
    { name: "Oymyakon, Russia", subtitle: "Subarctic climate, coldest inhabited place", lat: "63.4628", lon: "142.7866" },
    { name: "Dubai, UAE", subtitle: "Hot desert climate", lat: "25.2048", lon: "55.2708" },
    { name: "Amazon Rainforest, Brazil", subtitle: "Tropical rainforest climate", lat: "-3.4653", lon: "-62.2159" },
];

export default function NasaData() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Form inputs
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Current location state
    const [currentLocation, setCurrentLocation] = useState(null);
    const [locationLoading, setLocationLoading] = useState(false);
    const [locationError, setLocationError] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const playAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.playbackRate = 0.8; // Decrease pitch
                audioRef.current.detune = -1000; // Lower pitch by 200 cents (2 semitones)
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (currentLocation) {
            setLatitude(currentLocation.latitude.toFixed(4));
            setLongitude(currentLocation.longitude.toFixed(4));
        }
    }, [currentLocation]);

    const getCurrentLocation = () => {
        setLocationLoading(true);
        setLocationError(null);

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setLocationLoading(false);
                },
                (error) => {
                    setLocationError("Error getting location: " + error.message);
                    setLocationLoading(false);
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser");
            setLocationLoading(false);
        }
    };

    const fetchData = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `https://power.larc.nasa.gov/api/temporal/hourly/point?start=${startDate.replace(/-/g, '')}&end=${endDate.replace(/-/g, '')}&latitude=${latitude}&longitude=${longitude}&community=re&parameters=T2M,PRECTOTCORR,WS2M,RH2M,ALLSKY_SFC_SW_DWN&format=json&user=demo&header=true`
            );
            const result = await res.json();
            setData(result);
        } catch (err) {
            setError("Error fetching data");
        } finally {
            setLoading(false);
        }
    };

    const getAgriculturalInsights = (data) => {
        const insights = [];
        const unavailableData = [];

        if (data && data.properties && data.properties.parameter) {
            const { T2M, PRECTOTCORR, WS2M, RH2M, ALLSKY_SFC_SW_DWN } = data.properties.parameter;

            // Check for invalid or unavailable data
            const checkDataValidity = (paramName, paramData) => {
                const values = Object.values(paramData);
                if (values.every(val => val === 0 || val === -999)) {
                    unavailableData.push({ param: paramName, reason: "All values are 0.00 or -999" });
                    return false;
                }
                return true;
            };

            const validT2M = checkDataValidity("Temperature", T2M);
            const validPRECTOTCORR = checkDataValidity("Precipitation", PRECTOTCORR);
            const validWS2M = checkDataValidity("Wind Speed", WS2M);
            const validRH2M = checkDataValidity("Relative Humidity", RH2M);
            const validALLSKY_SFC_SW_DWN = checkDataValidity("Solar Radiation", ALLSKY_SFC_SW_DWN);

            // Calculate averages only for valid data
            const avgTemp = validT2M ? Object.values(T2M).filter(val => val !== 0 && val !== -999).reduce((sum, val) => sum + val, 0) / Object.values(T2M).filter(val => val !== 0 && val !== -999).length : null;
            const avgPrecip = validPRECTOTCORR ? Object.values(PRECTOTCORR).filter(val => val !== 0 && val !== -999).reduce((sum, val) => sum + val, 0) / Object.values(PRECTOTCORR).filter(val => val !== 0 && val !== -999).length : null;
            const avgWindSpeed = validWS2M ? Object.values(WS2M).filter(val => val !== 0 && val !== -999).reduce((sum, val) => sum + val, 0) / Object.values(WS2M).filter(val => val !== 0 && val !== -999).length : null;
            const avgHumidity = validRH2M ? Object.values(RH2M).filter(val => val !== 0 && val !== -999).reduce((sum, val) => sum + val, 0) / Object.values(RH2M).filter(val => val !== 0 && val !== -999).length : null;
            const avgSolarRad = validALLSKY_SFC_SW_DWN ? Object.values(ALLSKY_SFC_SW_DWN).filter(val => val !== 0 && val !== -999).reduce((sum, val) => sum + val, 0) / Object.values(ALLSKY_SFC_SW_DWN).filter(val => val !== 0 && val !== -999).length : null;

            // Temperature insights
            if (validT2M) {
                if (avgTemp > 30) {
                    insights.push({
                        insight: "Extreme heat conditions",
                        technical: `Average temperature: ${avgTemp.toFixed(1)}°C`,
                        reason: "Extreme heat can cause heat stress in crops, reduce pollination, and increase water demand. Consider shade cloth, misting systems, and increased irrigation.",
                        iconName: "FaTemperatureHigh"
                    });
                } else if (avgTemp > 25) {
                    insights.push({
                        insight: "Warm conditions",
                        technical: `Average temperature: ${avgTemp.toFixed(1)}°C`,
                        reason: "Warm temperatures can accelerate crop growth but may increase water needs. Monitor soil moisture and adjust irrigation accordingly.",
                        iconName: "FaSun"
                    });
                } else if (avgTemp >= 15 && avgTemp <= 25) {
                    insights.push({
                        insight: "Optimal temperature range",
                        technical: `Average temperature: ${avgTemp.toFixed(1)}°C`,
                        reason: "This temperature range is generally optimal for many crops. Continue with standard agricultural practices and monitor for any sudden changes.",
                        iconName: "FaCheckCircle"
                    });
                } else if (avgTemp < 10) {
                    insights.push({
                        insight: "Cold conditions",
                        technical: `Average temperature: ${avgTemp.toFixed(1)}°C`,
                        reason: "Cold temperatures can slow plant growth and increase frost risk. Consider using row covers or greenhouses for sensitive crops.",
                        iconName: "FaSnowflake"
                    });
                }
            }

            // Precipitation insights
            if (validPRECTOTCORR) {
                if (avgPrecip > 10) {
                    insights.push({
                        insight: "Heavy precipitation",
                        technical: `Average precipitation: ${avgPrecip.toFixed(2)} mm/h`,
                        reason: "Heavy rainfall may lead to soil erosion and nutrient leaching. Consider implementing drainage systems and using cover crops.",
                        iconName: "FaCloudRain"
                    });
                } else if (avgPrecip >= 2 && avgPrecip <= 10) {
                    insights.push({
                        insight: "Moderate precipitation",
                        technical: `Average precipitation: ${avgPrecip.toFixed(2)} mm/h`,
                        reason: "This level of precipitation is generally beneficial for most crops. Monitor soil moisture levels and adjust irrigation as needed.",
                        iconName: "FaCloudSunRain"
                    });
                } else if (avgPrecip < 0.5) {
                    insights.push({
                        insight: "Low precipitation",
                        technical: `Average precipitation: ${avgPrecip.toFixed(2)} mm/h`,
                        reason: "Low rainfall may require additional irrigation. Consider drought-resistant crops and water conservation techniques.",
                        iconName: "FaWater"
                    });
                }
            }

            // Wind speed insights
            if (validWS2M) {
                if (avgWindSpeed > 10) {
                    insights.push({
                        insight: "High wind speeds",
                        technical: `Average wind speed: ${avgWindSpeed.toFixed(1)} m/s`,
                        reason: "High wind speeds can physically damage crops, lead to soil erosion, and increase water loss through evaporation. Implementing windbreaks or selecting wind-resistant crop varieties may help mitigate these effects.",
                        iconName: "FaWind"
                    });
                } else if (avgWindSpeed >= 4 && avgWindSpeed <= 10) {
                    insights.push({
                        insight: "Moderate wind speeds",
                        technical: `Average wind speed: ${avgWindSpeed.toFixed(1)} m/s`,
                        reason: "Moderate wind speeds can help with air circulation, reducing humidity and disease risk. Ensure proper crop spacing and use of windbreaks can further enhance this effect.",
                        iconName: "FaWind"
                    });
                } else if (avgWindSpeed >= 1 && avgWindSpeed < 4) {
                    insights.push({
                        insight: "Light wind speeds",
                        technical: `Average wind speed: ${avgWindSpeed.toFixed(1)} m/s`,
                        reason: "Light wind speeds are generally beneficial for most crops. Monitor for any changes that might affect pollination or disease spread.",
                        iconName: "FaWind"
                    });
                } else if (avgWindSpeed < 1) {
                    insights.push({
                        insight: "Very low wind speeds",
                        technical: `Average wind speed: ${avgWindSpeed.toFixed(1)} m/s`,
                        reason: "Very low wind speeds can lead to stagnant air, which may increase humidity levels and promote fungal diseases. Ensuring adequate air circulation and using proper crop management practices can help reduce disease risk.",
                        iconName: "FaWind"
                    });
                }
            }

            // Humidity insights
            if (validRH2M) {
                if (avgHumidity > 80) {
                    insights.push({
                        insight: "High humidity",
                        technical: `Average relative humidity: ${avgHumidity.toFixed(1)}%`,
                        reason: "High humidity can increase the risk of fungal diseases. Ensure good air circulation and consider fungicide applications if necessary.",
                        iconName: "FaTint"
                    });
                } else if (avgHumidity >= 50 && avgHumidity <= 80) {
                    insights.push({
                        insight: "Optimal humidity range",
                        technical: `Average relative humidity: ${avgHumidity.toFixed(1)}%`,
                        reason: "This humidity range is generally suitable for most crops. Continue monitoring for any sudden changes that might affect plant health.",
                        iconName: "FaCheckCircle"
                    });
                } else if (avgHumidity < 30) {
                    insights.push({
                        insight: "Low humidity",
                        technical: `Average relative humidity: ${avgHumidity.toFixed(1)}%`,
                        reason: "Low humidity can increase water loss through transpiration. Consider increasing irrigation and using mulch to retain soil moisture.",
                        iconName: "FaWater"
                    });
                }
            }

            // Solar radiation insights
            if (validALLSKY_SFC_SW_DWN) {
                if (avgSolarRad > 300) {
                    insights.push({
                        insight: "High solar radiation",
                        technical: `Average solar radiation: ${avgSolarRad.toFixed(1)} W/m^2`,
                        reason: "High solar radiation can lead to increased evapotranspiration. Consider shade structures for sensitive crops and adjust irrigation accordingly.",
                        iconName: "FaSun"
                    });
                } else if (avgSolarRad >= 100 && avgSolarRad <= 300) {
                    insights.push({
                        insight: "Optimal solar radiation",
                        technical: `Average solar radiation: ${avgSolarRad.toFixed(1)} W/m^2`,
                        reason: "This range of solar radiation is generally beneficial for most crops. Continue with standard agricultural practices and monitor for any sudden changes.",
                        iconName: "FaSun"
                    });
                } else if (avgSolarRad < 100) {
                    insights.push({
                        insight: "Low solar radiation",
                        technical: `Average solar radiation: ${avgSolarRad.toFixed(1)} W/m^2`,
                        reason: "Low solar radiation may slow plant growth. Consider supplemental lighting for greenhouse crops or selecting shade-tolerant varieties for outdoor cultivation.",
                        iconName: "FaCloudSun"
                    });
                }
            }
        }

        return { insights, unavailableData };
    };

    const setPresetLocation = (lat, lon) => {
        setLatitude(lat);
        setLongitude(lon);
    };

    const getIconComponent = (iconName) => {
        switch (iconName) {
            case "FaTemperatureHigh": return FaTemperatureHigh;
            case "FaSun": return FaSun;
            case "FaCheckCircle": return FaCheckCircle;
            case "FaSnowflake": return FaSnowflake;
            case "FaCloudRain": return FaCloudRain;
            case "FaCloudSunRain": return FaCloudSunRain;
            case "FaWater": return FaWater;
            case "FaWind": return FaWind;
            case "FaTint": return FaTint;
            case "FaCloudSun": return FaCloudSun;
            default: return null;
        }
    };

    const setDateRange = (range) => {
        const endDate = new Date();
        let startDate = new Date();

        switch (range) {
            case 'year':
                startDate.setFullYear(startDate.getFullYear() - 1);
                break;
            case 'month':
                startDate.setMonth(startDate.getMonth() - 1);
                break;
            case 'week':
                startDate.setDate(startDate.getDate() - 7);
                break;
            default:
                break;
        }

        setStartDate(startDate.toISOString().split('T')[0]);
        setEndDate(endDate.toISOString().split('T')[0]);
    };

    return (
        <div className={`${inter.className} min-h-screen bg-gray-100 bg-cover bg-center text-gray-900 p-4 sm:p-8 overflow-x-hidden`} style={{ backgroundImage: "url('/farm-video-background.mp4')" }}>
            <Header />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
            >
                <div className="p-6 sm:p-10 bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 sm:mb-0">NASA Weather Data Explorer</h1>
                        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={playAudio}
                                className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
                                aria-label="Read out loud"
                            >
                                <FaVolumeUp className="mr-2" />
                                {isPlaying ? 'Pause' : 'Read'}
                            </motion.button>
                            <a href="https://github.com/saim-x/eeko-ai-webapp" target="_blank" rel="noopener noreferrer">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    Frontend
                                </motion.button>
                            </a>
                            <a href="https://github.com/mohibahmedbleedai/agri-backend" target="_blank" rel="noopener noreferrer">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>                                     Backend
                                </motion.button>
                            </a>
                        </div>
                    </div>
                    <audio ref={audioRef} src="/insights.wav" />
                    <form onSubmit={fetchData} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={latitude}
                                        onChange={(e) => setLatitude(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        placeholder="Enter latitude"
                                        required
                                    />
                                    <FaLocationArrow className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={longitude}
                                        onChange={(e) => setLongitude(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        placeholder="Enter longitude"
                                        required
                                    />
                                    <FaLocationArrow className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            {presetLocations.map((location, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={() => setPresetLocation(location.lat, location.lon)}
                                    className="bg-white text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-100 transition duration-300 flex flex-col items-start justify-center shadow-sm border border-gray-200"
                                >
                                    <span className="text-xs font-medium w-full truncate">{location.name}</span>
                                    <span className="text-[9px] text-gray-500 w-full truncate">{location.subtitle}</span>
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="button"
                            onClick={getCurrentLocation}
                            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center shadow-md"
                        >
                            <FaLocationArrow className="mr-2" />
                            Use Current Location
                        </motion.button>

                        {locationLoading && <p className="text-blue-600">Getting location...</p>}
                        {locationError && <p className="text-red-600">{locationError}</p>}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                                        required
                                    />
                                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between space-x-3">
                            {['year', 'month', 'week'].map((range) => (
                                <motion.button
                                    key={range}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={() => setDateRange(range)}
                                    className="flex-1 bg-white text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-100 transition duration-300 text-sm sm:text-base shadow-sm border border-gray-200"
                                >
                                    Past {range.charAt(0).toUpperCase() + range.slice(1)}
                                </motion.button>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center shadow-md"
                        >
                            <FaSearch className="mr-2" />
                            Fetch NASA Data
                        </motion.button>
                    </form>

                    {loading && (
                        <div className="mt-8 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    )}

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-900 p-4 rounded-lg"
                        >
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <div className="mt-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg p-6">
                        <h3 className="text-white text-xl font-semibold mb-4">AI-Powered Agricultural Assistant</h3>
                        <p className="text-white text-sm mb-6">Get personalized farming advice and insights from our intelligent chatbot.</p>
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 8px rgb(255,255,255)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.location.href = '/ChatBot'}
                            className="w-full bg-white text-green-600 font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition duration-300 flex items-center justify-center"
                        >
                            <FaGlobeAfrica className="mr-3 text-xl" />
                            Start AI Consultation
                        </motion.button>
                    </div>

                    {data && data.properties && data.properties.parameter && data.properties.parameter.T2M && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mt-8"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">NASA Weather Data</h2>
                            <div className="mb-8 bg-gradient-to-r from-green-100 to-blue-100 border-l-4 border-green-500 p-6 rounded-lg shadow-lg">
                                <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4">Agricultural Insights</h3>
                                {(() => {
                                    const { insights, unavailableData } = getAgriculturalInsights(data);
                                    if (insights.length > 0) {
                                        return (
                                            <ul className="space-y-6">
                                                {insights.map((item, index) => {
                                                    const IconComponent = getIconComponent(item.iconName);
                                                    return (
                                                        <li key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                                            <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                                                                <div className="flex items-center mb-2 sm:mb-0">
                                                                    {IconComponent && <IconComponent className="text-green-600 mr-3 text-3xl sm:text-4xl" />}
                                                                    <h4 className="text-green-600 font-bold text-lg sm:text-xl">{item.insight}</h4>
                                                                </div>
                                                            </div>
                                                            <p className="text-gray-700 mt-2 text-sm sm:text-base"><span className="font-semibold">Technical:</span> {item.technical}</p>
                                                            <p className="text-gray-700 mt-2 text-sm sm:text-base"><span className="font-semibold">Reason:</span> {item.reason}</p>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        );
                                    } else if (unavailableData.length > 0) {
                                        return (
                                            <div className="bg-yellow-100 p-4 rounded-lg">
                                                <p className="text-yellow-700 font-semibold text-base sm:text-lg mb-2">Some data is unavailable or invalid:</p>
                                                <ul className="list-disc pl-5 mt-2">
                                                    {unavailableData.map((item, index) => (
                                                        <li key={index} className="text-yellow-600 text-sm sm:text-base">{item.param}: {item.reason}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        );
                                    } else {
                                        return <p className="text-gray-700 text-base sm:text-lg font-medium">No specific insights available for the current data.</p>;
                                    }
                                })()}
                            </div>
                            <div className="overflow-x-auto bg-white rounded-lg shadow">
                                <table className="w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200 border-b border-gray-300">
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Time</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Temp (°C)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Precip (mm/h)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Wind (m/s)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Humidity (%)</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Solar (W/m^2)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.keys(data.properties.parameter.T2M).map((time, index) => (
                                            <tr key={time} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">{time}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{data.properties.parameter.T2M[time]?.toFixed(1)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{(data.properties.parameter.PRECTOTCORR[time] || 0).toFixed(2)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{data.properties.parameter.WS2M[time]?.toFixed(1)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{data.properties.parameter.RH2M[time]?.toFixed(1)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{data.properties.parameter.ALLSKY_SFC_SW_DWN[time]?.toFixed(1)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}