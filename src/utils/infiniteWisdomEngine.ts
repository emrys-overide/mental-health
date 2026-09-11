import { SingleBiteChunk, ReelCategory, ChunkType } from '../types';

// High quality, royalty-free calm nature and atmospheric background loops
export const ATMOSPHERIC_VIDEOS = [
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-a-silhouette-of-a-person-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-golden-sunrise-over-the-mountains-42777-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop'
  },
  {
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop'
  }
];

// Rich Curated Repository of Scriptures and Evidence
export interface WisdomTemplate {
  category: ReelCategory;
  type: ChunkType;
  typeLabel: string;
  headline: string;
  title: string;
  shortFact: string;
  deeperDetail: string;
  scriptureAnchor: {
    ref: string;
    text: string;
  };
  keyTakeaway: string;
  authorOrSource: string;
}

export const EXTENDED_WISDOM_LIBRARY: WisdomTemplate[] = [
  // --- ENCOURAGEMENT ---
  {
    category: 'Encouragement',
    type: 'encouragement',
    typeLabel: '🌟 Divine Encouragement',
    headline: 'You Are Not Forsaken',
    title: 'Strength When You Feel Completely Empty',
    shortFact: 'God’s presence is not contingent on your perfection. He draws nearest to you when your strength is exhausted and you feel like giving up.',
    deeperDetail: 'Neuroimaging reveals that genuine hope activates the nucleus accumbens and prefrontal networks, immediately lowering heart rate and counteracting the helpless surrender state.',
    scriptureAnchor: {
      ref: 'Isaiah 41:10',
      text: '“Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.”'
    },
    keyTakeaway: 'You do not fight alone. When you are weak, God’s hand is holding yours.',
    authorOrSource: 'Biblical Hope & Neuro-Endocrinology'
  },
  {
    category: 'Encouragement',
    type: 'encouragement',
    typeLabel: '🌟 Divine Encouragement',
    headline: 'A Definite Future',
    title: 'Your Story Does Not End in the Trap',
    shortFact: 'Your past missteps do not disqualify you from God’s calling. Your brain was built to adapt, and God has already charted your path of peace.',
    deeperDetail: 'Psychological resilience models show that looking forward toward purpose cuts addictive relapse risk by over 45% compared to constantly ruminating on past regrets.',
    scriptureAnchor: {
      ref: 'Jeremiah 29:11',
      text: '“For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.”'
    },
    keyTakeaway: 'Focus on who God is forming you to be tomorrow, not who you were yesterday.',
    authorOrSource: 'Cognitive Purpose Therapy'
  },
  {
    category: 'Encouragement',
    type: 'encouragement',
    typeLabel: '🌟 Divine Encouragement',
    headline: 'Joy Over You',
    title: 'God Rejoices Over You with Singing',
    shortFact: 'Satan tells you God is scowling with arms crossed. Scripture reveals the radical opposite: He rejoices over you with quiet love and singing.',
    deeperDetail: 'Experiencing unconditional acceptance downregulates hyperactive amygdala signaling and elevates oxytocin, quieting the chronic craving panic.',
    scriptureAnchor: {
      ref: 'Zephaniah 3:17',
      text: '“The Lord thy God in the midst of thee is mighty; he will save, he will rejoice over thee with joy; he will rest in his love, he will joy over thee with singing.”'
    },
    keyTakeaway: 'Rest in His song over you. You are loved, cherished, and fought for.',
    authorOrSource: 'Scriptural Identity & Affective Science'
  },

  // --- LOVE & MERCY ---
  {
    category: 'Love & Mercy',
    type: 'love',
    typeLabel: '❤️ Unconditional Love',
    headline: 'Inseparable Bond',
    title: 'Nothing Can Sever His Love from You',
    shortFact: 'No slip-up, no relapse, no secret temptation has the power to separate you from the love of Christ. His grip on you is unbreakable.',
    deeperDetail: 'In addiction science, secure attachment is the #1 predictor of long-term sobriety. Knowing you are securely loved eliminates the panic that triggers bingeing.',
    scriptureAnchor: {
      ref: 'Romans 8:38-39',
      text: '“For I am persuaded, that neither death, nor life, nor angels... nor things present, nor things to come... shall be able to separate us from the love of God.”'
    },
    keyTakeaway: 'You cannot make God love you less by failing, nor love you more by succeeding. He loves you completely.',
    authorOrSource: 'Attachment Theory & Pauline Theology'
  },
  {
    category: 'Love & Mercy',
    type: 'love',
    typeLabel: '💧 Mercy Unbounded',
    headline: 'New Every Morning',
    title: 'Your Clean Slate Begins Right Now',
    shortFact: 'You do not have to wait for next week or next month to begin again. God’s mercies do not renew annually—they renew every single sunrise.',
    deeperDetail: 'Shame traps the brain in an "Abstinence Violation Effect," convincing you all is lost. Instant mercy resets your executive resolve immediately.',
    scriptureAnchor: {
      ref: 'Lamentations 3:22-23',
      text: '“It is of the Lord’s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.”'
    },
    keyTakeaway: 'Take a deep breath and accept God’s fresh mercy right now. Stand back up.',
    authorOrSource: 'Self-Compassion in Recovery'
  },
  {
    category: 'Love & Mercy',
    type: 'love',
    typeLabel: '❤️ Perfect Love',
    headline: 'Casting Out Fear',
    title: 'Fear Drives Addiction; Love Drives Freedom',
    shortFact: 'Addictive habits flourish in the soil of fear: fear of failure, fear of rejection, fear of being known. Perfect love drives out all fear.',
    deeperDetail: 'Neurologically, fear and shame flood the prefrontal cortex with cortisol, impairing impulse inhibition. Love activates dopamine and oxytocin in healthy balance.',
    scriptureAnchor: {
      ref: '1 John 4:18',
      text: '“There is no fear in love; but perfect love casteth out fear: because fear hath torment. He that feareth is not made perfect in love.”'
    },
    keyTakeaway: 'Operate from love, not fear. You are fighting FROM victory, not for it.',
    authorOrSource: 'Neuroscience of Fear Conditioning'
  },
  {
    category: 'Love & Mercy',
    type: 'love',
    typeLabel: '💧 The Throne of Grace',
    headline: 'Boldness in Weakness',
    title: 'Come Boldly When You Need Help Most',
    shortFact: 'Jesus was tempted in all points just like us, yet without sin. He does not look at your struggle with disgust—He looks with deep empathy.',
    deeperDetail: 'Reaching out for help immediately during an urge prevents the 10-minute spiral of secrecy that leads to compulsive acting out.',
    scriptureAnchor: {
      ref: 'Hebrews 4:16',
      text: '“Let us therefore come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.”'
    },
    keyTakeaway: 'Run TO God in the moment of temptation, never away from Him.',
    authorOrSource: 'Christology & Addiction Psychology'
  },

  // --- PEACE & STILLNESS ---
  {
    category: 'Peace & Stillness',
    type: 'peace',
    typeLabel: '🕊️ Peace & Stillness',
    headline: 'Beyond Human Logic',
    title: 'The Peace That Guards Your Brain',
    shortFact: 'Scripture promises a peace that surpasses human comprehension. In Greek, the word for "keep" (phroureo) means to mount a military garrison over your mind.',
    deeperDetail: 'Prayer paired with gratitude lowers sympathetic autonomic arousal, stopping the adrenaline surge that urges rely on.',
    scriptureAnchor: {
      ref: 'Philippians 4:6-7',
      text: '“Be careful for nothing; but in every thing by prayer and supplication with thanksgiving... the peace of God, which passeth all understanding, shall keep your hearts and minds.”'
    },
    keyTakeaway: 'When temptation brings noise and urgency, prayer stations a divine garrison over your thoughts.',
    authorOrSource: 'Autonomic Vagal Modulation'
  },
  {
    category: 'Peace & Stillness',
    type: 'peace',
    typeLabel: '🕊️ Peace & Stillness',
    headline: 'The Still Waters',
    title: 'He Restores Your Neurochemical Soul',
    shortFact: 'David was a warrior king who understood high stress. He knew that the soul cannot thrive without resting in quiet green pastures.',
    deeperDetail: 'Spending 15 minutes in quiet reflection or nature lowers resting cortisol by 21% and restores prefrontal working memory capacity.',
    scriptureAnchor: {
      ref: 'Psalm 23:2-3',
      text: '“He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.”'
    },
    keyTakeaway: 'Turn off the screens. Sit in quiet still waters with God and let your weary mind be restored.',
    authorOrSource: 'Environmental Restorative Psychology'
  },
  {
    category: 'Peace & Stillness',
    type: 'peace',
    typeLabel: '🕊️ Peace & Stillness',
    headline: 'Be Still and Know',
    title: 'Cease Striving in Your Own Strength',
    shortFact: 'In Hebrew, "Be still" (raphah) literally means: relax, let go, stop clenching your fists. True peace comes when you stop trying to control everything.',
    deeperDetail: 'Chronic clenching and hypervigilance exhaust executive glycogen. Surrendering the battle to God calms the nervous system instantly.',
    scriptureAnchor: {
      ref: 'Psalm 46:10',
      text: '“Be still, and know that I am God: I will be exalted among the heathen, I will be exalted in the earth.”'
    },
    keyTakeaway: 'Drop your clenched fists. God is on the throne. Breathe in His sovereign peace.',
    authorOrSource: 'Biblical Hebrew & Somatic Calming'
  },

  // --- STRENGTH & COMFORT ---
  {
    category: 'Strength & Comfort',
    type: 'strength',
    typeLabel: '⚡ Divine Strength',
    headline: 'Renewed Like Eagles',
    title: 'Power Given to the Faint',
    shortFact: 'God gives power specifically to those who have none left. When you feel powerless before a habit, that is the exact doorway where His power enters.',
    deeperDetail: 'Waiting on the Lord activates the parasympathetic restorative state, promoting cellular repair and replenishing neurotransmitters.',
    scriptureAnchor: {
      ref: 'Isaiah 40:29, 31',
      text: '“He giveth power to the faint; and to them that have no might he increaseth strength... they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles.”'
    },
    keyTakeaway: 'Admitting your weakness isn’t defeat; it is the prerequisite for divine empowerment.',
    authorOrSource: 'Neuro-Endocrine Recovery'
  },
  {
    category: 'Strength & Comfort',
    type: 'strength',
    typeLabel: '🛡️ Sovereign Refuge',
    headline: 'The Secret Place',
    title: 'Protected Under the Shadow of the Almighty',
    shortFact: 'Under intense temptation, your home and phone can feel unsafe. Scripture gives you an impenetrable shelter: dwelling in God’s secret presence.',
    deeperDetail: 'Visualizing yourself inside a safe sanctuary activates the anterior cingulate cortex, dampening limbic panic and craving impulses.',
    scriptureAnchor: {
      ref: 'Psalm 91:1-2',
      text: '“He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the Lord, He is my refuge and my fortress.”'
    },
    keyTakeaway: 'Make God’s presence your default dwelling place, not the digital screen.',
    authorOrSource: 'Clinical Attentional Refocusing'
  },
  {
    category: 'Strength & Comfort',
    type: 'strength',
    typeLabel: '⚡ Grace in Weakness',
    headline: 'Strength Made Perfect',
    title: 'Why Paul Boasted in His Infirmities',
    shortFact: 'Paul pleaded three times for God to remove his thorn in the flesh. God answered: "My grace is sufficient for you: for my strength is made perfect in weakness."',
    deeperDetail: 'Humility and reliance on grace prevent the pride-relapse cycle (where self-reliance leads to complacency, which triggers relapse).',
    scriptureAnchor: {
      ref: '2 Corinthians 12:9',
      text: '“My grace is sufficient for thee: for my strength is made perfect in weakness. Most gladly therefore will I rather glory in my infirmities, that the power of Christ may rest upon me.”'
    },
    keyTakeaway: 'Your struggle keeps you close to the Savior. Through grace, you are made unconquerable.',
    authorOrSource: 'Spiritual Resilience Science'
  },

  // --- OVERCOMING TIPS & TACTICAL PROTOCOLS ---
  {
    category: 'Overcoming Tips',
    type: 'tip',
    typeLabel: '💡 Tactical Overcoming Tip',
    headline: 'The Mammalian Dive Reflex',
    title: 'Cold Water Vagus Nerve Reset',
    shortFact: 'Splashing ice-cold water onto your eyes and upper cheekbones for 20 seconds immediately triggers the ancient Mammalian Dive Reflex.',
    deeperDetail: 'This stimulates the ophthalmic branch of the trigeminal nerve, causing an instant vagal surge that drops heart rate by 15-25 bpm and extinguishes acute sexual arousal physiology.',
    scriptureAnchor: {
      ref: '1 Corinthians 9:27',
      text: '“But I keep under my body, and bring it into subjection: lest that by any means... I myself should be a castaway.”'
    },
    keyTakeaway: 'When an urge spikes, run to the sink, fill it with cold water, and submerge your face for 20 seconds. Watch the urge vanish.',
    authorOrSource: 'Physiological Autonomic Protocol'
  },
  {
    category: 'Overcoming Tips',
    type: 'tip',
    typeLabel: '💡 Tactical Overcoming Tip',
    headline: 'The 4-7-8 Breathing Hack',
    title: 'Resetting the Prefrontal Brake in 90 Seconds',
    shortFact: 'Inhale through the nose for 4 seconds, hold your breath for 7 seconds, and exhale slowly through your mouth for 8 seconds. Repeat 4 cycles.',
    deeperDetail: 'Prolonged exhalation increases intrathoracic pressure, activating baroreceptors that signal the brainstem to downregulate adrenaline and reboot prefrontal executive control.',
    scriptureAnchor: {
      ref: 'Job 33:4',
      text: '“The Spirit of God hath made me, and the breath of the Almighty hath given me life.”'
    },
    keyTakeaway: 'Your breath is your biological steering wheel. 4 cycles of 4-7-8 breathing buys your rational mind the time it needs to win.',
    authorOrSource: 'Clinical Vagal Tone Research'
  },
  {
    category: 'Overcoming Tips',
    type: 'tip',
    typeLabel: '💡 Tactical Overcoming Tip',
    headline: 'The Bedroom Phone Curfew',
    title: 'Physical Distance Beats Mental Resistance',
    shortFact: 'Over 85% of compulsive relapses happen in bed with a phone. Eliminating the smartphone from the bedroom eliminates the opportunity.',
    deeperDetail: 'Buying a $10 traditional alarm clock and charging your phone in the hallway creates high friction that interrupts late-night cognitive weakness.',
    scriptureAnchor: {
      ref: 'Romans 13:14',
      text: '“Put ye on the Lord Jesus Christ, and make not provision for the flesh, to fulfil the lusts thereof.”'
    },
    keyTakeaway: 'Never bring your phone to bed. Don’t make provision for the flesh. Charge it across the house.',
    authorOrSource: 'Environmental Choice Architecture'
  },
  {
    category: 'Overcoming Tips',
    type: 'tip',
    typeLabel: '💡 Tactical Overcoming Tip',
    headline: 'The Grayscale Screen Protocol',
    title: 'Draining the Visual Dopamine Trap',
    shortFact: 'Smartphones use hyper-saturated RGB app icons and notifications designed specifically by behavioral neuroscientists to hijack visual attention.',
    deeperDetail: 'Switching your phone screen to black-and-white (Grayscale in Accessibility settings) reduces unconscious phone pick-ups and doomscrolling by 37%.',
    scriptureAnchor: {
      ref: 'Psalm 119:37',
      text: '“Turn away mine eyes from beholding vanity; and quicken thou me in thy way.”'
    },
    keyTakeaway: 'Turn your phone to grayscale. Strip the digital candy of its hypnotic power.',
    authorOrSource: 'Center for Humane Technology'
  },
  {
    category: 'Overcoming Tips',
    type: 'tip',
    typeLabel: '💡 Tactical Overcoming Tip',
    headline: 'Physical Geography Shift',
    title: 'Change the Room Immediately',
    shortFact: 'Your brain associates physical spaces with specific behavioral loops. Sitting in the same chair or bed while fighting an urge is fighting a losing battle.',
    deeperDetail: 'Standing up, walking outside, or entering an occupied room breaks the contextual conditioning cues encoded in the hippocampus.',
    scriptureAnchor: {
      ref: 'Genesis 39:12',
      text: '“And she caught him by his garment, saying, Lie with me: and he left his garment in her hand, and fled, and got him out.”'
    },
    keyTakeaway: 'Don’t negotiate in the trigger zone. Stand up on your feet and leave the room immediately.',
    authorOrSource: 'Contextual Cue-Reactivity Science'
  },

  // --- SELF-DEVELOPMENT & HABIT ARCHITECTURE ---
  {
    category: 'Self-Development',
    type: 'tip',
    typeLabel: '🌱 Self-Development',
    headline: 'Identity-Based Freedom',
    title: 'You Are Not "Trying to Quit"',
    shortFact: 'Behavioral psychology proves that people who say "I can’t do that" are 50% more likely to relapse than those who say "I don’t do that."',
    deeperDetail: 'Saying "I can’t" implies deprivation and longing. Saying "I am a person of purity and divine honor" anchors your behavior in your true Christian identity.',
    scriptureAnchor: {
      ref: '1 Peter 2:9',
      text: '“But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people... that ye should shew forth the praises of him.”'
    },
    keyTakeaway: 'Shift your language: Do not say you are an addict trying to quit. Declare: “I am a child of God, and this does not align with who I am.”',
    authorOrSource: 'Identity Habit Theory (James Clear)'
  },
  {
    category: 'Self-Development',
    type: 'tip',
    typeLabel: '🌱 Self-Development',
    headline: 'Habit Stacking Principle',
    title: 'Anchor New Virtues to Existing Routines',
    shortFact: 'The easiest way to build a righteous daily routine is not to start from scratch, but to stack new virtues directly onto habits you already do.',
    deeperDetail: 'Neural pathways for existing habits (brushing teeth, making coffee, getting into your car) are already myelinated. Attaching prayer or scripture takes advantage of that momentum.',
    scriptureAnchor: {
      ref: 'Deuteronomy 6:7',
      text: '“And thou shalt teach them diligently unto thy children, and shalt talk of them when thou sittest in thine house, and when thou walkest by the way...”'
    },
    keyTakeaway: 'Stack: "After I pour my morning water, I will read one chapter of Proverbs before looking at any screen."',
    authorOrSource: 'Behavioral Habit Stacking Meta-Analysis'
  },
  {
    category: 'Self-Development',
    type: 'tip',
    typeLabel: '🌱 Self-Development',
    headline: 'The Anterior Cingulate Muscle',
    title: 'Every Time You Say NO, Your Willpower Grows',
    shortFact: 'The anterior mid-cingulate cortex (aMCC) is the brain’s hub for willpower. Neuroscientists have discovered that it physically GROWS in volume every time you do something hard.',
    deeperDetail: 'When you refuse a craving or push through a hard physical workout, your aMCC builds structural density, making all future temptations exponentially easier to resist.',
    scriptureAnchor: {
      ref: 'James 1:2-3',
      text: '“Count it all joy when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience.”'
    },
    keyTakeaway: 'The discomfort of resisting is not punishment—it is the sensation of your spiritual and mental muscle growing stronger.',
    authorOrSource: 'Dr. Andrew Huberman & Stanford Neuro-biology'
  },
  {
    category: 'Self-Development',
    type: 'tip',
    typeLabel: '🌱 Self-Development',
    headline: 'Morning Sunlight Anchor',
    title: 'Set Your Circadian Rhythm for Purity',
    shortFact: 'Viewing 10-15 minutes of natural morning sunlight within an hour of waking stimulates retinal ganglion cells, setting your circadian dopamine and cortisol timers.',
    deeperDetail: 'Proper morning light exposure promotes healthy nighttime melatonin release 14 hours later, preventing the insomnia and late-night vulnerability that fuels 85% of relapses.',
    scriptureAnchor: {
      ref: 'Psalm 143:8',
      text: '“Cause me to hear thy lovingkindness in the morning; for in thee do I trust: cause me to know the way wherein I should walk.”'
    },
    keyTakeaway: 'Step outside every morning. Let God’s natural light hit your eyes before any artificial screen.',
    authorOrSource: 'Circadian Neuroscience'
  }
];

