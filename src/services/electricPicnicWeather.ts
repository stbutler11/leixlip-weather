import { LiveWeatherData, LOCATIONS } from './weatherApi';
import { EPForecastDay, ForecastModelComparison } from '../types';

export interface LiveFestivalTelemetry {
  mudPercentage: number;
  mudCategory: 'Dusty & Dry' | 'Soft Ground' | 'Squishy' | 'Welly Deep' | 'Full Bog Snorkel';
  mudAdvice: string;
  ponchoStatus: string;
  recommendedSanctuary: string;
  dynamicHeroQuote: string;
  dynamicVerdictSubtext: string;
  liveBanterPoints: string[];
  campsiteSurvivalTip: string;
  comparativeTransitQuote: string;
}

// Compute dynamic mud factor from live precipitation & humidity
export function computeLiveMudFactor(
  rainMm: number,
  humidity: number,
  temp: number
): {
  mudPercentage: number;
  mudCategory: 'Dusty & Dry' | 'Soft Ground' | 'Squishy' | 'Welly Deep' | 'Full Bog Snorkel';
  mudAdvice: string;
} {
  let baseMud = 15; // standard Irish grass moisture

  if (rainMm > 15) baseMud = 92;
  else if (rainMm > 8) baseMud = 78;
  else if (rainMm > 3) baseMud = 58;
  else if (rainMm > 0.5) baseMud = 38;
  else if (rainMm > 0.1) baseMud = 25;
  else if (temp > 22 && humidity < 55) baseMud = 8; // sun-baked

  const clamped = Math.max(5, Math.min(100, baseMud));

  if (clamped >= 85) {
    return {
      mudPercentage: clamped,
      mudCategory: 'Full Bog Snorkel',
      mudAdvice: 'Tractor towage territory. Duct tape your wellies to your calves so you do not leave footwear behind in the Jimi Hendrix campsite.',
    };
  }
  if (clamped >= 65) {
    return {
      mudPercentage: clamped,
      mudCategory: 'Welly Deep',
      mudAdvice: 'Classic Stradbally squelch. Walking to the Terminus stage is now a certified leg-day workout.',
    };
  }
  if (clamped >= 40) {
    return {
      mudPercentage: clamped,
      mudCategory: 'Squishy',
      mudAdvice: 'Ground is holding up grand. Runners will get damp around the rim, but wellies or boots make you indestructible.',
    };
  }
  if (clamped >= 20) {
    return {
      mudPercentage: clamped,
      mudCategory: 'Soft Ground',
      mudAdvice: 'Prime festival turf. Tent pegs push in like warm Kerrygold butter. Ideal camping conditions.',
    };
  }
  return {
    mudPercentage: clamped,
    mudCategory: 'Dusty & Dry',
    mudAdvice: 'Unprecedented dryness. You can actually sit on the grass without a plastic bag underneath you. Mind-blowing stuff.',
  };
}

