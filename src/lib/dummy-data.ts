import { Database } from '@/types/database.types'

type Tables = Database['public']['Tables']
type City = Tables['cities']['Row']
type Category = Tables['categories']['Row']
type Restaurant = Tables['restaurants']['Row']
type Rating = Tables['ratings']['Row']
type MyListEntry = Tables['my_list_entries']['Row']
type RestaurantLocation = Tables['restaurant_locations']['Row']

// Cities
export const CITIES: City[] = [
    {
        id: 'london-city-id',
        name: 'London',
        slug: 'london',
        country: 'UK',
        created_at: '2024-01-01T00:00:00Z'
    }
]

// Categories
export const CATEGORIES: Category[] = [
    {
        id: 'burgers-id',
        name: 'Burgers',
        slug: 'burgers',
        description: 'The best burgers in London',
        is_special: false,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'pizza-id',
        name: 'Pizza',
        slug: 'pizza',
        description: 'Authentic pizza spots',
        is_special: false,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'fried-chicken-id',
        name: 'Fried Chicken',
        slug: 'fried-chicken',
        description: 'Crispy fried chicken',
        is_special: false,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'kebabs-id',
        name: 'Kebabs',
        slug: 'kebabs',
        description: 'Best kebabs in town',
        is_special: false,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'curry-id',
        name: 'Curry',
        slug: 'curry',
        description: 'Authentic curry houses',
        is_special: false,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'fish-and-chips-id',
        name: 'Fish & Chips',
        slug: 'fish-and-chips',
        description: 'Traditional fish and chips',
        is_special: false,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'guinness-id',
        name: 'Guinness',
        slug: 'guinness',
        description: 'Best pints of Guinness',
        is_special: true,
        created_at: '2024-01-01T00:00:00Z'
    }
]