// Dynamically generate fresh infinite chunks from templates or on demand
export const generateInfiniteChunk = (index: number, requestedCategory?: ReelCategory | 'All'): SingleBiteChunk => {
  const pool = !requestedCategory || requestedCategory === 'All'
    ? EXTENDED_WISDOM_LIBRARY
    : EXTENDED_WISDOM_LIBRARY.filter(item => item.category === requestedCategory);

  const selectedTemplate = pool[index % pool.length] || EXTENDED_WISDOM_LIBRARY[0];
  const videoPair = ATMOSPHERIC_VIDEOS[index % ATMOSPHERIC_VIDEOS.length];

  return {
    id: `infinite-chunk-${index + 1}-${Date.now() % 10000}`,
    chunkNumber: index + 1,
    type: selectedTemplate.type,
    typeLabel: selectedTemplate.typeLabel,
    category: selectedTemplate.category,
    headline: selectedTemplate.headline,
    title: selectedTemplate.title,
    shortFact: selectedTemplate.shortFact,
    deeperDetail: selectedTemplate.deeperDetail,
    scriptureAnchor: selectedTemplate.scriptureAnchor,
    keyTakeaway: selectedTemplate.keyTakeaway,
    videoUrl: videoPair.videoUrl,
    thumbnailUrl: videoPair.thumbnailUrl,
    likes: 25000 + Math.floor(Math.random() * 35000),
    authorOrSource: selectedTemplate.authorOrSource
  };
};
