// Mock restaurant databases for designated locations
const PRESET_LOCATIONS = {
  "shibuya": {
    name: "Shibuya, Tokyo",
    coordinates: "35.6580,139.7016",
    restaurants: [
      {
        name: "Ichiran Ramen Shibuya",
        address: "1-22-7 Jinnan, Shibuya, Tokyo",
        coordinates: "35.6625,139.7012",
        cuisine_type: "Ramen",
        price_range: "$$",
        average_rating: 4.6,
        review_count: 4850,
        signature_dish: "Classic Tonkotsu Ramen (with secret red sauce)",
        flags: [],
        review_velocity: 8.5,
        recent_comments: [
          "Best tonkotsu in Shibuya. The individual booths make it a focused, incredible dining experience.",
          "Customization is great, noodle texture was perfect, broth rich and flavorful.",
          "Long queue but moves fast. A must-try ramen landmark."
        ],
        peak_hours: "12:00 PM - 2:00 PM, 6:00 PM - 9:00 PM",
        optimal_arrival: "3:30 PM (low wait)",
        estimated_wait_minutes: 45,
        reservation_policy: "walk-in",
        booking_contact: "None (Walk-in only)",
        parking: "None",
        dietary_accommodations: ["gluten-free (limited)"],
        wheelchair_accessible: false,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: true,
        hourly_busyness: [10, 15, 30, 80, 95, 60, 40, 50, 75, 90, 85, 30] // 11am to 10pm
      },
      {
        name: "Sushi No Midori Shibuya",
        address: "Mark City 4F, 1-12-3 Dogenzaka, Shibuya, Tokyo",
        coordinates: "35.6585,139.6990",
        cuisine_type: "Sushi",
        price_range: "$$$",
        average_rating: 4.5,
        review_count: 2450,
        signature_dish: "Premium Anago (Whole Sea Eel) Nigiri",
        flags: [],
        review_velocity: 5.2,
        recent_comments: [
          "Superb quality sushi at a very reasonable price. Always a huge waitlist, so get a ticket early.",
          "The fatty tuna melted in my mouth. Incredible chef service.",
          "The wait is long but Mark City waiting area is indoor. Sushi is absolute top-tier."
        ],
        peak_hours: "11:30 AM - 1:30 PM, 5:30 PM - 8:30 PM",
        optimal_arrival: "4:45 PM (right before dinner tickets)",
        estimated_wait_minutes: 60,
        reservation_policy: "same-day",
        booking_contact: "+81 3-5458-0026",
        parking: "Mark City Parking (Paid)",
        dietary_accommodations: ["gluten-free (request soy sauce substitution)"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: true,
        hourly_busyness: [30, 90, 85, 40, 30, 70, 95, 99, 80, 50, 20, 0]
      },
      {
        name: "Shibuya Tokyu Foodshow Tempura",
        address: "2-24-1 Shibuya, Tokyo",
        coordinates: "35.6581,139.7025",
        cuisine_type: "Japanese",
        price_range: "$$",
        average_rating: 4.2,
        review_count: 850,
        signature_dish: "Glow-fried Ebi Tempura Bowl",
        flags: [],
        review_velocity: 3.1,
        recent_comments: [
          "Excellent quick bite. Batter is light and crispy.",
          "Very clean, quick service. Perfect for lunch.",
          "Small seating area but tempura is served piping hot."
        ],
        peak_hours: "12:00 PM - 1:00 PM",
        optimal_arrival: "11:30 AM",
        estimated_wait_minutes: 10,
        reservation_policy: "walk-in",
        booking_contact: "None",
        parking: "Paid public lot",
        dietary_accommodations: ["vegan (vegetable tempura options)"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: true,
        hourly_busyness: [15, 80, 50, 20, 15, 30, 45, 60, 50, 30, 10, 0]
      },
      {
        name: "Kobe Beef Kaiseki Shin",
        address: "2-25-12 Dogenzaka, Shibuya, Tokyo",
        coordinates: "35.6601,139.6974",
        cuisine_type: "Japanese / Steakhouse",
        price_range: "$$$$",
        average_rating: 4.8,
        review_count: 620,
        signature_dish: "A5 Kobe Beef Sirloin Kaiseki Course",
        flags: [],
        review_velocity: 4.8,
        recent_comments: [
          "Remarkable private room dining. The marbled beef literally dissolves. Exceptional sake pairing.",
          "Amazing chef explanations. Very intimate atmosphere, perfect for anniversary or business dinners.",
          "Expensively worth every single yen. Must reserve months in advance."
        ],
        peak_hours: "6:30 PM - 9:00 PM",
        optimal_arrival: "5:30 PM (first seating)",
        estimated_wait_minutes: 0,
        reservation_policy: "advance-booking",
        booking_contact: "shin-kaiseki.tokyo",
        parking: "Valet available",
        dietary_accommodations: ["halal (certified Kobe beef available on request)"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: false,
        hourly_busyness: [0, 0, 0, 0, 10, 40, 85, 95, 95, 80, 40, 10]
      },
      {
        name: "Shibuya Crossing Café",
        address: "1-2-1 Dogenzaka, Shibuya, Tokyo",
        coordinates: "35.6592,139.7006",
        cuisine_type: "Cafe / Western",
        price_range: "$$",
        average_rating: 3.9,
        review_count: 3200,
        signature_dish: "Crossing Latte Art and Fluffy Souffle Pancakes",
        flags: ["inconsistent_reviews"], // Flagged!
        review_velocity: 9.2,
        recent_comments: [
          "Amazing view of the scramble crossing, but food is average and service is slow.",
          "Pancakes were decent, but you pay for the location. Always crowded with tourists.",
          "Inconsistent cooking. My pancake was undercooked in the center, but the view is unmatched."
        ],
        peak_hours: "1:00 PM - 4:00 PM",
        optimal_arrival: "9:00 AM (opening)",
        estimated_wait_minutes: 30,
        reservation_policy: "walk-in",
        booking_contact: "None",
        parking: "None",
        dietary_accommodations: ["vegetarian"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: true,
        hourly_busyness: [40, 60, 75, 85, 95, 90, 80, 60, 50, 40, 20, 0]
      },
      {
        name: "Kaiseki Hanasaku",
        address: "1-15 Shibuya, Tokyo",
        coordinates: "35.6598,139.7042",
        cuisine_type: "Japanese",
        price_range: "$$$",
        average_rating: 4.4,
        review_count: 420,
        signature_dish: "Seasonal Crab Kaiseki Course",
        flags: ["temporary_closure"], // Closed!
        review_velocity: 0.1,
        recent_comments: [
          "Note: Currently closed for kitchen renovations until late summer.",
          "Fantastic crab meal. Quiet tatami rooms.",
          "Very authentic and peaceful."
        ],
        peak_hours: "6:00 PM - 8:30 PM",
        optimal_arrival: "N/A",
        estimated_wait_minutes: 0,
        reservation_policy: "advance-booking",
        booking_contact: "+81 3-3498-8739",
        parking: "None",
        dietary_accommodations: [],
        wheelchair_accessible: false,
        current_status: "closed",
        live_music: false,
        outdoor_seating: false,
        child_friendly: false,
        hourly_busyness: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
      {
        name: "L'Atelier de Shibuya",
        address: "2-10-12 Shibuya, Tokyo",
        coordinates: "35.6608,139.7058",
        cuisine_type: "French Bistro",
        price_range: "$$$",
        average_rating: 4.5,
        review_count: 310,
        signature_dish: "Confit de Canard (Crispy Duck Confit)",
        flags: [],
        review_velocity: 2.5,
        recent_comments: [
          "Charming French vibe in Shibuya. The duck confit was cooked beautifully.",
          "Nice wine selection. Cozy outdoor patio area which is rare in this neighborhood.",
          "Very romantic. Soft lighting, wonderful bread, attentive hosts."
        ],
        peak_hours: "7:00 PM - 9:30 PM",
        optimal_arrival: "6:00 PM",
        estimated_wait_minutes: 10,
        reservation_policy: "advance-booking",
        booking_contact: "latelier-shibuya.jp",
        parking: "Street parking nearby",
        dietary_accommodations: ["gluten-free options"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: true,
        outdoor_seating: true,
        child_friendly: true,
        hourly_busyness: [0, 0, 10, 20, 15, 35, 70, 95, 99, 85, 50, 20]
      },
      {
        name: "Shibuya Craft Beer Garden",
        address: "Roof of Shibuya Parco, 15-1 Udagawacho, Tokyo",
        coordinates: "35.6620,139.6987",
        cuisine_type: "Bar / Pub Food",
        price_range: "$$",
        average_rating: 4.3,
        review_count: 750,
        signature_dish: "Miso Glazed Chicken Wings & Local IPA",
        flags: [],
        review_velocity: 6.4,
        recent_comments: [
          "Superb rooftop venue. Craft beer from Japanese microbreweries. Outdoor seating is fantastic.",
          "Very lively. They have local acoustic bands performing on weekends.",
          "Great burgers and wings, child-friendly rooftop area during daytime."
        ],
        peak_hours: "6:00 PM - 10:00 PM",
        optimal_arrival: "5:00 PM (to catch sunset)",
        estimated_wait_minutes: 15,
        reservation_policy: "same-day",
        booking_contact: "via website",
        parking: "Parco Underground (Paid)",
        dietary_accommodations: ["vegan (plant burgers)", "gluten-free (cider option)"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: true,
        outdoor_seating: true,
        child_friendly: true,
        hourly_busyness: [5, 10, 20, 30, 45, 75, 90, 99, 95, 80, 50, 10]
      }
    ]
  },
  "greenwich": {
    name: "Greenwich Village, New York",
    coordinates: "40.7308,-74.0028",
    restaurants: [
      {
        name: "L'Artusi",
        address: "228 W 10th St, New York, NY 10014",
        coordinates: "40.7337,-74.0051",
        cuisine_type: "Italian",
        price_range: "$$$",
        average_rating: 4.7,
        review_count: 3200,
        signature_dish: "Roasted Mushroom Salad & Garganelli with Ragu",
        flags: [],
        review_velocity: 7.2,
        recent_comments: [
          "Outstanding Italian cuisine. The pasta is handmade and cooked to absolute perfection.",
          "Bar area is great if you don't have reservations. Lively atmosphere, great date spot.",
          "Mushroom salad is legendary. Excellent service every single time."
        ],
        peak_hours: "6:30 PM - 9:30 PM",
        optimal_arrival: "5:15 PM (bar seats)",
        estimated_wait_minutes: 30,
        reservation_policy: "advance-booking",
        booking_contact: "resy.com/lartusi",
        parking: "Garage down the street",
        dietary_accommodations: ["gluten-free pasta options", "vegetarian"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: true,
        child_friendly: true,
        hourly_busyness: [0, 0, 5, 15, 20, 55, 85, 98, 95, 80, 40, 10]
      },
      {
        name: "Joe's Pizza",
        address: "7 Carmine St, New York, NY 10014",
        coordinates: "40.7306,-74.0021",
        cuisine_type: "Pizza",
        price_range: "$",
        average_rating: 4.7,
        review_count: 9800,
        signature_dish: "Plain Cheese Slice",
        flags: [],
        review_velocity: 14.5,
        recent_comments: [
          "The quintessential New York slice. Fast, crispy, perfect cheese-to-sauce ratio.",
          "The queue is out the door but they serve you in 2 minutes. Unbelievable.",
          "Perfect late-night food. Still the best slice in Manhattan."
        ],
        peak_hours: "12:00 PM - 2:00 PM, 9:00 PM - 2:00 AM",
        optimal_arrival: "3:00 PM (low crowd)",
        estimated_wait_minutes: 5,
        reservation_policy: "walk-in",
        booking_contact: "None",
        parking: "None (Street only)",
        dietary_accommodations: ["vegetarian"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: true,
        hourly_busyness: [50, 70, 80, 50, 45, 65, 85, 95, 90, 85, 95, 99]
      },
      {
        name: "Minetta Tavern",
        address: "113 MacDougal St, New York, NY 10012",
        coordinates: "40.7301,-74.0003",
        cuisine_type: "American Steakhouse / French",
        price_range: "$$$$",
        average_rating: 4.6,
        review_count: 2850,
        signature_dish: "Black Label Burger (Dry-aged prime beef)",
        flags: [],
        review_velocity: 4.5,
        recent_comments: [
          "The Black Label burger is worth the hype. Rich, savory, and cooked to a perfect medium rare.",
          "Fabulous old-school tavern atmosphere. Feels like stepping back in time.",
          "Excellent steaks and pomme frites. Classic NYC institution."
        ],
        peak_hours: "7:00 PM - 10:00 PM",
        optimal_arrival: "5:30 PM (walk-in for tavern seating)",
        estimated_wait_minutes: 40,
        reservation_policy: "advance-booking",
        booking_contact: "minettatavernny.com",
        parking: "Valet on weekends",
        dietary_accommodations: ["gluten-free options"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: true,
        child_friendly: false,
        hourly_busyness: [0, 0, 10, 20, 25, 60, 90, 98, 95, 85, 50, 15]
      },
      {
        name: "Blue Hill",
        address: "75 Washington Pl, New York, NY 10011",
        coordinates: "40.7321,-74.0008",
        cuisine_type: "Farm-to-Table / Fine Dining",
        price_range: "$$$$",
        average_rating: 4.8,
        review_count: 940,
        signature_dish: "Farmer's Feast (Tasting Menu based on daily harvest)",
        flags: [],
        review_velocity: 1.8,
        recent_comments: [
          "Stellar seasonal menu. The fresh produce from Stone Barns is the real highlight.",
          "An intimate dining room tucked inside a brownstone. Perfect service.",
          "Expensive tasting menu, but it's an educational and delicious dining journey."
        ],
        peak_hours: "6:30 PM - 9:00 PM",
        optimal_arrival: "6:00 PM (first seating)",
        estimated_wait_minutes: 0,
        reservation_policy: "advance-booking",
        booking_contact: "bluehillfarm.com",
        parking: "None",
        dietary_accommodations: ["vegan (with 48h notice)", "gluten-free", "vegetarian"],
        wheelchair_accessible: false,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: false,
        hourly_busyness: [0, 0, 0, 0, 10, 30, 75, 95, 95, 85, 45, 10]
      },
      {
        name: "Bleecker Street Bistro",
        address: "189 Bleecker St, New York, NY 10012",
        coordinates: "40.7295,-74.0012",
        cuisine_type: "French Bistro",
        price_range: "$$",
        average_rating: 3.8,
        review_count: 420,
        signature_dish: "Moules Frites",
        flags: ["inconsistent_reviews"], // Flagged!
        review_velocity: 1.2,
        recent_comments: [
          "Frites were soggy and service was very neglectful. Cute patio though.",
          "Okay steak frites. Hostess was rude, but the wine list is inexpensive.",
          "Good location, but there are better French options in the Village."
        ],
        peak_hours: "12:00 PM - 2:00 PM, 6:00 PM - 8:00 PM",
        optimal_arrival: "4:00 PM",
        estimated_wait_minutes: 15,
        reservation_policy: "walk-in",
        booking_contact: "None",
        parking: "None",
        dietary_accommodations: [],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: true,
        child_friendly: true,
        hourly_busyness: [20, 60, 45, 20, 30, 65, 80, 85, 70, 50, 20, 0]
      },
      {
        name: "The Groove Jazz Club & Eatery",
        address: "125 MacDougal St, New York, NY 10012",
        coordinates: "40.7298,-73.9998",
        cuisine_type: "American / Bar Food",
        price_range: "$$",
        average_rating: 4.4,
        review_count: 1520,
        signature_dish: "Groove Smoked Burger & Craft Beers",
        flags: [],
        review_velocity: 5.6,
        recent_comments: [
          "Amazing live jazz music every night. The bands are top tier. Burger was delicious.",
          "Very energetic vibe. Cozy seating. Definitely make a reservation for live show seats.",
          "Great drinks, loud, fun, historic Greenwich vibe."
        ],
        peak_hours: "8:00 PM - 11:30 PM",
        optimal_arrival: "7:00 PM (for the early set)",
        estimated_wait_minutes: 20,
        reservation_policy: "advance-booking",
        booking_contact: "thegroovenyc.com",
        parking: "Street parking (difficult)",
        dietary_accommodations: ["vegetarian options"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: true,
        outdoor_seating: false,
        child_friendly: false,
        hourly_busyness: [0, 0, 0, 0, 10, 35, 60, 85, 99, 99, 90, 60]
      },
      {
        name: "Village Green Garden Cafe",
        address: "54 W 9th St, New York, NY 10011",
        coordinates: "40.7330,-73.9986",
        cuisine_type: "Cafe / Healthy",
        price_range: "$$",
        average_rating: 4.5,
        review_count: 680,
        signature_dish: "Avocado Sourdough Smash & Cold Brew",
        flags: [],
        review_velocity: 3.4,
        recent_comments: [
          "Gorgeous secret garden courtyard! So tranquil and relaxing.",
          "Very kid-friendly. They have high chairs and a toy basket. Great pastries.",
          "Delicious vegan bowls, friendly staff. Highly recommend the garden tables."
        ],
        peak_hours: "10:30 AM - 1:30 PM",
        optimal_arrival: "8:30 AM",
        estimated_wait_minutes: 10,
        reservation_policy: "walk-in",
        booking_contact: "None",
        parking: "Street parking",
        dietary_accommodations: ["vegan", "gluten-free options", "halal-friendly"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: true,
        child_friendly: true,
        hourly_busyness: [50, 85, 95, 80, 40, 20, 15, 10, 0, 0, 0, 0]
      }
    ]
  },
  "paris": {
    name: "7th Arrondissement, Paris",
    coordinates: "48.8566,2.3522",
    restaurants: [
      {
        name: "L'Ami Jean",
        address: "27 Rue Malar, 75007 Paris",
        coordinates: "48.8598,2.3055",
        cuisine_type: "Bistro / Basque",
        price_range: "$$$",
        average_rating: 4.6,
        review_count: 1450,
        signature_dish: "Riz au Lait (Famous Creamy Rice Pudding)",
        flags: [],
        review_velocity: 3.8,
        recent_comments: [
          "Incredible Basque bistro. Chef Stéphane Jégo is a genius. The rice pudding is monumental.",
          "Loud, chaotic, and incredibly delicious. Book weeks in advance.",
          "Rich flavors, heavy portions, amazing charcuterie. A classic Paris dining experience."
        ],
        peak_hours: "12:30 PM - 2:00 PM, 8:00 PM - 10:30 PM",
        optimal_arrival: "7:45 PM (right before opening)",
        estimated_wait_minutes: 15,
        reservation_policy: "advance-booking",
        booking_contact: "+33 1 47 05 86 85",
        parking: "Street parking (very hard)",
        dietary_accommodations: ["gluten-free options"],
        wheelchair_accessible: false,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: true,
        hourly_busyness: [0, 40, 90, 30, 0, 0, 10, 50, 95, 98, 80, 20]
      },
      {
        name: "Arpège",
        address: "84 Rue de Varenne, 75007 Paris",
        coordinates: "48.8553,2.3175",
        cuisine_type: "Fine Dining / Vegetarian-focused",
        price_range: "$$$$",
        average_rating: 4.7,
        review_count: 1200,
        signature_dish: "Chaud-Froid d'Oeuf (Warm/Cold Soft-Cooked Egg)",
        flags: [],
        review_velocity: 1.5,
        recent_comments: [
          "Alain Passard's mastery of vegetables is unparalleled. Every dish tells a farm-to-table story.",
          "Impeccable service, quiet and minimalist setting. Expensive but a culinary lifetime highlight.",
          "The estate-grown vegetables taste like nothing else on earth."
        ],
        peak_hours: "1:00 PM - 2:30 PM, 8:30 PM - 10:30 PM",
        optimal_arrival: "12:15 PM / 7:45 PM",
        estimated_wait_minutes: 0,
        reservation_policy: "advance-booking",
        booking_contact: "alain-passard.com",
        parking: "Valet parking",
        dietary_accommodations: ["vegan-friendly", "gluten-free", "vegetarian"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: false,
        child_friendly: false,
        hourly_busyness: [0, 20, 85, 50, 0, 0, 10, 45, 90, 95, 75, 10]
      },
      {
        name: "Fitzgerald Paris",
        address: "54 Boulevard de la Tour-Maubourg, 75007 Paris",
        coordinates: "48.8575,2.3112",
        cuisine_type: "Modern Bistro & Speakeasy",
        price_range: "$$$",
        average_rating: 4.4,
        review_count: 980,
        signature_dish: "Truffle Croque Monsieur & Custom Cocktails",
        flags: [],
        review_velocity: 4.2,
        recent_comments: [
          "Superb cocktails in the hidden speakeasy room in the back. Food in the front bistro is excellent.",
          "Very trendy vibe. Great music, wonderful staff. Perfect for a fun night out in the 7th.",
          "Chic atmosphere, delicious modern sharing plates."
        ],
        peak_hours: "8:00 PM - 11:30 PM",
        optimal_arrival: "7:00 PM (to get a good seat)",
        estimated_wait_minutes: 10,
        reservation_policy: "advance-booking",
        booking_contact: "fitzgerald.paris",
        parking: "Public parking lot nearby",
        dietary_accommodations: ["vegetarian options"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: true,
        outdoor_seating: true,
        child_friendly: false,
        hourly_busyness: [0, 0, 10, 20, 15, 30, 75, 95, 99, 99, 85, 40]
      },
      {
        name: "Café de l'Alma",
        address: "5 Avenue Rapp, 75007 Paris",
        coordinates: "48.8601,2.3015",
        cuisine_type: "French Bistro",
        price_range: "$$",
        average_rating: 4.1,
        review_count: 1100,
        signature_dish: "Eiffel Tower View Café Crème and Tartare de Boeuf",
        flags: ["inconsistent_reviews"], // Flagged!
        review_velocity: 5.6,
        recent_comments: [
          "Beautiful terrace with a view, but food is standard and overpriced. Waiters are very busy.",
          "Nice place to sit outside, but service can be extremely slow during tourist peak hours.",
          "Classic bistro. Tartare was okay. Coffee was nice but expensive."
        ],
        peak_hours: "12:00 PM - 3:00 PM, 6:00 PM - 9:00 PM",
        optimal_arrival: "9:30 AM",
        estimated_wait_minutes: 20,
        reservation_policy: "walk-in",
        booking_contact: "None",
        parking: "None",
        dietary_accommodations: ["vegetarian options"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: true,
        child_friendly: true,
        hourly_busyness: [30, 70, 85, 60, 45, 65, 90, 95, 80, 60, 30, 0]
      },
      {
        name: "L'Arrière Cour Garden Cafe",
        address: "18 Rue Saint-Dominique, 75007 Paris",
        coordinates: "48.8582,2.3218",
        cuisine_type: "Cafe / Bakery",
        price_range: "$$",
        average_rating: 4.5,
        review_count: 510,
        signature_dish: "Fresh Pistachio Croissant & Organic Matcha Latte",
        flags: [],
        review_velocity: 2.8,
        recent_comments: [
          "Hidden courtyard café. Extremely quiet, filled with plants and flowers.",
          "Very child-friendly with stroller access, kid plates, and incredibly friendly staff.",
          "Wonderful organic options. Excellent matcha and pastries."
        ],
        peak_hours: "9:30 AM - 12:30 PM",
        optimal_arrival: "8:00 AM (opening)",
        estimated_wait_minutes: 5,
        reservation_policy: "walk-in",
        booking_contact: "None",
        parking: "None",
        dietary_accommodations: ["vegan options", "gluten-free bread available"],
        wheelchair_accessible: true,
        current_status: "open",
        live_music: false,
        outdoor_seating: true,
        child_friendly: true,
        hourly_busyness: [40, 80, 95, 80, 50, 30, 20, 10, 0, 0, 0, 0]
      }
    ]
  }
};

// Deterministic pseudo-random number generator for custom locations
function createRandom(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return function() {
    h += h << 13;
    h ^= h >>> 7;
    h += h << 3;
    h ^= h >>> 17;
    h += h << 5;
    return ((h >>> 0) / 4294967296);
  };
}

// Haversine formula to compute distance in km
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Generate dynamic restaurants for custom locations
function generateCustomRestaurants(locationQuery, random) {
  const CUISINES = ["Italian", "French", "Japanese", "Ramen", "Sushi", "Cafe / Bakery", "Steakhouse", "Indian", "Mexican", "Vegetarian"];
  const DISHES = {
    "Italian": ["Handmade Truffle Cacio e Pepe", "Woodfired Margherita Pizza", "Slow-Braised Ragu Pappardelle"],
    "French": ["Classic Duck Confit", "Bordeaux Red Wine Coq au Vin", "Caramelized French Onion Soup"],
    "Japanese": ["Premium Omakase Box", "Wagyu Katsu Sando", "Crispy Vegetable Tempura"],
    "Ramen": ["Spicy Creamy Tonkotsu Ramen", "Black Garlic Shoyu Ramen", "Yuzu Shio Chicken Ramen"],
    "Sushi": ["Aburi Salmon Oshi Sushi", "Bluefin Tuna Nigiri Selection", "Dragon Maki Roll"],
    "Cafe / Bakery": ["Fluffy Souffle Pancakes", "Avocado Toast with Poached Egg", "Pistachio Almond Croissant"],
    "Steakhouse": ["Dry-Aged Ribeye Steak", "Wagyu Beef Smash Burger", "Slow-Cooked BBQ Short Ribs"],
    "Indian": ["Butter Chicken with Garlic Naan", "Slow-Cooked Lamb Rogan Josh", "Spiced Vegetable Biryani"],
    "Mexican": ["Birria Beef Tacos", "Chipotle Grilled Shrimp Quesadillas", "Avocado Street Corn Salad"],
    "Vegetarian": ["Roasted Cauliflower Steak", "Wild Mushroom Risotto", "Crispy Falafel Buddha Bowl"]
  };
  
  const STREET_NAMES = ["Grand Street", "Baker St", "Pine Ave", "Main St", "Broadway", "High St", "Maple Rd", "Ocean Blvd", "Market St", "Sunset Blvd"];
  const COMMENTS = [
    "Amazing flavors, highly recommended!",
    "Great service, nice decor, slightly pricey but worth it.",
    "Perfect spot for a date night. Ambient music was fantastic.",
    "Kid-friendly and spacious. The signature dish was stellar.",
    "Decent food, but the wait times can get crazy.",
    "A hidden gem! Low prices, high quality.",
    "Very friendly staff, clean dining room, excellent vegetarian options."
  ];

  const count = 7 + Math.floor(random() * 6); // 7 to 12 restaurants
  const list = [];

  const latCenter = 40.0 + (random() - 0.5) * 5.0;
  const lonCenter = -74.0 + (random() - 0.5) * 5.0;

  for (let i = 0; i < count; i++) {
    const cuisine = CUISINES[Math.floor(random() * CUISINES.length)];
    const priceLevels = ["$", "$$", "$$$", "$$$$"];
    const price = priceLevels[Math.floor(random() * priceLevels.length)];
    const rating = Math.round((4.0 + random() * 1.0) * 10) / 10;
    const reviewCount = 50 + Math.floor(random() * 3000);
    
    // Distance from epicenter
    const dist = Math.round((0.2 + random() * 4.5) * 10) / 10; // 0.2 to 4.7 km
    
    // Angles to generate lat/lng
    const angle = random() * Math.PI * 2;
    const lat = latCenter + (dist / 111.3) * Math.sin(angle);
    const lon = lonCenter + (dist / (111.3 * Math.cos(latCenter * Math.PI / 180))) * Math.cos(angle);

    const namePrefixes = ["Le", "The", "Old", "Golden", "Royal", "Bistro", "Casa", "Izakaya"];
    const nameSuffixes = ["Bistro", "Garden", "Kitchen", "Table", "House", "Spot", "Hub", "Cave"];
    const name = `${namePrefixes[Math.floor(random() * namePrefixes.length)]} ${cuisine} ${nameSuffixes[Math.floor(random() * nameSuffixes.length)]} ${i + 1}`;

    const flags = [];
    if (random() < 0.15) flags.push("inconsistent_reviews");
    if (random() < 0.08) flags.push("temporary_closure");

    const commentsList = [];
    for (let c = 0; c < 3; c++) {
      commentsList.push(COMMENTS[Math.floor(random() * COMMENTS.length)]);
    }

    list.push({
      name: name,
      address: `${100 + Math.floor(random() * 800)} ${STREET_NAMES[Math.floor(random() * STREET_NAMES.length)]}, ${locationQuery}`,
      coordinates: `${lat.toFixed(4)},${lon.toFixed(4)}`,
      cuisine_type: cuisine,
      price_range: price,
      average_rating: rating,
      review_count: reviewCount,
      signature_dish: DISHES[cuisine][Math.floor(random() * DISHES[cuisine].length)],
      flags: flags,
      review_velocity: Math.round((1.0 + random() * 10.0) * 10) / 10,
      recent_comments: commentsList,
      peak_hours: "12:00 PM - 2:00 PM, 6:30 PM - 9:00 PM",
      optimal_arrival: random() < 0.5 ? "5:30 PM" : "3:00 PM",
      estimated_wait_minutes: Math.floor(random() * 45),
      reservation_policy: random() < 0.3 ? "walk-in" : (random() < 0.7 ? "same-day" : "advance-booking"),
      booking_contact: random() < 0.3 ? "None" : `+1 212-555-${1000 + Math.floor(random() * 9000)}`,
      parking: random() < 0.5 ? "Street parking" : "Paid garage nearby",
      dietary_accommodations: random() < 0.5 ? ["vegetarian", "gluten-free"] : ["vegan", "vegetarian"],
      wheelchair_accessible: random() > 0.3,
      current_status: flags.includes("temporary_closure") ? "closed" : "open",
      live_music: random() < 0.25,
      outdoor_seating: random() > 0.4,
      child_friendly: random() > 0.3,
      hourly_busyness: Array.from({length: 12}, () => Math.floor(10 + random() * 89))
    });
  }

  return {
    name: locationQuery,
    coordinates: `${latCenter.toFixed(4)},${lonCenter.toFixed(4)}`,
    restaurants: list
  };
}

// Global scope initialization for simulator without ES modules
window.simulatePipeline = function(locationInput, cuisinePref, occasion, targetTime) {
  const seedString = `${locationInput}-${cuisinePref}-${occasion}`.toLowerCase();
  const random = createRandom(seedString);

  // Normalize location key
  const normKey = locationInput.toLowerCase();
  let selectedPreset = null;
  
  if (normKey.includes("shibuya") || normKey.includes("tokyo")) {
    selectedPreset = PRESET_LOCATIONS["shibuya"];
  } else if (normKey.includes("greenwich") || normKey.includes("new york") || normKey.includes("nyc") || normKey.includes("village")) {
    selectedPreset = PRESET_LOCATIONS["greenwich"];
  } else if (normKey.includes("paris") || normKey.includes("arrondissement") || normKey.includes("france")) {
    selectedPreset = PRESET_LOCATIONS["paris"];
  } else {
    // Generate dynamic city data deterministically
    selectedPreset = generateCustomRestaurants(locationInput, random);
  }

  const epicenterCoords = selectedPreset.coordinates;
  const [epicenterLat, epicenterLng] = epicenterCoords.split(",").map(Number);
  
  const logs = [];
  const addLog = (agent, msg) => {
    logs.push({ agent, message: msg, timestamp: new Date().toISOString() });
  };

  // --- AGENT 01: SCOUT AGENT ---
  addLog("01_scout_agent", `Received search request around Epicenter: ${selectedPreset.name} (${epicenterCoords})`);
  addLog("01_scout_agent", `Scanning Maps API, Yelp, local food blogs, and platforms in a 5km radius...`);
  
  let radius = 5.0;
  let rawVenues = [...selectedPreset.restaurants];
  
  // Filter by cuisine early if specified and not 'any'
  const filterCuisine = cuisinePref && cuisinePref.toLowerCase() !== "any" && cuisinePref.trim() !== "";
  if (filterCuisine) {
    const origCount = rawVenues.length;
    rawVenues = rawVenues.filter(r => r.cuisine_type.toLowerCase().includes(cuisinePref.toLowerCase()) || cuisinePref.toLowerCase().includes(r.cuisine_type.toLowerCase()));
    addLog("01_scout_agent", `Applied user cuisine filter: "${cuisinePref}". Screened from ${origCount} down to ${rawVenues.length} restaurants.`);
  }

  // Double check distances, assign calculated distances relative to epicenter
  rawVenues.forEach(v => {
    const [vLat, vLng] = v.coordinates.split(",").map(Number);
    v.distance_km = Math.round(calculateDistance(epicenterLat, epicenterLng, vLat, vLng) * 10) / 10;
  });

  // Quality check for Scout outputs
  const validatedScoutList = [];
  rawVenues.forEach(v => {
    // Check required fields
    if (v.name && v.address && v.average_rating && v.cuisine_type && v.price_range) {
      validatedScoutList.push(v);
    } else {
      addLog("01_scout_agent", `WARNING: Discarded restaurant "${v.name || 'Unnamed'}" due to missing critical fields.`);
    }
  });

  addLog("01_scout_agent", `Discovered ${validatedScoutList.length} total restaurants satisfying scope within ${radius} km radius.`);
  
  // Orchestrator QC Check: If the shortlist contains fewer than 3 venues, widen search radius
  if (validatedScoutList.length < 3) {
    radius += 1.0;
    addLog("00_orchestrator_agent", `QC GATEKEEPER ALERT: Scout discovered only ${validatedScoutList.length} venues. Instructing Scout to widen search radius to ${radius} km and re-run...`);
    addLog("01_scout_agent", `Re-scanning landscape with expanded radius: ${radius} km...`);
    if (filterCuisine) {
      addLog("01_scout_agent", `Found 2 additional matching venues under expanded radius.`);
    } else {
      addLog("01_scout_agent", `Found 3 additional venues under expanded radius.`);
    }
  }

  addLog("01_scout_agent", `Delivered validated Raw Restaurant Discovery Log containing ${validatedScoutList.length} entries.`);

  // --- AGENT 02: RANKING AGENT ---
  addLog("02_ranking_agent", `Received Raw Restaurant Discovery Log. Initiating cleaning and sentiment scoring.`);
  
  // Filter out closures and severe hygiene issues (average rating < 4.0 unless special search)
  const filterRatingThreshold = 4.0;
  const filteredRankList = validatedScoutList.filter(v => {
    if (v.flags.includes("temporary_closure") || v.current_status === "closed") {
      addLog("02_ranking_agent", `FILTERED OUT: "${v.name}" is currently closed or undergoing renovations.`);
      return false;
    }
    if (v.average_rating < filterRatingThreshold) {
      addLog("02_ranking_agent", `FILTERED OUT: "${v.name}" has average rating ${v.average_rating} (< ${filterRatingThreshold}).`);
      return false;
    }
    return true;
  });

  addLog("02_ranking_agent", `Analyzing local sentiment from latest reviews for ${filteredRankList.length} venues...`);
  
  // Score restaurants using custom ranking algorithm
  const rankedList = filteredRankList.map(v => {
    const overallRating = v.average_rating;
    const reviewVelocity = v.review_velocity;
    
    // Relevance based on occasion or vibe
    let intentRelevance = 4.0;
    if (occasion) {
      const occ = occasion.toLowerCase();
      if (occ.includes("date") && (v.price_range === "$$$" || v.price_range === "$$$$" || v.name.includes("Kaiseki") || v.cuisine_type.includes("French") || v.outdoor_seating)) {
        intentRelevance = 5.0;
      } else if (occ.includes("quick") && (v.price_range === "$" || v.cuisine_type.includes("Ramen") || v.cuisine_type.includes("Pizza") || v.reservation_policy === "walk-in")) {
        intentRelevance = 5.0;
      } else if (occ.includes("kid") || occ.includes("child") || occ.includes("family")) {
        intentRelevance = v.child_friendly ? 5.0 : 2.5;
      } else if (occ.includes("business") && (v.price_range === "$$$" || v.price_range === "$$$$")) {
        intentRelevance = 4.8;
      }
    }

    const normRating = (overallRating / 5.0) * 10;
    const normVelocity = (reviewVelocity / 15.0) * 10;
    const normRelevance = (intentRelevance / 5.0) * 10;
    
    const compositeScore = Math.round(((normRating * 0.5) + (normVelocity * 0.2) + (normRelevance * 0.3)) * 10) / 10;
    
    // Generate custom rationale
    let rationale = `Highly rated ${v.cuisine_type} option featuring excellent ${v.signature_dish}.`;
    if (v.review_velocity > 8.0) {
      rationale = `Trending rapidly in Shibuya with a review velocity of ${v.review_velocity}. Famous for its authentic flavor and signature: ${v.signature_dish}.`;
    } else if (overallRating >= 4.7) {
      rationale = `Exceptional neighborhood favorite with an overall rating of ${v.average_rating} stars. The ${v.signature_dish} is highly praised by locals.`;
    } else if (v.outdoor_seating && occasion && occasion.toLowerCase().includes("date")) {
      rationale = `Top pick for occasion due to its lovely outdoor terrace and high relevance for date night, featuring exquisite ${v.signature_dish}.`;
    }

    return {
      name: v.name,
      average_rating: v.average_rating,
      price_range: v.price_range,
      cuisine_type: v.cuisine_type,
      distance_km: v.distance_km,
      signature_dish: v.signature_dish,
      composite_score: compositeScore,
      score_breakdown: {
        overall_rating: overallRating,
        review_velocity: reviewVelocity,
        intent_relevance: intentRelevance
      },
      rationale: rationale,
      raw_details: v
    };
  });

  rankedList.sort((a, b) => b.composite_score - a.composite_score);
  
  rankedList.forEach((v, index) => {
    v.rank = index + 1;
  });

  addLog("02_ranking_agent", `Completed scoring. Created Ranked Shortlist with top ${rankedList.length} options.`);

  // --- AGENT 03: LOGISTICS AGENT ---
  addLog("03_logistics_agent", `Enriching ${rankedList.length} shortlisted venues with travel times, schedules, and accessibility details.`);
  
  const logisticsOutput = rankedList.map(item => {
    const raw = item.raw_details;
    const dist = raw.distance_km;
    const walking_minutes = Math.max(1, Math.round(dist * 12));
    const driving_minutes = Math.max(1, Math.round(dist * 3 + 2));
    const transit_minutes = Math.max(2, Math.round(dist * 5 + 4));

    return {
      name: item.name,
      travel_times: {
        walking_minutes,
        driving_minutes,
        transit_minutes
      },
      timing: {
        peak_hours: raw.peak_hours,
        optimal_arrival: raw.optimal_arrival,
        estimated_wait_minutes: raw.estimated_wait_minutes
      },
      reservation_policy: raw.reservation_policy,
      booking_contact: raw.booking_contact,
      parking: raw.parking,
      dietary_accommodations: raw.dietary_accommodations,
      wheelchair_accessible: raw.wheelchair_accessible,
      current_status: raw.current_status,
      live_music: raw.live_music,
      outdoor_seating: raw.outdoor_seating,
      child_friendly: raw.child_friendly,
      hourly_busyness: raw.hourly_busyness
    };
  });

  addLog("03_logistics_agent", `Successfully calculated logistics, travel vectors, accessibility flags, and reservation parameters.`);

  // --- AGENT 00: ORCHESTRATOR AGENT ---
  addLog("00_orchestrator_agent", `All backend logs received. Commencing final guide synthesis.`);
  
  const scoutsPickItem = rankedList[0];
  const scoutsPick = {
    name: scoutsPickItem ? scoutsPickItem.name : "None",
    reason: scoutsPickItem ? `Highest composite score (${scoutsPickItem.composite_score}/10) combining superior food quality, local review velocity, and matching dining intent. Try the signature dish: ${scoutsPickItem.signature_dish}!` : "No matching venues found."
  };

  let toneText = "a polished, informative style";
  if (occasion && (occasion.toLowerCase().includes("quick") || occasion.toLowerCase().includes("casual"))) {
    toneText = "a casual, bullet-oriented style";
  } else if (occasion && (occasion.toLowerCase().includes("date") || occasion.toLowerCase().includes("anniversary"))) {
    toneText = "an elegant, detailed narrative style";
  }

  addLog("00_orchestrator_agent", `Adapting writer tone to user request: using ${toneText}.`);

  let mdGuide = `# Personalized Dining Guide: ${selectedPreset.name}\n\n`;
  mdGuide += `This guide has been carefully compiled based on your preferences: **${cuisinePref || 'Any cuisine'}** for a **${occasion || 'casual meal'}** at **${targetTime || 'your target dining time'}**.\n\n`;
  
  rankedList.forEach(item => {
    const logi = logisticsOutput.find(l => l.name === item.name);
    mdGuide += `## Rank #${item.rank}: ${item.name} (${item.cuisine_type})\n`;
    mdGuide += `* **Composite Rating:** ⭐ ${item.average_rating}/5.0 (Scored: **${item.composite_score}/10**)\n`;
    mdGuide += `* **Price Range:** \`${item.price_range}\` | **Distance:** \`${item.distance_km} km\`\n`;
    mdGuide += `* **Signature Dish:** *${item.signature_dish}*\n`;
    mdGuide += `* **Logistics & Transit:** 🚶 ${logi.travel_times.walking_minutes} min walk | 🚗 ${logi.travel_times.driving_minutes} min drive | 🚇 ${logi.travel_times.transit_minutes} min transit\n`;
    mdGuide += `* **Wait Tip:** ${logi.timing.optimal_arrival} is the best arrival time. Expected wait: ~${logi.timing.estimated_wait_minutes} mins during peak hours (${logi.timing.peak_hours}).\n`;
    mdGuide += `* **Reservation Policy:** ${logi.reservation_policy.toUpperCase()} | Booking: *${logi.booking_contact}*\n`;
    mdGuide += `* **Vibe:** ${logi.outdoor_seating ? '🌿 Outdoor Seating' : ''} ${logi.live_music ? '🎵 Live Music' : ''} ${logi.wheelchair_accessible ? '♿ Accessible' : ''} ${logi.child_friendly ? '👶 Family Friendly' : ''}\n\n`;
    mdGuide += `> **Why it's here:** ${item.rationale}\n\n`;
  });

  mdGuide += `## 🌟 Scout's Pick\n`;
  mdGuide += `**${scoutsPick.name}**: ${scoutsPick.reason}\n`;

  addLog("00_orchestrator_agent", `Dining guide synthesized successfully. Assembling schema payload...`);

  // --- AGENT 04: DASHBOARD AGENT ---
  addLog("04_dashboard_agent", `Formatting final visual payload. Assembling interactive charts and card metadata.`);
  addLog("04_dashboard_agent", `Created Cuisine Distribution data & Price vs. Rating scatter coordinates.`);
  addLog("04_dashboard_agent", `Dashboard rendering complete. Deliver final output to user.`);

  const payload = {
    pipeline_metadata: {
      run_id: "sim-uuid-" + Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString(),
      epicenter: {
        coordinates: epicenterCoords,
        neighborhood: selectedPreset.name
      },
      radius_km: radius,
      user_intent: `Search for ${cuisinePref || 'any'} cuisine suitable for ${occasion || 'any occasion'} around ${locationInput}`
    },
    scout_output: {
      raw_discovery_log: validatedScoutList.map(v => ({
        name: v.name,
        address: v.address,
        coordinates: v.coordinates,
        distance_km: v.distance_km,
        cuisine_type: v.cuisine_type,
        price_range: v.price_range,
        average_rating: v.average_rating,
        review_count: v.review_count,
        signature_dish: v.signature_dish,
        flags: v.flags,
        current_status: v.current_status,
        live_music: v.live_music,
        outdoor_seating: v.outdoor_seating,
        child_friendly: v.child_friendly,
        hourly_busyness: v.hourly_busyness
      }))
    },
    ranking_output: {
      ranked_shortlist: rankedList.map(r => ({
        rank: r.rank,
        name: r.name,
        composite_score: r.composite_score,
        score_breakdown: r.score_breakdown,
        rationale: r.rationale
      }))
    },
    logistics_output: {
      operational_logs: logisticsOutput
    },
    final_guide: {
      curated_dining_guide: mdGuide,
      scouts_pick: scoutsPick
    }
  };

  return {
    logs,
    payload
  };
};
