import { SingleBiteChunk, VideoReel } from '../types';
import { EXTENDED_WISDOM_LIBRARY, ATMOSPHERIC_VIDEOS } from '../utils/infiniteWisdomEngine';

const INITIAL_CHUNKS: SingleBiteChunk[] = [
  {
    id: 'chunk-1',
    chunkNumber: 1,
    type: 'brain',
    typeLabel: '🧠 Brain Mechanism',
    category: 'Brain & Dopamine',
    headline: 'Dopamine Exhaustion',
    title: 'How It Numbs Your Brain',
    shortFact: 'Pornography floods your reward center with dopamine surges up to 200% above normal baseline. To protect itself from overload, your brain shuts down and removes D2 dopamine receptors.',
    deeperDetail: 'This downregulation causes anhedonia: everyday joys like food, nature, hobbies, and real conversations suddenly feel flat and boring.',
    scriptureAnchor: {
      ref: 'Romans 12:2',
      text: '“Be not conformed to this world, but be ye transformed by the renewing of your mind.”'
    },
    keyTakeaway: 'Your brain isn’t broken—it is adapting. As you abstain, receptors regrow within 60 to 90 days.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-a-silhouette-of-a-person-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    likes: 34200,
    authorOrSource: 'Neurobiology of Addiction'
  },
  {
    id: 'chunk-2',
    chunkNumber: 2,
    type: 'body',
    typeLabel: '⚠️ Body & Health',
    category: 'Body & Health',
    headline: 'Autonomic Burnout',
    title: 'The Physical Strain on Your Nervous System',
    shortFact: 'Compulsive screen arousal keeps your sympathetic nervous system stuck in hyper-arousal. This chronically spikes cortisol and suppresses nocturnal melatonin.',
    deeperDetail: 'Over time, your body suffers from disrupted REM sleep, morning fatigue, chronic brain fog, and psychogenic desensitization in real relationships.',
    scriptureAnchor: {
      ref: '1 Corinthians 6:19-20',
      text: '“What? Know ye not that your body is the temple of the Holy Ghost... therefore glorify God in your body.”'
    },
    keyTakeaway: 'Your body was designed for sacred honor and deep peace, never for high-voltage digital depletion.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    likes: 28900,
    authorOrSource: 'Clinical Autonomic Research'
  },
  {
    id: 'chunk-3',
    chunkNumber: 3,
    type: 'cross-addiction',
    typeLabel: '🔗 Addiction Link',
    category: 'Cross-Addictions',
    headline: 'The Common Currency',
    title: 'Why All Compulsive Habits Feed Each Other',
    shortFact: 'Whether it is social media doomscrolling, gambling, nicotine, or adult sites, your brain uses only ONE reward chemical: dopamine.',
    deeperDetail: 'Frequent spikes trigger a molecular switch called DeltaFosB. This proteins sensitizes craving pathways across ALL addictions simultaneously.',
    scriptureAnchor: {
      ref: 'Galatians 5:1',
      text: '“Stand fast therefore in the liberty wherewith Christ hath made us free, and be not entangled again with the yoke of bondage.”'
    },
    keyTakeaway: 'Taming phone doomscrolling directly reduces pornography cravings because both drink from the same compulsive well.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop',
    likes: 31500,
    authorOrSource: 'Addiction Medicine & Psychology'
  },
  {
    id: 'chunk-4',
    chunkNumber: 4,
    type: 'urge',
    typeLabel: '🌊 Urge Mastery',
    category: 'Urge Mastery',
    headline: 'The 60-Second Wave',
    title: 'An Urge Cannot Stay at Peak Forever',
    shortFact: 'Autonomic physiology proves that a neurological craving wave peaks in about 90 to 180 seconds, then naturally collapses if you don’t feed it new imagery.',
    deeperDetail: 'You do not need to fight the urge with clenched fists. Merely observe it like an ocean wave passing beneath a boat without acting.',
    scriptureAnchor: {
      ref: '1 Corinthians 10:13',
      text: '“God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape.”'
    },
    keyTakeaway: 'Every urge you surf without obeying rewires your brain and weakens that cue’s future grip forever.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop',
    likes: 42100,
    authorOrSource: 'ACT Urge Surfing Protocol'
  },
  {
    id: 'chunk-5',
    chunkNumber: 5,
    type: 'stat',
    typeLabel: '📊 Clinical Reality',
    category: 'Stats & Science',
    headline: 'Tolerance Signatures',
    title: 'The 80% Neurochemical Overlap',
    shortFact: 'fMRI brain scans show an 80% overlap between heavy compulsive digital users and the neurochemical tolerance signatures found in chemical substance dependencies.',
    deeperDetail: 'The user stops consuming to feel intense pleasure, and begins consuming purely to relieve the unbearable withdrawal agitation created by the habit.',
    scriptureAnchor: {
      ref: 'Proverbs 27:20',
      text: '“Hell and destruction are never full; so the eyes of man are never satisfied.”'
    },
    keyTakeaway: 'The digital screen is bottomless by design. True satisfaction only comes from living purpose and God’s presence.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-golden-sunrise-over-the-mountains-42777-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop',
    likes: 38700,
    authorOrSource: 'fMRI Brain Imaging Research'
  },
  {
    id: 'chunk-6',
    chunkNumber: 6,
    type: 'truth',
    typeLabel: '💡 The Grace Antidote',
    category: 'Stats & Science',
    headline: 'Breaking The Cycle',
    title: 'Why Shame Feeds Relapse, Not Recovery',
    shortFact: 'Intense self-loathing activates the brain’s physical pain matrix, dumping cortisol into your blood. To escape that emotional agony, the brain seeks instant digital numbing.',
    deeperDetail: 'This is the "Abstinence Violation Effect": shame tricks you into believing you have failed completely, driving you to binge even deeper.',
    scriptureAnchor: {
      ref: 'Romans 8:1',
      text: '“There is therefore now no condemnation to them which are in Christ Jesus.”'
    },
    keyTakeaway: 'Conviction leads you back to a loving Father; shame locks you in solitary confinement. Grace breaks the compulsion.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
    likes: 47600,
    authorOrSource: 'Neurobiology of Self-Compassion'
  },
  {
    id: 'chunk-7',
    chunkNumber: 7,
    type: 'scripture',
    typeLabel: '⚔️ Scripture Weapon',
    category: 'Combating Scriptures',
    headline: 'Attentional Gating',
    title: 'Guarding The 150-Millisecond Eye Gate',
    shortFact: 'Visual triggers activate your limbic reward pathway within 150 milliseconds—faster than conscious executive control can deliberate.',
    deeperDetail: 'King Solomon understood this long before brain scanners: what enters your eye gate directly poisons or preserves the fountain of your inner life.',
    scriptureAnchor: {
      ref: 'Proverbs 4:23',
      text: '“Keep thy heart with all diligence; for out of it are the issues of life.”'
    },
    keyTakeaway: 'Do not debate the image once it enters your field of view. Practice "bouncing the eyes" up and away immediately.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-a-silhouette-of-a-person-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    likes: 36400,
    authorOrSource: 'Visual Neuroscience & Proverbs'
  },
  {
    id: 'chunk-8',
    chunkNumber: 8,
    type: 'brain',
    typeLabel: '🧠 Brain Mechanism',
    category: 'Brain & Dopamine',
    headline: 'The Escalation Trap',
    title: 'The Coolidge Effect & Why Novelty Escalates',
    shortFact: 'Online pornography exploits the "Coolidge Effect": the brain is hardwired to react with dopamine surges to novelty. Infinite tabs trigger artificial escalation.',
    deeperDetail: 'Users soon find themselves searching for extreme, bizarre content they never found attractive before, purely because baseline novelty burned out.',
    scriptureAnchor: {
      ref: 'Ecclesiastes 1:8',
      text: '“The eye is not satisfied with seeing, nor the ear filled with hearing.”'
    },
    keyTakeaway: 'You cannot satisfy an appetite that was engineered to be insatiable. Starve the novelty search to restore your natural peace.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    likes: 33100,
    authorOrSource: 'Evolutionary Biology'
  },
  {
    id: 'chunk-9',
    chunkNumber: 9,
    type: 'scripture',
    typeLabel: '⚔️ Scripture Weapon',
    category: 'Combating Scriptures',
    headline: 'Tactical Escape',
    title: 'Why You Must Flee Rather Than Argue',
    shortFact: 'Scripture tells us to resist the devil, but for sexual temptation the explicit instruction is: FLEE. In cognitive psychology, stimulus removal beats mental willpower every time.',
    deeperDetail: 'Standing up, walking out of the room, and changing your physical environment disengages the cue-reactivity loop in your brain’s salience network.',
    scriptureAnchor: {
      ref: '2 Timothy 2:22',
      text: '“Flee also youthful lusts: but follow righteousness, faith, charity, peace, with them that call on the Lord.”'
    },
    keyTakeaway: 'Joseph did not stay in Potiphar’s house to debate with temptation—he sprinted outside. Your feet are your best prefrontal weapon.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop',
    likes: 39500,
    authorOrSource: 'Behavioral Stimulus Control'
  },
  {
    id: 'chunk-10',
    chunkNumber: 10,
    type: 'urge',
    typeLabel: '🌊 Urge Mastery',
    category: 'Urge Mastery',
    headline: 'The HALT Diagnostic',
    title: 'Pornography Is Almost Never About Sex',
    shortFact: 'Compulsive screen habits are primarily digital painkillers. We reach for them when we feel Hungry, Angry, Lonely, or Tired (HALT).',
    deeperDetail: 'The urge is a disguised cry for genuine comfort, deep rest, or human connection. Naming the real root emotion disarms the false substitute.',
    scriptureAnchor: {
      ref: 'Psalm 42:1-2',
      text: '“As the hart panteth after the water brooks, so panteth my soul after thee, O God.”'
    },
    keyTakeaway: 'When temptation strikes, ask: Am I Hungry, Angry, Lonely, or Tired? Address the real physical or emotional need directly.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-golden-sunrise-over-the-mountains-42777-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop',
    likes: 41200,
    authorOrSource: 'Clinical CBT Protocol'
  },
  {
    id: 'chunk-11',
    chunkNumber: 11,
    type: 'stat',
    typeLabel: '📊 Clinical Reality',
    category: 'Stats & Science',
    headline: 'Midnight Vulnerability',
    title: 'Why 85% of Relapses Occur After 10 PM',
    shortFact: 'Studies reveal that 85% of compulsive relapses happen between 10:00 PM and 2:00 AM, when prefrontal glucose and executive energy are deeply depleted.',
    deeperDetail: 'Late at night, your brain’s steering wheel and brake go offline while the limbic craving engine remains wide awake in the dark.',
    scriptureAnchor: {
      ref: 'Romans 13:12',
      text: '“The night is far spent, the day is at hand: let us therefore cast off the works of darkness, and let us put on the armour of light.”'
    },
    keyTakeaway: 'Charge your phone in the living room or hallway. Eliminating screens in bed prevents the majority of potential lapses.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop',
    likes: 35800,
    authorOrSource: 'Circadian Neurochemistry'
  },
  {
    id: 'chunk-12',
    chunkNumber: 12,
    type: 'cross-addiction',
    typeLabel: '🔗 Addiction Link',
    category: 'Cross-Addictions',
    headline: 'The Skinner Box Trap',
    title: 'Why Infinite Feeds Hook You Like Slot Machines',
    shortFact: 'TikTok feeds, Instagram reels, and adult tube sites all utilize the same B.F. Skinner variable-ratio reward schedule as casino slot machines.',
    deeperDetail: 'Because you never know which swipe holds the reward, your brain releases anticipation dopamine constantly, trapping you in a hypnotic loop.',
    scriptureAnchor: {
      ref: '1 Corinthians 6:12',
      text: '“All things are lawful unto me, but all things are not expedient... I will not be brought under the power of any.”'
    },
    keyTakeaway: 'Recognize the algorithm for what it is: a programmed distraction engine designed to harvest your sacred attention.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
    likes: 29400,
    authorOrSource: 'Behavioral Psychology'
  },
  {
    id: 'chunk-13',
    chunkNumber: 13,
    type: 'scripture',
    typeLabel: '⚔️ Scripture Weapon',
    category: 'Combating Scriptures',
    headline: 'Attentional Displacement',
    title: 'The White Bear Paradox & The Power of Truth',
    shortFact: 'Trying not to think of something forces working memory to keep checking on it. Scripture reveals the cognitive cure: displacement by positive truth.',
    deeperDetail: 'You cannot fight darkness with a broom; you extinguish it by turning on the light. Saturating your mind with noble truth pushes out temptation.',
    scriptureAnchor: {
      ref: 'Philippians 4:8',
      text: '“Whatsoever things are true, whatsoever things are honest, whatsoever things are pure... think on these things.”'
    },
    keyTakeaway: 'Don’t just try to stop bad thoughts. Actively direct your attention toward an uplifting, honorable mission.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-with-a-silhouette-of-a-person-41551-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop',
    likes: 44100,
    authorOrSource: 'Cognitive Displacement Research'
  },
  {
    id: 'chunk-14',
    chunkNumber: 14,
    type: 'brain',
    typeLabel: '🧠 Brain Mechanism',
    category: 'Brain & Dopamine',
    headline: 'Hypofrontality',
    title: 'Why It Feels Like You Lose Control in the Moment',
    shortFact: 'Under intense sexual arousal cues, blood flow decreases in the dorsolateral prefrontal cortex—a state called temporary hypofrontality.',
    deeperDetail: 'This is why your rational long-term goals feel so far away during high temptation. The brain’s executive steering wheel has temporarily dimmed.',
    scriptureAnchor: {
      ref: 'Ephesians 6:10-11',
      text: '“Be strong in the Lord, and in the power of his might. Put on the whole armour of God.”'
    },
    keyTakeaway: 'Build automatic guardrails when you are calm so you don’t rely on a compromised steering wheel in the storm.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
    likes: 37800,
    authorOrSource: 'Clinical Neuro-imaging'
  },
  {
    id: 'chunk-15',
    chunkNumber: 15,
    type: 'body',
    typeLabel: '⚠️ Body & Health',
    category: 'Body & Health',
    headline: 'Relational Vitality',
    title: 'Restoring Natural Eye Contact & Confidence',
    shortFact: 'Heavy consumption conditions the brain to visual pixels rather than real human faces, causing unconscious gaze avoidance and social anxiety.',
    deeperDetail: 'Within 30 to 45 days of screen detox, oxytocin signaling and natural social confidence rebound, restoring warmth to everyday eye-to-eye interactions.',
    scriptureAnchor: {
      ref: 'Matthew 6:22',
      text: '“The light of the body is the eye: if therefore thine eye be single, thy whole body shall be full of light.”'
    },
    keyTakeaway: 'Clear eyes bring an unclouded soul. You were created to connect with real human beings in sacred truth.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop',
    likes: 40300,
    authorOrSource: 'Relational Psychology'
  },
  {
    id: 'chunk-16',
    chunkNumber: 16,
    type: 'truth',
    typeLabel: '💡 The Grace Antidote',
    category: 'Combating Scriptures',
    headline: 'Abiding in the Spirit',
    title: 'Self-Control Is a Fruit, Not White-Knuckle Straining',
    shortFact: 'Many fail because they rely on clenched-teeth human willpower. Biblical self-control is the natural FRUIT of abiding in the Holy Spirit.',
    deeperDetail: 'Branches don’t strain to produce fruit—they simply stay connected to the vine. When you stay in prayer and God’s presence, self-control grows naturally.',
    scriptureAnchor: {
      ref: 'Galatians 5:16, 22-23',
      text: '“Walk in the Spirit, and ye shall not fulfil the lust of the flesh. But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, meekness, temperance.”'
    },
    keyTakeaway: 'Don’t just try to quit. Fall deeply in love with Christ and His calling for your life.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-golden-sunrise-over-the-mountains-42777-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800&auto=format&fit=crop',
    likes: 51200,
    authorOrSource: 'Biblical Psychology'
  },
  {
    id: 'chunk-17',
    chunkNumber: 17,
    type: 'urge',
    typeLabel: '🌊 Urge Mastery',
    category: 'Urge Mastery',
    headline: 'The 20-Second Friction Rule',
    title: 'Environmental Friction Beats Raw Willpower',
    shortFact: 'Adding just 20 seconds of physical friction (app blockers, passcode locks, leaving phones in another room) eliminates up to 80% of impulsive acting-out.',
    deeperDetail: 'Your prefrontal cortex needs only a brief pause to catch up with an impulsive limbic reflex. Physical boundaries provide that lifesaving buffer.',
    scriptureAnchor: {
      ref: 'Proverbs 22:3',
      text: '“A prudent man foreseeth the evil, and hideth himself: but the simple pass on, and are punished.”'
    },
    keyTakeaway: 'Never rely on will alone when you can design an environment that protects you automatically.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop',
    likes: 38900,
    authorOrSource: 'Behavioral Economics'
  },
  {
    id: 'chunk-18',
    chunkNumber: 18,
    type: 'brain',
    typeLabel: '🧠 Brain Mechanism',
    category: 'Brain & Dopamine',
    headline: 'Neuroplastic Restoration',
    title: 'Your Brain Has an Extraordinary Capacity to Rewire',
    shortFact: 'Neuroplasticity proves that the neural pathways you stop traveling naturally atrophy, while wholesome, healthy new pathways strengthen.',
    deeperDetail: 'Each time you say NO to a compulsive visual cue, the synaptic wiring of that habit shrinks by micro-fractions. Within 90 days, true baseline balance returns.',
    scriptureAnchor: {
      ref: '2 Corinthians 5:17',
      text: '“Therefore if any man be in Christ, he is a new creature: old things are passed away; behold, all things are become new.”'
    },
    keyTakeaway: 'You are not doomed to your past wiring. God designed your brain to be renewed every single day.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop',
    likes: 49400,
    authorOrSource: 'Neuroplasticity & Faith'
  }
];

