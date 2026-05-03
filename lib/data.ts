export type Severity = "low" | "medium" | "high" | "critical";

export type TrailNode = {
  id: string;
  name: string;
  type: "collector" | "subsidiary" | "broker" | "advertiser" | "government" | "partner";
  description: string;
  country: string;
};

export type Incident = {
  year: string;
  title: string;
  description: string;
};

export type DataPoint = {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  examples: string[];
  icelandNote?: string;
  incidents?: Incident[];
  trail: {
    collectedBy: TrailNode;
    sharedWith: TrailNode[];
    soldTo: TrailNode[];
    usedFor: string[];
    retentionPeriod: string;
    encrypted: boolean;
    canOptOut: boolean;
  };
};

export type Device = {
  slug: string;
  name: string;
  category: string;
  description: string;
  networkRisk: boolean;
  alwaysOn: boolean;
  dataPoints: DataPoint[];
};

export const devices: Device[] = [
  {
    slug: "smart-speaker",
    name: "Smart Speaker / Voice Assistant",
    category: "Voice Assistant",
    description: "Always-on voice-activated device that listens for a wake word and processes commands through company servers. Every interaction is logged and analysed.",
    alwaysOn: true,
    networkRisk: false,
    dataPoints: [
      {
        id: "voice-recordings",
        name: "Voice Recordings",
        description: "Audio captured after the wake word — and sometimes before it. Recordings are stored on remote servers and reviewed by human contractors.",
        severity: "critical",
        examples: [
          "Every command or question you ask",
          "Background conversations picked up accidentally",
          "Tone of voice and emotional cues",
        ],
        incidents: [
          {
            year: "2019",
            title: "Amazon employees listen to Alexa recordings",
            description: "Bloomberg reported that thousands of Amazon employees around the world — in the US, India, and Romania — were hired to listen to and transcribe Alexa voice recordings taken from inside people's homes, including bedrooms. Amazon confirmed the practice.",
          },
          {
            year: "2019",
            title: "Google Assistant recordings leaked in Belgium",
            description: "A Belgian broadcaster obtained over 1,000 leaked Google Assistant recordings from a contractor, including private conversations, medical discussions, and intimate exchanges — none of which were triggered intentionally.",
          },
        ],
        trail: {
          collectedBy: {
            id: "amazon",
            name: "Amazon.com Inc.",
            type: "collector",
            description: "Stores voice recordings on AWS servers. Used to improve speech recognition and personalise recommendations.",
            country: "USA",
          },
          sharedWith: [
            { id: "amazon-ads", name: "Amazon Advertising", type: "subsidiary", description: "Uses voice data to infer purchase intent and build ad targeting profiles.", country: "USA" },
            { id: "human-reviewers", name: "Human review contractors", type: "subsidiary", description: "Third-party contractors manually review a sample of recordings to improve accuracy. Confirmed by Amazon, Google, and Apple.", country: "USA / India / Romania" },
          ],
          soldTo: [
            { id: "acxiom", name: "Acxiom", type: "broker", description: "One of the world's largest data brokers. Builds consumer profiles sold to thousands of companies.", country: "USA" },
            { id: "third-party-skills", name: "Third-party app developers", type: "partner", description: "Developers of voice assistant apps receive interaction data when users use their app.", country: "Global" },
          ],
          usedFor: ["Targeted advertising", "Product recommendations", "Training AI voice models", "Sold to data brokers"],
          retentionPeriod: "Indefinitely unless manually deleted",
          encrypted: true,
          canOptOut: false,
        },
      },
      {
        id: "home-occupancy",
        name: "Home Occupancy Patterns",
        description: "When you are home, when you sleep, when you leave — all inferred from the timing of device interactions.",
        severity: "high",
        examples: [
          "What time you wake up each day",
          "When the house is empty",
          "Your daily routine inferred from device usage",
        ],
        trail: {
          collectedBy: {
            id: "amazon",
            name: "Amazon.com Inc.",
            type: "collector",
            description: "Infers home occupancy from when and how devices are used throughout the day.",
            country: "USA",
          },
          sharedWith: [
            { id: "amazon-sidewalk", name: "Amazon Sidewalk", type: "subsidiary", description: "A mesh network that shares low-bandwidth data across Amazon devices in your neighbourhood — including with your neighbours' devices.", country: "USA" },
          ],
          soldTo: [
            { id: "insurance-brokers", name: "Insurance data aggregators", type: "broker", description: "Home and life insurers purchase occupancy and behaviour data to model risk and adjust premiums.", country: "USA" },
          ],
          usedFor: ["Smart home automation", "Targeted advertising", "Sold to insurance aggregators", "Building neighbourhood mesh networks"],
          retentionPeriod: "Indefinitely",
          encrypted: true,
          canOptOut: false,
        },
      },
    ],
  },
  {
    slug: "smart-doorbell",
    name: "Smart Video Doorbell",
    category: "Security Camera",
    description: "Video doorbell that records all motion events outside your home. Footage is stored in the cloud and has been shared with law enforcement without warrants.",
    alwaysOn: true,
    networkRisk: false,
    dataPoints: [
      {
        id: "video-footage",
        name: "Video Footage",
        description: "Continuous exterior video of your home, street, and everyone who passes by — including people who have no interaction with your household.",
        severity: "critical",
        icelandNote: "Persónuvernd (Iceland's Data Protection Authority) has ruled that home security cameras must not capture shared gardens, neighbours' property, or public pavements and streets. In a documented case, a homeowner was ordered to immediately stop filming and delete all recorded footage after three cameras covered a shared garden and a public pavement. If your doorbell camera captures any area beyond your own private property, you may be in violation of Icelandic law.",
        examples: [
          "Face recordings of every visitor and passerby",
          "Video of neighbours and pedestrians who never interacted with your home",
          "Your own comings and goings — every day, every time",
        ],
        incidents: [
          {
            year: "2019",
            title: "Ring employees watched customer videos",
            description: "The Intercept reported that Ring gave its Ukraine-based R&D team broad access to a folder containing every video ever uploaded by Ring customers worldwide — unencrypted, accessible to any employee. No audit trail existed.",
          },
          {
            year: "2022",
            title: "Amazon shared Ring footage with police 11 times without a warrant",
            description: "Amazon admitted to the US Senate that in 2022 alone it had responded to 11 emergency requests from law enforcement and handed over Ring camera footage without the homeowner's knowledge or a court order.",
          },
          {
            year: "2023",
            title: "Ring pays $5.8M to FTC over privacy violations",
            description: "The US Federal Trade Commission fined Ring $5.8 million after finding that employees and contractors had been accessing customer videos for their own amusement, and that lax security practices had allowed hackers to access live feeds inside people's homes.",
          },
        ],
        trail: {
          collectedBy: {
            id: "ring",
            name: "Ring LLC (Amazon subsidiary)",
            type: "collector",
            description: "Stores all video on Amazon AWS servers. Metadata is retained even if clips are deleted by the user.",
            country: "USA",
          },
          sharedWith: [
            { id: "amazon-parent", name: "Amazon.com Inc.", type: "subsidiary", description: "Ring's parent company has access to footage for product improvement and AI training.", country: "USA" },
            { id: "neighbors-app", name: "Neighbors App (Ring)", type: "subsidiary", description: "Users can share footage publicly on Ring's own social network, making it available to strangers.", country: "USA" },
          ],
          soldTo: [
            { id: "law-enforcement", name: "Law enforcement agencies", type: "government", description: "Ring has partnerships with over 2,000 police departments across the US. Footage has been shared without warrants.", country: "USA" },
            { id: "facial-recognition", name: "Facial recognition vendors", type: "broker", description: "Footage has been used to train third-party facial recognition systems, including Amazon's own Rekognition service.", country: "USA / Global" },
          ],
          usedFor: ["Security alerts", "AI and facial recognition training", "Police investigations (at times without warrants)", "Public surveillance via Neighbors app"],
          retentionPeriod: "60 days for clips, metadata indefinitely",
          encrypted: false,
          canOptOut: false,
        },
      },
      {
        id: "facial-biometrics",
        name: "Facial Biometric Data",
        description: "Facial geometry extracted from video footage to identify frequent visitors. This data can be subpoenaed and is used to train commercial AI systems.",
        severity: "critical",
        examples: [
          "Face geometry scans of every person who approaches your door",
          "Repeat visitor profiles built automatically",
          "Strangers captured and stored without consent",
        ],
        trail: {
          collectedBy: {
            id: "ring",
            name: "Ring LLC",
            type: "collector",
            description: "Facial geometry data extracted from video for visitor detection features.",
            country: "USA",
          },
          sharedWith: [
            { id: "amazon-rekognition", name: "Amazon Rekognition", type: "subsidiary", description: "Amazon's facial recognition AI, sold commercially to businesses and police departments.", country: "USA" },
          ],
          soldTo: [
            { id: "dhs", name: "Department of Homeland Security / ICE", type: "government", description: "US immigration and border agencies have used Amazon Rekognition, trained in part on Ring data.", country: "USA" },
            { id: "private-security", name: "Private security firms", type: "broker", description: "Biometric data is licensed to private security and background check companies.", country: "USA" },
          ],
          usedFor: ["Visitor identification", "Police facial recognition", "Immigration enforcement", "Private background checks"],
          retentionPeriod: "Indefinitely",
          encrypted: false,
          canOptOut: false,
        },
      },
    ],
  },
  {
    slug: "robot-vacuum",
    name: "Robot Vacuum",
    category: "Smart Appliance",
    description: "Autonomous vacuum that maps your entire home using SLAM technology, building a precise spatial model of your living space and everything in it.",
    alwaysOn: false,
    networkRisk: false,
    dataPoints: [
      {
        id: "home-floor-plan",
        name: "Home Floor Plan & Layout",
        description: "A precise digital map of every room — dimensions, furniture positions, doorways, and the paths people walk most.",
        severity: "high",
        examples: [
          "Exact floor plan of every room in your home",
          "Furniture layout and room names you assign",
          "Where people walk most frequently",
        ],
        incidents: [
          {
            year: "2023",
            title: "iRobot AI training images leak intimate photos",
            description: "MIT Technology Review revealed that photos taken inside customers' homes by iRobot Roomba development devices — including an image of a woman sitting on a toilet — had been leaked and circulated on Facebook by data labelling workers in Venezuela. The photos were taken by special test devices given to paid beta testers, and iRobot's privacy policy did permit the collection of such images for AI training.",
          },
        ],
        trail: {
          collectedBy: {
            id: "irobot",
            name: "iRobot Corporation",
            type: "collector",
            description: "Floor plan data stored in iRobot's cloud. iRobot's CEO confirmed in 2017 they were considering selling map data commercially — they walked it back under public pressure.",
            country: "USA",
          },
          sharedWith: [
            { id: "irobot-cloud", name: "iRobot cloud platform", type: "subsidiary", description: "Maps synced to iRobot's servers to enable app features and personalised cleaning schedules.", country: "USA" },
          ],
          soldTo: [
            { id: "furniture-retailers", name: "Furniture and home retailers", type: "advertiser", description: "Floor plan and room-layout data is commercially valuable to home furnishing companies for targeted advertising.", country: "USA / Global" },
            { id: "real-estate-data", name: "Real estate data aggregators", type: "broker", description: "Home interior data helps real estate platforms build property databases.", country: "USA" },
          ],
          usedFor: ["Personalised cleaning routes", "AI home layout training", "Potential future commercial licensing", "Targeted home goods advertising"],
          retentionPeriod: "Indefinitely",
          encrypted: true,
          canOptOut: false,
        },
      },
      {
        id: "object-recognition",
        name: "Object & Pet Recognition",
        description: "Newer models photograph and classify objects — shoes, cables, pet waste, furniture — building a visual inventory of your home.",
        severity: "medium",
        examples: [
          "Types of furniture and belongings you own",
          "Presence and behaviour of pets",
          "Lifestyle indicators inferred from clutter and objects",
        ],
        trail: {
          collectedBy: {
            id: "irobot",
            name: "iRobot Corporation",
            type: "collector",
            description: "Object images and classification labels sent to cloud servers for AI training and cleaning personalisation.",
            country: "USA",
          },
          sharedWith: [
            { id: "irobot-ai", name: "iRobot AI team", type: "subsidiary", description: "Object data used internally to improve obstacle detection models.", country: "USA" },
          ],
          soldTo: [
            { id: "pet-brands", name: "Pet care and consumer brands", type: "advertiser", description: "Home interior and pet presence data is commercially valuable to consumer brands for targeted advertising.", country: "Global" },
          ],
          usedFor: ["Personalised cleaning", "AI obstacle detection training", "Targeted advertising for pet products and home goods"],
          retentionPeriod: "Indefinitely",
          encrypted: true,
          canOptOut: false,
        },
      },
    ],
  },
  {
    slug: "smart-tv",
    name: "Smart TV",
    category: "Smart Display",
    description: "Internet-connected television that uses Automatic Content Recognition (ACR) to capture what is on screen every few seconds — including content from cable, streaming, and gaming.",
    alwaysOn: false,
    networkRisk: false,
    dataPoints: [
      {
        id: "viewing-habits",
        name: "Viewing & Watching Habits",
        description: "ACR technology screenshots your screen constantly and matches the images against a database of all broadcast content. Every show, ad, and channel is logged.",
        severity: "high",
        examples: [
          "Every TV show and film you watch",
          "How long you watch each channel or service",
          "Which streaming platforms you use and at what time",
        ],
        incidents: [
          {
            year: "2017",
            title: "Vizio fined $2.2M for collecting viewing data without consent",
            description: "The US Federal Trade Commission and Department of Justice fined Vizio $2.2 million after finding it had collected viewing data from 11 million televisions without informing users — tracking second-by-second viewing data and appending demographic information before selling it to advertisers.",
          },
          {
            year: "2015",
            title: "Samsung Smart TV warning: your voice is being transmitted",
            description: "Samsung's privacy policy warned users that 'personal or other sensitive information' spoken near the TV 'will be among the data captured and transmitted to a third party.' Security researchers later confirmed the voice data was transmitted unencrypted.",
          },
        ],
        trail: {
          collectedBy: {
            id: "samsung",
            name: "Samsung Electronics Co.",
            type: "collector",
            description: "ACR takes a screenshot of your screen every second and matches it against a database of all content. Stored and sold through Samsung Ads.",
            country: "South Korea / USA",
          },
          sharedWith: [
            { id: "samsung-ads", name: "Samsung Ads platform", type: "subsidiary", description: "Uses ACR data to build viewer profiles for targeted TV advertising.", country: "USA" },
          ],
          soldTo: [
            { id: "nielsen", name: "Nielsen", type: "broker", description: "Purchases ACR and viewership data to replace traditional TV ratings panels.", country: "USA" },
            { id: "tv-advertisers", name: "TV and streaming advertisers", type: "advertiser", description: "Brands pay to reach viewers who watched competitor ads or specific programmes.", country: "Global" },
          ],
          usedFor: ["Targeted TV advertising", "Audience measurement and ratings", "Content licensing negotiations", "Competitive intelligence for streaming platforms"],
          retentionPeriod: "2 years",
          encrypted: true,
          canOptOut: true,
        },
      },
      {
        id: "microphone-data",
        name: "Voice Commands & Ambient Audio",
        description: "Smart TV microphones capture voice commands and transmit audio to third-party voice recognition servers — sometimes capturing nearby conversations.",
        severity: "critical",
        examples: [
          "Everything said near the TV when voice control is active",
          "Channel and app commands",
          "Ambient conversations captured while the microphone is live",
        ],
        trail: {
          collectedBy: {
            id: "samsung",
            name: "Samsung Electronics",
            type: "collector",
            description: "Voice data sent to Samsung servers and to third-party voice recognition partners for processing.",
            country: "South Korea",
          },
          sharedWith: [
            { id: "nuance", name: "Nuance Communications (Microsoft)", type: "partner", description: "Samsung's voice recognition technology partner processes audio on their own servers.", country: "USA" },
          ],
          soldTo: [
            { id: "marketing-firms", name: "Digital marketing agencies", type: "advertiser", description: "Interest profiles derived from voice data are sold to advertising agencies.", country: "Global" },
          ],
          usedFor: ["Voice recognition improvement", "Interest profile building", "Targeted advertising"],
          retentionPeriod: "Until account deletion",
          encrypted: true,
          canOptOut: true,
        },
      },
    ],
  },
  {
    slug: "baby-monitor",
    name: "Baby Monitor Camera",
    category: "Security Camera",
    description: "Network-connected camera placed in a child's bedroom. Many models have weak security, making them one of the most frequently hacked consumer devices.",
    alwaysOn: true,
    networkRisk: true,
    dataPoints: [
      {
        id: "live-video-audio",
        name: "Live Video & Audio Feed",
        description: "Continuous live video and audio from inside a child's bedroom, streamed over the internet and stored in the cloud.",
        severity: "critical",
        examples: [
          "Live video inside your child's bedroom at all times",
          "Audio of your child and anyone speaking nearby",
          "Sleep patterns, movements, and behaviour",
        ],
        incidents: [
          {
            year: "2013",
            title: "TRENDnet baby monitor hacks — FTC settlement",
            description: "A security flaw in TRENDnet cameras exposed live feeds from hundreds of home cameras — including baby monitors — to the open internet. Footage of sleeping infants, families, and children was publicly accessible. The FTC settled with TRENDnet, marking the first major IoT privacy enforcement action.",
          },
          {
            year: "2018",
            title: "Parents hear stranger's voice through baby monitor",
            description: "A South Carolina couple (the Rigneys) reported that a hacker accessed their baby monitor and broadcast a voice saying 'I'm going to kidnap your baby' and 'I'm in your baby's room.' Their 4-month-old son was asleep in the crib. The incident was reported to police in June 2018 and covered by NPR. Similar incidents were reported across the US, UK, and Canada — all involving internet-connected baby cameras with default or weak passwords.",
          },
          {
            year: "2019",
            title: "Nest camera hacked — stranger speaks to baby",
            description: "A family in Lake Barrington, Illinois reported that a hacker accessed their Nest camera and spoke through the speaker in their 7-month-old baby's room. The hacker also hurled obscenities at the parents and turned the thermostat to 90°F. Google confirmed the account had been compromised through credential stuffing — where passwords leaked from other breaches are tried automatically.",
          },
        ],
        trail: {
          collectedBy: {
            id: "monitor-manufacturer",
            name: "Camera manufacturer cloud platform",
            type: "collector",
            description: "Video and audio streamed and stored on manufacturer cloud servers. Security standards vary widely — many budget models store footage unencrypted.",
            country: "USA / China",
          },
          sharedWith: [
            { id: "cloud-provider", name: "Cloud infrastructure provider", type: "partner", description: "Most manufacturers host footage on Amazon AWS or Google Cloud, meaning the cloud provider has access to raw data.", country: "USA" },
          ],
          soldTo: [
            { id: "data-aggregators", name: "Behavioural data aggregators", type: "broker", description: "Usage patterns, sleep schedules, and household activity data are commercially valuable to data brokers.", country: "USA / Global" },
          ],
          usedFor: ["Remote monitoring", "AI baby behaviour analysis", "Parenting product advertising", "Sleep pattern profiling"],
          retentionPeriod: "30–90 days depending on plan",
          encrypted: false,
          canOptOut: false,
        },
      },
      {
        id: "sleep-behaviour",
        name: "Sleep & Behaviour Patterns",
        description: "Some models use AI to analyse sleep quality, movement, and sound — generating health-relevant data about a child that is stored indefinitely.",
        severity: "high",
        examples: [
          "How many times your child wakes at night",
          "Breathing rate and movement patterns",
          "Crying frequency and duration",
        ],
        trail: {
          collectedBy: {
            id: "monitor-manufacturer",
            name: "Camera / monitor manufacturer",
            type: "collector",
            description: "AI-derived health and behaviour data stored on manufacturer servers and often shared with analytics partners.",
            country: "USA / China",
          },
          sharedWith: [
            { id: "health-analytics", name: "Child health analytics platforms", type: "partner", description: "Some manufacturers share anonymised sleep and behaviour data with research and analytics partners.", country: "USA" },
          ],
          soldTo: [
            { id: "pharma-brands", name: "Pharmaceutical and baby product brands", type: "advertiser", description: "Child sleep and behaviour data is commercially valuable to companies selling remedies, supplements, and baby products.", country: "Global" },
          ],
          usedFor: ["Product improvement", "Targeted baby product advertising", "Child health research (often without clear consent)", "AI model training"],
          retentionPeriod: "Indefinitely in some cases",
          encrypted: false,
          canOptOut: false,
        },
      },
    ],
  },
  {
    slug: "laptop",
    name: "Laptop / Desktop Computer",
    category: "Personal Computer",
    description: "Your primary computing device. The operating system, browser, and every installed application collects detailed telemetry about your behaviour, location, and identity.",
    alwaysOn: false,
    networkRisk: false,
    dataPoints: [
      {
        id: "os-telemetry",
        name: "Operating System Telemetry",
        description: "Windows and macOS continuously send usage data, crash reports, app usage, and hardware diagnostics back to Microsoft and Apple — often enabled by default with no clear opt-out.",
        severity: "high",
        examples: [
          "Every app you open and how long you use it",
          "Typing patterns and search terms in system search",
          "Hardware performance and location data",
        ],
        incidents: [
          {
            year: "2015",
            title: "Windows 10 telemetry cannot be fully disabled",
            description: "Security researchers demonstrated that even when all privacy settings in Windows 10 were disabled, the operating system continued to send data to Microsoft servers — including keystrokes typed into non-Microsoft applications. Microsoft later acknowledged the behaviour and issued a partial patch.",
          },
        ],
        trail: {
          collectedBy: {
            id: "microsoft",
            name: "Microsoft Corporation",
            type: "collector",
            description: "Collects 'diagnostic data' from all Windows devices. The level of data collected is categorised as 'Basic' or 'Full' — even Basic includes device identifiers, app crash data, and usage patterns.",
            country: "USA",
          },
          sharedWith: [
            { id: "microsoft-advertising", name: "Microsoft Advertising", type: "subsidiary", description: "Usage and interest data feeds into Microsoft's advertising platform, targeting ads across Bing, LinkedIn, and partner sites.", country: "USA" },
          ],
          soldTo: [
            { id: "oracle-data", name: "Oracle Data Cloud", type: "broker", description: "Purchases OS-level interest and behaviour data to enrich consumer profiles sold to advertisers.", country: "USA" },
          ],
          usedFor: ["Product improvement", "Bug diagnosis", "Targeted advertising", "Building consumer interest profiles"],
          retentionPeriod: "Up to 3 years",
          encrypted: true,
          canOptOut: false,
        },
      },
      {
        id: "browser-history",
        name: "Browser History & Cookies",
        description: "Your entire browsing history — every website visited, every search made — is tracked by your browser, by websites, and by the advertising networks embedded in them.",
        severity: "critical",
        examples: [
          "Every website you visit and how long you stay",
          "Medical, financial, and legal searches",
          "Shopping behaviour and price comparisons",
        ],
        trail: {
          collectedBy: {
            id: "google-browser",
            name: "Google LLC (Chrome browser / Search)",
            type: "collector",
            description: "Chrome has over 65% global browser market share. It links your browsing behaviour to your Google account, building one of the most detailed profiles of any individual's interests and intentions.",
            country: "USA",
          },
          sharedWith: [
            { id: "google-ads", name: "Google Ads platform", type: "subsidiary", description: "Browsing history feeds directly into ad targeting across Google Search, YouTube, Gmail, and millions of partner websites.", country: "USA" },
          ],
          soldTo: [
            { id: "dv360", name: "Google Display & Video 360 (DV360)", type: "advertiser", description: "Google's programmatic ad platform sells access to your browsing profile to any advertiser bidding in real time.", country: "Global" },
            { id: "lotame", name: "Lotame and other data management platforms", type: "broker", description: "Browser-level cookie and interest data is purchased by data management platforms and resold to hundreds of advertisers.", country: "USA" },
          ],
          usedFor: ["Targeted advertising", "Personalised search results", "Retargeting (ads that follow you across websites)", "Consumer profiling"],
          retentionPeriod: "18 months default, up to indefinitely",
          encrypted: true,
          canOptOut: true,
        },
      },
    ],
  },
  {
    slug: "tablet",
    name: "Tablet",
    category: "Mobile Device",
    description: "Portable touchscreen device used for browsing, media, and communication. Combines the tracking of a smartphone with the usage patterns of a home computer.",
    alwaysOn: false,
    networkRisk: false,
    dataPoints: [
      {
        id: "app-tracking",
        name: "App Data & Cross-App Tracking",
        description: "Every app on your tablet requests permissions and shares data with advertising networks. Until Apple's 2021 App Tracking Transparency change, apps shared identifiers with hundreds of ad networks by default.",
        severity: "high",
        examples: [
          "Location data shared by apps in the background",
          "Contacts, photos, and microphone access granted to apps",
          "Your unique advertising ID shared across all apps",
        ],
        incidents: [
          {
            year: "2021",
            title: "Facebook loses $10B after Apple blocks app tracking",
            description: "When Apple's App Tracking Transparency feature required apps to ask for permission before tracking users across apps, Facebook (Meta) reported a $10 billion revenue hit in a single year — demonstrating how central cross-device tracking was to their business model.",
          },
        ],
        trail: {
          collectedBy: {
            id: "meta-google",
            name: "Meta / Google (via embedded SDKs)",
            type: "collector",
            description: "The Facebook SDK and Google AdMob are embedded in thousands of apps. Even if you never open Facebook, these SDKs track your app usage and send data back to Meta and Google.",
            country: "USA",
          },
          sharedWith: [
            { id: "ad-networks", name: "Mobile advertising networks", type: "partner", description: "Data is shared with hundreds of ad networks via real-time bidding — your profile is auctioned to advertisers in milliseconds as you load a page.", country: "Global" },
          ],
          soldTo: [
            { id: "data-brokers-mobile", name: "Mobile data brokers", type: "broker", description: "Companies like Babel Street and Venntel purchase mobile location and app data and sell it to government agencies and commercial clients.", country: "USA" },
            { id: "government-agencies", name: "Government intelligence agencies", type: "government", description: "US agencies including the DHS and NSA have purchased mobile app data from brokers as a warrantless alternative to requesting data directly from tech companies.", country: "USA" },
          ],
          usedFor: ["Targeted advertising", "Cross-device identity linking", "Government surveillance (via brokers)", "Consumer profiling"],
          retentionPeriod: "Varies by app — often indefinitely",
          encrypted: true,
          canOptOut: true,
        },
      },
      {
        id: "usage-patterns",
        name: "Usage Patterns & Screen Time",
        description: "How long you use the device, what apps you open, at what time, and in what sequence — all logged by the OS and shared with app developers.",
        severity: "medium",
        examples: [
          "Which apps you open first thing in the morning",
          "How long you spend on social media vs. news",
          "Night-time usage patterns indicating sleep disturbances",
        ],
        trail: {
          collectedBy: {
            id: "apple-google-os",
            name: "Apple / Google (operating system)",
            type: "collector",
            description: "iOS and Android both collect detailed app usage telemetry, linked to your Apple ID or Google Account.",
            country: "USA",
          },
          sharedWith: [
            { id: "app-developers", name: "Individual app developers", type: "partner", description: "OS analytics platforms share aggregated and individual usage data with app developers.", country: "Global" },
          ],
          soldTo: [
            { id: "behavioural-analytics", name: "Behavioural analytics companies", type: "broker", description: "Usage pattern data is purchased by companies building psychological and behavioural profiles for advertising and insurance.", country: "USA / Global" },
          ],
          usedFor: ["App store personalisation", "Targeted advertising", "Behavioural profiling", "Mental health and wellness product targeting"],
          retentionPeriod: "Up to 2 years",
          encrypted: true,
          canOptOut: true,
        },
      },
    ],
  },
  {
    slug: "smart-kitchen",
    name: "Smart Kitchen Appliances",
    category: "Smart Appliance",
    description: "Connected refrigerators, ovens, coffee machines, and dishwashers. These devices collect detailed data about eating habits and daily routines — and often serve as an unsecured gateway into your home network.",
    alwaysOn: false,
    networkRisk: true,
    dataPoints: [
      {
        id: "food-habits",
        name: "Eating Habits & Food Data",
        description: "Smart fridges and ovens track what food you buy, store, and prepare — building a detailed picture of your diet and lifestyle.",
        severity: "medium",
        examples: [
          "What food you keep in your fridge and how often you restock",
          "What time you cook and how often",
          "Diet preferences inferred from food inventory",
        ],
        trail: {
          collectedBy: {
            id: "samsung-appliance",
            name: "Appliance manufacturer (Samsung, LG, Whirlpool)",
            type: "collector",
            description: "Usage data sent to manufacturer cloud platforms and often to partner food delivery and grocery services.",
            country: "South Korea / USA",
          },
          sharedWith: [
            { id: "grocery-partners", name: "Grocery and food delivery partners", type: "partner", description: "Some smart fridge manufacturers have partnerships with grocery chains to suggest purchases based on inventory data.", country: "Global" },
          ],
          soldTo: [
            { id: "food-brands", name: "Food and beverage brands", type: "advertiser", description: "Dietary and food purchase data is commercially valuable to food companies for targeted marketing.", country: "Global" },
            { id: "health-insurers-food", name: "Health insurers", type: "broker", description: "Diet and eating habit data is of significant interest to health insurance actuaries modelling risk.", country: "USA / Global" },
          ],
          usedFor: ["Personalised grocery suggestions", "Targeted food advertising", "Health insurance risk modelling", "Diet and wellness product marketing"],
          retentionPeriod: "Varies — often indefinitely",
          encrypted: true,
          canOptOut: true,
        },
      },
      {
        id: "network-gateway",
        name: "Home Network Gateway Risk",
        description: "Smart kitchen appliances frequently have weak security and outdated firmware. Once compromised, they provide an attacker with access to your entire home network — including computers, phones, and cameras.",
        severity: "critical",
        examples: [
          "An unpatched fridge giving an attacker access to your Wi-Fi network",
          "Credentials from your router intercepted through a smart appliance",
          "Access to other devices on the same network — laptops, phones, security cameras",
        ],
        incidents: [
          {
            year: "2016",
            title: "Mirai botnet hijacks 600,000 IoT devices",
            description: "The Mirai malware infected over 600,000 IoT devices — including smart home appliances, cameras, and routers — by scanning for devices with default usernames and passwords. It then used them to launch the largest DDoS attack in history, taking down major websites including Twitter, Netflix, and Reddit. Most victims had no idea their devices had been compromised.",
          },
          {
            year: "2015",
            title: "Samsung smart fridge exposes Gmail login credentials",
            description: "Security researchers at Pen Test Partners demonstrated at DEF CON that a Samsung RF28HMELBSR smart fridge failed to validate SSL certificates. An attacker on the same Wi-Fi network could intercept the owner's Google login credentials in a man-in-the-middle attack via the fridge's Gmail calendar display.",
          },
        ],
        trail: {
          collectedBy: {
            id: "attacker-isp",
            name: "Malicious actors / ISP (via compromised device)",
            type: "collector",
            description: "A compromised kitchen appliance gives an attacker a foothold on your home network — from which they can access any other connected device.",
            country: "Unknown",
          },
          sharedWith: [
            { id: "botnet-operators", name: "Botnet operators", type: "partner", description: "Compromised devices are enrolled into botnets used for DDoS attacks, spam distribution, and cryptomining — all without the owner's knowledge.", country: "Global" },
          ],
          soldTo: [
            { id: "dark-web", name: "Dark web markets", type: "broker", description: "Access to compromised home networks is sold on dark web forums to other attackers.", country: "Global" },
          ],
          usedFor: ["DDoS attacks", "Spam distribution", "Cryptomining", "Lateral network access to sensitive devices"],
          retentionPeriod: "N/A",
          encrypted: false,
          canOptOut: false,
        },
      },
    ],
  },
  {
    slug: "smart-bulb",
    name: "Smart Light Bulbs",
    category: "Smart Home",
    description: "Wi-Fi or Zigbee connected light bulbs. Individually harmless-seeming, they silently track occupancy and movement patterns — and have repeatedly been exploited as a gateway into home networks.",
    alwaysOn: true,
    networkRisk: true,
    dataPoints: [
      {
        id: "occupancy-patterns",
        name: "Occupancy & Movement Patterns",
        description: "When lights are switched on and off reveals exactly when people are home, which rooms are occupied, and daily routines — data with obvious value to insurers, advertisers, and burglars.",
        severity: "medium",
        examples: [
          "Exactly when you wake up and go to bed each day",
          "Which rooms are occupied and at what time",
          "When the house is empty — a significant security risk",
        ],
        trail: {
          collectedBy: {
            id: "bulb-manufacturer",
            name: "Smart lighting manufacturer (Philips Hue, LIFX, TP-Link)",
            type: "collector",
            description: "On/off patterns and scheduling data stored on manufacturer cloud servers and tied to your account and home address.",
            country: "Netherlands / USA / China",
          },
          sharedWith: [
            { id: "smart-home-platform", name: "Smart home platforms (Google Home, Amazon Alexa, Apple HomeKit)", type: "partner", description: "Lighting data is shared with whatever smart home platform the user connects their bulbs to.", country: "USA" },
          ],
          soldTo: [
            { id: "insurance-bulb", name: "Home insurance data aggregators", type: "broker", description: "Occupancy pattern data is of direct value to home insurers modelling the risk of burglary and unoccupied property.", country: "USA / Global" },
            { id: "advertisers-bulb", name: "Lifestyle and retail advertisers", type: "advertiser", description: "Routine and occupancy data is used to infer lifestyle and purchasing behaviour for ad targeting.", country: "Global" },
          ],
          usedFor: ["Smart home automation", "Energy usage reporting", "Targeted advertising", "Home insurance risk modelling"],
          retentionPeriod: "Indefinitely",
          encrypted: true,
          canOptOut: false,
        },
      },
      {
        id: "bulb-network-exploit",
        name: "Network Exploitation Vector",
        description: "Smart bulbs connect directly to your home Wi-Fi and run minimal security software. Researchers have repeatedly demonstrated that they can be compromised to extract your Wi-Fi password and gain access to your entire network.",
        severity: "critical",
        examples: [
          "Wi-Fi password extracted from a bulb's unencrypted memory",
          "A compromised bulb used to eavesdrop on network traffic",
          "Attacker gains access to computers and cameras via a light bulb",
        ],
        incidents: [
          {
            year: "2020",
            title: "Philips Hue vulnerability allows full network takeover",
            description: "Check Point Research demonstrated a complete attack chain beginning with a Philips Hue smart bulb. An attacker could remotely trigger a firmware bug in the bulb, forcing the owner to delete and re-add it — at which point malicious firmware was installed. This gave the attacker a foothold on the home network, from which they could target connected computers and other devices.",
          },
          {
            year: "2019",
            title: "LIFX bulbs store Wi-Fi credentials in plain text",
            description: "A security researcher discovered that LIFX smart bulbs stored the home Wi-Fi password in plain, unencrypted memory in the bulb's firmware. The vulnerability was found in May 2018 and publicly disclosed in January 2019 after LIFX issued a patch. Anyone with physical access to an unpatched bulb could extract the Wi-Fi password using a hex editor.",
          },
        ],
        trail: {
          collectedBy: {
            id: "attacker-bulb",
            name: "Malicious actor (via firmware exploit)",
            type: "collector",
            description: "A compromised smart bulb can expose Wi-Fi credentials, allowing an attacker silent access to the home network and all devices connected to it.",
            country: "Unknown",
          },
          sharedWith: [
            { id: "botnet-bulb", name: "Botnet infrastructure", type: "partner", description: "Compromised bulbs are recruited into botnets used for DDoS attacks and other malicious activities.", country: "Global" },
          ],
          soldTo: [
            { id: "dark-web-bulb", name: "Dark web network access markets", type: "broker", description: "Verified home network access is sold to other malicious actors.", country: "Global" },
          ],
          usedFor: ["Wi-Fi credential theft", "Network surveillance", "Lateral access to other home devices", "Botnet recruitment"],
          retentionPeriod: "N/A",
          encrypted: false,
          canOptOut: false,
        },
      },
    ],
  },
];

