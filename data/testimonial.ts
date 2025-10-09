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
  // Germany
  {
    id: "germany-1",
    name: "Renil George Cyric student testimonial",
    country: "Germany country icon",
    flag: "/study-germany-secure-fee-transfer.webp",
    position: { x: 55, y: 88 },
    flagPosition: { top: "mt-[380px]", right: "mr-[25px]" },
    image: "/smooth-study-abroad-fee-transfer.webp",
    quote: "BuyEx Forex provides exceptional service with quick and efficient transactions, making them a top choice for all your exchange needs.",
    company: "Germany Resident"
  },
  {
    id: "germany-2",
    name: "Alex Joseph student testimonial",
    country: "Germany study abroad payment icon",
    flag: "/study-germany-secure-fee-transfer.webp",
    position: { x: 43, y: 80 },
    flagPosition: { top: "mt-[390px]", right: "mr-[30px]" },
    image: "/alex-study-abroad-payment-story.webp",
    quote: "I really had a great experience with the team. Excellent customer service and fast processing.",
    company: "Germany Resident"
  },
  {
    id: "germany-3",
    name: "Abhishek S student testimonial",
    country: "Germany Study Abroad Fee Transfer Partner",
    flag: "/study-germany-secure-fee-transfer.webp",
    position: { x: 37, y: 32 },
    flagPosition: { top: "mt-[227px]", right: "mr-[35px]" },
    image: "/abhishek-secure-fee-transfer.webp",
    quote: "It was a good and fast. Felt happy.",
    company: "Germany Resident"
  },

  // Canada
  {
    id: "canada-1",
    name: "Darshana D",
    country: "Canada country icon",
    flag: "/study-canada-hassle-free-transfer.webp",
    position: { x: 18, y: 25 },
    flagPosition: { top: "mt-[320px]", right: "mr-[110px]" },
    image: "/darshana.png",
    quote: "Excellent service provided by this team. Really happy with the support they provide 😊",
    company: "Humber University Student"
  },

  // United Kingdom
  {
    id: "uk-1",
    name: "Mansoor Manu",
    country: "United Kingdom",
    flag: "/united kingdom.png",
    position: { x: 58, y: 23 },
    flagPosition: { top: "mt-[202px]", right: "mr-[15px]" },
    image: "/Manzoor.jpeg",
    quote: "Very well satisfied! They provided me a travel card and currency in GBP at the best rate available in the market.",
    company: "UK Resident"
  },
  {
    id: "uk-2",
    name: "Revathy Murali",
    country: "UK country icon",
    flag: "/study-uk-secure-fee-payment.webp",
    position: { x: 80, y: 25 },
    flagPosition: { top: "mt-[360px]", right: "mr-[20px]" },
    image: "/revathy.png",
    quote: "I had a good experience with Buyex Forex. Mr.Mukthadir guided me through out my journey.",
    company: "Student UK"
  },
  {
    id: "uk-3",
    name: "Shibila Nizam",
    country: "UK country icon",
    flag: "/study-uk-secure-fee-payment.webp",
    position: { x: 50, y: 27 },
    flagPosition: { top: "mt-[539px]", right: "mr-[25px]" },
    image: "/Sibla Nizam.jpeg",
    quote: "Buyex Forex dealt with my tuition fees which was much faster than a reputed nationalised bank.",
    company: "Student UK"
  },

  // United States
  {
    id: "usa-1",
    name: "Viswanathan NP",
    country: "USA country icon",
    flag: "/study-usa-affordable-fee-transfer.webp",
    position: { x: 30, y: 32 },
    flagPosition: { top: "mt-[420px]", right: "mr-[100px]" },
    image: "/viswanathan.jpeg",
    quote: "Good rate compare with others, excellent transaction within time and had a very good service during the process.",
    company: "USA Resident"
  },
  {
    id: "usa-2",
    name: "Prashanth Mudugal",
    country: "USA country icon",
    flag: "/study-usa-affordable-fee-transfer.webp",
    position: { x: 22, y: 60 },
    flagPosition: { top: "mt-[594px]", right: "mr-[105px]" },
    image: "/Prashanth Mudugal.jpg",
    quote: "Very professional and personal service was offered. Went a step ahead and got me the lowest exchange rate.",
    company: "USA Resident"
  },
  {
    id: "usa-3",
    name: "Haritha VK",
    country: "USA country icon",
    flag: "/study-usa-affordable-fee-transfer.webp",
    position: { x: 95, y: 30 },
    flagPosition: { top: "mt-[864px]", right: "mr-[95px]" },
    image: "/ppVK.jpg",
    quote: "Very good service and excellent exchange rates.",
    company: "USA Resident"
  },
  {
    id: "usa-4",
    name: "Hari Santoor",
    country: "USA country icon",  // Changed from "United states" to "United States"
    flag: "/study-usa-affordable-fee-transfer.webp",
    position: { x: 70, y: 35 },
    flagPosition: { top: "mt-[450px]", right: "mr-[40px]" },
    image: "/Hari Santoor.jpeg",
    quote: "The explanation regarding our doubts from Mr Ratheesh was very clear and he took our transactions with personal care.",
    company: "USA Resident"
  },

  // Hong Kong
  {
    id: "hongkong",
    name: "Meera Kanakamma Mohan",
    country: "Hong Kong country icon",
    flag: "/study-hongkong-safe-fee-transfer.svg",
    position: { x: 95, y: 32 },
    flagPosition: { top: "mt-[440px]", right: "mr-[130px]" },
    image: "/meera.png",
    quote: "Their response to my request for international remittance was too quick. Ratheesh kept in touch throughout the process.",
    company: "Hong Kong Resident"
  },

  // Australia
  {
    id: "australia",
    name: "Ambili Sreeraj",
    country: "Australia country icon",
    flag: "/study-australia-easy-fee-payment.webp",
    position: { x: 85, y: 60 },
    flagPosition: { top: "mt-[650px]", right: "mr-[-90px]" },
    image: "/Ambil.jpeg",
    quote: "Team Buyex Forex supported me at the right time to do my first ever outward remittance of paying my tuition fee.",
    company: "Student Australia"
  },

  // Croatia
  {
    id: "croatia",
    name: "Nitin P Ajayan",
    country: "Croatia country icon",
    flag: "/study-croatia-online-fee-transfer.webp",
    position: { x: 86, y: 30 },
    flagPosition: { top: "mt-[227px]", right: "mr-[45px]" },
    image: "/nithinajayan.jpg",
    quote: "It was great, easy, and helpful. I was delighted with their service when I was searching for a solution.",
    company: "Croatia Resident"
  }
];