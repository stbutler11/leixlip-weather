import { IrishGlossaryTerm, LeixlipSpotWeather, WeatherMetric } from '../types';

export const CURRENT_LEIXLIP_CONDITIONS = {
  town: 'Leixlip',
  county: 'Co. Kildare',
  temp: 16.5,
  feelsLike: 15.8,
  conditionText: 'Fierce Mild with High-Level Mackerel Clouds',
  cloudCoverPercent: 68,
  windSpeedKmh: 19,
  windDirection: 'South-South-West (Breeze off the Rye Water)',
  humidity: 74,
  pressureHpa: 1014,
  pressureTrend: 'Falling slowly (Classic Irish Atlantic drift)',
  rainChanceToday: 25,
  rainfallMmPast24h: 1.4,
  dryingIndexRating: 'Moderate — Watch the horizon over Maynooth',
  dryingIndexScore: 7, // out of 10
  jacketRecommendation: 'Grand in a decent hoody or light gilet',
  salmonLeapRiverStatus: 'Gentle Flow (Salmon are content)',
  lastUpdated: '10 minutes ago from Castletown Gates station',
  summaryBanter: "Look, it's not splitting the stones, but you wouldn't be lighting the fire either. Soft breeze coming up through St. Catherine's Park. Perfect weather for doing a lap of Castletown and complaining about the humidity.",
};

export const LEIXLIP_KEY_METRICS: WeatherMetric[] = [
  {
    label: 'Current Temperature',
    value: '16.5°C',
    subtext: 'Feels like 15.8°C with the Rye breeze',
    status: 'good',
  },
  {
    label: 'Official Irish State',
    value: 'Fierce Mild',
    subtext: 'Not hot, not cold, just close enough to sweat in a fleece',
    status: 'grand',
  },
  {
    label: 'Drying Weather Status',
    value: 'Grade 2 Drying',
    subtext: 'Sheets dry in 3 hours; heavy denim needs prayers',
    status: 'moderate',
  },
  {
    label: 'Jacket Advisory',
    value: 'Jumper & Light Mac',
    subtext: 'Leave the Canada Goose parka at home, don’t be ridiculous',
    status: 'good',
  },
  {
    label: 'Electric Picnic Alert',
    value: "It'll Be Grand",
    subtext: 'Atmospheric confidence level: 100%',
    status: 'grand',
  },
  {
    label: 'Barometric Trend',
    value: '1014 hPa',
    subtext: 'Holding steady like a pint on a Saturday night',
    status: 'good',
  },
];

export const LEIXLIP_SPOTS: LeixlipSpotWeather[] = [
  {
    name: 'Castletown House & Demesne',
    landmark: 'The Long Gallery & Batty Langley Lodge',
    currentTemp: 16.2,
    condition: 'Dappled sun filtering through the historic beech trees',
    windNote: 'Calm under the tree canopy',
    dryingStatus: 'Prime walking weather for dogs with muddy paws',
    funFact: "If the cows are lying down near the Ha-Ha wall, expect a shower before dinner.",
  },
  {
    name: 'The Salmon Leap & Liffey Bridge',
    landmark: 'Main Street & Historic Mill',
    currentTemp: 16.8,
    condition: 'Fresh spray from the weir, misty atmosphere',
    windNote: 'Brisk 22 km/h funneling along the river valley',
    dryingStatus: 'River humidity dampens laundry within 100m',
    funFact: "Arthur Guinness brewed his very first pints right here in 1756 before moving to St. James's Gate.",
  },
  {
    name: 'The Wonderful Barn',
    landmark: 'Corkscrew Folly & Pigeon Tower',
    currentTemp: 16.4,
    condition: 'Breezy spiral updrafts around the stone stairs',
    windNote: 'Elevated vantage point catching eastern gusts',
    dryingStatus: 'Great air circulation, peak tea towel drying zone',
    funFact: 'Built in 1743 to provide employment during famine and predict incoming Kildare weather fronts.',
  },
  {
    name: 'Confey & Leixlip North',
    landmark: 'Royal Canal Greenway & Train Station',
    currentTemp: 15.9,
    condition: 'Bright spells reflecting off the canal waters',
    windNote: 'Open railway breeze from the Meath border',
    dryingStatus: 'Fast-moving air, peg your washing securely',
    funFact: 'Higher elevation means Confey sees rain 4 minutes before Main Street.',
  },
  {
    name: 'Intel Campus & Collinstown',
    landmark: 'Silicon Substation & Cleanrooms',
    currentTemp: 17.1,
    condition: 'Micro-heat island from industrial cleanroom ventilation',
    windNote: 'Moderate gust around the car parks',
    dryingStatus: 'Optimal dry air',
    funFact: 'The microchips inside your weather radar were probably fabricated right here in Leixlip.',
  },
];

