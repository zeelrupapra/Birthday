// =========================================================================
// CUSTOMIZATION CONFIGURATION - VRUSHTI DIDU'S BIRTHDAY SURPRISE
// Handcrafted with love by Zeel for cute sister, best friend & closest person
// =========================================================================

export interface MemoryPhoto {
  id: number;
  title: string;
  caption: string;
  story: string;
  dateTag: string;
  imagePath: string;
  fallbackGradient: string;
  accentEmoji: string;
  // Image Fit & Control options
  fit?: 'cover' | 'contain' | 'fill';
  scale?: number; // Zoom level: 0.5 to 2.5
  rotate?: number; // Rotation degrees: -180 to 180 or 0, 90, 180, 270
  positionX?: number; // Horizontal focus: 0% to 100%
  positionY?: number; // Vertical focus: 0% to 100%
}

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    reaction: string;
    isBestieAnswer?: boolean;
  }[];
}

export interface AwardCategory {
  icon: string;
  title: string;
  desc: string;
}

export interface WheelOption {
  id: string;
  label: string;
  emoji: string;
  color: string;
  challenge: string;
}

export interface BirthdayConfig {
  // 1. BASIC INFORMATION
  name: string;
  senderName: string;
  nickname: string;
  birthDateString: string; // DD/MM/YYYY
  birthDay: number;
  birthMonth: number; // 1-indexed (10 = October)
  birthYear: number;
  passcode: string;
  relationship: string;

  // 2. AUDIO & MUSIC CONFIGURATION
  musicPath: string;
  songTitle: string;

  // 3. COUNTDOWN & WELCOME COPY
  countdownMessage: string;
  unlockCelebrationHeadline: string;
  unlockCelebrationSubtext: string;
  secretScreenHeading: string;
  secretScreenSubtext: string;
  secretScreenHint: string;
  welcomeTitle: string;
  welcomeSubtitle: string;

  // 4. HEARTFELT SISTER & BESTIE LETTER
  letter: {
    title: string;
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };

  // 5. PHOTO MEMORIES
  photos: MemoryPhoto[];

  // 6. MINI GAME
  game: {
    title: string;
    subtitle: string;
    targetScore: number;
    durationSeconds: number;
    winMessage: string;
  };

  // 7. SISTER & BEST FRIEND QUIZ
  quiz: {
    title: string;
    subtitle: string;
    questions: QuizQuestion[];
    resultScoreText: string;
    resultDescription: string;
  };

  // 8. BEST SISTER & BESTIE HONORS CEREMONY
  award: {
    title: string;
    recipient: string;
    awardName: string;
    officialDate: string;
    categories: AwardCategory[];
  };

  // 9. SPIN THE BIRTHDAY WHEEL
  wheel: {
    title: string;
    subtitle: string;
    options: WheelOption[];
  };

  // 10. SURPRISE BOX & FINAL EMOTIONAL CLIMAX
  surpriseBox: {
    prompt: string;
    hint: string;
  };

  finalMessage: {
    headline: string;
    paragraphs: string[];
    toast: string;
    finalButtonText: string;
  };

  // 11. THEME PALETTE
  theme: {
    primaryPink: string;
    softBlush: string;
    hotPink: string;
    deepRose: string;
    softLavender: string;
    darkPlum: string;
  };
}

