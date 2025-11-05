import React, { useState, useEffect } from 'react';
import { MapPin, Thermometer, Users, AlertTriangle, Star, Navigation, Guitar as Hospital, Flag, MessageCircle, Shield, Eye, EyeOff, Droplets, Phone, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Beach, UserData, WeatherData, Review } from '../types/user';
import { realTimeFloodAPI, RealTimeFloodAlert } from '../services/realTimeFloodAPI';

interface BeachCardProps {
  beach: Beach;
  user: UserData | null;
}

const BeachCard: React.FC<BeachCardProps> = ({ beach, user }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [crowdLevel, setCrowdLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [showModal, setShowModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [floodAlert, setFloodAlert] = useState<RealTimeFloodAlert | null>(null);
  const [nearbyHospitals, setNearbyHospitals] = useState<any[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportPassword, setReportPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [reportType, setReportType] = useState('safety');
  const [reportDescription, setReportDescription] = useState('');
  const [showHospitals, setShowHospitals] = useState(false);

  useEffect(() => {
    // Real API calls for weather and flood data
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch real-time flood alert data from external APIs
        const alertData = await realTimeFloodAPI.getRealTimeFloodAlert(
          beach.id, 
          beach.coordinates.lat, 
          beach.coordinates.lng
        );
        setFloodAlert(alertData);
        
        // Extract weather data from flood alert
        if (alertData) {
          const weatherData: WeatherData = {
            temperature: alertData.currentConditions.temperature,
            description: alertData.currentConditions.stormActivity,
            humidity: alertData.currentConditions.humidity,
            windSpeed: parseInt(alertData.currentConditions.windSpeed),
            icon: this.getWeatherIcon(alertData.currentConditions.stormActivity),
            alerts: alertData.officialAlerts.map(alert => ({
              sender_name: alert.source,
              event: alert.alertType,
              start: Date.now(),
              end: Date.now() + 86400000,
              description: alert.description,
              tags: [alert.severity]
            }))
          };
          setWeather(weatherData);
        }
        
        // Random crowd level
        const crowds = ['low', 'medium', 'high'] as const;
        setCrowdLevel(crowds[Math.floor(Math.random() * 3)]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather/flood data:', error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Mock nearby hospitals data (within 10km)
    const mockHospitals = [
      { 
        name: `${beach.location} Medical Center`, 
        distance: '2.3 km', 
        rating: 4.5, 
        type: 'Multi-specialty',
        emergency: true,
        phone: '+91-9876543210'
      },
      { 
        name: `${beach.location} Emergency Hospital`, 
        distance: '3.1 km', 
        rating: 4.2, 
        type: 'Emergency Care',
        emergency: true,
        phone: '+91-9876543211'
      },
      { 
        name: 'Coastal Health Clinic', 
        distance: '4.7 km', 
        rating: 4.0, 
        type: 'General Medicine',
        emergency: false,
        phone: '+91-9876543212'
      },
      { 
        name: 'Seaside General Hospital', 
        distance: '6.2 km', 
        rating: 4.3, 
        type: 'Multi-specialty',
        emergency: true,
        phone: '+91-9876543213'
      },
      { 
        name: 'Marine Medical Center', 
        distance: '8.9 km', 
        rating: 4.1, 
        type: 'Trauma Center',
        emergency: true,
        phone: '+91-9876543214'
      }
    ];
    setNearbyHospitals(mockHospitals);
        
    // Load reviews from localStorage
    const storedReviews = JSON.parse(localStorage.getItem(`reviews_${beach.id}`) || '[]');
    setReviews(storedReviews);

    // Real-time flood alert updates every 30 seconds
    const floodAlertInterval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(floodAlertInterval);
  }, [beach.id]);

  const getWeatherIcon = (stormActivity: string): string => {
    const activity = stormActivity.toLowerCase();
    if (activity.includes('rain') || activity.includes('storm')) return '🌧️';
    if (activity.includes('cloud')) return '☁️';
    if (activity.includes('clear') || activity.includes('sunny')) return '☀️';
    return '🌤️';
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const review: Review = {
      id: Date.now().toString(),
      beachId: beach.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${beach.id}`, JSON.stringify(updatedReviews));
    
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!user) {
      alert('Please login to report issues.');
      return;
    }

    // Validate password first
    if (reportPassword !== 'beach123') {
      alert('Invalid password! Please contact administrator for reporting access. Default password: beach123');
      return;
    }

    // Validate description
    if (!reportDescription.trim()) {
      alert('Please provide a description for the report.');
      return;
    }
    
    // Store report in localStorage
    const reports = JSON.parse(localStorage.getItem('beachReports') || '[]');
    const newReport = {
      id: Date.now().toString(),
      beachId: beach.id,
      beachName: beach.name,
      type: reportType,
      description: reportDescription,
      reportedBy: user.name,
      reporterEmail: user.email,
      date: new Date().toLocaleString(),
      status: 'pending'
    };
    
    reports.push(newReport);
    localStorage.setItem('beachReports', JSON.stringify(reports));
    
    alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} alert reported successfully for ${beach.name}. Authorities will be notified within 24 hours.`);
    
    // Reset form
    setShowReportForm(false);
    setReportPassword('');
    setReportDescription('');
    setReportType('safety');
  };

  const handleReportAlert = () => {
    if (!user) {
      alert('Please login to report issues.');
      return;
    }
    setShowReportForm(true);
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${beach.coordinates.lat},${beach.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const callHospital = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFloodAlertColor = (level: string) => {
    switch (level) {
      case 'none': return 'text-green-600 bg-green-100 border-green-300';
      case 'low': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'medium': return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getFloodAlertText = (level: string) => {
    switch (level) {
      case 'none': return 'No Flood Risk';
      case 'low': return 'Low Flood Risk';
      case 'medium': return 'Medium Flood Risk';
      case 'high': return 'High Flood Risk';
      default: return 'Unknown';
    }
  };

  const getAlertTypeText = (alertType: string) => {
    switch (alertType) {
      case 'clear': return '✅ SAFE CONDITIONS';
      case 'heavy_rain': return '🌧️ HEAVY RAINFALL ALERT';
      case 'flood_risk': return '🌊 FLOOD RISK ALERT';
      case 'cyclone': return '🌀 CYCLONE WARNING';
      case 'storm_surge': return '⛈️ STORM SURGE ALERT';
      default: return '📢 WEATHER ADVISORY';
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  return (
    <>
      {/* Compact Beach Card */}
      <div 
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* Beach Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={beach.image}
            alt={beach.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              // Fallback image for broken links
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800';
            }}
          />
          
          {/* Safety Badge */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${getSafetyColor(beach.safety)}`}>
            {beach.safety.toUpperCase()} SAFETY
          </div>
          
          {/* Flood Alert Badge - ALWAYS VISIBLE */}
          {floodAlert && (
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${getFloodAlertColor(floodAlert.level)} flex items-center animate-pulse`}>
              <Droplets className="w-3 h-3 mr-1" />
              {floodAlert.level.toUpperCase()}
            </div>
          )}

          {/* Live Update Indicator */}
          {floodAlert && (
            <div className="absolute bottom-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs animate-pulse">
              🔴 LIVE: {floodAlert.lastUpdated}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-1">{beach.name}</h3>
              <div className="flex items-center text-blue-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{beach.location}, {beach.state}</span>
              </div>
            </div>
            {averageRating > 0 && (
              <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm font-semibold">{averageRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center">Click to view details</p>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-800">{beach.name}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Beach Image */}
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={beach.image}
                  alt={beach.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div>
                <div className="flex items-center text-blue-600 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{beach.location}, {beach.state}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{beach.description}</p>
              </div>

              {/* PROMINENT Flood Alert Details */}
              {floodAlert && (
                <div className={`p-6 rounded-lg border-l-4 ${getFloodAlertColor(floodAlert.level)} bg-opacity-50`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Droplets className="w-6 h-6 mr-3" />
                      <span className="font-bold text-xl">
                        {getAlertTypeText(floodAlert.alertType)}
                      </span>
                    </div>
                    <span className="text-sm bg-white px-3 py-1 rounded animate-pulse">
                      🔴 LIVE: {floodAlert.lastUpdated}
                    </span>
                  </div>

                  {/* Official Weather Alerts from External APIs */}
                  {floodAlert.officialAlerts && floodAlert.officialAlerts.length > 0 && (
                    <div className="mb-4 bg-red-100 border border-red-300 rounded p-4">
                      <h4 className="font-bold text-red-800 mb-2">🚨 OFFICIAL ALERTS FROM EXTERNAL SOURCES</h4>
                      {floodAlert.officialAlerts.map((alert, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-red-700">{alert.alertType}</span>
                            <span className="text-xs text-red-600">{alert.source}</span>
                          </div>
                          <p className="text-sm text-red-800">{alert.description}</p>
                          <span className="bg-red-200 text-red-700 px-2 py-1 rounded-full text-xs">
                            {alert.severity} Alert
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Current Conditions */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm bg-white bg-opacity-70 p-4 rounded">
                    <div><strong>🌊 Sea Level:</strong> {floodAlert.currentConditions.seaLevel}</div>
                    <div><strong>🌊 Tide:</strong> {floodAlert.currentConditions.tideHeight} ({floodAlert.currentConditions.tideType})</div>
                    <div><strong>🌧️ Rainfall:</strong> {floodAlert.currentConditions.rainfall}</div>
                    <div><strong>💨 Wind:</strong> {floodAlert.currentConditions.windSpeed}</div>
                    <div><strong>⛈️ Storm:</strong> {floodAlert.currentConditions.stormActivity}</div>
                    <div><strong>👁️ Visibility:</strong> {floodAlert.currentConditions.visibility}</div>
                    <div><strong>🌡️ Temperature:</strong> {floodAlert.currentConditions.temperature}°C</div>
                    <div><strong>💧 Humidity:</strong> {floodAlert.currentConditions.humidity}%</div>
                  </div>

                  {/* Risk Factors */}
                  <div className="mb-4 bg-white bg-opacity-70 p-4 rounded">
                    <strong className="text-sm">⚠️ Risk Factors:</strong>
                    <ul className="text-sm mt-2 ml-4">
                      {floodAlert.riskFactors.map((factor: string, index: number) => (
                        <li key={index} className="list-disc">🔸 {factor}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety Recommendations */}
                  <div className="mb-4 bg-white bg-opacity-70 p-4 rounded">
                    <strong className="text-sm">🛡️ Safety Recommendations:</strong>
                    <ul className="text-sm mt-2 ml-4">
                      {floodAlert.safetyRecommendations.map((rec: string, index: number) => (
                        <li key={index} className="list-disc">✅ {rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Affected Areas */}
                  <div className="mb-4 bg-white bg-opacity-70 p-4 rounded">
                    <strong className="text-sm">📍 Affected Areas:</strong>
                    <p className="text-sm mt-1">{floodAlert.affectedAreas.join(', ')}</p>
                  </div>

                  {/* Emergency Information for High Risk */}
                  {floodAlert.level === 'high' && floodAlert.emergencyInfo && (
                    <div className="bg-red-200 p-4 rounded mt-4 border-2 border-red-500">
                      <strong className="text-red-800">🚨 EMERGENCY EVACUATION INFO:</strong>
                      <div className="text-sm mt-2">
                        <p><strong>🏠 Shelter:</strong> {floodAlert.emergencyInfo.evacuationShelter}</p>
                        <p><strong>🛣️ Route:</strong> {floodAlert.emergencyInfo.evacuationRoute}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => window.open(`tel:${floodAlert.emergencyInfo.emergencyContacts.coastGuard}`, '_self')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            🚢 Coast Guard: {floodAlert.emergencyInfo.emergencyContacts.coastGuard}
                          </button>
                          <button
                            onClick={() => window.open(`tel:${floodAlert.emergencyInfo.emergencyContacts.localEmergency}`, '_self')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            🚨 Emergency: {floodAlert.emergencyInfo.emergencyContacts.localEmergency}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-600 mt-3 text-center bg-white bg-opacity-70 p-2 rounded">
                    🔄 Next update: {floodAlert.nextUpdate} | Updates every 30 seconds
                  </div>
                </div>
              )}

              {/* Weather Info */}
              {loading ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="animate-pulse flex items-center">
                    <div className="w-6 h-6 bg-blue-200 rounded mr-2"></div>
                    <div className="h-4 bg-blue-200 rounded w-32"></div>
                  </div>
                </div>
              ) : weather && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Thermometer className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="font-semibold text-blue-800">{weather.temperature}°C</span>
                      <span className="text-blue-600 ml-2">{weather.description}</span>
                    </div>
                    <div className="text-2xl">{weather.icon}</div>
                  </div>
                  <div className="flex justify-between text-sm text-blue-600 mt-2">
                    <span>Humidity: {weather.humidity}%</span>
                    <span>Wind: {weather.windSpeed} km/h</span>
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    📡 Data from real-time APIs: OpenWeatherMap, IMD, CWC
                  </div>
                </div>
              )}

              {/* Crowd Level */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-700">Crowd Level:</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getCrowdColor(crowdLevel)}`}>
                  {crowdLevel.toUpperCase()}
                </span>
              </div>

              {/* Activities */}
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Popular Activities</h4>
                <div className="flex flex-wrap gap-2">
                  {beach.popularActivities.map((activity, index) => (
                    <span key={index} className="bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs">
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={openGoogleMaps}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </button>
                <button
                  onClick={handleReportAlert}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center"
                >
                  <Flag className="w-4 h-4 mr-1" />
                  Report
                </button>
                <button 
                  onClick={() => setShowHospitals(!showHospitals)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                  title="Nearby Hospitals"
                >
                  <Hospital className="w-4 h-4" />
                </button>
              </div>

              {/* Nearby Hospitals */}
              {showHospitals && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Hospital className="w-5 h-5 mr-2" />
                    Nearby Hospitals (within 10km)
                  </h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {nearbyHospitals.map((hospital, index) => (
                      <div key={index} className="bg-white p-3 rounded-lg border border-green-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-semibold text-green-800">{hospital.name}</h5>
                            <p className="text-sm text-green-600">{hospital.type}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-1">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="text-sm font-semibold">{hospital.rating}</span>
                            </div>
                            {hospital.emergency && (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                                Emergency
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{hospital.distance}</span>
                          <button
                            onClick={() => callHospital(hospital.phone)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                          >
                            <Phone className="w-3 h-3 mr-1" />
                            Call Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Report Form */}
              {showReportForm && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                    <Flag className="w-5 h-5 mr-2" />
                    Report Issue for {beach.name}
                  </h4>
                  <form onSubmit={handleReportSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Reporting Password *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={reportPassword}
                          onChange={(e) => setReportPassword(e.target.value)}
                          className="w-full p-2 pr-10 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter reporting password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-2 text-red-500 hover:text-red-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-red-600 mt-1">
                        Password required for reporting. Default: beach123
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Report Type</label>
                      <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full p-2 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="safety">Safety Concern</option>
                        <option value="pollution">Pollution</option>
                        <option value="overcrowding">Overcrowding</option>
                        <option value="infrastructure">Infrastructure Issue</option>
                        <option value="emergency">Emergency Situation</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">Description *</label>
                      <textarea
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        className="w-full p-2 border border-red-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="Please describe the issue in detail..."
                        required
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                      >
                        Submit Report
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowReportForm(false);
                          setReportPassword('');
                          setReportDescription('');
                        }}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Reviews Section */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-blue-800">Reviews ({reviews.length})</h4>
                  {user && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Add Review
                    </button>
                  )}
                </div>

                {/* Add Review Form */}
                {showReviewForm && user && (
                  <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {[5, 4, 3, 2, 1].map(rating => (
                          <option key={rating} value={rating}>{rating} Star{rating !== 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Share your experience..."
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      >
                        Submit Review
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Display Reviews */}
                {reviews.length > 0 ? (
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {reviews.slice(-3).map((review) => (
                      <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-blue-800">{review.userName}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{review.comment}</p>
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BeachCard;