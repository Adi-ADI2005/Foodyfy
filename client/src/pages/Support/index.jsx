import { motion } from 'framer-motion';
import { FiMessageCircle, FiPhone, FiMail, FiHelpCircle, FiFlag } from 'react-icons/fi';
import './style.css';

const Support = () => {
  const FAQS = [
    { q: 'How long does delivery take?', a: 'Average delivery time is 20-30 minutes depending on your location and the restaurant.' },
    { q: 'Can I track my order?', a: 'Yes! Go to My Orders and click on any order to see real-time tracking updates.' },
    { q: 'How do I cancel my order?', a: 'You can cancel your order within 5 minutes of placing it from the Orders page.' },
    { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, net banking, and cash on delivery.' },
    { q: 'Is there a minimum order amount?', a: 'There is no minimum order amount, but orders below ₹500 will have a ₹30 delivery fee.' },
  ];

  return (
    <div className="support-page">
      <div className="support-container">
        <motion.div
          className="support-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>How can we help you?</h1>
          <p>We're here to help! Choose how you'd like to get in touch.</p>
        </motion.div>

        <div className="support-options">
          {[
            { icon: FiMessageCircle, title: 'Chat with Us', desc: 'Start a conversation', action: 'Start Chat', color: '#6c5ce7' },
            { icon: FiPhone, title: 'Call Us', desc: '+91 234 567 8900', action: 'Call Now', color: '#00b894' },
            { icon: FiMail, title: 'Email Us', desc: 'support@foodyfy.com', action: 'Send Email', color: '#0984e3' },
            { icon: FiFlag, title: 'Report an Issue', desc: 'Let us know', action: 'Report', color: '#e74c3c' },
          ].map(({ icon: Icon, title, desc, action, color }, i) => (
            <motion.div
              key={title}
              className="support-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="support-icon" style={{ background: color + '15', color }}>
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <button className="support-action-btn" style={{ background: color }}>
                {action}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="faq-section">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <FiHelpCircle /> Frequently Asked Questions
          </motion.h2>
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              className="faq-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <h4>{faq.q}</h4>
              <p>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;