export const DEFAULT_BIRTHDAY_DATA: BirthdayConfig = {
  // 1. BASIC INFORMATION
  name: "Vrushti didu",
  senderName: "Zeel",
  nickname: "Meri Cute Vrushti Didu 🌸",
  birthDateString: "17/10/2008", // DD/MM/YYYY
  birthDay: 17,
  birthMonth: 10, // October (1-indexed)
  birthYear: 2008,
  
  // Passcode for secret entry
  passcode: "1710",
  relationship: "MY CUTE SISTER, BEST FRIEND & CLOSEST PERSON IN THE UNIVERSE 🌸💖",

  // 2. AUDIO & MUSIC CONFIGURATION
  musicPath: "/music/birthday-song.mp3",
  songTitle: "Best Sister & Bestie Song 🎵🌸",

  // 3. COUNTDOWN & WELCOME COPY
  countdownMessage: "Something truly magical is waiting for my Vrushti didu... 🌸✨",
  unlockCelebrationHeadline: "IT'S YOUR DAY, VRUSHTI DIDU! 🎂🌸❤️",
  unlockCelebrationSubtext: "The universe is officially celebrating the sweetest sister, coolest best friend, and most special soul today!",

  secretScreenHeading: "Before we begin, my cute didu... 💌",
  secretScreenSubtext: "Only the best sister in the entire world has the key to unlock this secret realm.",
  secretScreenHint: "(your birth date 17/10)",
  welcomeTitle: "Welcome, Meri Vrushti Didu 🌸",
  welcomeSubtitle: "A magical world crafted with all my love just for you...",

  // 4. HEARTFELT SISTER & BESTIE LETTER
  letter: {
    title: "A little heartfelt letter for my cute sister & best friend 💌",
    salutation: "Dear Vrushti didu,",
    paragraphs: [
      "To my dearest sister, my best friend, and the closest person in my whole life: having you by my side makes every single day brighter, happier, and full of comfort.",
      "From all our secret late-night chats, endless inside jokes, and silly giggles, to how you always stand up for me and guide me—you are truly one in a billion.",
      "You have the kindest heart, the sweetest smile, and the purest soul. Even when we tease each other or argue over little things, you know that you mean the absolute world to me.",
      "Today is 100% all about celebrating YOU! May your 18th birthday bring you unlimited happiness, grand dreams fulfilled, and all the love you deserve. Happy Birthday, Vrushti didu! 🎂🌸✨"
    ],
    closing: "With all my heart, endless love, and warmest hugs,",
    signature: "Your Zeel Forever & Always 💕"
  },

  // 5. 3 PHOTO MEMORIES
  photos: [
    {
      id: 1,
      title: "The Sweetest Didu 👑🌸",
      caption: "The brightest smile in the entire room ✨",
      story: "Look at how radiant and adorable you look! Your cheerful smile has this magical superpower of making everyone around you feel happy and comforted.",
      dateTag: "Vrushti Didu Portrait 1",
      imagePath: "/photos/photo1.jpg",
      fallbackGradient: "from-pink-400 via-rose-300 to-pink-200",
      accentEmoji: "👑",
      fit: "cover",
      scale: 1,
      rotate: 0,
      positionX: 50,
      positionY: 50
    },
    {
      id: 2,
      title: "Pure Cuteness & Drama 🎀",
      caption: "My favorite laugh in the whole universe...",
      story: "100% natural, 100% cute drama! This captures your playful, goofy, and charming side that makes you the most fun sister ever.",
      dateTag: "Vrushti Didu Portrait 2",
      imagePath: "/photos/photo2.jpg",
      fallbackGradient: "from-rose-400 via-pink-300 to-amber-200",
      accentEmoji: "💖",
      fit: "cover",
      scale: 1,
      rotate: 0,
      positionX: 50,
      positionY: 50
    },
    {
      id: 3,
      title: "Forever My Safe Place ✨",
      caption: "Best sister, best friend & forever guide 🌸",
      story: "The prettiest soul I know, inside and out. Thank you for always listening, always understanding, and being the best sister anyone could dream of.",
      dateTag: "Vrushti Didu Portrait 3",
      imagePath: "/photos/photo3.jpg",
      fallbackGradient: "from-fuchsia-400 via-pink-400 to-rose-200",
      accentEmoji: "✨",
      fit: "cover",
      scale: 1,
      rotate: 0,
      positionX: 50,
      positionY: 50
    }
  ],

  // 6. MINI GAME
  game: {
    title: "Catch Flowers & Hearts 🌸💖",
    subtitle: "Collect 10 sweet items to unlock the next chapter!",
    targetScore: 10,
    durationSeconds: 20,
    winMessage: "SISTER & BESTIE BOND: INFINITY & BEYOND! 🌸💕"
  },

  // 7. SISTER & BEST FRIEND QUIZ
  quiz: {
    title: "How Well Do You Know Our Sister Bond? 👀🌸",
    subtitle: "5 quick questions to test our sibling & bestie telepathy!",
    questions: [
      {
        question: "What is my absolute favorite thing about you, Vrushti didu? 🌸",
        options: [
          { text: "Your warm, cute, heart-melting smile", reaction: "Yes! It always brightens my day! 🥰🌸" },
          { text: "How caring and supportive your heart is", reaction: "A sister with a heart of pure gold! ✨" },
          { text: "Your innocent drama and cute giggles", reaction: "Too hilarious and cute to handle! 😂💖" },
          { text: "Literally everything—you are the best sister & bestie!", reaction: "1000% THE TRUE ANSWER! You're my favorite person! 🌸💕", isBestieAnswer: true }
        ]
      },
      {
        question: "When something exciting or funny happens, who do I want to tell first?",
        options: [
          { text: "Late night or day—Vrushti didu is always first!", reaction: "1000% TRUE! You never leave my mind! 💖📱", isBestieAnswer: true },
          { text: "Whoever answers the phone first", reaction: "Nope, only didu gets the VIP gossip! 😜" },
          { text: "I keep it inside for later", reaction: "Can never keep secrets from my bestie sister! 🤫" },
          { text: "Our family group chat", reaction: "Private chats with didu hit different! 🍰" }
        ]
      },
      {
        question: "Who is the certified cute drama queen between us? 🥺",
        options: [
          { text: "Vrushti didu when she wants pampering", reaction: "Cutest sister in the world! 🧸👑" },
          { text: "Zeel because I love teasing you endlessly", reaction: "Guilty! Teasing my didu is my hobby! 🙋‍♂️😜" },
          { text: "Both of us creating absolute chaos together", reaction: "CORRECT! Inseparable partners in crime! 👯‍♀️💖", isBestieAnswer: true },
          { text: "Depends on who misses who more", reaction: "A daily love and banter match! 🏆" }
        ]
      },
      {
        question: "What does our future together look like? 🌸✨",
        options: [
          { text: "Endless shopping trips, treats, and road trips", reaction: "All the best treats on me always! 🛍️🚗" },
          { text: "Cozy late-night gossip and tea sessions", reaction: "My favorite definition of comfort! ☕" },
          { text: "A lifetime of unbreakable sisterhood and support", reaction: "AMEN! Forever and always by your side! 🌸💖", isBestieAnswer: true },
          { text: "All of the above and so much more!", reaction: "YES! The sweetest forever bond ever written! 🌟" }
        ]
      },
      {
        question: "How lucky am I to have you as my sister and best friend? 🌹",
        options: [
          { text: "Luckiest person in the entire universe!", reaction: "TRULY! Blessed with the best didu! 🌸💖", isBestieAnswer: true },
          { text: "More than all the stars in the night sky", reaction: "Still not enough to measure it! ✨" },
          { text: "100 out of 10 with infinite bonus points", reaction: "Off the charts completely! 📈💕" },
          { text: "Words could never describe how grateful I am", reaction: "THE ABSOLUTE TRUTH! Beyond infinity! 💖🌸", isBestieAnswer: true }
        ]
      }
    ],
    resultScoreText: "Sister & Bestie Compatibility: 10000% 🌸💕",
    resultDescription: "True sister telepathy confirmed. Two souls blessed with the sweetest, unbreakable best friend bond forever!"
  },

  // 8. BEST SISTER & BESTIE HONORS CEREMONY
  award: {
    title: "THE OFFICIAL BEST SISTER & BESTIE AWARDS 🏆",
    recipient: "VRUSHTI DIDU",
    awardName: "WORLD'S BEST SISTER & CLOSEST PERSON",
    officialDate: "17 October 2026",
    categories: [
      { icon: "👑", title: "Prettiest & Sweetest Didu", desc: "Instantly brings sunshine, comfort, and warmth to every room." },
      { icon: "💖", title: "Certified Best Friend for Life", desc: "Always listening, always caring, and knowing me better than anyone." },
      { icon: "🛡️", title: "My Ultimate Safe Place & Guide", desc: "Always standing by my side through every little high and low." },
      { icon: "🌸", title: "Cutest Drama & Giggles Queen", desc: "Bringing non-stop laughter and joy to every sibling conversation." },
      { icon: "✨", title: "Most Precious Blessing in My Life", desc: "Having you as my sister is the greatest gift God ever gave me." }
    ]
  },

  // 9. SPIN THE BIRTHDAY WHEEL
  wheel: {
    title: "Spin Your Birthday Wheel 🎡",
    subtitle: "A sweet wheel for sisterly treats, hugs & perks!",
    options: [
      { id: "hug", label: "Warm Bear Hug", emoji: "🫂", color: "#FF8FB8", challenge: "A big, warm, loving bear hug from Zeel is officially owed right now! 💕" },
      { id: "treat", label: "Food Treat / Party", emoji: "🍰", color: "#FFB3D9", challenge: "Vrushti didu gets to pick her favorite meal or dessert treat paid by Zeel! 🍕😋" },
      { id: "hangout", label: "Shopping / Hangout", emoji: "🛍️", color: "#FF65A3", challenge: "A special day out with shopping and fun anywhere didu wants! 🎁" },
      { id: "compliment", label: "Sweet Sister Note", emoji: "💌", color: "#FF9EC7", challenge: "You are the sweetest, kindest, and most caring sister in the entire world! 🌸✨" },
      { id: "promise", label: "Pinky Promise", emoji: "🤞", color: "#F472B6", challenge: "I promise to always stand by your side, protect you, and cheer for you forever! 🔒" },
      { id: "wish", label: "Make a Secret Wish", emoji: "✨", color: "#EC4899", challenge: "Make a secret wish in your heart right now, and Zeel will try to fulfill it! 🌟" }
    ]
  },

  // 10. SURPRISE BOX & FINAL EMOTIONAL CLIMAX
  surpriseBox: {
    prompt: "One last special surprise... 🎁",
    hint: "Tap the box gently to unwrap the love"
  },

  finalMessage: {
    headline: "Happy 18th Birthday, Vrushti Didu! 🎂🌸💕",
    paragraphs: [
      "To my dearest Vrushti didu, my sister, my best friend, and my closest confidante in the world...",
      "As you step into 18, I wish you a year filled with boundless laughter, grand adventures, success in everything you pursue, and all the happiness your heart can hold.",
      "Thank you for being my constant, for listening to all my stories, and for being the sweetest sister and coolest best friend anyone could ever dream of.",
      "No matter how old we grow or where life takes us, you will always be my beloved didu and my favorite person. I will always be right here cheering for you!"
    ],
    toast: "To the best didu in the universe... Happy 18th Birthday! 🥂🌸💖",
    finalButtonText: "Sisterhood Forever & Always 💕"
  },

  // 11. THEME PALETTE
  theme: {
    primaryPink: "#FF8FB8",
    softBlush: "#FFE8EE",
    hotPink: "#FF4F91",
    deepRose: "#C2185B",
    softLavender: "#F3E8FF",
    darkPlum: "#2D1226"
  }
};