export function getDevice(slug: string): Device | undefined {
  return devices.find((d) => d.slug === slug);
}

export function getDataPoint(slug: string, dataId: string): DataPoint | undefined {
  return getDevice(slug)?.dataPoints.find((d) => d.id === dataId);
}

export const severityConfig: Record<Severity, { label: string; color: string; bg: string; border: string }> = {
  low:      { label: "Low",      color: "text-black",  bg: "bg-[#565656]",    border: "border-[#565656]" },
  medium:   { label: "Medium",   color: "text-black",  bg: "bg-[#565656]",    border: "border-[#565656]" },
  high:     { label: "High",     color: "text-black",  bg: "bg-[#A6151D]/80", border: "border-[#A6151D]" },
  critical: { label: "Critical", color: "text-black",  bg: "bg-[#A6151D]",    border: "border-[#A6151D]" },
};

export const trailNodeConfig: Record<TrailNode["type"], { label: string; color: string; bg: string; border: string }> = {
  collector:   { label: "Collects",     color: "text-[#D4D4D4]", bg: "bg-[#111]", border: "border-[#565656]" },
  subsidiary:  { label: "Shared With",  color: "text-[#D4D4D4]", bg: "bg-[#111]", border: "border-[#565656]" },
  broker:      { label: "Data Broker",  color: "text-[#A6151D]", bg: "bg-[#111]", border: "border-[#A6151D]" },
  advertiser:  { label: "Advertiser",   color: "text-[#A6151D]", bg: "bg-[#111]", border: "border-[#A6151D]" },
  government:  { label: "Government",   color: "text-[#A6151D]", bg: "bg-[#111]", border: "border-[#A6151D]" },
  partner:     { label: "Partner",      color: "text-[#D4D4D4]", bg: "bg-[#111]", border: "border-[#565656]" },
};