// Generate dynamic festival quotes & commentary based on live data
export function generateLiveFestivalTelemetry(
  stradballyWeather?: LiveWeatherData | null,
  leixlipWeather?: LiveWeatherData | null,
  regionalWeatherMap?: Record<string, LiveWeatherData>
): LiveFestivalTelemetry {
  const temp = stradballyWeather?.temp ?? 16.5;
  const feelsLike = stradballyWeather?.feelsLike ?? 15.8;
  const rainMm = stradballyWeather?.precipitationMm ?? 0.0;
  const windKmh = stradballyWeather?.windSpeedKmh ?? 18;
  const windGusts = stradballyWeather?.windGustsKmh ?? 26;
  const humidity = stradballyWeather?.humidity ?? 72;
  const weatherCode = stradballyWeather?.weatherCode ?? 2;

  const { mudPercentage, mudCategory, mudAdvice } = computeLiveMudFactor(rainMm, humidity, temp);

  // Dynamic poncho & clothing status
  let ponchoStatus = 'Optional Festive Layer';
  if (rainMm > 2) ponchoStatus = 'Mandatory Plastic Armor (Hood Up)';
  else if (rainMm > 0.2) ponchoStatus = 'Emergency Pocket Ready';
  else if (temp >= 21) ponchoStatus = 'Discarded in Tent for Factor 50';

  // Dynamic sanctuary stage based on current weather
  let recommendedSanctuary = 'Rankin’s Wood & Electric Arena (Huge covered marquee roofs!)';
  if (rainMm === 0 && temp >= 18) {
    recommendedSanctuary = 'Main Stage open field with an ice cold cider in hand';
  } else if (temp <= 12 || windGusts > 45) {
    recommendedSanctuary = 'Mindfield Spoken Word / Leviathan Tent (Warm hot chocolate & debates)';
  } else if (rainMm > 5) {
    recommendedSanctuary = 'Salty Dog Pirate Ship or Comedy Marquee (Shelter from the deluge)';
  }

  // Dynamic hero statement quote
  let dynamicHeroQuote = '"IT\'LL BE GRAND."';
  let dynamicVerdictSubtext = '';

  if (rainMm > 5) {
    dynamicHeroQuote = '"IT\'S FAIRLY LASHING, BUT IT\'LL BE ABSOLUTE GRAND."';
    dynamicVerdictSubtext = `Current Stradbally radar reports ${rainMm}mm rainfall with ${windGusts}km/h gusts. Your poncho will double as a sail, but the bassline at the Electric Arena will keep spirits 100% buoyant.`;
  } else if (rainMm > 0.2) {
    dynamicHeroQuote = '"SOFT KILDARE/LAOIS DRIZZLE: 100% CERTIFIED GRAND."';
    dynamicVerdictSubtext = `Currently ${temp}°C with ${rainMm}mm soft mist. It's the exact atmospheric moisture level designed by Irish ancestors to keep your skin hydrated while queuing for loaded chips.`;
  } else if (temp >= 22) {
    dynamicHeroQuote = '"SPLITTING THE STONES IN STRADBALLY: UNBELIEVABLY GRAND."';
    dynamicVerdictSubtext = `A scorching ${temp}°C (feels like ${feelsLike}°C) across the festival grounds. Slap on the Factor 50, drink water between ciders, and marvel at the rare sighting of Irish collarbones getting a tan.`;
  } else if (temp <= 12) {
    dynamicHeroQuote = '"BRISK ATLANTIC AIR: WRAP UP WARM & IT\'LL BE GRAND."';
    dynamicVerdictSubtext = `Currently a crisp ${temp}°C in Stradbally Hall with ${windKmh}km/h breezes. Throw a fleece over your festival outfit; dancing near the front will warm you up in 45 seconds.`;
  } else {
    dynamicHeroQuote = '"FIERCE MILD & STEADY: 100% PURE IRISH GRANDNESS."';
    dynamicVerdictSubtext = `Sitting at a lovely ${temp}°C in Stradbally with ${rainMm}mm rain and gentle ${windKmh}km/h winds. Prime weather for strolling between Hazelwood, Trenchtown, and the Trailer Park.`;
  }

  // Dynamic live banter bullets
  const liveBanterPoints: string[] = [
    `🌡️ Ground Temperature: ${temp}°C (Apparent feels-like: ${feelsLike}°C). Perfect pint-holding equilibrium.`,
    rainMm > 0 
      ? `🌧️ Live Precipitation: ${rainMm}mm active rainfall. Squelch factor currently at ${mudPercentage}%.`
      : `☀️ Live Precipitation: 0.0mm dry turf. Stradbally grass is holding firm without wellies right now.`,
    windGusts > 35
      ? `💨 Wind Telemetry: ${windKmh} km/h with gusts up to ${windGusts} km/h. Keep gazebo tie-downs weighted with beer crates.`
      : `🍃 Wind Telemetry: Gentle ${windKmh} km/h breeze rolling across the Laois oak trees.`,
    `🛡️ Official Law: You spent months getting this ticket; no isobar or cloud cluster is going to dampen the craic.`
  ];

  // Dynamic campsite survival tip
  let campsiteSurvivalTip = 'Keep your dry socks sealed in two separate zip-lock bags inside your sleeping bag. Never trust morning condensation.';
  if (rainMm > 2) {
    campsiteSurvivalTip = `Active rainfall alert (${rainMm}mm): Make sure your tent flysheet is NOT touching the inner mesh, or you will wake up with an unwanted water feature above your head.`;
  } else if (windGusts > 40) {
    campsiteSurvivalTip = `High gusts (${windGusts} km/h): Double-peg the guy lines on the windward side facing southwest towards the Slieve Bloom mountains.`;
  } else if (temp >= 21) {
    campsiteSurvivalTip = `Warm morning alert (${temp}°C): Open tent ventilation flaps at 7am or the greenhouse effect will turn your tent into a sauna by 8:30am.`;
  }

  // Comparative transit quote between Leixlip, Dublin, Portlaoise, and Stradbally
  let comparativeTransitQuote = 'Leixlip and Stradbally are sharing the same Atlantic weather pattern down the M7.';
  if (leixlipWeather && stradballyWeather) {
    const diff = Math.round((stradballyWeather.temp - leixlipWeather.temp) * 10) / 10;
    if (diff > 0.5) {
      comparativeTransitQuote = `Leaving Leixlip (${leixlipWeather.temp}°C) for Stradbally (${stradballyWeather.temp}°C)? You are gaining +${diff}°C of festival warmth as you travel southwest down the M7!`;
    } else if (diff < -0.5) {
      comparativeTransitQuote = `Stradbally (${stradballyWeather.temp}°C) is currently ${Math.abs(diff)}°C cooler than Leixlip (${leixlipWeather.temp}°C) — throw an extra hoodie in the backpack before hitting the M7.`;
    } else {
      comparativeTransitQuote = `Identical ${temp}°C conditions between Leixlip and Stradbally Hall. The Kildare-Laois atmospheric corridor is aligned in pure harmony.`;
    }
  }

  return {
    mudPercentage,
    mudCategory,
    mudAdvice,
    ponchoStatus,
    recommendedSanctuary,
    dynamicHeroQuote,
    dynamicVerdictSubtext,
    liveBanterPoints,
    campsiteSurvivalTip,
    comparativeTransitQuote,
  };
}

