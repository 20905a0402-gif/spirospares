export type Bike = {
  id: string;
  name: "COMMANDO" | "VEO" | "EKON400M2" | "EKON400M1" | "EKON450M2";
  category: string;
  price: number;
  SKU: string;
  short_description: string;
  images: string[];
  stock: number;
  motor: string;
  range: string;
  battery: string;
  speed: string;
  charging_time: string;
};

export type SparePartCategory = "Body & Trim" | "Frame & Suspension" | "General" | "Electrical";

export type SparePart = {
  id: string;
  name: string;
  part_code: string;
  price: number;
  category: SparePartCategory;
  compatible_models: Bike["name"][];
  function: string;
  replacement_cycle: string;
  stock: number;
  image: string;
  material: string;
  quality: string;
};

export type Gadget = {
  id: string;
  name: string;
  price: number;
  images: string[];
  features: string[];
  compatibility: string;
  category: "Phone holders" | "Chargers" | "Safety" | "Security";
  technical_details: string;
};

export type ServiceLocation = {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  phone: string;
  whatsapp: string;
  services: string[];
  hours: string;
  map_link: string;
  battery_swapping: boolean;
};

export const bikes: Bike[] = [
  {
    id: "commando",
    name: "COMMANDO",
    category: "Utility Cargo",
    price: 245000,
    SKU: "SPI-COM-001",
    short_description:
      "Built for heavy-duty routes with access to the battery swapping network for downtime reduction across delivery riders in Nairobi.",
    images: [
      "/images/bikes/bike5.png",
      "/images/bikes/bike6.png"
    ],
    stock: 18,
    motor: "5.0kW Peak",
    range: "110 km",
    battery: "72V 45Ah Swappable",
    speed: "85 km/h",
    charging_time: "3.5 hours"
  },
  {
    id: "veo",
    name: "VEO",
    category: "Urban Commuter",
    price: 199500,
    SKU: "SPI-VEO-002",
    short_description:
      "Compact and efficient for city commuting with quick battery swapping network access and downtime reduction for daily operations.",
    images: [
      "/images/bikes/bike6.png",
      "/images/bikes/bike7.png"
    ],
    stock: 24,
    motor: "3.5kW Peak",
    range: "95 km",
    battery: "60V 40Ah Swappable",
    speed: "70 km/h",
    charging_time: "3 hours"
  },
  {
    id: "ekon400m2",
    name: "EKON400M2",
    category: "Commercial Delivery",
    price: 269000,
    SKU: "SPI-EK4-003",
    short_description:
      "Designed for high-frequency dispatch with genuine electric bike parts support and reliable uptime for delivery riders in Nairobi.",
    images: [
      "/images/bikes/bike7.png",
      "/images/bikes/bike8.png"
    ],
    stock: 15,
    motor: "4.8kW Peak",
    range: "120 km",
    battery: "72V 50Ah Swappable",
    speed: "88 km/h",
    charging_time: "3.8 hours"
  },
  {
    id: "ekon450m1",
    name: "EKON400M1",
    category: "Flagship Performance",
    price: 289500,
    SKU: "SPI-EK45-004",
    short_description:
      "Flagship Spiro performance bike optimized for battery swapping network speed, downtime reduction, and commercial growth in Nairobi.",
    images: [
      "/images/bikes/bike8.png",
      "/images/bikes/bike5.png"
    ],
    stock: 12,
    motor: "6.2kW Peak",
    range: "145 km",
    battery: "74V 55Ah Swappable",
    speed: "98 km/h",
    charging_time: "4 hours"
  },
  {
    id: "ekon450m2",
    name: "EKON450M2",
    category: "Fleet Optimized",
    price: 299000,
    SKU: "SPI-EK45-005",
    short_description:
      "Purpose-built for fleet scale with robust electric bike parts support and battery swapping integration to keep business moving.",
    images: [
      "/images/bikes/bike5.png",
      "/images/bikes/bike7.png"
    ],
    stock: 10,
    motor: "6.0kW Peak",
    range: "150 km",
    battery: "74V 60Ah Swappable",
    speed: "100 km/h",
    charging_time: "4.2 hours"
  }
];

