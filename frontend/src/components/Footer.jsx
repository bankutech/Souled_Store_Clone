import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Brand */}
        <div className="footer-brand">
          <div className="logo-main">THE SOULED STORE</div>
          <p>India's premier destination for fan merchandise and trendy apparel. We design, manufacture and sell the most awesome products featuring your favourite characters and shows.</p>
          <div className="footer-social">
            {['📘','📸','🐦','▶️','📌'].map((icon, i) => (
              <a key={i} href="#" className="social-btn" aria-label={`social-${i}`}>{icon}</a>
            ))}
          </div>
        </div>

        {/* Help */}
        <div className="footer-col">
          <h4>Help</h4>
          <ul>
            {['Track My Order','Return & Exchange','Size Guide','FAQ','Contact Us','Store Locator'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            {['About Us','Careers','Press','Sustainability','Affiliate Program','Investor Relations'].map(item => (
              <li key={item}><a href="#">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h4>Stay In The Loop</h4>
          <p style={{ fontSize: '12px', color: '#888', marginBottom: '14px', lineHeight: '1.6' }}>
            Subscribe to get special offers, free giveaways, and new drops.
          </p>
          <div className="footer-newsletter">
            <input type="email" placeholder="Your email address" id="newsletter-email" />
            <button id="newsletter-submit">Subscribe Now →</button>
          </div>
          <p style={{ fontSize: '10px', color: '#555', marginTop: '10px' }}>
            🔒 We respect your privacy. No spam ever.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div style={{ borderTop: '1px solid #2a2a2a' }}>
        <div className="footer-bottom" style={{ maxWidth: '1400px', margin: '0 auto', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', fontSize: '11px', color: '#555' }}>
          <div>© 2025 The Souled Store Pvt. Ltd. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {['Privacy Policy','Terms of Service','Cookie Policy'].map(l => (
              <a key={l} href="#" style={{ color: '#555', transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = '#e11b23'}
                onMouseOut={e => e.target.style.color = '#555'}>{l}</a>
            ))}
          </div>
          <div className="payment-icons">
            {['VISA','MC','UPI','EMI','COD'].map(p => (
              <div key={p} className="pay-icon">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