const EXTENDED_CHUNKS: SingleBiteChunk[] = EXTENDED_WISDOM_LIBRARY.map((item, idx) => {
  const vid = ATMOSPHERIC_VIDEOS[idx % ATMOSPHERIC_VIDEOS.length];
  return {
    id: `chunk-ext-${idx + 1}`,
    chunkNumber: 19 + idx,
    type: item.type,
    typeLabel: item.typeLabel,
    category: item.category,
    headline: item.headline,
    title: item.title,
    shortFact: item.shortFact,
    deeperDetail: item.deeperDetail,
    scriptureAnchor: item.scriptureAnchor,
    keyTakeaway: item.keyTakeaway,
    videoUrl: vid.videoUrl,
    thumbnailUrl: vid.thumbnailUrl,
    likes: 38000 + ((idx * 1650) % 20000),
    authorOrSource: item.authorOrSource
  };
});

export const BITE_CHUNKS: SingleBiteChunk[] = [...INITIAL_CHUNKS, ...EXTENDED_CHUNKS];

// Backward-compatibility export for existing components if referenced
export const REELS_DATA: VideoReel[] = BITE_CHUNKS.map((chunk) => ({
  id: chunk.id,
  title: chunk.title,
  headline: chunk.headline,
  category: chunk.category,
  videoUrl: chunk.videoUrl,
  thumbnailUrl: chunk.thumbnailUrl,
  speakerOrAuthor: chunk.authorOrSource,
  durationSec: 14,
  infoChunk: chunk.shortFact,
  bodyHarm: chunk.deeperDetail,
  brainImpact: chunk.keyTakeaway,
  scriptureCombat: {
    ref: chunk.scriptureAnchor?.ref || 'Romans 12:2',
    text: chunk.scriptureAnchor?.text || 'Be transformed by the renewing of your mind.',
    principle: chunk.keyTakeaway
  },
  scienceTakeaway: chunk.shortFact,
  actionStep: 'Stand up, breathe deeply, and declare God’s truth over your mind.',
  likes: chunk.likes,
  tags: ['#' + chunk.category.replace(/\s+/g, '')]
}));
