import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/home');
  
  // This line won't be reached
  return null;
}