export const spareParts: SparePart[] = [
  {
    id: "drive-chain-complete-loop",
    name: "Drive Chain (Complete Loop)",
    part_code: "SP-DRC-001",
    price: 5400,
    category: "General",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Transfers motor torque to the rear wheel for smooth acceleration and dependable load handling.",
    replacement_cycle: "Inspect every 4,000 km; replace every 15,000-20,000 km or on stiff links.",
    stock: 46,
    image: "/images/spares/Drive%20Chain%20(Complete%20Loop).png",
    material: "Heat-treated alloy steel",
    quality: "OEM fitment with anti-rust coating"
  },
  {
    id: "front-left-turn-signal",
    name: "Front Left Turn Signal",
    part_code: "SP-FTL-002",
    price: 2100,
    category: "Electrical",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Provides left-side directional indication for safer lane changes and junction turns.",
    replacement_cycle: "Replace on cracked lens, moisture ingress, or failed blinking output.",
    stock: 58,
    image: "/images/spares/Front%20Left%20Turn%20Signal.png",
    material: "Impact-resistant polycarbonate lens",
    quality: "Water-sealed connector and vibration-safe mount"
  },
  {
    id: "front-right-turn-signal",
    name: "Front Right Turn Signal",
    part_code: "SP-FTR-003",
    price: 2100,
    category: "Electrical",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Provides right-side directional indication for safer overtakes and urban maneuvering.",
    replacement_cycle: "Replace on cracked lens, water entry, or intermittent flash behavior.",
    stock: 55,
    image: "/images/spares/Front%20Right%20Turn%20Signal.png",
    material: "Impact-resistant polycarbonate lens",
    quality: "Water-sealed connector and vibration-safe mount"
  },
  {
    id: "front-small-sprocket",
    name: "Front Small Sprocket",
    part_code: "SP-FSS-004",
    price: 3600,
    category: "General",
    compatible_models: ["COMMANDO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Primary front drive sprocket that maintains chain alignment and torque transfer.",
    replacement_cycle: "Inspect every 5,000 km; replace when teeth are hooked or unevenly worn.",
    stock: 37,
    image: "/images/spares/Front%20Small%20Sprocket.png",
    material: "CNC-cut hardened steel",
    quality: "Precision tooth profile for smooth chain engagement"
  },
  {
    id: "left-handle-switch",
    name: "Left Handle Switch",
    part_code: "SP-LHS-005",
    price: 4300,
    category: "Electrical",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Controls indicators, horn, and lighting functions from the left handlebar cluster.",
    replacement_cycle: "Replace when switches stick, fail contact, or wiring shows intermittent faults.",
    stock: 31,
    image: "/images/spares/Left%20Handle%20Switch.png",
    material: "ABS housing with copper contacts",
    quality: "OEM electrical continuity and weather cover"
  },
  {
    id: "main-bracket-spring",
    name: "Main Bracket Spring",
    part_code: "SP-MBS-006",
    price: 2500,
    category: "Frame & Suspension",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Returns the center stand bracket to neutral position for stable parking support.",
    replacement_cycle: "Inspect every 6 months; replace on stretch, rust pitting, or loss of tension.",
    stock: 64,
    image: "/images/spares/Main%20Bracket%20Spring.png",
    material: "Tempered spring steel",
    quality: "Anti-fatigue winding for repeated deployment"
  },
  {
    id: "rear-big-sprocket",
    name: "Rear Big Sprocket",
    part_code: "SP-RBS-007",
    price: 4800,
    category: "General",
    compatible_models: ["COMMANDO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Rear drive sprocket that balances pull force and cruising efficiency under daily loads.",
    replacement_cycle: "Replace every 18,000-24,000 km or when tooth wear affects chain grip.",
    stock: 29,
    image: "/images/spares/Rear%20Big%20Sprocket.png",
    material: "Heat-hardened steel alloy",
    quality: "Machined concentric profile for reduced drivetrain vibration"
  },
  {
    id: "rearview-mirror-pair-l-r",
    name: "Rearview Mirror Pair (L & R)",
    part_code: "SP-RMP-008",
    price: 3200,
    category: "Body & Trim",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Expands rear visibility for safer lane awareness in dense city traffic.",
    replacement_cycle: "Replace on cracked mirror glass, loose stems, or vibration blur.",
    stock: 48,
    image: "/images/spares/Rearview%20Mirror%20Pair%20(L%20%26%20R).png",
    material: "ABS shell with anti-glare mirror glass",
    quality: "Wide-angle OEM mirror clarity"
  },
  {
    id: "side-bracket-spring",
    name: "Side Bracket Spring",
    part_code: "SP-SBS-009",
    price: 2100,
    category: "Frame & Suspension",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Keeps side stand return action firm and prevents accidental drag while riding.",
    replacement_cycle: "Inspect every 6 months; replace on reduced spring tension or corrosion damage.",
    stock: 67,
    image: "/images/spares/Side%20Bracket%20Spring.png",
    material: "Tempered spring steel",
    quality: "Durable recoil performance for daily stop-start riding"
  },
  {
    id: "front-brake-pad-kit",
    name: "Front Brake Pad Kit",
    part_code: "SP-FBP-010",
    price: 2900,
    category: "Frame & Suspension",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Provides reliable front braking bite with stable heat dissipation under urban stop-go traffic.",
    replacement_cycle: "Inspect every 3,500 km; replace at 2mm thickness or on uneven wear.",
    stock: 51,
    image: "/images/spares/Front%20Small%20Sprocket.png",
    material: "Semi-metallic friction compound",
    quality: "Low-noise OEM-equivalent brake response"
  },
  {
    id: "rear-brake-pad-kit",
    name: "Rear Brake Pad Kit",
    part_code: "SP-RBP-011",
    price: 2700,
    category: "Frame & Suspension",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Maintains rear-wheel braking stability for safer deceleration on loaded delivery runs.",
    replacement_cycle: "Inspect every 3,500 km; replace on glazing, noise, or reduced bite.",
    stock: 49,
    image: "/images/spares/Rear%20Big%20Sprocket.png",
    material: "Semi-metallic friction compound",
    quality: "Consistent braking control for daily operations"
  },
  {
    id: "headlight-led-module",
    name: "Headlight LED Module",
    part_code: "SP-HLM-012",
    price: 6800,
    category: "Electrical",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Delivers high-clarity forward illumination for early-morning and night route safety.",
    replacement_cycle: "Replace on flicker, moisture ingress, or low-beam failure.",
    stock: 34,
    image: "/images/spares/Front%20Right%20Turn%20Signal.png",
    material: "Sealed polycarbonate and aluminum housing",
    quality: "Stable beam pattern with vibration-safe internals"
  },
  {
    id: "controller-harness-kit",
    name: "Controller Harness Kit",
    part_code: "SP-CHK-013",
    price: 9300,
    category: "Electrical",
    compatible_models: ["COMMANDO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Reconnects key controller lines for throttle, sensors, and power delivery continuity.",
    replacement_cycle: "Replace on connector burn, hard insulation cracks, or intermittent cut-offs.",
    stock: 22,
    image: "/images/spares/Left%20Handle%20Switch.png",
    material: "High-temp insulated copper loom",
    quality: "Factory-pinout harness for accurate diagnostics"
  },
  {
    id: "throttle-grip-assy",
    name: "Throttle Grip Assembly",
    part_code: "SP-TGA-014",
    price: 4100,
    category: "Electrical",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Converts rider input into smooth acceleration signals for safer power response.",
    replacement_cycle: "Replace on delayed throttle response or jitter in signal output.",
    stock: 39,
    image: "/images/spares/Left%20Handle%20Switch.png",
    material: "ABS grip core with hall sensor",
    quality: "Linear throttle curve with stable return spring"
  },
  {
    id: "rear-shock-bush-set",
    name: "Rear Shock Bush Set",
    part_code: "SP-RSB-015",
    price: 2500,
    category: "Frame & Suspension",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1", "EKON450M2"],
    function: "Reduces shock-play and improves rear suspension precision on rough city surfaces.",
    replacement_cycle: "Inspect every 8,000 km; replace on noise, wobble, or visible deformation.",
    stock: 43,
    image: "/images/spares/Main%20Bracket%20Spring.png",
    material: "Reinforced elastomer and steel sleeve",
    quality: "Low-vibration fitment for heavy daily usage"
  },
  {
    id: "center-stand-complete",
    name: "Center Stand Complete",
    part_code: "SP-CSC-016",
    price: 5200,
    category: "Frame & Suspension",
    compatible_models: ["COMMANDO", "VEO", "EKON400M2", "EKON400M1"],
    function: "Supports stable parking and service positioning for fleet maintenance.",
    replacement_cycle: "Replace on bent frame, unstable support angle, or worn pivot points.",
    stock: 27,
    image: "/images/spares/Main%20Bracket%20Spring.png",
    material: "Powder-coated mild steel",
    quality: "Load-tested stand geometry"
  },
  {
    id: "front-fender-matte",
    name: "Front Fender Matte Finish",
    part_code: "SP-FFM-017",
    price: 3400,
    category: "Body & Trim",
    compatible_models: ["VEO", "EKON400M2", "EKON400M1"],
    function: "Protects front section from road spray and debris impact in wet operations.",
    replacement_cycle: "Replace on severe cracks, broken mounts, or wheel-rub alignment issues.",
    stock: 35,
    image: "/images/spares/Rearview%20Mirror%20Pair%20(L%20%26%20R).png",
    material: "High-impact ABS",
    quality: "Colorfast matte panel with OEM mount points"
  },
  {
    id: "side-panel-left",
    name: "Side Panel Left",
    part_code: "SP-SPL-018",
    price: 3600,
    category: "Body & Trim",
    compatible_models: ["COMMANDO", "EKON450M2", "EKON400M2"],
    function: "Restores side body profile and protects internal harness routing from splash.",
    replacement_cycle: "Replace on broken clips, severe scratches, or panel detachment.",
    stock: 31,
    image: "/images/spares/Rearview%20Mirror%20Pair%20(L%20%26%20R).png",
    material: "ABS composite shell",
    quality: "Secure clip-lock fitment"
  },
  {
    id: "side-panel-right",
    name: "Side Panel Right",
    part_code: "SP-SPR-019",
    price: 3600,
    category: "Body & Trim",
    compatible_models: ["COMMANDO", "EKON450M2", "EKON400M2"],
    function: "Completes body enclosure and protects wiring and controller cavity on the right side.",
    replacement_cycle: "Replace on broken clips, severe scratches, or panel detachment.",
    stock: 30,
    image: "/images/spares/Rearview%20Mirror%20Pair%20(L%20%26%20R).png",
    material: "ABS composite shell",
    quality: "Secure clip-lock fitment"
  }
];

export const gadgets: Gadget[] = [
  {
    id: "smart-quad-lock",
    name: "Smart Quad Phone Holder",
    price: 4500,
    images: ["/images/gadgets/Smart%20Quad%20Phone%20Holde.png"],
    features: ["Anti-vibration mount", "One-twist locking", "Rain-resistant shell"],
    compatibility: "Compatible with COMMANDO, VEO, EKON400M2, EKON400M1, EKON450M2",
    category: "Phone holders",
    technical_details: "360-degree swivel, impact-rated mount, 4-point anchor"
  },
  {
    id: "rapid-ride-charger",
    name: "Rapid Ride USB-C Charger",
    price: 3900,
    images: ["/images/gadgets/Rapid%20Ride%20USB-C%20Charger.png"],
    features: ["PD fast charging", "Water-resistant cap", "Dual output"],
    compatibility: "12V conversion harness for all Spiro platforms",
    category: "Chargers",
    technical_details: "36W PD output, fused protection, weather-sealed connector"
  },
  {
    id: "urban-helmet-pro",
    name: "Urban Safety Helmet Pro",
    price: 7200,
    images: ["/images/gadgets/Urban%20Safety%20Helmet%20Pro.png"],
    features: ["Rear safety light", "Breathable liner", "Quick lock strap"],
    compatibility: "Rider safety gear for all electric bike operators",
    category: "Safety",
    technical_details: "ABS shell, ECE-certified structure, USB rechargeable rear light"
  },
  {
    id: "fleet-gps-guard",
    name: "Fleet GPS Guard",
    price: 9800,
    images: ["/images/gadgets/Fleet%20GPS%20Guard.png"],
    features: ["Live route tracking", "Geo-fence alerts", "Anti-tamper alarm"],
    compatibility: "Ideal for Spiro fleet operations and owner-rider security",
    category: "Security",
    technical_details: "4G tracker, 72-hour backup battery, mobile app dashboard"
  },
  {
    id: "night-vision-cam",
    name: "Night Vision Rider Cam",
    price: 12400,
    images: ["/images/gadgets/Night%20Vision%20Rider%20Cam.png"],
    features: ["Low-light capture", "Impact-resistant shell", "Loop recording"],
    compatibility: "Helmet and handlebar mount compatible for all Spiro riders",
    category: "Safety",
    technical_details: "1080p sensor, IP66 weather seal, 128GB storage support"
  },
  {
    id: "smart-battery-monitor",
    name: "Smart Battery Monitor",
    price: 8600,
    images: ["/images/gadgets/Smart%20Battery%20Monitor.png"],
    features: ["Live battery diagnostics", "Overheat alerts", "Mobile dashboard"],
    compatibility: "Compatible with swappable pack diagnostics for Spiro platforms",
    category: "Chargers",
    technical_details: "Bluetooth telemetry, thermal sensors, app analytics integration"
  },
  {
    id: "anti-theft-disc-lock",
    name: "Anti-Theft Disc Alarm Lock",
    price: 5700,
    images: ["/images/gadgets/Anti-Theft%20Disc%20Alarm%20Lock.png"],
    features: ["120dB alarm", "Tamper detection", "Weather-sealed body"],
    compatibility: "Fits COMMANDO, VEO, EKON400M2, EKON400M1, EKON450M2",
    category: "Security",
    technical_details: "Hardened steel pin, motion sensor siren, CR2 replaceable cell"
  },
  {
    id: "wireless-handlebar-charger",
    name: "Wireless Handlebar Charger",
    price: 6400,
    images: ["/images/gadgets/Wireless%20Handlebar%20Charger.png"],
    features: ["15W wireless pad", "Grip lock mount", "Splash-proof cover"],
    compatibility: "Universal mount for all Spiro bike handlebars",
    category: "Chargers",
    technical_details: "Qi-enabled charging pad, 5V/3A input, dual-clamp anti-slip frame"
  },
  {
    id: "dash-quick-tilt-mount",
    name: "Dash Quick Tilt Holder",
    price: 4200,
    images: ["/images/gadgets/Smart%20Quad%20Phone%20Holde.png"],
    features: ["Quick angle lock", "Anti-slip grip", "Low-profile clamp"],
    compatibility: "Fits COMMANDO, VEO, EKON400M2, EKON400M1, EKON450M2",
    category: "Phone holders",
    technical_details: "Dual-axis lock, vibration damping insert, one-hand release"
  },
  {
    id: "dual-port-fast-charger",
    name: "Dual Port Fast Charger",
    price: 5300,
    images: ["/images/gadgets/Rapid%20Ride%20USB-C%20Charger.png"],
    features: ["USB-C + USB-A", "Smart current balancing", "Waterproof lid"],
    compatibility: "Direct fit for Spiro 12V accessory harness",
    category: "Chargers",
    technical_details: "48W combined output, short-circuit protection, IP65 cap"
  },
  {
    id: "helmet-visor-defog-kit",
    name: "Helmet Visor Defog Kit",
    price: 3500,
    images: ["/images/gadgets/Urban%20Safety%20Helmet%20Pro.png"],
    features: ["Anti-fog insert", "Rain spread coating", "Night clarity boost"],
    compatibility: "Compatible with most rider helmets used by Spiro operators",
    category: "Safety",
    technical_details: "Optical-grade polymer layer with adhesive edge seal"
  },
  {
    id: "smart-rider-tail-light",
    name: "Smart Rider Tail Light",
    price: 4600,
    images: ["/images/gadgets/Urban%20Safety%20Helmet%20Pro.png"],
    features: ["Brake-sensing flash", "USB charging", "Quick saddle mount"],
    compatibility: "Universal rear mount for Spiro bike frames",
    category: "Safety",
    technical_details: "Motion + deceleration sensor, 9-hour backup, IP66 shell"
  },
  {
    id: "fleet-panic-button",
    name: "Fleet Panic Alert Button",
    price: 6700,
    images: ["/images/gadgets/Fleet%20GPS%20Guard.png"],
    features: ["One-tap SOS", "Live location push", "Tamper trigger"],
    compatibility: "Integrates with fleet GPS and rider app workflow",
    category: "Security",
    technical_details: "4G trigger module, encrypted emergency ping protocol"
  },
  {
    id: "mini-handlebar-dashcam",
    name: "Mini Handlebar Dashcam",
    price: 9900,
    images: ["/images/gadgets/Night%20Vision%20Rider%20Cam.png"],
    features: ["Wide-angle recording", "Vibration stabilized", "Emergency lock clips"],
    compatibility: "Handlebar mount for all Spiro rider bikes",
    category: "Safety",
    technical_details: "2K capture, gyroscopic lock file system, loop overwrite"
  },
  {
    id: "battery-health-dock",
    name: "Battery Health Dock",
    price: 11800,
    images: ["/images/gadgets/Smart%20Battery%20Monitor.png"],
    features: ["Cycle count sync", "Thermal diagnostics", "Cell balance checks"],
    compatibility: "For swappable pack service points and fleet bays",
    category: "Chargers",
    technical_details: "Bluetooth + cloud logging, diagnostics export interface"
  },
  {
    id: "chain-lock-pro-xl",
    name: "Chain Lock Pro XL",
    price: 6100,
    images: ["/images/gadgets/Anti-Theft%20Disc%20Alarm%20Lock.png"],
    features: ["Hardened links", "Anti-cut sleeve", "Compact carry loop"],
    compatibility: "Fits all Spiro bike wheel and frame lock points",
    category: "Security",
    technical_details: "12mm hardened links, anti-pick key cylinder, weather sleeve"
  },
  {
    id: "quick-grab-phone-cradle",
    name: "Quick Grab Phone Cradle",
    price: 3800,
    images: ["/images/gadgets/Smart%20Quad%20Phone%20Holde.png"],
    features: ["One-press release", "Rubberized arms", "Anti-vibe plate"],
    compatibility: "Universal fit for all Spiro handlebars",
    category: "Phone holders",
    technical_details: "Spring-assist clamp with reinforced locking tabs"
  },
  {
    id: "wireless-power-pod",
    name: "Wireless Power Pod",
    price: 7600,
    images: ["/images/gadgets/Wireless%20Handlebar%20Charger.png"],
    features: ["Mag-safe charging", "Rain guard flap", "Shock-safe mount"],
    compatibility: "Best for city-delivery riders using nav-heavy routes",
    category: "Chargers",
    technical_details: "20W output, vibration-damped mount, UV-resistant shell"
  }
];

export const serviceLocations: ServiceLocation[] = [
  {
    id: "nairobi-industrial",
    name: "Nairobi Industrial Hub",
    city: "Nairobi",
    area: "Industrial Area",
    address: "Dunga Close, Near Car & General Roundabout, Industrial Area, Nairobi",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Repair", "Battery check", "Controller diagnostics", "Brake replacement", "Battery swapping"],
    hours: "Mon-Sat 8:00 AM - 6:00 PM",
    map_link:
      "https://www.google.com/maps?q=Dunga+Close+Industrial+Area+Nairobi&output=embed",
    battery_swapping: true
  },
  {
    id: "westlands-rapid",
    name: "Westlands Rapid Point",
    city: "Nairobi",
    area: "Westlands",
    address: "Ring Road Parklands, Westlands, Nairobi",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Battery swapping", "Quick tune-up", "Electrical troubleshooting"],
    hours: "Mon-Sun 7:00 AM - 8:00 PM",
    map_link: "https://www.google.com/maps?q=Westlands+Nairobi&output=embed",
    battery_swapping: true
  },
  {
    id: "mombasa-hub",
    name: "Mombasa EV Hub",
    city: "Mombasa",
    area: "Makadara",
    address: "Makadara Road, Mombasa",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Fleet maintenance", "Battery swapping", "Spares pickup"],
    hours: "Mon-Sat 8:00 AM - 6:00 PM",
    map_link: "https://www.google.com/maps?q=Makadara+Mombasa&output=embed",
    battery_swapping: true
  },
  {
    id: "kisumu-center",
    name: "Kisumu Service Center",
    city: "Kisumu",
    area: "Milimani",
    address: "Oginga Odinga Street, Milimani, Kisumu",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Repair", "Battery check", "Brake and suspension"],
    hours: "Mon-Sat 8:30 AM - 6:00 PM",
    map_link: "https://www.google.com/maps?q=Milimani+Kisumu&output=embed",
    battery_swapping: false
  },
  {
    id: "nakuru-swap",
    name: "Nakuru Swap Station",
    city: "Nakuru",
    area: "CBD",
    address: "Kenyatta Avenue, Nakuru CBD",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Battery swapping", "Quick diagnostics", "General servicing"],
    hours: "Mon-Sun 7:30 AM - 8:30 PM",
    map_link: "https://www.google.com/maps?q=Nakuru+CBD&output=embed",
    battery_swapping: true
  },
  {
    id: "eldoret-workshop",
    name: "Eldoret Workshop",
    city: "Eldoret",
    area: "Pioneer",
    address: "Uganda Road, Pioneer, Eldoret",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Motor diagnostics", "Suspension", "Electrical"],
    hours: "Mon-Sat 8:00 AM - 5:30 PM",
    map_link: "https://www.google.com/maps?q=Uganda+Road+Eldoret&output=embed",
    battery_swapping: false
  },
  {
    id: "thika-fastfix",
    name: "Thika FastFix Point",
    city: "Thika",
    area: "Kisii Road",
    address: "Kisii Road Junction, Thika",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Battery swapping", "Repair", "Controller reset"],
    hours: "Mon-Sun 8:00 AM - 8:00 PM",
    map_link: "https://www.google.com/maps?q=Thika+Town&output=embed",
    battery_swapping: true
  },
  {
    id: "machakos-riders",
    name: "Machakos Riders Bay",
    city: "Machakos",
    area: "Town Center",
    address: "Machakos Town Center, Machakos",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["General maintenance", "Battery check", "Spare fitment"],
    hours: "Mon-Sat 9:00 AM - 6:00 PM",
    map_link: "https://www.google.com/maps?q=Machakos+Town&output=embed",
    battery_swapping: false
  },
  {
    id: "nyeri-mobility",
    name: "Nyeri Mobility Service",
    city: "Nyeri",
    area: "Kimathi Way",
    address: "Kimathi Way, Nyeri",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Battery swapping", "Brake tuning", "Electrical diagnostics"],
    hours: "Mon-Sat 8:00 AM - 6:00 PM",
    map_link: "https://www.google.com/maps?q=Nyeri+Town&output=embed",
    battery_swapping: true
  },
  {
    id: "kakamega-core",
    name: "Kakamega Core Service",
    city: "Kakamega",
    area: "CBD",
    address: "Kenyatta Street, Kakamega",
    phone: "+254733959383",
    whatsapp: "+254733959383",
    services: ["Repair", "Battery check", "Spare pickup"],
    hours: "Mon-Sat 8:30 AM - 5:30 PM",
    map_link: "https://www.google.com/maps?q=Kakamega+Town&output=embed",
    battery_swapping: false
  }
];

export const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Bikes", href: "/bikes" },
  { label: "Spares", href: "/spares" },
  { label: "Gadgets", href: "/gadgets" },
  { label: "Service Center", href: "/services" },
  { label: "Tracking", href: "/tracking" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" }
];

export const formatKES = (value: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0
  }).format(value);

export const getBikeById = (modelId: string) => bikes.find((bike) => bike.id === modelId);

export const getSpareById = (partId: string) => spareParts.find((part) => part.id === partId);

export const getGadgetById = (gadgetId: string) => gadgets.find((gadget) => gadget.id === gadgetId);

export const getServiceLocationById = (locationId: string) =>
  serviceLocations.find((location) => location.id === locationId);
