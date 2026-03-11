require('dotenv').config();
const mysql2 = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const conn = await mysql2.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shiva_db',
    multipleStatements: true
  });

  console.log('Seeding database...');

  // Admin user
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
  await conn.query(`
    INSERT IGNORE INTO admin_users (email, password, name) VALUES (?, ?, ?)
  `, [process.env.ADMIN_EMAIL || 'admin@allaboutshiva.com', hash, 'Administrator']);
  console.log('Admin user seeded.');

  // Names
  const names = [
    ['Shiva', 'Sanskrit', 'The Auspicious One', 'Shiva means the one who is eternally pure and auspicious. He is the one who purifies everyone through the sound of His name.', 1],
    ['Mahadeva', 'Sanskrit', 'The Great God', 'Mahadeva is the supreme of all devas. When the gods needed a being beyond their own power, they turned to Mahadeva.', 1],
    ['Neelakantha', 'Sanskrit', 'The Blue-Throated One', 'During the churning of the cosmic ocean (Samudra Manthan), a deadly poison emerged. Lord Shiva consumed it to save the universe, and it turned His throat blue.', 1],
    ['Nataraja', 'Sanskrit', 'Lord of Dance', 'Nataraja represents Shiva as the cosmic dancer whose dance sustains the universe. The Ananda Tandava (dance of bliss) occurs in the heart of the devotee.', 1],
    ['Rudra', 'Sanskrit', 'The Howler / The Fierce One', 'Rudra is the terrifying aspect of Shiva. He roams as the lord of storms and winds, and his howl resonates across all creation.', 1],
    ['Shankar', 'Sanskrit', 'The Beneficent One', 'Shankar is He who bestows happiness and well-being. He grants all boons and fulfills the desires of His devotees.', 1],
    ['Bholenath', 'Sanskrit', 'The Innocent Lord', 'Shiva is known as Bholenath because He is easily pleased and quick to grant boons — even to demons — out of His boundless innocence and compassion.', 1],
    ['Pashupatinath', 'Sanskrit', 'Lord of All Living Beings', 'Pashupati means the Lord of all animals and beings. Shiva is the protector of all souls bound in the cycle of existence.', 0],
    ['Tryambaka', 'Sanskrit', 'The Three-Eyed Lord', 'Tryambaka refers to Shiva having three eyes. The third eye represents wisdom, foresight and the destruction of ignorance.', 0],
    ['Vishwanath', 'Sanskrit', 'Lord of the Universe', 'Vishwanath is the ruler and protector of the entire cosmos. His most famous temple stands at Varanasi, the eternal city.', 0],
  ];
  for (const [name, language, meaning, story, featured] of names) {
    await conn.query(
      `INSERT IGNORE INTO names (name, language, meaning, story, is_featured) VALUES (?, ?, ?, ?, ?)`,
      [name, language, meaning, story, featured]
    );
  }
  console.log('Names seeded.');

  // Mantras
  await conn.query(`INSERT IGNORE INTO mantras (title, text_sanskrit, text_english, meaning, source, story, is_featured) VALUES
    ('Om Namah Shivaya',
     'ॐ नमः शिवाय',
     'Om Namah Shivaya',
     'I bow to Lord Shiva — the auspicious one, the inner self of all beings. The five syllables Na-Ma-Shi-Va-Ya represent the five elements: earth, water, fire, air, and space.',
     'Krishna Yajurveda, Taittiriya Samhita 4.5.8',
     'This is the Panchakshara mantra — the five sacred syllables that are the very essence of the Vedas. Sage Vyaghrapada and sage Patanjali are said to have attained liberation through this mantra.',
     1),
    ('Maha Mrityunjaya Mantra',
     'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥',
     'Om Tryambakam yajamahe sugandhim pushti-vardhanam\\nUrvarukamiva bandhanan mrityor mukshiya maamritat',
     'We worship the three-eyed Lord Shiva who nourishes all beings. May He liberate us from death and grant us immortality, as easily as a ripe cucumber is freed from its vine.',
     'Rigveda 7.59.12',
     'The Maha Mrityunjaya Mantra was revealed to Rishi Markandeya. He used it to overcome death itself when Yama, the God of Death, came for him. Shiva appeared and protected the young sage.',
     1),
    ('Shiva Panchakshara Stotram Opening',
     'नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय',
     'Nagendraharaya Trilochanaya Bhasmangaragaya Maheshwaraya',
     'To the one who wears the king of serpents as a garland, who has three eyes, who is smeared with sacred ash — to that Maheshwara I bow.',
     'Adi Shankaracharya',
     'Composed by Adi Shankaracharya, each verse of this stotra begins with one of the five syllables of the Panchakshara mantra.',
     0)
  `);
  console.log('Mantras seeded.');

  // Vedas
  const vedas = [
    ['Rigveda', 'Knowledge of Hymns of Praise', 'Composed circa 1500–1200 BCE; the oldest of the four Vedas', 'The Rigveda is the oldest known Vedic Sanskrit text. It consists of 1,028 hymns composed in praise of the gods. Shiva appears in the Rigveda as Rudra — the fierce and compassionate deity of storms.', 1],
    ['Yajurveda', 'Knowledge of Sacrificial Formulas', 'Compiled circa 1100–800 BCE', 'The Yajurveda contains prose mantras used in Vedic sacrifices. It is split into the Krishna (Black) and Shukla (White) Yajurveda. The famous Shri Rudram is found in the Krishna Yajurveda.', 2],
    ['Samaveda', 'Knowledge of Melodies and Chants', 'Compiled circa 1200–1000 BCE', 'The Samaveda is the Veda of songs. Most of its verses are derived from the Rigveda, set to musical notation. It forms the basis of Indian classical music.', 3],
    ['Atharvaveda', 'Knowledge of Atharvan', 'Compiled circa 1000–900 BCE', 'The Atharvaveda contains hymns, spells, and speculative hymns. It includes the Shiva Sankalpa Upanishad and many hymns to Rudra-Shiva for healing and protection.', 4],
  ];
  for (const [name, meaning, timeline, desc, order] of vedas) {
    await conn.query(
      `INSERT IGNORE INTO vedas (name, meaning, timeline, description, sort_order) VALUES (?, ?, ?, ?, ?)`,
      [name, meaning, timeline, desc, order]
    );
  }

  // Veda incidents
  const [rigveda] = await conn.query(`SELECT id FROM vedas WHERE name='Rigveda'`);
  const [yajur] = await conn.query(`SELECT id FROM vedas WHERE name='Yajurveda'`);
  if (rigveda[0]) {
    await conn.query(`INSERT IGNORE INTO veda_incidents (veda_id, title, content, type) VALUES
      (?, 'The Hymn of Rudra (Rigveda 2.33)', 'One of the most ancient hymns to Rudra, this Rigvedic hymn praises the healer god who sends disease and also cures it. He is invoked as a father who shows mercy to his children.', 'incident'),
      (?, 'Maruts — The Storm Companions of Rudra', 'The Maruts are described as the sons of Rudra and Prisni. They accompany Indra in battle but ultimately serve Rudra as the storm gods. Their story reflects the dual nature of Shiva — creator and destroyer.', 'story')
    `, [rigveda[0].id, rigveda[0].id]);
  }
  if (yajur[0]) {
    await conn.query(`INSERT IGNORE INTO veda_incidents (veda_id, title, content, type) VALUES
      (?, 'Shri Rudram — The Supreme Hymn to Shiva', 'Found in the Krishna Yajurveda (Taittiriya Samhita), the Shri Rudram is the most sacred hymn to Shiva. It describes His 1,000 forms and grants all boons when chanted.', 'incident'),
      (?, 'Namakam and Chamakam', 'The Shri Rudram has two parts: Namakam (invoking the names of Rudra, asking Him to avert His destructive power) and Chamakam (asking Rudra to grant specific blessings). Together they represent surrender and grace.', 'story')
    `, [yajur[0].id, yajur[0].id]);
  }
  console.log('Vedas seeded.');

  // Stotras
  await conn.query(`INSERT IGNORE INTO stotras (title, text, meaning, written_by, story, is_featured) VALUES
    ('Shiva Tandava Stotram',
     'जटाटवीगलज्जलप्रवाहपावितस्थले\\nगलेऽवलम्ब्य लम्बितां भुजङ्गतुङ्गमालिकाम्।\\nडमड्डमड्डमड्डमन्निनादवड्डमर्वयं\\nचकार चण्डताण्डवं तनोतु नः शिवः शिवम्॥',
     'The one whose matted hair holds the rushing Ganga, who wears a garland of great serpents on His neck, who fills the sky with the sound of Damaru — may that Shiva who performs the fierce Tandava dance grant us auspiciousness.',
     'Ravana',
     'The Shiva Tandava Stotram was composed by the great king Ravana. He had lifted Mount Kailash to take it to Lanka. Shiva, unperturbed, pressed His big toe and pinned Ravana under the mountain. Ravana composed this 17-verse hymn and sang it with ten voices for 1,000 years. Shiva, pleased, freed him.',
     1),
    ('Lingashtakam',
     'ब्रह्ममुरारिसुरार्चितलिङ्गं\\nनिर्मलभासितशोभितलिङ्गम्।\\nजन्मजदुःखविनाशकलिङ्गं\\nतत्प्रणमामि सदाशिवलिङ्गम्॥',
     'The Linga worshipped by Brahma, Vishnu, and all the gods; the Linga that shines with immaculate brilliance; the Linga that destroys the sorrow born of worldly existence — to that eternal Shivalinga I bow.',
     'Adi Shankaracharya',
     'Adi Shankaracharya composed the Lingashtakam as a meditation on the Shivalinga — the formless form of Shiva. Each of the eight verses reveals a different quality of the divine symbol.',
     1)
  `);
  console.log('Stotras seeded.');

  // Events
  await conn.query(`INSERT IGNORE INTO events (event_name, event_date, day_name, mahurat_time, description, is_active) VALUES
    ('Maha Shivratri 2025', '2025-02-26', 'Wednesday', 'Nishita Kaal Puja: 12:09 AM to 1:00 AM (Feb 27)', 'The Great Night of Shiva — observed on the 14th night of the dark fortnight in the month of Phalguna. Fasting and all-night vigil are observed.', 1),
    ('Shravan Somvar (1st Monday)', '2025-07-21', 'Monday', 'Brahma Muhurta: 4:30 AM to 6:00 AM', 'The first Monday of the holy month of Shravan — the most auspicious time to worship Lord Shiva.', 1),
    ('Maha Shivratri 2026', '2026-02-15', 'Sunday', 'Nishita Kaal Puja: 12:02 AM to 12:52 AM (Feb 16)', 'The most auspicious night of the year for Shiva devotees. Chanting, fasting, and Rudrabhishek are performed through the night.', 1),
    ('Shivratri (Monthly)', '2025-08-14', 'Thursday', 'Pradosh Kaal: 6:30 PM to 9:00 PM', 'The monthly Shivratri observed on the Chaturdashi (14th day) of the Krishna Paksha every month.', 1)
  `);
  console.log('Events seeded.');

  // Ornaments
  const ornaments = [
    ['Trishula (Trident)', 'Right Hand', 'The Trishula represents the three fundamental aspects of existence: creation, preservation, and destruction. It also symbolizes the three states of consciousness — waking, dreaming, and deep sleep.', 'Shiva uses the Trishula to destroy evil and ignorance. When Tarakasura became invincible, only Shiva\'s weapon could defeat the demon. The Trishula also represents Shiva\'s mastery over the three gunas (Sattva, Rajas, Tamas).'],
    ['Damaru (Drum)', 'Left Hand', 'The Damaru represents the primordial sound of creation — Nada Brahma. Its two heads represent pairs of opposites in creation: male-female, past-future, pleasure-pain.', 'When Shiva performed the Ananda Tandava, the sound of the Damaru gave birth to language. The 14 Maheshwara Sutras — the foundation of Sanskrit grammar — emerged from its beats.'],
    ['Ganga (Sacred River)', 'Matted Hair (Jata)', 'Ganga flowing from Shiva\'s matted locks represents His ability to absorb and neutralize the destructive force of the divine river while slowly releasing it to nurture the world.', 'When King Bhagirath brought Ganga to earth to liberate his ancestors, the force of her descent would have shattered the earth. Shiva agreed to catch her in His matted locks, breaking her fall and releasing her gently.'],
    ['Crescent Moon', 'Forehead', 'The crescent moon (Chandra) on Shiva\'s forehead represents time and the cyclical nature of the cosmos. It also symbolizes the nectar of immortality and the cooling, soothing aspect of Shiva.', 'The moon god Chandra was cursed by Daksha to wane and die. He sought refuge at Shiva\'s feet. Shiva placed him on His head, giving him protection and allowing him to wax and wane eternally rather than perish.'],
    ['Third Eye', 'Forehead (between eyebrows)', 'The third eye of Shiva represents omniscience, higher perception, and the power to destroy illusion. When opened, it burns away everything that is false.', 'When the god Kama (love) shot an arrow at Shiva while He meditated, the third eye opened and reduced Kama to ashes. It also burned the three celestial cities of the demon Tripurasura.'],
    ['Rudraksha Mala', 'Neck and Body', 'Rudraksha beads are sacred to Shiva. The word Rudraksha means the eye (aksha) of Rudra. Each bead is said to be a tear of compassion shed by Shiva for suffering beings.', 'Shiva meditated for thousands of years for the welfare of all beings. When He opened His eyes, tears of compassion fell to earth and became the Rudraksha tree. The beads protect the wearer and amplify spiritual practice.'],
    ['Serpent (Vasuki)', 'Neck / Body', 'The serpent Vasuki worn by Shiva represents the ego which, when under the Lord\'s control, becomes an ornament rather than a danger. Serpents also symbolize Kundalini energy.', 'Vasuki is the king of serpents. During the churning of the cosmic ocean, Vasuki served as the churning rope. Shiva wears Vasuki to show his dominion over time, death, and the ego.'],
    ['Tiger Skin', 'Waist/Seat', 'The tiger skin on which Shiva sits or which He wears represents victory over animal instincts, ferocity, and the ego. The tiger is the vehicle of Shakti — Shiva wearing its skin shows His mastery over primal energy.', 'A group of sages in the Deodar forest were performing rituals with worldly motives. To test them, Shiva appeared as a wandering mendicant. The sages sent a tiger to kill Him. Shiva slew the tiger effortlessly and wore its skin as a garland.'],
    ['Vibhuti (Sacred Ash)', 'Entire Body', 'Vibhuti — the sacred ash — is smeared all over Shiva\'s body. It represents the impermanence of matter: everything will eventually become ash. It is the ultimate truth of existence.', 'When Shiva burned Kama with His third eye, He smeared the ashes on His body. Vibhuti also symbolizes the burning of karma and ego in the fire of knowledge. Devotees apply three lines of Vibhuti to represent the destruction of the three types of karma.'],
    ['Kundala (Earrings)', 'Ears', 'Shiva wears two different earrings — one masculine (representing Shiva principle) and one feminine (representing Shakti). This represents the union of opposites in the divine.', 'The two different earrings on Shiva\'s ears — Kundala and Allataka — represent His nature as Ardhanarishvara, the divine union of male and female principles. They show that the universe itself arises from the balance of masculine and feminine energies.'],
  ];
  for (const [name, part, meaning, story] of ornaments) {
    await conn.query(
      `INSERT IGNORE INTO ornaments (name, body_part, meaning, story) VALUES (?, ?, ?, ?)`,
      [name, part, meaning, story]
    );
  }
  console.log('Ornaments seeded.');

  // Static Pages
  await conn.query(`INSERT IGNORE INTO pages (slug, title, content) VALUES
    ('about-us', 'About All About Shiva',
     '<h2>Our Mission</h2><p>All About Shiva is a devoted digital sanctuary for seekers, scholars, and devotees of Lord Shiva. Our mission is to preserve, present, and share the ancient wisdom surrounding the Mahadeva — the Great God — in an accessible and authentic way.</p><h2>What We Offer</h2><p>From the 1,008 names of Shiva to the most revered mantras and stotras, from the four sacred Vedas to the significance of every ornament He wears — we bring together the living tradition of Shaivism for the modern seeker.</p><h2>Our Approach</h2><p>All content is drawn from classical Sanskrit sources including the Vedas, Puranas, Agamas, and the commentaries of great acharyas. We believe knowledge should be both spiritually authentic and beautifully presented.</p>'),
    ('contact-us', 'Contact Us',
     '<h2>Get in Touch</h2><p>We welcome inquiries, corrections, suggestions, and contributions from scholars and devotees alike.</p><p>Email: <strong>contact@allaboutshiva.com</strong></p><p>For content contributions or corrections rooted in classical sources, please include references from primary texts (Vedas, Puranas, Agamas).</p>'),
    ('108-names', 'Ashtottara Shatanamavali — 108 Names of Shiva',
     '<h2>The 108 Sacred Names</h2><p>Reciting or reading the 108 names of Shiva is a complete spiritual practice. These names appear in the Shiva Purana and Linga Purana, and together they describe every aspect of the infinite Lord.</p><p>Visit our Names section to explore each name with meaning and story.</p>'),
    ('significance-of-shiva', 'The Significance of Lord Shiva',
     '<h2>Shiva in the Hindu Tradition</h2><p>Lord Shiva is one of the principal deities of Hinduism and the Supreme Being in the Shaiva traditions. He is the destroyer in the Hindu Trinity (Brahma-Vishnu-Shiva), but destruction in this context means transformation — the clearing away of the old to make room for the new.</p><h2>Shiva as Adiyogi</h2><p>The tradition recognizes Shiva as the first yogi (Adiyogi) who transmitted the science of yoga to the Saptarishis (seven sages) over 15,000 years ago on the banks of the Kantisarovar lake in the Himalayas.</p>')
  `);
  console.log('Pages seeded.');

  console.log('\n✅ Database seeded successfully!');
  console.log(`Admin login: ${process.env.ADMIN_EMAIL || 'admin@allaboutshiva.com'} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
  await conn.end();
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
