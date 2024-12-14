import { useState } from 'react';

export default function Help() {
  const [activeTab, setActiveTab] = useState('faq');

  const faqData = [
    {
      question: 'How do I place an order?',
      answer:
        'To place an order, simply browse our products, add items to your cart, and proceed to checkout. Follow the prompts to enter your shipping and payment information.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay.',
    },
    {
      question: 'How long does shipping take?',
      answer:
        'Shipping times vary depending on your location and chosen shipping method. Typically, orders are delivered within 3-7 business days.',
    },
    {
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy for most items. Please refer to our Returns & Refunds page for more detailed information.',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden'>
        <div className='px-6 py-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-6'>Help Center</h1>
          <div className='mb-6'>
            <div className='sm:hidden'>
              <select
                id='tabs'
                name='tabs'
                className='block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
              >
                <option value='faq'>FAQ</option>
                <option value='contact'>Contact Us</option>
              </select>
            </div>
            <div className='hidden sm:block'>
              <nav className='flex space-x-4' aria-label='Tabs'>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`${
                    activeTab === 'faq'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  FAQ
                </button>
                <button
                  onClick={() => setActiveTab('contact')}
                  className={`${
                    activeTab === 'contact'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  } px-3 py-2 font-medium text-sm rounded-md`}
                >
                  Contact Us
                </button>
              </nav>
            </div>
          </div>
          {activeTab === 'faq' && (
            <div className='space-y-6'>
              {faqData.map((item, index) => (
                <div key={index} className='bg-gray-50 p-4 rounded-lg'>
                  <h3 className='text-lg font-medium text-gray-900 mb-2'>
                    {item.question}
                  </h3>
                  <p className='text-gray-600'>{item.answer}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'contact' && (
            <div>
              <p className='text-gray-600 mb-4'>
                If you couldn't find the answer to your question in our FAQ,
                please don't hesitate to contact us:
              </p>
              <ul className='space-y-2 text-gray-600'>
                <li>Email: support@example.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Hours: Monday - Friday, 9am - 5pm EST</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