// Restaurants
export const RESTAURANTS: Restaurant[] = [
    // Burgers
    {
        id: 'bleecker-burger-id',
        name: 'Bleecker Burger',
        city_id: 'london-city-id',
        neighbourhood: 'Victoria',
        address: '205 Victoria St, London SW1E 5NE',
        lat: 51.4965,
        lng: -0.1436,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'honest-burgers-id',
        name: 'Honest Burgers',
        city_id: 'london-city-id',
        neighbourhood: 'Soho',
        address: '4-6 Meard St, London W1F 0EF',
        lat: 51.5138,
        lng: -0.1329,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'patty-and-bun-id',
        name: 'Patty & Bun',
        city_id: 'london-city-id',
        neighbourhood: 'Soho',
        address: '18 Old Compton St, London W1D 4TN',
        lat: 51.5131,
        lng: -0.1316,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'shake-shack-id',
        name: 'Shake Shack',
        city_id: 'london-city-id',
        neighbourhood: 'Covent Garden',
        address: '24 Market Building, The Piazza, London WC2E 8RD',
        lat: 51.5118,
        lng: -0.1226,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'five-guys-id',
        name: 'Five Guys',
        city_id: 'london-city-id',
        neighbourhood: 'Covent Garden',
        address: '1-3 Long Acre, London WC2E 9LH',
        lat: 51.5127,
        lng: -0.1244,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    // Pizza
    {
        id: 'pizza-pilgrims-id',
        name: 'Pizza Pilgrims',
        city_id: 'london-city-id',
        neighbourhood: 'Soho',
        address: '11 Dean St, London W1D 3RP',
        lat: 51.5137,
        lng: -0.1321,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'franco-manca-id',
        name: 'Franco Manca',
        city_id: 'london-city-id',
        neighbourhood: 'Brixton',
        address: '4 Market Row, London SW9 8LD',
        lat: 51.4615,
        lng: -0.1145,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'santa-maria-id',
        name: 'Santa Maria',
        city_id: 'london-city-id',
        neighbourhood: 'Ealing',
        address: '15 St Mary\'s Rd, London W5 5RA',
        lat: 51.5110,
        lng: -0.3065,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'homeslice-id',
        name: 'Homeslice',
        city_id: 'london-city-id',
        neighbourhood: 'Covent Garden',
        address: '13 Neal\'s Yard, London WC2H 9DP',
        lat: 51.5145,
        lng: -0.1265,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'rudy-pizza-id',
        name: 'Rudy\'s Pizza',
        city_id: 'london-city-id',
        neighbourhood: 'Soho',
        address: '26 Peter St, London W1F 0AH',
        lat: 51.5142,
        lng: -0.1345,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    // Fried Chicken
    {
        id: 'chick-n-sours-id',
        name: 'Chick \'n\' Sours',
        city_id: 'london-city-id',
        neighbourhood: 'Haggerston',
        address: '390 Kingsland Rd, London E8 4AA',
        lat: 51.5481,
        lng: -0.0759,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'bird-id',
        name: 'Bird',
        city_id: 'london-city-id',
        neighbourhood: 'Shoreditch',
        address: '42 Kingsland Rd, London E2 8DA',
        lat: 51.5267,
        lng: -0.0780,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'mother-clucker-id',
        name: 'Mother Clucker',
        city_id: 'london-city-id',
        neighbourhood: 'Islington',
        address: '48 Chapel Market, London N1 9EW',
        lat: 51.5344,
        lng: -0.1088,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'wings-id',
        name: 'Wings',
        city_id: 'london-city-id',
        neighbourhood: 'Shoreditch',
        address: '15 Hoxton Market, London N1 6HG',
        lat: 51.5293,
        lng: -0.0821,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    // Kebabs
    {
        id: 'berber-and-q-id',
        name: 'Berber & Q',
        city_id: 'london-city-id',
        neighbourhood: 'Haggerston',
        address: 'Arch 338, Acton Mews, London E8 4EA',
        lat: 51.5391,
        lng: -0.0759,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'oklava-id',
        name: 'Oklava',
        city_id: 'london-city-id',
        neighbourhood: 'Shoreditch',
        address: '74 Luke St, London EC2A 4PY',
        lat: 51.5232,
        lng: -0.0873,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'le-bab-id',
        name: 'Le Bab',
        city_id: 'london-city-id',
        neighbourhood: 'Soho',
        address: '4-5 Kingly Ct, London W1B 5PW',
        lat: 51.5133,
        lng: -0.1399,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    // Curry
    {
        id: 'dishoom-id',
        name: 'Dishoom',
        city_id: 'london-city-id',
        neighbourhood: 'Shoreditch',
        address: '7 Boundary St, London E2 7JE',
        lat: 51.5246,
        lng: -0.0806,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'gymkhana-id',
        name: 'Gymkhana',
        city_id: 'london-city-id',
        neighbourhood: 'Mayfair',
        address: '42 Albemarle St, London W1S 4JH',
        lat: 51.5089,
        lng: -0.1419,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'hoppers-id',
        name: 'Hoppers',
        city_id: 'london-city-id',
        neighbourhood: 'Soho',
        address: '49 Frith St, London W1D 4SG',
        lat: 51.5141,
        lng: -0.1316,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'tayyabs-id',
        name: 'Tayyabs',
        city_id: 'london-city-id',
        neighbourhood: 'Whitechapel',
        address: '83-89 Fieldgate St, London E1 1JU',
        lat: 51.5176,
        lng: -0.0632,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    // Fish & Chips
    {
        id: 'poppies-id',
        name: 'Poppies Fish & Chips',
        city_id: 'london-city-id',
        neighbourhood: 'Spitalfields',
        address: '6-8 Hanbury St, London E1 6QR',
        lat: 51.5195,
        lng: -0.0715,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'golden-hind-id',
        name: 'The Golden Hind',
        city_id: 'london-city-id',
        neighbourhood: 'Marylebone',
        address: '73 Marylebone Ln, London W1U 2PN',
        lat: 51.5177,
        lng: -0.1538,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'hook-id',
        name: 'Hook Camden Town',
        city_id: 'london-city-id',
        neighbourhood: 'Camden',
        address: '65-69 Parkway, London NW1 7PP',
        lat: 51.5399,
        lng: -0.1436,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    // Guinness
    {
        id: 'guinness-storehouse-id',
        name: 'The Toucan',
        city_id: 'london-city-id',
        neighbourhood: 'Soho',
        address: '19 Carlisle St, London W1D 3BY',
        lat: 51.5134,
        lng: -0.1329,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'porterhouse-id',
        name: 'The Porterhouse',
        city_id: 'london-city-id',
        neighbourhood: 'Covent Garden',
        address: '21-22 Maiden Ln, London WC2E 7NA',
        lat: 51.5107,
        lng: -0.1239,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
    }
]

// Restaurant Categories (join table)
export const RESTAURANT_CATEGORIES = [
    // Burgers
    { restaurant_id: 'bleecker-burger-id', category_id: 'burgers-id' },
    { restaurant_id: 'honest-burgers-id', category_id: 'burgers-id' },
    { restaurant_id: 'patty-and-bun-id', category_id: 'burgers-id' },
    { restaurant_id: 'shake-shack-id', category_id: 'burgers-id' },
    { restaurant_id: 'five-guys-id', category_id: 'burgers-id' },
    // Pizza
    { restaurant_id: 'pizza-pilgrims-id', category_id: 'pizza-id' },
    { restaurant_id: 'franco-manca-id', category_id: 'pizza-id' },
    { restaurant_id: 'santa-maria-id', category_id: 'pizza-id' },
    { restaurant_id: 'homeslice-id', category_id: 'pizza-id' },
    { restaurant_id: 'rudy-pizza-id', category_id: 'pizza-id' },
    // Fried Chicken
    { restaurant_id: 'chick-n-sours-id', category_id: 'fried-chicken-id' },
    { restaurant_id: 'bird-id', category_id: 'fried-chicken-id' },
    { restaurant_id: 'mother-clucker-id', category_id: 'fried-chicken-id' },
    { restaurant_id: 'wings-id', category_id: 'fried-chicken-id' },
    // Kebabs
    { restaurant_id: 'berber-and-q-id', category_id: 'kebabs-id' },
    { restaurant_id: 'oklava-id', category_id: 'kebabs-id' },
    { restaurant_id: 'le-bab-id', category_id: 'kebabs-id' },
    // Curry
    { restaurant_id: 'dishoom-id', category_id: 'curry-id' },
    { restaurant_id: 'gymkhana-id', category_id: 'curry-id' },
    { restaurant_id: 'hoppers-id', category_id: 'curry-id' },
    { restaurant_id: 'tayyabs-id', category_id: 'curry-id' },
    // Fish & Chips
    { restaurant_id: 'poppies-id', category_id: 'fish-and-chips-id' },
    { restaurant_id: 'golden-hind-id', category_id: 'fish-and-chips-id' },
    { restaurant_id: 'hook-id', category_id: 'fish-and-chips-id' },
    // Guinness
    { restaurant_id: 'guinness-storehouse-id', category_id: 'guinness-id' },
    { restaurant_id: 'porterhouse-id', category_id: 'guinness-id' }
]

// Mock user ID (declared before RATINGS to avoid reference errors)
export const MOCK_USER_ID = 'mock-user-id'

// Ratings
export const RATINGS: Rating[] = [
    // Burgers
    { id: 'rating-1', user_id: null, restaurant_id: 'bleecker-burger-id', score: 9.2, review_text: 'Simple, juicy, perfect meat blend. The bacon cheeseburger is incredible.', source: 'google', created_at: '2024-01-15T00:00:00Z', updated_at: '2024-01-15T00:00:00Z' },
    { id: 'rating-2', user_id: null, restaurant_id: 'bleecker-burger-id', score: 8.8, review_text: 'Best burger in London, no contest.', source: 'google', created_at: '2024-01-16T00:00:00Z', updated_at: '2024-01-16T00:00:00Z' },
    { id: 'rating-3', user_id: null, restaurant_id: 'honest-burgers-id', score: 8.5, review_text: 'Great quality beef, love the rosemary chips.', source: 'google', created_at: '2024-01-17T00:00:00Z', updated_at: '2024-01-17T00:00:00Z' },
    { id: 'rating-4', user_id: null, restaurant_id: 'honest-burgers-id', score: 8.7, review_text: 'Consistently good burgers.', source: 'google', created_at: '2024-01-18T00:00:00Z', updated_at: '2024-01-18T00:00:00Z' },
    { id: 'rating-5', user_id: null, restaurant_id: 'patty-and-bun-id', score: 8.9, review_text: 'The Ari Gold is a masterpiece.', source: 'google', created_at: '2024-01-19T00:00:00Z', updated_at: '2024-01-19T00:00:00Z' },
    { id: 'rating-6', user_id: null, restaurant_id: 'shake-shack-id', score: 7.8, review_text: 'Good but overpriced for what it is.', source: 'google', created_at: '2024-01-20T00:00:00Z', updated_at: '2024-01-20T00:00:00Z' },
    { id: 'rating-7', user_id: null, restaurant_id: 'five-guys-id', score: 7.5, review_text: 'Decent burgers, love the customization.', source: 'google', created_at: '2024-01-21T00:00:00Z', updated_at: '2024-01-21T00:00:00Z' },

    // Pizza
    { id: 'rating-8', user_id: null, restaurant_id: 'pizza-pilgrims-id', score: 9.3, review_text: 'Best crust in London, hands down. Nduja pizza is fire.', source: 'google', created_at: '2024-01-22T00:00:00Z', updated_at: '2024-01-22T00:00:00Z' },
    { id: 'rating-9', user_id: null, restaurant_id: 'pizza-pilgrims-id', score: 9.0, review_text: 'Authentic Neapolitan pizza.', source: 'google', created_at: '2024-01-23T00:00:00Z', updated_at: '2024-01-23T00:00:00Z' },
    { id: 'rating-10', user_id: null, restaurant_id: 'franco-manca-id', score: 8.6, review_text: 'Sourdough base is incredible.', source: 'google', created_at: '2024-01-24T00:00:00Z', updated_at: '2024-01-24T00:00:00Z' },
    { id: 'rating-11', user_id: null, restaurant_id: 'santa-maria-id', score: 9.1, review_text: 'Worth the trip to Ealing.', source: 'google', created_at: '2024-01-25T00:00:00Z', updated_at: '2024-01-25T00:00:00Z' },
    { id: 'rating-12', user_id: null, restaurant_id: 'homeslice-id', score: 8.4, review_text: 'Great for sharing, fun atmosphere.', source: 'google', created_at: '2024-01-26T00:00:00Z', updated_at: '2024-01-26T00:00:00Z' },
    { id: 'rating-13', user_id: null, restaurant_id: 'rudy-pizza-id', score: 8.8, review_text: 'Proper Neapolitan style.', source: 'google', created_at: '2024-01-27T00:00:00Z', updated_at: '2024-01-27T00:00:00Z' },

    // Fried Chicken
    { id: 'rating-14', user_id: null, restaurant_id: 'chick-n-sours-id', score: 8.9, review_text: 'Korean fried chicken done right.', source: 'google', created_at: '2024-01-28T00:00:00Z', updated_at: '2024-01-28T00:00:00Z' },
    { id: 'rating-15', user_id: null, restaurant_id: 'bird-id', score: 8.3, review_text: 'Crispy and flavorful.', source: 'google', created_at: '2024-01-29T00:00:00Z', updated_at: '2024-01-29T00:00:00Z' },
    { id: 'rating-16', user_id: null, restaurant_id: 'mother-clucker-id', score: 8.5, review_text: 'Buttermilk fried chicken perfection.', source: 'google', created_at: '2024-01-30T00:00:00Z', updated_at: '2024-01-30T00:00:00Z' },
    { id: 'rating-17', user_id: null, restaurant_id: 'wings-id', score: 8.1, review_text: 'Great wings, good variety of sauces.', source: 'google', created_at: '2024-01-31T00:00:00Z', updated_at: '2024-01-31T00:00:00Z' },

    // Kebabs
    { id: 'rating-18', user_id: null, restaurant_id: 'berber-and-q-id', score: 8.7, review_text: 'Middle Eastern BBQ at its finest.', source: 'google', created_at: '2024-02-01T00:00:00Z', updated_at: '2024-02-01T00:00:00Z' },
    { id: 'rating-19', user_id: null, restaurant_id: 'oklava-id', score: 8.6, review_text: 'Turkish cuisine elevated.', source: 'google', created_at: '2024-02-02T00:00:00Z', updated_at: '2024-02-02T00:00:00Z' },
    { id: 'rating-20', user_id: null, restaurant_id: 'le-bab-id', score: 8.4, review_text: 'Modern take on kebabs.', source: 'google', created_at: '2024-02-03T00:00:00Z', updated_at: '2024-02-03T00:00:00Z' },

    // Curry
    { id: 'rating-21', user_id: null, restaurant_id: 'dishoom-id', score: 9.0, review_text: 'Black daal is legendary for a reason. Breakfast naan rolls are amazing.', source: 'google', created_at: '2024-02-04T00:00:00Z', updated_at: '2024-02-04T00:00:00Z' },
    { id: 'rating-22', user_id: null, restaurant_id: 'dishoom-id', score: 8.8, review_text: 'Best Indian in London.', source: 'google', created_at: '2024-02-05T00:00:00Z', updated_at: '2024-02-05T00:00:00Z' },
    { id: 'rating-23', user_id: null, restaurant_id: 'gymkhana-id', score: 9.4, review_text: 'Michelin-starred for a reason.', source: 'google', created_at: '2024-02-06T00:00:00Z', updated_at: '2024-02-06T00:00:00Z' },
    { id: 'rating-24', user_id: null, restaurant_id: 'hoppers-id', score: 8.7, review_text: 'Sri Lankan street food perfection.', source: 'google', created_at: '2024-02-07T00:00:00Z', updated_at: '2024-02-07T00:00:00Z' },
    { id: 'rating-25', user_id: null, restaurant_id: 'tayyabs-id', score: 8.5, review_text: 'Unbeatable value, amazing lamb chops.', source: 'google', created_at: '2024-02-08T00:00:00Z', updated_at: '2024-02-08T00:00:00Z' },

    // Fish & Chips
    { id: 'rating-26', user_id: null, restaurant_id: 'poppies-id', score: 8.2, review_text: 'Classic fish and chips done right.', source: 'google', created_at: '2024-02-09T00:00:00Z', updated_at: '2024-02-09T00:00:00Z' },
    { id: 'rating-27', user_id: null, restaurant_id: 'golden-hind-id', score: 8.4, review_text: 'Traditional and delicious.', source: 'google', created_at: '2024-02-10T00:00:00Z', updated_at: '2024-02-10T00:00:00Z' },
    { id: 'rating-28', user_id: null, restaurant_id: 'hook-id', score: 8.6, review_text: 'Fresh fish, sustainable sourcing.', source: 'google', created_at: '2024-02-11T00:00:00Z', updated_at: '2024-02-11T00:00:00Z' },

    // Guinness
    { id: 'rating-29', user_id: null, restaurant_id: 'guinness-storehouse-id', score: 8.8, review_text: 'Perfect pint every time.', source: 'google', created_at: '2024-02-12T00:00:00Z', updated_at: '2024-02-12T00:00:00Z' },
    { id: 'rating-30', user_id: null, restaurant_id: 'porterhouse-id', score: 8.5, review_text: 'Great atmosphere, well-poured Guinness.', source: 'google', created_at: '2024-02-13T00:00:00Z', updated_at: '2024-02-13T00:00:00Z' },

    // User ratings (for My List)
    { id: 'user-rating-1', user_id: MOCK_USER_ID, restaurant_id: 'pizza-pilgrims-id', score: 9.3, review_text: 'Best crust in London, hands down.', source: 'user', created_at: '2024-02-14T00:00:00Z', updated_at: '2024-02-14T00:00:00Z' },
    { id: 'user-rating-2', user_id: MOCK_USER_ID, restaurant_id: 'bleecker-burger-id', score: 9.2, review_text: 'Simple, juicy, perfect meat blend.', source: 'user', created_at: '2024-02-15T00:00:00Z', updated_at: '2024-02-15T00:00:00Z' },
    { id: 'user-rating-3', user_id: MOCK_USER_ID, restaurant_id: 'dishoom-id', score: 9.0, review_text: 'Black daal is legendary for a reason.', source: 'user', created_at: '2024-02-16T00:00:00Z', updated_at: '2024-02-16T00:00:00Z' },
    { id: 'user-rating-4', user_id: MOCK_USER_ID, restaurant_id: 'gymkhana-id', score: 9.4, review_text: 'Michelin-starred perfection.', source: 'user', created_at: '2024-02-17T00:00:00Z', updated_at: '2024-02-17T00:00:00Z' },
    { id: 'user-rating-5', user_id: MOCK_USER_ID, restaurant_id: 'chick-n-sours-id', score: 8.9, review_text: 'Korean fried chicken done right.', source: 'user', created_at: '2024-02-18T00:00:00Z', updated_at: '2024-02-18T00:00:00Z' }
]

// My List Entries
export const MY_LIST_ENTRIES: MyListEntry[] = [
    {
        id: 'mylist-1',
        user_id: MOCK_USER_ID,
        restaurant_id: 'pizza-pilgrims-id',
        position: 1,
        created_at: '2024-02-01T00:00:00Z',
        updated_at: '2024-02-01T00:00:00Z'
    },
    {
        id: 'mylist-2',
        user_id: MOCK_USER_ID,
        restaurant_id: 'bleecker-burger-id',
        position: 2,
        created_at: '2024-02-02T00:00:00Z',
        updated_at: '2024-02-02T00:00:00Z'
    },
    {
        id: 'mylist-3',
        user_id: MOCK_USER_ID,
        restaurant_id: 'dishoom-id',
        position: 3,
        created_at: '2024-02-03T00:00:00Z',
        updated_at: '2024-02-03T00:00:00Z'
    },
    {
        id: 'mylist-4',
        user_id: MOCK_USER_ID,
        restaurant_id: 'gymkhana-id',
        position: 4,
        created_at: '2024-02-04T00:00:00Z',
        updated_at: '2024-02-04T00:00:00Z'
    },
    {
        id: 'mylist-5',
        user_id: MOCK_USER_ID,
        restaurant_id: 'chick-n-sours-id',
        position: 5,
        created_at: '2024-02-05T00:00:00Z',
        updated_at: '2024-02-05T00:00:00Z'
    }
]

// Restaurant Locations (for restaurants with multiple locations)
export const RESTAURANT_LOCATIONS: RestaurantLocation[] = [
    {
        id: 'loc-1',
        restaurant_id: 'dishoom-id',
        name: 'Dishoom Shoreditch',
        address: '7 Boundary St, London E2 7JE',
        lat: 51.5246,
        lng: -0.0806,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'loc-2',
        restaurant_id: 'dishoom-id',
        name: 'Dishoom Covent Garden',
        address: '12 Upper St Martin\'s Ln, London WC2H 9FB',
        lat: 51.5126,
        lng: -0.1272,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z'
    },
    {
        id: 'loc-3',
        restaurant_id: 'dishoom-id',
        name: 'Dishoom King\'s Cross',
        address: '5 Stable St, London N1C 4AB',
        lat: 51.5356,
        lng: -0.1243,
        google_place_id: null,
        created_at: '2024-01-01T00:00:00Z'
    }
]
