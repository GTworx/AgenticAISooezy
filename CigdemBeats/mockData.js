const mockConcerts = {
  "dusseldorf": [
    {
      "id": "d1",
      "name": "Bad Bunny - DeBí TiRAR MáS FOToS Tour",
      "date": "2026-06-20",
      "time": "20:00",
      "venue": "MERKUR SPIEL-ARENA",
      "genre": "Latin / Reggaeton",
      "price": "€85.00 - €250.00",
      "image": "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.de",
      "description": "Global superstar Bad Bunny brings his high-energy production and Latin trap beats to Düsseldorf for a massive arena show."
    },
    {
      "id": "d2",
      "name": "Max Korzh - Live in Concert",
      "date": "2026-06-26",
      "time": "19:30",
      "venue": "MERKUR SPIEL-ARENA",
      "genre": "Hip Hop / Rock",
      "price": "€60.00 - €120.00",
      "image": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.de",
      "description": "Eastern European hitmaker Max Korzh returns to the stage with his signature blend of emotional lyrics and stadium-sized energy."
    },
    {
      "id": "d3",
      "name": "Afro Wave feat. Uncle Waffles",
      "date": "2026-06-27",
      "time": "22:00",
      "venue": "RheinRiff",
      "genre": "Electronic / Amapiano",
      "price": "€35.00 - €70.00",
      "image": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.de",
      "description": "Experience the infectious rhythms of Amapiano and Afro House with headliner Uncle Waffles at the unique RheinRiff indoor beach venue."
    },
    {
      "id": "d4",
      "name": "Die Toten Hosen - Trink Aus! Tour 2026",
      "date": "2026-07-03",
      "time": "18:00",
      "venue": "MERKUR SPIEL-ARENA",
      "genre": "Rock / Punk",
      "price": "€75.00 - €140.00",
      "image": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.de",
      "description": "Düsseldorf's legendary punk rock pioneers return to their hometown for a historic, high-octane stadium performance."
    },
    {
      "id": "d5",
      "name": "System Of A Down + Queens Of The Stone Age",
      "date": "2026-07-10",
      "time": "17:00",
      "venue": "D.LIVE Open Air Park",
      "genre": "Metal / Alternative",
      "price": "€95.00",
      "image": "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.de",
      "description": "A powerhouse double-bill featuring metal legends System Of A Down and desert-rock masters Queens Of The Stone Age."
    },
    {
      "id": "d6",
      "name": "OneRepublic - Summer Open Air",
      "date": "2026-07-18",
      "time": "19:00",
      "venue": "Arena im Düsseldorf Open Air Park",
      "genre": "Pop / Rock",
      "price": "€65.00 - €110.00",
      "image": "https://images.unsplash.com/photo-1487180142328-054b783fc471?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.de",
      "description": "Ryan Tedder and OneRepublic perform their chart-topping pop anthems under the stars in Düsseldorf."
    },
    {
      "id": "d7",
      "name": "Pitbull - Party After Dark Tour",
      "date": "2026-07-19",
      "time": "20:00",
      "venue": "Arena im Düsseldorf Open Air Park",
      "genre": "Pop / Dance",
      "price": "€70.00 - €150.00",
      "image": "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.de",
      "description": "Mr. Worldwide brings the party to Düsseldorf! Prepare for an evening of relentless dance hits and high energy."
    }
  ],
  "spain": [
    {
      "id": "s1",
      "name": "Mad Cool Festival 2026",
      "date": "2026-07-08",
      "time": "16:00",
      "venue": "Iberdrola Music (Madrid)",
      "genre": "Festival / Indie / Rock",
      "price": "€80.00 - €210.00",
      "image": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80",
      "url": "https://madcoolfestival.es",
      "description": "Celebrating its 10th anniversary, Mad Cool features massive headliners including Foo Fighters, Moby, Lorde, and Florence + The Machine."
    },
    {
      "id": "s2",
      "name": "Sónar Festival 2026",
      "date": "2026-06-18",
      "time": "15:00",
      "venue": "Fira Gran Via (Barcelona)",
      "genre": "Festival / Electronic",
      "price": "€90.00 - €290.00",
      "image": "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=600&q=80",
      "url": "https://sonar.es",
      "description": "The absolute benchmark for electronic music and digital art. Headliners include The Prodigy, Charlotte de Witte, and Skepta."
    },
    {
      "id": "s3",
      "name": "Primavera Sound 2026",
      "date": "2026-06-03",
      "time": "14:00",
      "venue": "Parc del Fòrum (Barcelona)",
      "genre": "Festival / Indie / Pop",
      "price": "€125.00 - €325.00",
      "image": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.primaverasound.com",
      "description": "A legendary multi-genre music festival by the sea, showcasing underground and superstar talent from around the world."
    },
    {
      "id": "s4",
      "name": "Bilbao BBK Live 2026",
      "date": "2026-07-09",
      "time": "17:00",
      "venue": "Kobetamendi (Bilbao)",
      "genre": "Festival / Alternative",
      "price": "€75.00 - €190.00",
      "image": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.bilbaobbklive.com",
      "description": "Set atop Kobetamendi mountain with stunning views of Bilbao, featuring Calvin Harris, Robbie Williams, and David Byrne."
    },
    {
      "id": "s5",
      "name": "Arenal Sound 2026",
      "date": "2026-07-30",
      "time": "16:00",
      "venue": "Burriana Beach (Castellón)",
      "genre": "Festival / Pop / Urban",
      "price": "€65.00 - €130.00",
      "image": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.arenalsound.com",
      "description": "Spain's premier beachside music festival, packed with sun, sea, and top-tier urban and Latin pop performances."
    }
  ],
  "london": [
    {
      "id": "l1",
      "name": "Coldplay - Music Of The Spheres Tour",
      "date": "2026-08-12",
      "time": "19:00",
      "venue": "Wembley Stadium",
      "genre": "Pop / Rock",
      "price": "£75.00 - £180.00",
      "image": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.co.uk",
      "description": "Coldplay brings their record-breaking, eco-friendly stadium spectacle back to Wembley for a series of glowing nights."
    },
    {
      "id": "l2",
      "name": "Fred Again.. - Infinite Sounds",
      "date": "2026-08-28",
      "time": "20:00",
      "venue": "Alexandra Palace",
      "genre": "Electronic",
      "price": "£45.00 - £90.00",
      "image": "https://images.unsplash.com/photo-1516873240891-4bf014598ab4?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.co.uk",
      "description": "UK electronic sensation Fred again.. returns home for a euphoric, immersive audio-visual show at Ally Pally."
    }
  ],
  "new york": [
    {
      "id": "n1",
      "name": "Billie Eilish - Hit Me Hard and Soft Tour",
      "date": "2026-10-15",
      "time": "19:30",
      "venue": "Madison Square Garden",
      "genre": "Alternative / Pop",
      "price": "$90.00 - $350.00",
      "image": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
      "url": "https://www.ticketmaster.com",
      "description": "Billie Eilish live in the heart of Manhattan, performing hits from her highly acclaimed album in a 360-degree stage setup."
    }
  ]
};

if (typeof module !== 'undefined') {
  module.exports = mockConcerts;
}