// Generate live dynamic supercomputer comparisons using real-time numbers
export function generateLiveEPModelComparisons(
  liveWeather?: LiveWeatherData | null
): ForecastModelComparison[] {
  const temp = liveWeather?.temp ?? 16.5;
  const rain = liveWeather?.precipitationMm ?? 0.0;
  const windGusts = liveWeather?.windGustsKmh ?? 28;
  const humidity = liveWeather?.humidity ?? 74;

  const ecmwfTemp = `${Math.round(temp - 1.5)}°C – ${Math.round(temp + 2)}°C`;
  const gfsTemp = `${Math.round(temp - 2)}°C – ${Math.round(temp + 3.5)}°C`;
  const metEireannTemp = `${Math.round(temp - 0.5)}°C – ${Math.round(temp + 1.5)}°C`;

  return [
    {
      name: 'ECMWF (European Supercomputer)',
      provider: 'Reading, UK (0.1° High Resolution)',
      prediction: rain > 1 
        ? `Tracking an active Atlantic front over Stradbally with ${rain}mm recorded precipitation and persistent cloud ceiling.`
        : `Simulating a transient ridge with ${windGusts}km/h gusts and isolated convective showers over the Slieve Bloom foothills.`,
      rainEstimate: rain > 0 ? `${Math.max(1, Math.round(rain * 2))} - ${Math.round(rain * 4 + 8)} mm` : '0 - 4 mm (Passing mist)',
      tempRange: ecmwfTemp,
      confidence: '86% (High Resolution)',
      leixlipCritique: 'Those lads in Reading are panicking over a standard Irish cloud. We call this "drying weather with occasional flavour".',
      iconName: 'CloudRain',
    },
    {
      name: 'GFS (American NOAA Model)',
      provider: 'National Weather Service, USA',
      prediction: `Global ensemble shows atmospheric moisture at ${humidity}% with convective instability potential over Co. Laois.`,
      rainEstimate: rain > 0 ? `${Math.round(rain * 3)} - ${Math.round(rain * 6 + 12)} mm (Deluge alarm)` : '2 - 12 mm (Scattered)',
      tempRange: gfsTemp,
      confidence: '72% (Volatile Ensemble)',
      leixlipCritique: 'Americans get terrified by 3 drops of drizzle. Wrap your phone in a sandwich bag and you are 100% invincible.',
      iconName: 'CloudLightning',
    },
    {
      name: 'Met Éireann (National Forecaster)',
      provider: 'Glasnevin, Dublin 9',
      prediction: `Rather changeable. Currently ${temp}°C in Stradbally with moderate ${liveWeather?.windDirectionText || 'South-Westerly'} winds. Sunny spells developing between passing Atlantic showers.`,
      rainEstimate: rain > 0 ? `${Math.round(rain * 1.5)} - ${Math.round(rain * 3 + 5)} mm` : '0 - 2 mm (Scattered soft drops)',
      tempRange: metEireannTemp,
      confidence: '82% (Classic Irish Summer)',
      leixlipCritique: 'Translates to: "Stick your head out of the tent flap and see for yourself." Sensible Irish guidance.',
      iconName: 'CloudSunRain',
    },
    {
      name: 'The Leixlip Weather Guy Consensus',
      provider: 'Salmon Leap Bridge Observation Post',
      prediction: `Live observation: It is currently ${temp}°C in Stradbally. Once the first bass drop kicks in at the Main Stage, the collective body heat of 75,000 people will deflect any cloud back towards Offaly.`,
      rainEstimate: rain > 0 ? 'Only wet on the outside' : 'Bone dry craic',
      tempRange: `${temp}°C (Fierce grand if moving)`,
      confidence: '100% Ironclad Certainty',
      leixlipCritique: "Scientific conclusion: It'll be grand. Pack the wellies for style points, bring a spare dry pair of socks, and enjoy yourself.",
      iconName: 'Sparkles',
    },
  ];
}

