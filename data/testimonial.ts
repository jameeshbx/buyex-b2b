
export type Testimonial = {
  id: string
  name: string
  country: string
  flag: string
  position: { x: number; y: number }
  flagPosition: { top: string; right: string }
  image: string
  quote: string
  company: string
}

export const testimonials: Testimonial[] = [
  {
    id: "uk",
    name: "James Wilson",
    country: "United Kingdom",
    flag: "/united kingdom.png",
    position: { x: 47, y: 28 },
    flagPosition: { top: "mt-[400px]", right: "mr-[10px]" },
    image: "/girl.jpg",
    quote: "BuyExchange transformed how we manage international transactions. The platform's intuitive design saved us countless hours.",
    company: "TechSolutions UK",
  },
  {
    id: "australia",
    name: "Emma Thompson",
    country: "Australia",
    flag: "/australia.png",
    position: { x: 88, y: 65 },
    flagPosition: { top: "mt-[700px]", right: "mr-[-100px]" },
    image: "/boy.jpg",
    quote: "The customer service at BuyExchange is exceptional. They've helped us expand our business across the Asia-Pacific region.",
    company: "Sydney Digital",
  },
  {
    id: "canada",
    name: "Michael Chen",
    country: "Canada",
    flag: "/canada.png",
    position: { x: 20, y: 30 },
    flagPosition: { top: "mt-[350px]", right: "mr-[120px]" },
    image: "/b.jpg",
    quote: "BuyExchange's platform has streamlined our procurement process, making international purchases seamless and efficient.",
    company: "Maple Innovations",
  },
  {
    id: "china",
    name: "Li Wei",
    country: "China",
    flag: "/china.png",
    position: { x: 72, y: 34 },
    flagPosition: { top: "mt-[510px]", right: "mr-[125px]" },
    image: "/boy p.avif",
    quote: "Platform BuyExchange telah membantu kami memperluas jangkauan bisnis ke pasar global dengan mudah.。",
    company: "东方科技",
  },
  {
    id: "singapore",
    name: "Raj Patel",
    country: "Singapore",
    flag: "/singapore.png",
    position: { x: 70, y: 43 },
    flagPosition: { top: "mt-[600px]", right: "mr-[-700px]" },
    image: "/b.jpg",
    quote: "As a hub for international business, Singapore demands efficient solutions. BuyExchange delivers exactly what we need.",
    company: "Lion City Ventures",
  },
  {
    id: "south-korea",
    name: "Park Min-ho",
    country: "South Korea",
    flag: "/south korea.png",
    position: { x: 78, y: 36 },
    flagPosition: { top: "mt-[525px]", right: "mr-[-200px]" },
    image: "/boy.jpg",
    quote: "BuyExchange demands efficient solutions. BuyExchange delivers exactly what we need.",
    company: "Seoul Tech",
  },
  {
    id: "indonesia",
    name: "Aditya Wijaya",
    country: "Indonesia",
    flag: "/indonesia.png",
    position: { x: 73, y: 48 },
    flagPosition: { top: "mt-[650px]", right: "mr-[-110px]" },
    image: "/a.jpeg",
    quote: "Platform BuyExchange telah membantu kami memperluas jangkauan bisnis ke pasar global dengan mudah.",
    company: "Jakarta Digital",
  },
  {
    id: "brazil",
    name: "Carlos Silva",
    country: "Brazil",
    flag: "/brazil.png",
    position: { x: 32, y: 48 },
    flagPosition: { top: "mt-[800px]", right: "mr-[135px]" },
    image: "/a.jpeg",
    quote: "BuyExchange has revolutionized how we handle international transactions, making global business accessible.",
    company: "Rio Tech Solutions",
  },
  {
    id: "north-korea",
    name: "Anonymous User",
    country: "North Korea",
    flag: "/north korea.png",
    position: { x: 76, y: 32 },
    flagPosition: { top: "mt-[305px]", right: "mr-[-190px]" },
    image: "/b.jpg",
    quote: "The platform has helped our organization manage international transactions securely and efficiently.",
    company: "International Trade",
  }
];