import { redirect } from 'next/navigation';

export default function Home() {
  // ==========================================
  // @desc Root URL Redirect
  // This function intercepts anyone visiting the base URL (localhost:3000 or your future domain)
  // and instantly redirects them to the unified login page before any UI is rendered.
  // ==========================================
  
  redirect('/login');
}