// Blend live 7-day forecast with EP daily schedule
export function generateLiveEPDailyForecast(
  liveWeather?: LiveWeatherData | null
): EPForecastDay[] {
  const daily = liveWeather?.daily || [];
  const baseDays = [
    { day: 'Thursday', phase: 'Early Entry & The Great Tent Peg Battle', date: '2026-08-27' },
    { day: 'Friday', phase: 'Official Festival Kickoff & Glitter Onslaught', date: '2026-08-28' },
    { day: 'Saturday', phase: 'The Heavyweight Day & Peak Revelry', date: '2026-08-29' },
    { day: 'Sunday', phase: 'The Emotional Finale & Last Dance Stand', date: '2026-08-30' },
    { day: 'Monday', phase: 'The Great Stradbally Mud Exodus', date: '2026-08-31' },
  ];

  return baseDays.map((base, idx) => {
    // If we have live daily forecast data, use it for realistic values
    const liveDay = daily[idx] || daily[0];
    const tempDay = liveDay?.tempMax ?? (18 - idx % 2);
    const tempNight = liveDay?.tempMin ?? (11 - (idx % 3));
    const rainfallMm = liveDay?.rainSumMm ?? (idx === 2 ? 14.5 : idx === 1 ? 6.2 : 2.0);
    const rainProb = liveDay?.rainProbMax ?? (rainfallMm > 5 ? 75 : 35);
    const windSpeedKmh = liveDay?.windMaxKmh ?? (20 + idx * 3);
    const windGustsKmh = Math.round(windSpeedKmh * 1.4);

    const { mudPercentage, mudCategory } = computeLiveMudFactor(rainfallMm, 75, tempDay);

    let localVerdict = "It'll be grand. Ground is holding well and the craic is soaring.";
    if (rainfallMm > 10) {
      localVerdict = "It'll be grand!! Put on the poncho, lace up the wellies, and slide into the arena like a champion.";
    } else if (tempDay >= 20) {
      localVerdict = "Splitting the stones! Ice creams in the Trailer Park and sunglasses at the Main Stage.";
    } else if (rainfallMm > 3) {
      localVerdict = "Soft Irish day. The rain is just nature's free festival misting fan.";
    }

    const gears = [
      ['Mallet (or heavy boot)', 'Roll of Duck Tape', 'Can of cider', 'Tent pegs'],
      ['Bucket hat', 'Dunnes poncho', 'Wellies with funky socks', 'Hand sanitiser'],
      ['Zip-lock phone bag', 'Fleece jumper', 'Two pairs of dry socks', 'Glowsticks'],
      ['Dry hoodie', 'Sunglasses', 'Half-broken umbrella', 'Lollipops'],
      ['Car jump leads', 'Trash bag for muddy wellies', 'Lucozade', 'Jumbo Breakfast Roll'],
    ][idx];

    const stages = [
      'Trailer Park / Survivor Village',
      'Rankin’s Wood & Electric Arena (Roof cover!)',
      'Salty Dog & Mindfield Spoken Word tent',
      'Main Stage for the epic farewell anthem',
      'Applegreen Petrol Station Deli Counter',
    ][idx];

    return {
      date: base.date,
      dayName: base.day,
      phase: base.phase,
      tempDay,
      tempNight,
      rainfallMm,
      rainProbability: rainProb,
      windSpeedKmh,
      windGustsKmh,
      officialModelPrediction: rainfallMm > 5 
        ? `Open-Meteo model predicts ${rainfallMm}mm rain bands with ${windGustsKmh}km/h gusts.`
        : `Open-Meteo model predicts settled conditions with high of ${tempDay}°C and ${rainfallMm}mm precipitation.`,
      ecmwfModel: `${rainfallMm}mm rain track, ${tempDay}°C high`,
      gfsModel: `${Math.round(rainfallMm * 1.2)}mm convective profile, ${tempDay + 1}°C`,
      metEireannNote: rainfallMm > 3 ? 'Showers merging into spells of rain' : 'Mainly dry with bright sunny breaks',
      mudIndex: mudCategory,
      mudPercentage,
      localIrishVerdict: localVerdict,
      essentialGear: gears,
      recommendedStage: stages,
      vibeSummary: [
        'Optimistic bag-carrying sweat followed by the first satisfying crack of a beverage.',
        'First sprint across the arena. Mild squelch underfoot but morale is through the stratosphere.',
        'Full immersion. You’ve accepted the mud. You are one with Stradbally earth.',
        'Arm-in-arm swaying with strangers, screaming lyrics into the damp Laois night sky.',
        'Quiet existential reflection on the M7 back to Leixlip with the heater blasted on maximum.',
      ][idx],
    };
  });
}
