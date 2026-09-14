import mongoose from 'mongoose';
import Location from '../models/Location.js';

async function updateNoidaFaqs() {
  await mongoose.connect('mongodb://127.0.0.1:27017/oz_interstate');
  
  await Location.findOneAndUpdate(
    { slug: 'noida' },
    {
      $set: {
        faqTitle: 'Answers to your Noida moving questions',
        faqs: [
          {
            question: 'How does the interstate moving process work for Noida routes?',
            answer: 'Our professional team takes care of full protective packing, secure transport, real-time tracking, and room-by-room delivery at your destination.'
          },
          {
            question: 'Are moving goods insured during transit in Noida?',
            answer: 'Yes, comprehensive goods-in-transit insurance is provided on all residential and commercial moves.'
          },
          {
            question: 'How far in advance should I book my move?',
            answer: 'We recommend reserving your booking 2 to 3 weeks in advance to ensure your preferred moving date and vehicle size.'
          }
        ]
      }
    }
  );

  console.log('Noida FAQs cleaned and updated successfully!');
  await mongoose.disconnect();
}

updateNoidaFaqs().catch(console.error);
