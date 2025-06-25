import { categories } from './categories'

export interface BlogPost {
  id: string
  title: string
  summary: string
  category: string
  tag: "Reviews" | "News" | "Guides" | "Trip Reports"
  author: string
  date: string
  readTime: string
  image?: string
  slug: string
}

export const posts: BlogPost[] = [
  {
    id: "1",
    title: "Maximize Your Airline Points",
    summary: "Learn how to strategically earn and redeem airline points for maximum value on your next trip. Discover insider techniques that frequent flyers use to get more from their miles and travel further for less.",
    category: "Airlines & Aviation",
    tag: "Guides",
    author: "Alex Thompson",
    date: "May 15, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/maximize-airline-points"
  },
  {
    id: "2",
    title: "Best Credit Cards for Travel",
    summary: "Discover the top credit cards that offer exceptional travel rewards, perks, and benefits for frequent travelers. Compare sign-up bonuses, earning rates, and redemption options to find your perfect travel companion.",
    category: "Credit Cards & Points",
    tag: "Reviews",
    author: "Sarah Chen",
    date: "May 12, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/best-credit-cards-travel"
  },
  {
    id: "3",
    title: "Top Hotels for Budget Travelers",
    summary: "Find luxury accommodations without breaking the bank. Our comprehensive guide covers the best hotel loyalty programs, booking strategies, and insider tips. Learn which hotel chains offer the best value and how to maximize elite status benefits.",
    category: "Hotels & Trip Reports",
    tag: "Trip Reports",
    author: "Michael Rodriguez",
    date: "May 10, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/budget-luxury-hotels"
  },
  {
    id: "4",
    title: "Hidden Gems: Off the Beaten Path",
    summary: "Explore lesser-known travel destinations that offer incredible experiences without the crowds and high costs. Discover beautiful locations that haven't been overrun by tourism and offer authentic cultural experiences.",
    category: "Travel Hacks & Deals",
    tag: "Guides",
    author: "Emma Wilson",
    date: "May 8, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/hidden-gems"
  },
  {
    id: "5",
    title: "Travel Hacking 101: Getting Started",
    summary: "A beginner's guide to travel hacking with step-by-step instructions on how to start maximizing your travel rewards. Learn the fundamentals of points programs and how to develop a strategy that works for your travel goals.",
    category: "Travel Hacks & Deals",
    tag: "Guides",
    author: "David Kim",
    date: "May 5, 2024",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/travel-hacking-101"
  },
  {
    id: "6",
    title: "Airline Status Match Guide",
    summary: "Learn how to leverage status match opportunities to quickly earn elite status with airlines. Our comprehensive guide covers the best times to book, how to leverage airline partnerships, and techniques for successful upgrades.",
    category: "Airlines & Aviation",
    tag: "News",
    author: "Lisa Patel",
    date: "May 3, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/airline-status-match"
  },
  // New credit card posts
  {
    id: "7",
    title: "Chase Sapphire Reserve Review 2024",
    summary: "An in-depth analysis of the Chase Sapphire Reserve credit card, including its benefits, rewards structure, and whether it's worth the annual fee. Learn how to maximize this premium travel card.",
    category: "Credit Cards & Points",
    tag: "Reviews",
    author: "Alex Thompson",
    date: "May 1, 2024",
    readTime: "11 min read",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/chase-sapphire-reserve-review"
  },
  {
    id: "8",
    title: "New Amex Platinum Benefits Announced",
    summary: "Breaking news: American Express has announced significant changes to the Platinum Card benefits. Here's everything you need to know about the new perks and how they affect cardholders.",
    category: "Credit Cards & Points",
    tag: "News",
    author: "Sarah Chen",
    date: "April 28, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/amex-platinum-updates"
  },
  {
    id: "9",
    title: "Credit Card Points vs. Cash Back",
    summary: "A comprehensive comparison of points-based and cash-back credit cards. Learn which type of card is best for your spending habits and travel goals.",
    category: "Credit Cards & Points",
    tag: "Guides",
    author: "Michael Rodriguez",
    date: "April 25, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/points-vs-cashback"
  },
  {
    id: "10",
    title: "My First Class Experience with Points",
    summary: "A detailed trip report of my first-class journey from New York to Tokyo, entirely booked with credit card points. Learn the strategies I used and tips for booking premium cabin awards.",
    category: "Credit Cards & Points",
    tag: "Trip Reports",
    author: "Emma Wilson",
    date: "April 22, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/first-class-tokyo"
  },
  {
    id: "11",
    title: "Best Business Credit Cards 2024",
    summary: "A roundup of the top business credit cards for entrepreneurs and small business owners. Compare rewards, benefits, and annual fees to find the perfect card for your business.",
    category: "Credit Cards & Points",
    tag: "Reviews",
    author: "David Kim",
    date: "April 20, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/best-business-cards"
  },
  {
    id: "12",
    title: "Credit Card Application Strategy",
    summary: "Learn how to strategically apply for credit cards to maximize your rewards while maintaining a healthy credit score. Tips for timing applications and managing multiple cards.",
    category: "Credit Cards & Points",
    tag: "Guides",
    author: "Lisa Patel",
    date: "April 18, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/credit-card-strategy"
  },
  // Additional Airlines & Aviation posts
  {
    id: "13",
    title: "Airline Alliance Guide",
    summary: "Understanding airline alliances and how to use them to your advantage. Learn about Star Alliance, Oneworld, and SkyTeam benefits and how to maximize your travel options.",
    category: "Airlines & Aviation",
    tag: "Guides",
    author: "Alex Thompson",
    date: "April 15, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/airline-alliance-guide"
  },
  {
    id: "14",
    title: "Best First Class Awards",
    summary: "Discover the most valuable first class award redemptions and how to book them. From Etihad's The Residence to Singapore Airlines Suites, find out which premium experiences are worth your points.",
    category: "Airlines & Aviation",
    tag: "Guides",
    author: "Sarah Chen",
    date: "April 12, 2024",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/best-first-class-awards"
  },
  // Additional Hotels & Trip Reports posts
  {
    id: "15",
    title: "Luxury Hotel Review: The Ritz-Carlton",
    summary: "An in-depth review of The Ritz-Carlton experience, from check-in to check-out. Learn about the amenities, service quality, and whether it's worth the premium price point.",
    category: "Hotels & Trip Reports",
    tag: "Reviews",
    author: "Michael Rodriguez",
    date: "April 10, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/ritz-carlton-review"
  },
  {
    id: "16",
    title: "Boutique Hotels in Paris",
    summary: "Discover hidden gem boutique hotels in Paris that offer authentic experiences away from the tourist crowds. From charming rooms to local neighborhood insights.",
    category: "Hotels & Trip Reports",
    tag: "Trip Reports",
    author: "Emma Wilson",
    date: "April 8, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/paris-boutique-hotels"
  },
  {
    id: "17",
    title: "Hotel Status Match Guide",
    summary: "Learn how to leverage hotel status match opportunities to quickly earn elite status. Our guide covers the best programs and strategies for successful matches.",
    category: "Hotels & Trip Reports",
    tag: "Guides",
    author: "David Kim",
    date: "April 5, 2024",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/hotel-status-match"
  },
  // Additional Travel Hacks & Deals posts
  {
    id: "18",
    title: "Secret Flight Booking Tips",
    summary: "Uncover lesser-known techniques for finding the best flight deals. From hidden city ticketing to mistake fares, learn the strategies that can save you hundreds on airfare.",
    category: "Travel Hacks & Deals",
    tag: "Guides",
    author: "Lisa Patel",
    date: "April 3, 2024",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/secret-flight-tips"
  },
  {
    id: "19",
    title: "Travel Insurance Guide",
    summary: "Everything you need to know about travel insurance, from what to look for to when it's worth the cost. Protect your trip investment with the right coverage.",
    category: "Travel Hacks & Deals",
    tag: "Guides",
    author: "Alex Thompson",
    date: "April 1, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop&crop=center",
    slug: "/blog/travel-insurance-guide"
  }
] 