'use client';

import Home from '@/pagesMain';
import Feature from '@/pagesMain/Feature';
import Working from '@/components/Working';
import Cta from '@/components/Cta';
import For from '@/components/For';
import Footer from '@/components/Footer';

export default function Page() {

  return (
    <main className="bg-[#FAFAFA]">
      <div id="home"><Home /></div>
      <div id="features"><Feature /></div>
      <div id="how-it-works"><Working /></div>
      <div id="who-can-use"><For /></div>
      <Cta />
      <Footer />
    </main>
  );
}
