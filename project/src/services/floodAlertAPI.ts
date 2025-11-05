// Real-time Flood Alert API Service
export interface FloodAlertData {
  beachId: string;
  level: 'none' | 'low' | 'medium' | 'high';
  seaLevel: string;
  tideHeight: string;
  tideType: string;
  rainfall: string;
  windSpeed: string;
  stormActivity: string;
  visibility: string;
  riskFactors: string[];
  safetyRecommendations: string[];
  affectedAreas: string[];
  lastUpdated: string;
  nextUpdate: string;
  evacuationShelter?: string;
  evacuationRoute?: string;
  emergencyContacts?: {
    coastGuard: string;
    localEmergency: string;
    weatherOffice: string;
  };
}

// Simulated real-time API data - In production, this would fetch from actual weather/flood monitoring APIs
const generateRealTimeFloodData = (beachId: string): FloodAlertData => {
  const currentTime = new Date();
  const nextUpdateTime = new Date(currentTime.getTime() + 30000); // 30 seconds later
  
  // Simulate different flood conditions based on beach location and current conditions
  const floodScenarios: { [key: string]: Partial<FloodAlertData> } = {
    // High Risk Scenarios
    '36': { // Marina Beach, Chennai
      level: 'high',
      seaLevel: '+1.8m above normal',
      tideHeight: '3.5m',
      tideType: 'Storm Surge',
      rainfall: '45mm in last hour',
      windSpeed: '65 km/h',
      stormActivity: 'Severe cyclonic storm',
      visibility: '1km',
      riskFactors: [
        'Severe coastal flooding up to 500m inland',
        'Dangerous waves up to 5m height',
        'Strong rip currents and undertows',
        'Beach road completely submerged',
        'Parking areas flooded',
        'Nearby buildings at risk'
      ],
      safetyRecommendations: [
        'IMMEDIATE EVACUATION REQUIRED',
        'Avoid entire coastal area',
        'Stay minimum 1km from shoreline',
        'Monitor emergency broadcasts',
        'Keep emergency supplies ready'
      ],
      affectedAreas: [
        'Entire Marina Beach stretch',
        'Beach road and promenade',
        'Parking areas and facilities',
        'Nearby restaurants and shops',
        'Coastal residential areas'
      ],
      evacuationShelter: 'Chennai Corporation Community Hall, Anna Salai',
      evacuationRoute: 'Take Anna Salai towards city center, avoid coastal roads',
      emergencyContacts: {
        coastGuard: '1554',
        localEmergency: '108',
        weatherOffice: '044-28271616'
      }
    },
    
    '39': { // RK Beach, Visakhapatnam
      level: 'high',
      seaLevel: '+1.5m above normal',
      tideHeight: '3.2m',
      tideType: 'Cyclonic Storm Surge',
      rainfall: '38mm in last hour',
      windSpeed: '58 km/h',
      stormActivity: 'Cyclonic storm approaching',
      visibility: '1.5km',
      riskFactors: [
        'Severe flooding expected',
        'Submarine museum area at risk',
        'Beach road impassable',
        'Strong coastal winds',
        'Dangerous wave conditions'
      ],
      safetyRecommendations: [
        'EVACUATE IMMEDIATELY',
        'Close all beach facilities',
        'Avoid coastal roads',
        'Seek high ground shelter'
      ],
      affectedAreas: [
        'RK Beach promenade',
        'Submarine museum complex',
        'Beach road and parking',
        'Coastal restaurants'
      ],
      evacuationShelter: 'Visakhapatnam Municipal Corporation Hall',
      evacuationRoute: 'Take NH16 towards city center',
      emergencyContacts: {
        coastGuard: '1554',
        localEmergency: '108',
        weatherOffice: '0891-2566502'
      }
    },

    // Medium Risk Scenarios
    '29': { // Varkala Beach, Kerala
      level: 'medium',
      seaLevel: '+0.9m above normal',
      tideHeight: '2.3m',
      tideType: 'Spring High Tide',
      rainfall: '18mm in last hour',
      windSpeed: '32 km/h',
      stormActivity: 'Monsoon depression',
      visibility: '4km',
      riskFactors: [
        'Cliff erosion possible',
        'Moderate coastal flooding',
        'Slippery cliff paths',
        'Strong waves at beach level',
        'Reduced visibility due to rain'
      ],
      safetyRecommendations: [
        'Avoid cliff edges and paths',
        'Stay away from water',
        'Use extreme caution on wet surfaces',
        'Monitor weather updates regularly'
      ],
      affectedAreas: [
        'Cliff walkway and viewpoints',
        'Beach access stairs',
        'Lower beach area',
        'Beachfront restaurants'
      ]
    },

    '18': { // Juhu Beach, Mumbai
      level: 'medium',
      seaLevel: '+0.7m above normal',
      tideHeight: '2.1m',
      tideType: 'Monsoon High Tide',
      rainfall: '22mm in last hour',
      windSpeed: '28 km/h',
      stormActivity: 'Heavy monsoon activity',
      visibility: '5km',
      riskFactors: [
        'Moderate flooding of beach area',
        'Waterlogged access roads',
        'Strong waves and currents',
        'Slippery promenade surfaces'
      ],
      safetyRecommendations: [
        'Avoid water activities',
        'Stay on elevated promenade',
        'Be cautious of slippery surfaces',
        'Avoid low-lying beach areas'
      ],
      affectedAreas: [
        'Beach promenade lower sections',
        'Street food stalls area',
        'Beach access points',
        'Parking areas near beach'
      ]
    },

    '32': { // Digha Beach, West Bengal
      level: 'medium',
      seaLevel: '+0.8m above normal',
      tideHeight: '2.0m',
      tideType: 'Cyclonic Tide',
      rainfall: '25mm in last hour',
      windSpeed: '35 km/h',
      stormActivity: 'Pre-cyclonic conditions',
      visibility: '3km',
      riskFactors: [
        'Moderate flooding expected',
        'Strong waves dangerous for families',
        'Beach erosion in progress',
        'Reduced visibility'
      ],
      safetyRecommendations: [
        'Avoid beach activities',
        'Stay in hotels/resorts',
        'Monitor cyclone updates',
        'Keep emergency supplies ready'
      ],
      affectedAreas: [
        'Main beach area',
        'Sea-facing hotels ground floors',
        'Beach market and stalls',
        'Coastal roads'
      ]
    },

    // Low Risk Scenarios
    '1': { // Shivrajpur Beach, Gujarat
      level: 'low',
      seaLevel: '+0.4m above normal',
      tideHeight: '1.4m',
      tideType: 'High Tide',
      rainfall: '5mm in last hour',
      windSpeed: '18 km/h',
      stormActivity: 'Light clouds',
      visibility: '8km',
      riskFactors: [
        'Minor beach flooding possible',
        'Slightly stronger waves than usual',
        'Wet sand conditions'
      ],
      safetyRecommendations: [
        'Exercise normal beach caution',
        'Avoid very low-lying areas',
        'Monitor tide changes'
      ],
      affectedAreas: [
        'Lower beach sections',
        'Beach entry points'
      ]
    },

    '34': { // Chandipur Beach, Odisha
      level: 'low',
      seaLevel: '+0.3m above normal',
      tideHeight: '1.2m',
      tideType: 'Neap Tide',
      rainfall: '2mm in last hour',
      windSpeed: '15 km/h',
      stormActivity: 'Clear skies',
      visibility: '12km',
      riskFactors: [
        'Minimal risk',
        'Unique receding water phenomenon active',
        'Normal tidal variations'
      ],
      safetyRecommendations: [
        'Safe for walking during low tide',
        'Watch for tide changes',
        'Don\'t venture too far during low tide'
      ],
      affectedAreas: [
        'None - normal tidal patterns'
      ]
    },

    // No Risk Scenarios
    '11': { // Radhanagar Beach, Andaman
      level: 'none',
      seaLevel: 'Normal levels',
      tideHeight: '0.8m',
      tideType: 'Low Tide',
      rainfall: '0mm in last hour',
      windSpeed: '8 km/h',
      stormActivity: 'Clear skies',
      visibility: '15km',
      riskFactors: ['No flood risk'],
      safetyRecommendations: [
        'Perfect conditions for all beach activities',
        'Excellent for swimming and snorkeling'
      ],
      affectedAreas: ['None']
    },

    '22': { // Palolem Beach, Goa
      level: 'none',
      seaLevel: 'Normal levels',
      tideHeight: '0.9m',
      tideType: 'Low Tide',
      rainfall: '0mm in last hour',
      windSpeed: '10 km/h',
      stormActivity: 'Sunny',
      visibility: '12km',
      riskFactors: ['No flood risk'],
      safetyRecommendations: [
        'Ideal conditions for water sports',
        'Perfect for sunbathing and swimming'
      ],
      affectedAreas: ['None']
    }
  };

  // Default scenario for beaches not specifically configured
  const defaultScenario: Partial<FloodAlertData> = {
    level: 'none',
    seaLevel: 'Normal levels',
    tideHeight: '1.0m',
    tideType: 'Normal Tide',
    rainfall: '0mm in last hour',
    windSpeed: '12 km/h',
    stormActivity: 'Clear',
    visibility: '10km',
    riskFactors: ['No flood risk'],
    safetyRecommendations: ['Normal beach activities safe'],
    affectedAreas: ['None']
  };

  const scenario = floodScenarios[beachId] || defaultScenario;

  return {
    beachId,
    level: scenario.level || 'none',
    seaLevel: scenario.seaLevel || 'Normal levels',
    tideHeight: scenario.tideHeight || '1.0m',
    tideType: scenario.tideType || 'Normal Tide',
    rainfall: scenario.rainfall || '0mm in last hour',
    windSpeed: scenario.windSpeed || '12 km/h',
    stormActivity: scenario.stormActivity || 'Clear',
    visibility: scenario.visibility || '10km',
    riskFactors: scenario.riskFactors || ['No flood risk'],
    safetyRecommendations: scenario.safetyRecommendations || ['Normal beach activities safe'],
    affectedAreas: scenario.affectedAreas || ['None'],
    lastUpdated: currentTime.toLocaleTimeString(),
    nextUpdate: nextUpdateTime.toLocaleTimeString(),
    evacuationShelter: scenario.evacuationShelter,
    evacuationRoute: scenario.evacuationRoute,
    emergencyContacts: scenario.emergencyContacts
  };
};

// API service class
export class FloodAlertAPI {
  private static instance: FloodAlertAPI;
  private cache: Map<string, { data: FloodAlertData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  static getInstance(): FloodAlertAPI {
    if (!FloodAlertAPI.instance) {
      FloodAlertAPI.instance = new FloodAlertAPI();
    }
    return FloodAlertAPI.instance;
  }

  async getFloodAlert(beachId: string): Promise<FloodAlertData> {
    const now = Date.now();
    const cached = this.cache.get(beachId);

    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate new data
    const data = generateRealTimeFloodData(beachId);
    
    // Cache the data
    this.cache.set(beachId, { data, timestamp: now });

    return data;
  }

  // Method to force refresh data (useful for manual updates)
  async refreshFloodAlert(beachId: string): Promise<FloodAlertData> {
    this.cache.delete(beachId);
    return this.getFloodAlert(beachId);
  }

  // Get flood alerts for multiple beaches
  async getMultipleFloodAlerts(beachIds: string[]): Promise<FloodAlertData[]> {
    const promises = beachIds.map(id => this.getFloodAlert(id));
    return Promise.all(promises);
  }
}

// Export singleton instance
export const floodAlertAPI = FloodAlertAPI.getInstance();