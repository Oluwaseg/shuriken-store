import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I track my order?',
    answer:
      'You can track your order by logging into your account and visiting the "Order History" section. There, you\'ll find a tracking number for each shipped order.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for most items. Products must be in their original condition and packaging. Please visit our Returns page for more details.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes, we ship to many countries worldwide. Shipping costs and delivery times vary depending on the destination. You can check available shipping options during checkout.',
  },
  {
    question: 'How can I change or cancel my order?',
    answer:
      "If you need to change or cancel your order, please contact our customer support team as soon as possible. We'll do our best to accommodate your request if the order hasn't been shipped yet.",
  },
];

interface FAQSectionProps {
  onStartLiveChat: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ onStartLiveChat }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='p-4 space-y-4'>
      <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
        Frequently Asked Questions
      </h3>
      {faqs.map((faq, index) => (
        <div
          key={index}
          className='border-b border-gray-200 dark:border-gray-700 pb-4'
        >
          <button
            className='flex justify-between items-center w-full text-left'
            onClick={() => toggleFAQ(index)}
          >
            <span className='font-medium text-gray-700 dark:text-gray-300'>
              {faq.question}
            </span>
            {openIndex === index ? (
              <ChevronUp className='text-gray-500 dark:text-gray-400' />
            ) : (
              <ChevronDown className='text-gray-500 dark:text-gray-400' />
            )}
          </button>
          {openIndex === index && (
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              {faq.answer}
            </p>
          )}
        </div>
      ))}
      <p className='text-center text-gray-600 dark:text-gray-400 mt-4'>
        Can't find what you're looking for?{' '}
        <button
          onClick={onStartLiveChat}
          className='text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
        >
          Chat with us
        </button>
      </p>
    </div>
  );
};

export default FAQSection;