export const IRISH_GLOSSARY: IrishGlossaryTerm[] = [
  {
    term: "It'll be grand",
    phonetic: "/ɪt-əl biː ɡrænd/",
    literalMeaning: "Things will be large or magnificent.",
    actualIrishMeaning: "The situation is anywhere between moderately satisfactory and an apocalyptic hurricane, but stoic acceptance and a cup of Barry's tea will see us through.",
    meteorologicalCategory: 'General Vibe',
    exampleUsage: '"The roof blew off the tractor shed and there\'s 4 feet of water in the hallway." — "Ah, it\'ll be grand."',
    leixlipContext: 'The foundational philosophy for all Electric Picnic forecasts since 2004.',
  },
  {
    term: 'Fierce mild',
    phonetic: "/fɪərs maɪld/",
    literalMeaning: "Aggressively gentle.",
    actualIrishMeaning: "Humid, sticky, overcast weather where wearing a coat makes you sweat profusely, but taking it off makes you immediately feel a chill.",
    meteorologicalCategory: 'Temperature',
    exampleUsage: '"Step out there Mary, it\'s fierce mild altogether, had to roll down the car window."',
    leixlipContext: 'Standard August climate walking across the bridge into Confey.',
  },
  {
    term: 'Soft day (thank God)',
    phonetic: "/sɒft deɪ θæŋk ɡɒd/",
    literalMeaning: "A day made of velvet or foam.",
    actualIrishMeaning: "A relentless, microscopic mist that doesn't look like rain on your phone screen, but will completely soak your trousers to the marrow in under 90 seconds.",
    meteorologicalCategory: 'Rain',
    exampleUsage: '"Soft day now, Paddy!" — "Soft day thank God, good for the grass."',
    leixlipContext: 'Crucial greeting ritual outside the local SuperValu on a Tuesday morning.',
  },
  {
    term: 'Splitting the stones',
    phonetic: "/ˈsplɪt.ɪŋ ðə stoʊnz/",
    literalMeaning: "Geological fractures occurring from thermal expansion.",
    actualIrishMeaning: "The temperature has crept above 21°C. Every Irish person is legally obligated to take off their shirt, get sunburned on one shoulder, and eat a 99 ice cream.",
    meteorologicalCategory: 'Temperature',
    exampleUsage: '"The sun is splitting the stones today, make sure you put Factor 50 on the back of the neck."',
    leixlipContext: 'Happens precisely 3 days every June on the banks of the Rye Water.',
  },
  {
    term: 'Great drying',
    phonetic: "/ɡreɪt ˈdraɪ.ɪŋ/",
    literalMeaning: "Superior moisture evaporation rates.",
    actualIrishMeaning: "The highest meteorological honour a day can achieve in Ireland. The holy combination of stiff breeze and dry air that allows three loads of washing to dry before 2pm.",
    meteorologicalCategory: 'Laundry',
    exampleUsage: '"Get the sheets out quick Seán, there’s fierce drying out there with that southerly wind!"',
    leixlipContext: 'Causes mass stampedes to rotary clotheslines across Louisa Valley.',
  },
  {
    term: 'Lashing out of the heavens',
    phonetic: "/ˈlæʃ.ɪŋ aʊt əv ðə ˈhɛv.ənz/",
    literalMeaning: "Celestial whipping.",
    actualIrishMeaning: "Heavy, diagonal, windscreen-wiper-defying rain driven by an Atlantic depression.",
    meteorologicalCategory: 'Rain',
    exampleUsage: '"Don’t go to the shop now, it’s lashing out of the heavens."',
    leixlipContext: 'Standard Friday evening conditions heading down the M7 to Stradbally.',
  },
  {
    term: 'Rotten',
    phonetic: "/ˈrɒt.ən/",
    literalMeaning: "Decomposing matter.",
    actualIrishMeaning: "Dull, dark, grey, persistent sleety drizzle that drains the human soul of joy.",
    meteorologicalCategory: 'General Vibe',
    exampleUsage: '"Rotten day outside, wouldn\'t put a dog out in that."',
    leixlipContext: 'A winter Tuesday when the bus to Dublin city is running 25 minutes late.',
  },
  {
    term: 'Close',
    phonetic: "/kloʊs/",
    literalMeaning: "Proximity or shut.",
    actualIrishMeaning: "Suffocating humidity before a thunderstorm when the air feels like warm pea soup.",
    meteorologicalCategory: 'Temperature',
    exampleUsage: '"It’s terrible close tonight, I can’t sleep without the fan on full blast."',
    leixlipContext: 'Peak Stradbally tent atmosphere at 6:30am on Sunday morning.',
  },
];

export const ASK_WEATHER_QUERIES = [
  {
    question: "Should I pack wellies or runners for Electric Picnic 2026?",
    answer: "Pack the wellies, wear the runners on the drive down, and have a spare pair of cheap runners in the boot for the Monday drive back. Even if Stradbally is bone dry, wearing wellies gives you +50 Irish festival street credibility.",
    category: 'Festival'
  },
  {
    question: "Is it a 'jacket day' in Leixlip right now?",
    answer: "Currently, you'll be grand in a decent light jumper or fleece. If you're walking along the Liffey or going down by the mill, bring a zip-up windbreaker just in case the river breeze kicks up. Leave the heavy winter parka at home.",
    category: 'Local'
  },
  {
    question: "What's the drying weather score today?",
    answer: "Solid 7/10! Moderate southerly airflow means tea towels, t-shirts, and socks will be dry in about 2.5 hours. Keep one eye on the clouds rolling in over Maynooth, and pull the washing in if you see Mrs. Higgins next door taking hers down.",
    category: 'Drying'
  },
  {
    question: "The ECMWF model predicts 40mm of torrential rain for Saturday night. Are we doomed?",
    answer: "Absolutely not. Scientific fact: ECMWF supercomputers run on cold silicon logic, whereas Stradbally runs on unadulterated human euphoria. Once the tent pegs are secured and the main stage lights turn on, 40mm of rain just becomes atmospheric special effects. It'll be grand.",
    category: 'Festival'
  },
  {
    question: "Why does Leixlip get its own weather forecast instead of just looking at Dublin?",
    answer: "Because Dublin is coast-moderated softies! Leixlip sits in the prime Rye Water-Liffey micro-basin right where Kildare green fields meet the Leinster coalfields. We have our own cloud dynamics, our own drying cycles, and significantly better banter.",
    category: 'Local'
  },
];
