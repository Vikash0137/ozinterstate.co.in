import mongoose from 'mongoose';
import Location from '../models/Location.js';

async function updateAdelaide() {
  await mongoose.connect('mongodb://127.0.0.1:27017/oz_interstate');
  
  await Location.findOneAndUpdate(
    { slug: 'adelaide' },
    {
      $set: {
        heroTitle: 'Interstate Removalists & Freight in Adelaide',
        heroSubtitle: 'Direct linehaul moving services connecting Adelaide with Melbourne, Sydney, Brisbane, Perth & all regional routes.',
        heroDescription: 'Fixed pricing, comprehensive transit insurance, and GPS-tracked modern vehicle fleet.',
        heroImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80',
        
        aboutTitle: 'About OZ Interstate Movers Adelaide',
        aboutSubtitle: 'South Australia’s Premier Interstate Logistics & Moving Hub',
        aboutDescription: 'OZ Interstate Movers provides specialized long-haul removalist and freight solutions for residential, corporate, and commercial clients in Adelaide. Our experienced team and modern fleet ensure safe, on-time delivery across Australia.',
        aboutImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
        
        customSectionBadge: 'Linehaul Network',
        customSectionTitle: 'Specialized Adelaide Linehaul & Freight Scope',
        customSectionSubtitle: 'Direct interstate departures connecting SA with Eastern and Western capitals.',
        customSectionContent: 'Our Adelaide linehaul operations provide dependable scheduling, secure palletized freight, and customized door-to-door moving services designed to minimize downtime and eliminate relocation friction.',
        customSectionImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80',
        customSectionBullets: [
          'Daily linehaul departures connecting Adelaide with Melbourne, Sydney & Perth',
          'Air-ride suspension linehaul fleet for fragile heavy transit',
          'Short-term and long-term secure containerized storage in Regency Park'
        ],
        
        faqs: [
          { question: 'How long does a move from Adelaide to Melbourne or Sydney take?', answer: 'Adelaide to Melbourne typically takes 24 to 48 hours, while moves to Sydney or Brisbane take 2 to 4 days depending on transit schedule.' },
          { question: 'Are all goods fully insured during transport to and from Adelaide?', answer: 'Yes, all shipments carried by OZ Interstate Movers include comprehensive goods-in-transit insurance coverage against fire, collision, overturning, and accidental loss.' },
          { question: 'Do you offer packing and unpacking services in Adelaide suburbs?', answer: 'Yes, our trained local team provides full packing, fragile item wrapping, furniture disassembly, and unpacking at your destination.' }
        ]
      }
    },
    { upsert: true }
  );

  console.log('Adelaide location updated successfully!');
  await mongoose.disconnect();
}

updateAdelaide().catch(console.error);