const STORAGE_KEY = "vrushti_didu_birthday_config_v1";

/**
 * Loads birthday configuration from localStorage, falling back to default
 */
export function loadBirthdayConfig(): BirthdayConfig {
  if (typeof window === "undefined") {
    return DEFAULT_BIRTHDAY_DATA;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_BIRTHDAY_DATA;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BIRTHDAY_DATA, ...parsed };
  } catch (err) {
    console.error("Failed to parse stored birthday config:", err);
    return DEFAULT_BIRTHDAY_DATA;
  }
}

/**
 * Saves configuration to localStorage and notifies listeners
 */
export function saveBirthdayConfig(config: BirthdayConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    // Update live memory reference
    Object.assign(BIRTHDAY_DATA, config);
    window.dispatchEvent(new CustomEvent("birthday_config_updated", { detail: config }));
  } catch (err) {
    console.error("Failed to save birthday config:", err);
  }
}

/**
 * Resets configuration back to defaults
 */
export function resetBirthdayConfig(): BirthdayConfig {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
      Object.assign(BIRTHDAY_DATA, DEFAULT_BIRTHDAY_DATA);
      window.dispatchEvent(new CustomEvent("birthday_config_updated", { detail: DEFAULT_BIRTHDAY_DATA }));
    } catch {}
  }
  return DEFAULT_BIRTHDAY_DATA;
}

// Live mutable reference for backward compatibility with canvasGenerators / static callers
export const BIRTHDAY_DATA: BirthdayConfig = {
  ...DEFAULT_BIRTHDAY_DATA,
  ...(typeof window !== "undefined" ? loadBirthdayConfig() : {})
};
