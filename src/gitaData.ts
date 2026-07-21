export interface Shloka {
  verseRef: string;
  sanskrit: string;
  transliteration: string;
  translation: string;
  explanation: string;
}

export interface Chapter {
  number: number;
  sanskritName: string;
  englishTitle: string;
  visualTheme: "battlefield_grief" | "chariot_wisdom" | "action_duty" | "glowing_knowledge" | "inner_renunciation" | "meditation_peace" | "cosmic_discernment" | "immortal_spirit" | "sovereign_secret" | "spark_splendor" | "vishwaroopam" | "bhakti_devotion" | "field_knower" | "modes_nature" | "banyan_tree" | "divine_demonic" | "threefold_faith" | "final_liberation";
  narrativeSummary: string; // Detailed storytelling for reading & listening
  keyLessons: string[]; // 3 modern life translations
  featuredShloka: Shloka;
}

export const gitaChapters: Chapter[] = [
  {
    number: 1,
    sanskritName: "Arjuna Viṣāda Yoga",
    englishTitle: "The Yoga of Arjuna's Grief",
    visualTheme: "battlefield_grief",
    narrativeSummary: "The great war of Kurukshetra is about to begin. The blowing of conch shells echoes across the sacred plains. Surrounded by grand armies, Arjuna, the mighty warrior, asks his divine charioteer, Lord Krishna, to position their golden chariot between the two forces. As Arjuna gazes upon both sides, he realizes that he must fight his own beloved grandfathers, teachers, cousins, and friends. Overwhelmed by deep sorrow, confusion, and fear of the impending destruction, his bow, Gandiva, slips from his hand. He refuses to fight and sinks into his chariot seat in absolute dejection, weeping over the cruel dilemma of duty versus family.",
    keyLessons: [
      "Overcoming Anxiety: When faced with high-stakes choices, emotional overwhelms can cloud our intellect and paralyze our ability to act.",
      "Recognizing Bias: The grief of Arjuna highlights how attachment to comfortable relationships can sway us from our ultimate responsibilities.",
      "The Seeking Mindset: Total vulnerability and admitting your confusion is the first step toward receiving true guiding wisdom."
    ],
    featuredShloka: {
      verseRef: "BG 1.28",
      sanskrit: "दृष्ट्वेमं स्वजनं कृष्ण युयुत्सुं समुपस्थितम् ।\nसीदन्ति मम गात्राणि मुखं च परिशुष्यति ॥",
      transliteration: "dṛṣṭvemaṁ svajanaṁ kṛṣṇa yuyutsuṁ samupasthitam\nsīdanti mama gātrāṇi mukhaṁ ca pariśuṣyati",
      translation: "Arjuna said: O Krishna, seeing my own kinsmen gathered here with a desire to fight, my limbs are failing and my mouth is parched.",
      explanation: "This verse beautifully captures the visceral, physical impact of stress and moral dilemma on a human mind, reflecting our own modern moments of panic when life's battles feel too heavy to bear."
    }
  },
  {
    number: 2,
    sanskritName: "Sāṅkhya Yoga",
    englishTitle: "The Yoga of Analytical Wisdom",
    visualTheme: "chariot_wisdom",
    narrativeSummary: "Seeing Arjuna collapsed in grief, Lord Krishna smiles gently and begins His divine discourse. He reminds Arjuna that the soul is eternal, unborn, and indestructible—it merely changes bodies like a person changes worn-out clothes. Krishna introduces 'Sankhya'—the wisdom of distinguishing the immortal self from the temporary physical form. He explains 'Samatvam' (equanimity) in victory or defeat, pleasure or pain. Krishna introduces 'Karma Yoga'—performing one's duty with dedication without obsessing over the results, leading to the ultimate state of a 'Sthitaprajna', a person of steady, undisturbed wisdom.",
    keyLessons: [
      "Focus on Action, Not Results: You have a absolute right over your actions, but never over the outcomes. Anxiety decreases when you focus purely on execution.",
      "The Unshakable Self: Your core identity is eternal. Temporary setbacks, failures, or criticisms in life do not define your soul's value.",
      "Mindfulness & Equanimity: Training the mind to remain balanced in both praise and blame shields you from emotional burnouts."
    ],
    featuredShloka: {
      verseRef: "BG 2.47",
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
      transliteration: "karmaṇy-evādhikāras te mā phaleṣu kadācana\nmā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
      translation: "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions. Never consider yourself to be the cause of the results, nor be attached to inaction.",
      explanation: "The ultimate peak of the Gita's philosophy: perform every duty with deep focus, love, and excellence, but practice emotional detachment from the outcomes to achieve supreme peace and efficiency."
    }
  },
  {
    number: 3,
    sanskritName: "Karma Yoga",
    englishTitle: "The Yoga of Dedicated Action",
    visualTheme: "action_duty",
    narrativeSummary: "Arjuna is confused: if spiritual wisdom is superior to action, why does Krishna urge him to engage in a bloody war? Krishna explains that no living being can remain inactive for even a single second. Suppression of action while dwelling on desires is hypocrisy. Instead, one should practice selflessness by performing work as 'Yajna' (an offering of service to the universe). By working for the welfare of others without personal greed, we purify our hearts and break free from the shackles of ego. Krishna explains how desire and anger are the eternal enemies of wisdom, residing in the senses, mind, and intellect.",
    keyLessons: [
      "Action is Inevitable: Inaction is not a choice. Even maintaining your body and mind requires action. True spirituality is working with high integrity.",
      "Universal Contribution: Run your career or business as a service to society (Yajna). A life lived purely for personal gratification is an incomplete life.",
      "Conquering Inner Enemies: Lust, anger, and greed are the primary obstacles to professional and personal focus. They must be curbed at the root."
    ],
    featuredShloka: {
      verseRef: "BG 3.19",
      sanskrit: "तस्मादसक्तः सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः ॥",
      transliteration: "tasmād asaktaḥ satataṁ kāryaṁ karma samācara\nasakto hy ācaran karma param āpnoti pūruṣaḥ",
      translation: "Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.",
      explanation: "True freedom comes not from escaping our day-to-day work, but from escaping the heavy emotional baggage of selfish desires while performing it."
    }
  },
  {
    number: 4,
    sanskritName: "Jnāna Karma Sannyāsa Yoga",
    englishTitle: "The Yoga of Knowledge and Action",
    visualTheme: "glowing_knowledge",
    narrativeSummary: "Krishna reveals His divine nature as the eternal, birthless Lord who incarnates age after age to protect the righteous, eliminate evil, and restore cosmic balance (Dharma). He introduces the profound concept of 'Akarma' (inaction in action)—how a fully enlightened person, while executing dynamic deeds, remains free from karma because their actions are burned away in the fire of spiritual wisdom. Krishna explains various forms of spiritual sacrifices and emphasizes that all offerings culminate in divine knowledge, which can destroy all doubts and sins like a blazing fire consumes firewood.",
    keyLessons: [
      "The Fire of Wisdom: Acquiring deep wisdom clears confusion, doubts, and past regrets, transforming your outlook on current challenges.",
      "Leading by Example: True leaders act dynamically to set a positive example for others, without being driven by personal greed.",
      "Seeking Mentorship: Spiritual and practical progress requires finding a wise mentor, asking respectful questions, and serving them with humility."
    ],
    featuredShloka: {
      verseRef: "BG 4.7",
      sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥",
      transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata\nabhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
      translation: "Whenever and wherever there is a decline in righteousness, O descendant of Bharata, and a predominant rise of unrighteousness—at that time I descend Myself.",
      explanation: "This classic promise of divine intervention assures seekers that whenever darkness or corruption seems to overwhelm our life or the world, the power of supreme order and light will manifest to re-establish goodness."
    }
  },
  {
    number: 5,
    sanskritName: "Karma Sannyāsa Yoga",
    englishTitle: "The Yoga of Renunciation of Action",
    visualTheme: "inner_renunciation",
    narrativeSummary: "Arjuna is still torn between the physical renunciation of work (monastic life) and active work in devotion. Krishna clarifies that while both lead to liberation, active selfless work (Karma Yoga) is far superior and easier to practice. A true renunciant is not someone who runs away to the forest, but someone who performs daily tasks with a pure heart, free from hatred and desire. Such a person is like a lotus leaf floating on water—though they touch the material world, they remain completely wetless and unaffected by sin, enjoying deep, unshakeable inner peace.",
    keyLessons: [
      "The Lotus Leaf Attitude: Live in the world, engage in its colorful experiences, but don't let its negativity or anxiety seep into your inner consciousness.",
      "Renounce the Ego: Realize that you are not the sole author of events. Multiple cosmic forces are at play. This humbles the ego and relieves stress.",
      "Equal Vision: A spiritually mature individual treats everyone with equal respect—whether a corporate leader, a laborer, or an animal."
    ],
    featuredShloka: {
      verseRef: "BG 5.10",
      sanskrit: "ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः ।\nलिप्यते न स पापेन पद्मपत्रमिवाम्भसा ॥",
      transliteration: "brahmaṇy ādhāya karmāṇi saṅgaṁ tyaktvā karoti yaḥ\nlipyate na sa pāpena padma-patram ivāmbhasā",
      translation: "One who performs their duty without attachment, surrendering the results unto the Supreme Lord, is unaffected by sinful action, as the lotus leaf is untouched by water.",
      explanation: "Just as the beautiful lotus leaf floats gracefully on muddy water without absorbing any mud, we can live amidst modern chaos and daily stress while keeping our mind pure and calm."
    }
  },
  {
    number: 6,
    sanskritName: "Dhyāna Yoga",
    englishTitle: "The Yoga of Meditation",
    visualTheme: "meditation_peace",
    narrativeSummary: "Krishna details the practical path of meditation (Dhyana) and mind control. He explains that for one who has conquered it, the mind is the best of friends; but for one who has failed to do so, the mind remains the greatest enemy. Krishna describes the ideal posture, environment, and breathing methods for deep meditation. He teaches that moderation in eating, sleeping, work, and recreation is essential to destroy all sorrow. When Arjuna complains that the mind is as restless and wild as the wind, Krishna assures him that through constant practice (Abhyasa) and detachment (Vairagya), the mind can definitely be subdued.",
    keyLessons: [
      "The Mind is your Choice: Your mind can either be your strongest ally or your worst saboteur. You must actively train it to serve your higher self.",
      "A Life of Moderation: Avoid extreme behaviors. Balanced diet, adequate sleep, organized work, and healthy relaxation form the core of mental peace.",
      "Practice and Patience: Mind wandering is normal. Gently bring it back without judgment. Consistent habit (Abhyasa) overcomes long-term mental blocks."
    ],
    featuredShloka: {
      verseRef: "BG 6.5",
      sanskrit: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥",
      transliteration: "uddhared ātmanātmānaṁ nātmānam avasādayet\nātmaiva hy ātmano bandhur ātmaiva ripur ātmanaḥ",
      translation: "One must deliver oneself with the help of one's own mind, and not degrade oneself. The mind is the friend of the conditioned soul, and the enemy as well.",
      explanation: "No external person can save or ruin your life permanently. Your own thoughts and mental habits are the ultimate architects of your destiny. Empower yourself from within."
    }
  },
  {
    number: 7,
    sanskritName: "Jnāna Vijñāna Yoga",
    englishTitle: "The Yoga of Wisdom and Realization",
    visualTheme: "cosmic_discernment",
    narrativeSummary: "Krishna describes the structure of His material and spiritual energies. Earth, water, fire, air, space, mind, intellect, and ego constitute His material nature, while a higher spiritual energy sustains all living beings. Krishna explains that He is the essence of all things—the taste in water, the light of the sun and moon, the sacred syllable Om in the Vedas, and the ability in human beings. He explains that His divine illusion (Maya), made of the three modes, is extremely difficult to cross, but those who surrender to Him in deep love easily transcend it.",
    keyLessons: [
      "See the Essence: Learn to see the divine spark and natural beauty in everything around you—in the elements, in art, in the skills of people.",
      "Transcending Illusion: Modern life is full of distractions and superficial desires (Maya). Cultivating a connection with a higher power helps us see through these.",
      "Humility in Capability: Your talents, intelligence, and achievements are gifts of nature. Appreciate them with a sense of gratitude rather than arrogant ego."
    ],
    featuredShloka: {
      verseRef: "BG 7.7",
      sanskrit: "मत्तः परतरं नान्यत्किञ्चिदस्ति धनञ्जय ।\nमयि सर्वमिदं प्रोतं सूत्रे मणिगणा इव ॥",
      transliteration: "mattaḥ parataraṁ nānyat kiñcid asti dhanañjaya\nmayi sarvam idaṁ protaṁ sūtre maṇi-gaṇā iva",
      translation: "O conqueror of wealth, there is no truth superior to Me. Everything rests upon Me, as pearls are strung on a thread.",
      explanation: "An incredible image showing the interconnectedness of all life. There is a single, divine, unseen thread that binds the universe, galaxies, and our souls together in perfect harmony."
    }
  },
  {
    number: 8,
    sanskritName: "Akṣara Brahma Yoga",
    englishTitle: "The Yoga of the Imperishable Absolute",
    visualTheme: "immortal_spirit",
    narrativeSummary: "Arjuna asks about Brahman, the self, karma, and the state of consciousness at the moment of death. Krishna explains that whatever a person remembers and meditates upon during their final moments of life determines their next destination. Therefore, one must practice remembering the Divine constantly, even while performing daily duties and battles. He contrasts the temporary, cyclic worlds of creation—where beings are repeatedly born and die—with His supreme, imperishable spiritual abode, from which there is no return to this world of suffering.",
    keyLessons: [
      "Consistent Quality of Thought: Your daily dominant thoughts shape your character and ultimately decide your life's final trajectory.",
      "Multitasking with Mindfulness: Keep your hands busy in your physical duties (career, family), but keep your heart connected to a high spiritual purpose.",
      "The Long-Term Picture: Recognize that material gains are temporary. Investing time in developing spiritual intelligence yields permanent assets."
    ],
    featuredShloka: {
      verseRef: "BG 8.7",
      sanskrit: "तस्मात्सर्वेषु कालेषु मामनुस्मर युध्य च ।\nमय्यर्पितमनोबुद्धिर्मामेवैष्यस्यसंशयम् ॥",
      transliteration: "tasmāt sarveṣu kāleṣu mām anusmara yudhya ca\nmayy arpita-mano-buddhir mām evaiṣyasy asaṁśayaḥ",
      translation: "Therefore, at all times, think of Me and fight. With your mind and intellect dedicated to Me, you will surely attain Me without a doubt.",
      explanation: "Do not wait for old age or retirement to find peace. Krishna advises Arjuna to engage actively in his duty ('fight') while maintaining a constant stream of inner divine awareness."
    }
  },
  {
    number: 9,
    sanskritName: "Rāja Vidyā Rāja Guhya Yoga",
    englishTitle: "The Sovereign Science and Secret",
    visualTheme: "sovereign_secret",
    narrativeSummary: "Krishna reveals the most confidential wisdom: how He pervades the entire universe in His unmanifested form, yet remains independent and unattached. He explains that even the most simple, humble offering—a leaf, a flower, a fruit, or water—is accepted by Him with great joy if offered with pure love and devotion. Krishna assures Arjuna that no devotee of His is ever lost or destroyed, and that even those who have committed terrible mistakes can redeem themselves instantly by realigning their consciousness with devotion and righteousness.",
    keyLessons: [
      "Simplicity of Devotion: Great deeds are not measured by luxury, but by the purity of intention. Simple, heartfelt actions carry the maximum impact.",
      "Redemption is Always Open: No matter how many mistakes you have made in the past, a sincere decision to turn toward goodness can reboot your destiny.",
      "Unshakable Security: Cultivating faith in a benevolent cosmic power provides a profound mental shield against the fear of failure and loss."
    ],
    featuredShloka: {
      verseRef: "BG 9.26",
      sanskrit: "पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति ।\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ॥",
      transliteration: "patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati\ntad ahaṁ bhakty-upahṛtam aśnāmi prayatātmanaḥ",
      translation: "If one offers Me with love and devotion a leaf, a flower, a fruit or water, I will accept it.",
      explanation: "This beautiful verse highlights that the cosmic intelligence cares nothing for your external wealth, status, or complex rituals. It responds only to the pure, simple love of your heart."
    }
  },
  {
    number: 10,
    sanskritName: "Vibhūti Vistāra Yoga",
    englishTitle: "The Yoga of Divine Manifestations",
    visualTheme: "spark_splendor",
    narrativeSummary: "Arjuna desires to hear more about Lord Krishna's divine glories so that he can meditate on Him constantly. Krishna explains that He is the source of all spiritual and material worlds. He describes His primary manifestations among creations: He is the consciousness in living beings, Lord Shiva among Rudras, the Himalayas among mountains, the ocean among water bodies, the Ganges among rivers, Rama among warriors, and the spring among seasons. Krishna concludes by saying that all majestic, beautiful, and glorious creations are merely a tiny spark of His infinite power.",
    keyLessons: [
      "Recognize Greatness: When you see exceptional talent, beautiful art, scientific breakthroughs, or natural wonders, recognize them as sparks of divine glory.",
      "Source of All Assets: Your intellectual ideas, creative power, and life energy flow from the central cosmic source. This removes pride and instills gratitude.",
      "Broaden Your Vision: Meditate on the grandeur of the universe to make your personal, day-to-day problems feel small, manageable, and temporary."
    ],
    featuredShloka: {
      verseRef: "BG 10.41",
      sanskrit: "यद्यद्विभूतिमत्सत्त्वं श्रीमदूर्जितमेव वा ।\nतत्तदेवावगच्छ त्वं मम तेजोंऽशसम्भवम् ॥",
      transliteration: "yad yad vibhūtimat sattvaṁ śrīmad ūrjitameva vā\ntat tad evāvagaccha tvaṁ mama tejo-'ṁśa-sambhavam",
      translation: "Know that all opulent, beautiful and glorious creations spring from but a spark of My splendor.",
      explanation: "A deeply poetic reminder that all the beauty, art, wisdom, and magnificent structures of our world are but tiny reflections of the infinite spiritual beauty that lies at the core of existence."
    }
  },
  {
    number: 11,
    sanskritName: "Viśvarūpa Darśana Yoga",
    englishTitle: "The Vision of the Cosmic Form",
    visualTheme: "vishwaroopam",
    narrativeSummary: "Fascinated by Krishna's glories, Arjuna begs to witness His actual cosmic form (Vishwaroopam). Krishna grants Arjuna divine eyes to behold His infinite majesty. Arjuna sees a spectacular, terrifying form spanning the heavens and earth, glowing with the light of thousands of suns. The cosmic form displays multiple faces, eyes of fire, multi-dimensional arms, and the entire universe resting in one place. Arjuna sees past, present, and future merging, with great warriors rushing into the Lord's mouth of time. Trembling with awe and fear, Arjuna bows down, asks for forgiveness for treating Him as a mere friend, and pleads to see His gentle, human form again.",
    keyLessons: [
      "The Bigger Picture: There are dimensions of reality far beyond our tiny human perception. Broaden your awareness beyond the immediate physical senses.",
      "Time is the Great Devourer: All physical things—success, bodies, conflicts—rise and dissolve in the river of Time. This realization inspires humility and focus.",
      "Grace and Guidance: Even in the face of terrifying change or chaos, surrender to divine grace provides the balance needed to handle life's storms."
    ],
    featuredShloka: {
      verseRef: "BG 11.12",
      sanskrit: "दिवि सूर्यसहस्रस्य भवेद्युगपदुत्थिता ।\nयदि भाः सदृशी सा स्याद्भासस्तस्य महात्मनः ॥",
      transliteration: "divi sūrya-sahasrasya bhaved yugapad utthitā\nyadi bhāḥ sadṛśī sā syād bhāsas tasya mahātmanaḥ",
      translation: "If thousands of suns were to rise at once into the sky, their glorious light might resemble the splendor of the Supreme Lord.",
      explanation: "J. Robert Oppenheimer famously quoted this exact verse upon witnessing the first atomic explosion. It represents the breathtaking, raw, infinite energy of the absolute cosmic reality."
    }
  },
  {
    number: 12,
    sanskritName: "Bhakti Yoga",
    englishTitle: "The Yoga of Devotion",
    visualTheme: "bhakti_devotion",
    narrativeSummary: "Arjuna asks whether it is better to worship God in His personal, loving form, or as the formless, unmanifested absolute. Krishna asserts that while both lead to Him, meditating on the formless is extremely difficult and painful for embodied humans. He recommends the path of pure devotion (Bhakti). Krishna outlines the stages of Bhakti: if you cannot fix your mind constantly on Him, practice the discipline of meditation; if that is hard, perform work for Him; if even that is too difficult, simply surrender the fruits of your actions. Krishna lists the lovely qualities of a dear devotee—peaceful, compassionate, free from envy and ego, balanced in joy and grief.",
    keyLessons: [
      "Choose Your Path Wisely: Align your spiritual or focus practices with your psychological nature. Make progress step-by-step rather than forcing extreme targets.",
      "Cultivate Kindness: True devotion is not just ritual; it is reflecting empathy, patience, friendliness, and non-violence toward all living beings.",
      "Stability in Dualities: True inner freedom means not being easily swayed by praise, criticism, gain, loss, excitement, or anxiety."
    ],
    featuredShloka: {
      verseRef: "BG 12.13",
      sanskrit: "अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च ।\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥",
      transliteration: "adveṣṭā sarva-bhūtānāṁ maitraḥ karuṇa eva ca\nnirmamo nirahaṅkāraḥ sama-duḥkha-sukhaḥ kṣamī",
      translation: "He who is not envious but is a kind friend to all living entities, who does not think himself a proprietor and is free from false ego, who is equal in both happiness and distress, and is forgiving...",
      explanation: "Lord Krishna defines a truly spiritual person not by external appearances, but by their inner traits of universal love, humility, empathy, forgiveness, and mental poise."
    }
  },
  {
    number: 13,
    sanskritName: "Kṣetra Kṣetrajña Vibhāga Yoga",
    englishTitle: "The Yoga of the Field and Knower",
    visualTheme: "field_knower",
    narrativeSummary: "Krishna explains the division between 'Kshetra' (the Field—the body, mind, senses, and material nature) and 'Kshetrajna' (the Knower of the Field—the conscious soul that observes everything). He describes how the soul, seated in material nature, becomes attached to worldly experiences, leading to repeated births in different bodies. Krishna teaches that by developing qualities like humility, simplicity, non-violence, detachment, and unwavering devotion, one can perceive the distinction between the physical shell and the divine observer, thereby achieving liberation.",
    keyLessons: [
      "The Power of Observation: You are not your thoughts, emotions, or bodily sensations. You are the silent conscious observer (the Knower) of them.",
      "Build Character: Cultivate values like modesty, non-injury, patience, and honesty. They are defined by Krishna as the foundation of true knowledge.",
      "Objectify your Stress: When anxiety arises, look at it objectively as a temporary cloud passing through the 'field' of your mind, without identifying with it."
    ],
    featuredShloka: {
      verseRef: "BG 13.2",
      sanskrit: "क्षेत्रज्ञं चापि मां विद्धि सर्वक्षेत्रेषु भारत ।\nक्षेत्रक्षेत्रज्ञयोर्ज्ञानं यत्तज्ज्ञानं मतं मम ॥",
      transliteration: "kṣetra-jñaṁ cāpi māṁ viddhi sarva-kṣetreṣu bhārata\nkṣetra-kṣetrajñayor jñānaṁ yat taj jñānaṁ mataṁ mama",
      translation: "Understand Me to be the Knower in all fields of activities, O descendant of Bharata. The understanding of this body and its Knower is what I consider true knowledge.",
      explanation: "True education is dual: understanding the physical/psychological vehicle we operate (the field) and realizing the divine consciousness (the observer) that brings it to life."
    }
  },
  {
    number: 14,
    sanskritName: "Guṇatraya Vibhāga Yoga",
    englishTitle: "The Yoga of Three Modes of Nature",
    visualTheme: "modes_nature",
    narrativeSummary: "Krishna describes the three 'Gunas' (qualities or forces of material nature) that bind the eternal soul: 'Sattva' (goodness, purity, light, wisdom), 'Rajas' (passion, desire, action, greed), and 'Tamas' (darkness, ignorance, laziness, confusion). These three qualities compete for dominance in our minds. Sattva elevates our awareness; Rajas drives restless desire and burnout; Tamas causes depression, inertia, and sleepiness. Krishna explains how to recognize which Guna is active in our thoughts and actions, and guides Arjuna on how to rise above all three to achieve absolute spiritual liberation.",
    keyLessons: [
      "Analyze your Moods: Recognize your mental states. Are you calm and clear (Sattva), restless and ambitious (Rajas), or lazy and heavy (Tamas)?",
      "Cultivate Sattva: Increase purity in your lifestyle, food, and thoughts to elevate your daily clarity, creativity, and overall happiness.",
      "Go Beyond: Don't become proud of even your goodness. Ultimate peace comes from realizing you are the pure, unattached soul beyond all three Gunas."
    ],
    featuredShloka: {
      verseRef: "BG 14.5",
      sanskrit: "सत्त्वं रजस्तम इति गुणाः प्रकृतिसम्भवाः ।\nनिबध्नन्ति महाबाहो देहे देहिनमव्ययम् ॥",
      transliteration: "sattvaṁ rajas tama iti guṇāḥ prakṛti-sambhavāḥ\nnibadhnanti mahā-bāho dehe dehinam avyayam",
      translation: "Material nature consists of three modes—goodness, passion and ignorance. When the eternal living entity comes in contact with nature, O mighty-armed Arjuna, he becomes bound by these modes.",
      explanation: "Our personalities are dynamic mixtures of clarity, desire, and rest. Recognizing these forces helps us master our habits, diet, and lifestyle choices to maintain optimal balance."
    }
  },
  {
    number: 15,
    sanskritName: "Purūṣottama Yoga",
    englishTitle: "The Yoga of the Supreme Person",
    visualTheme: "banyan_tree",
    narrativeSummary: "Krishna uses the profound metaphor of an inverted Banyan Tree (Ashvatthama) to describe the material world—with its roots extending upwards in spiritual realms and its branches growing downwards as sensory desires. One must cut down this deeply rooted tree using the sharp axe of detachment. Krishna explains that He is the light of the sun, moon, and fire. He enters the earth to sustain all vegetation and resides in the hearts of all living beings as memory, knowledge, and forgetfulness. He is the supreme transcendental person (Purushottama), higher than both the perishable and imperishable.",
    keyLessons: [
      "Axe of Detachment: Cut through the branches of excessive material cravings and toxic dependencies using conscious detachment (Vairagya).",
      "Source of Intellect: Acknowledge that your intelligence, memory, and gut feelings are managed by a higher, supportive cosmic presence.",
      "The Spiritual Roots: Look upward for your ultimate security and values, rather than seeking permanent fulfillment in temporary material branches."
    ],
    featuredShloka: {
      verseRef: "BG 15.15",
      sanskrit: "सर्वस्य चाहं हृदि सन्निविष्टो मत्तः स्मृतिर्ज्ञानमपोहनं च ।\nवेदैश्च सर्वैरहमेव वेद्यो वेदान्तकृद्वेदविदेव चाहम् ॥",
      transliteration: "sarvasya cāhaṁ hṛdi sanniviṣṭo mattaḥ smṛtir jñānam apohanaṁ ca\nvedaiś ca sarvair aham eva vedyo vedāntakṛd vedavid eva cāham",
      translation: "I am seated in everyone's heart, and from Me come memory, knowledge and forgetfulness. By all the Vedas, I am to be known. Indeed, I am the compiler of Vedanta, and I am the knower of the Vedas.",
      explanation: "A deeply reassuring statement that the divine is not a distant, judgmental entity in the clouds, but a loving, constant presence dwelling right inside your own heart."
    }
  },
  {
    number: 16,
    sanskritName: "Daivāsura Sampad Vibhāga Yoga",
    englishTitle: "The Yoga of Divine and Demonic Natures",
    visualTheme: "divine_demonic",
    narrativeSummary: "Krishna contrasts two types of human natures: 'Daivi' (divine qualities) and 'Asuri' (demonic or self-destructive qualities). Divine traits include fearlessness, charity, self-control, truthfulness, compassion, modesty, and forgiveness. Demonic traits include pride, arrogance, anger, harshness, and ignorance. Selfish individuals believe the world has no moral foundation and live purely for sensory pleasure and wealth. Krishna warns that lust, anger, and greed are the three gates to hell, destroying the soul's potential. To avoid self-destruction, one must follow scriptural guidelines for moral action.",
    keyLessons: [
      "The Three Dangerous Gates: Lust (uncontrolled craving), Anger, and Greed are the primary entry points for mental anguish and personal ruin.",
      "Cultivate the Divine: Practice intentional habits of honesty, gentleness, courage, and non-violence to secure a clean, positive mindset.",
      "Self-Awareness and Correction: Regularly check if arrogant or self-centered thoughts are taking over your speech, and realign with humble values."
    ],
    featuredShloka: {
      verseRef: "BG 16.21",
      sanskrit: "त्रिविधं नरकस्येदं द्वारं नाशनमात्मनः ।\nकामः क्रोधस्तथा लोभस्तस्मादेतत्त्रयं त्यजेत् ॥",
      transliteration: "tri-vidhaṁ narakasyedaṁ dvāraṁ nāśanam ātmanaḥ\nkāmaḥ krodhas tathā lobhas tasmād etat trayaṁ tyajet",
      translation: "There are three gates leading to this hell—lust, anger and greed. Every sane person should give these up, for they lead to the degradation of the soul.",
      explanation: "These three vices act like psychological poisons, blinding our intellect and destroying relationships. Releasing them is the direct passport to peace and success."
    }
  },
  {
    number: 17,
    sanskritName: "Śraddhātraya Vibhāga Yoga",
    englishTitle: "The Yoga of the Threefold Faith",
    visualTheme: "threefold_faith",
    narrativeSummary: "Arjuna asks about the fate of those who worship with sincerity but neglect scriptural rules—what category of faith do they hold? Krishna answers that the faith of every human is shaped by their dominant Guna (Sattva, Rajas, or Tamas). He explains how our food choices, worship, sacrifices, austerity, and charity are also divided into these three modes. For instance, Sattvik food is fresh, nourishing, and juicy; Rajasik food is bitter, sour, and overly spicy; Tamasik food is stale, toxic, and impure. Krishna introduces the sacred vibration 'Om Tat Sat' to purify all spiritual and practical works.",
    keyLessons: [
      "Mind-Food Connection: What you eat directly impacts your mental energy. Fresh, balanced meals enhance calm focus; heavy, processed foods cause lethargy.",
      "Intention in Giving: Charity should be Sattvik—given at the right time and place to a deserving person with zero expectation of return.",
      "Consistent Authenticity: Let your words be pleasant, truthful, and helpful. Avoid speech that causes agitation or hurts others."
    ],
    featuredShloka: {
      verseRef: "BG 17.3",
      sanskrit: "सत्त्वानुरूपा सर्वस्य श्रद्धा भवति भारत ।\nश्रद्धामयोऽयं पुरुषो यो यच्छ्रद्धः स एव सः ॥",
      transliteration: "sattvānurūpā sarvasya śraddhā bhavati bhārata\nśraddhā-mayo 'yaṁ puruṣo yo yac-chraddhaḥ sa eva saḥ",
      translation: "The faith of each individual is in accordance with their nature. A person is made of their faith; as their faith is, so indeed are they.",
      explanation: "You are what you believe in. Your core beliefs and deep-seated convictions shape your entire reality, decisions, habits, and ultimate character."
    }
  },
  {
    number: 18,
    sanskritName: "Mokṣa Sannyāsa Yoga",
    englishTitle: "The Yoga of Liberation through Renunciation",
    visualTheme: "final_liberation",
    narrativeSummary: "In this final, grand chapter, Krishna summarizes His entire teachings. He defines 'Tyaga' (renunciation) as relinquishing selfish desires and dedicating the fruits of action to the Supreme, while continuing to perform social duties, charity, and self-discipline. Krishna explains how knowledge, action, intellect, resolve, and happiness are categorized under the three Gunas. He reveals the ultimate secret: to abandon all mental anxieties, surrender completely to Him, and perform one's duties with love. Arjuna's doubts are completely destroyed. He regains his focus, picks up his bow Gandiva, and declares with confidence: 'I am ready to perform my duty!'",
    keyLessons: [
      "Action with Detachment: True freedom is not escaping work, but executing your work with 100% devotion while letting go of anxious attachment to outcomes.",
      "Absolute Surrender: Surrender your worries and ego to the ultimate divine wisdom. This releases mental burdens and invites serene confidence.",
      "Ready for Duty: After acquiring wisdom, stand up, pick up your responsibility (your Gandiva), and face your life's challenges with courage."
    ],
    featuredShloka: {
      verseRef: "BG 18.66",
      sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामी मा शुचः ॥",
      transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja\nahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
      translation: "Abandon all varieties of dharma and surrender unto Me alone. I shall deliver you from all sinful reactions. Do not fear.",
      explanation: "The ultimate guarantee of divine protection. Release your heavy anxieties, ethical calculations, and fear of failure. Align with love and truth, and march forward fearlessly."
    }
  }
];
