import { createElement as h } from 'react';
import { useState } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber && password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPhoneNumber('');
    setPassword('');
  };

  if (isLoggedIn) {
    return h('div', { className: 'dashboard-container' },
      h('header', { className: 'dashboard-header' },
        h('div', { className: 'header-content' },
          h('img', { 
            src: 'https://cdn.manus.im/whatsapp-logo-gold.png',
            alt: 'WhatsApp',
            className: 'logo'
          }),
          h('h1', null, 'WhatsApp Monitoring'),
          h('button', {
            onClick: handleLogout,
            className: 'btn-logout'
          }, 'Logout')
        )
      ),
      
      h('main', { className: 'dashboard-main' },
        h('section', { className: 'section-hero' },
          h('div', { className: 'hero-content' },
            h('h2', null, 'Real-time Message Monitoring'),
            h('div', { className: 'accent-line' }),
            h('p', null, 'Monitor incoming messages with intelligent keyword detection and instant escalation alerts.')
          )
        ),

        h('section', { className: 'section-teal' },
          h('div', { className: 'section-content' },
            h('h3', null, 'Active Monitoring'),
            h('div', { className: 'monitoring-grid' },
              h('div', { className: 'card' },
                h('h4', null, '📨 Messages'),
                h('p', null, 'Real-time message tracking and analysis'),
                h('div', { className: 'stat' }, '0')
              ),
              h('div', { className: 'card' },
                h('h4', null, '🚨 Alerts'),
                h('p', null, 'Keyword-triggered escalations'),
                h('div', { className: 'stat' }, '0')
              ),
              h('div', { className: 'card' },
                h('h4', null, '⏱️ Response Time'),
                h('p', null, 'Average alert response'),
                h('div', { className: 'stat' }, '--')
              )
            )
          )
        ),

        h('section', { className: 'section-features' },
          h('div', { className: 'section-content' },
            h('h2', null, 'Key Features'),
            h('div', { className: 'accent-line' }),
            h('div', { className: 'features-grid' },
              h('div', { className: 'feature-card' },
                h('h4', null, 'Keyword Detection'),
                h('p', null, 'Automatically detect critical keywords in incoming messages')
              ),
              h('div', { className: 'feature-card' },
                h('h4', null, 'SMS Alerts'),
                h('p', null, 'Receive instant SMS notifications for urgent messages')
              ),
              h('div', { className: 'feature-card' },
                h('h4', null, 'Dashboard Alerts'),
                h('p', null, 'View all alerts in a centralized dashboard')
              ),
              h('div', { className: 'feature-card' },
                h('h4', null, 'Auto-Timeout'),
                h('p', null, 'Automatic timeout management for escalations')
              )
            )
          )
        )
      ),

      h('footer', { className: 'dashboard-footer' },
        h('p', null, '© 2026 WhatsApp Monitoring Dashboard. All rights reserved.')
      )
    );
  }

  return h('div', { className: 'login-container' },
    h('div', { className: 'login-wrapper' },
      h('div', { className: 'login-header' },
        h('img', { 
          src: 'https://cdn.manus.im/whatsapp-logo-gold.png',
          alt: 'WhatsApp',
          className: 'logo-large'
        }),
        h('h1', null, 'WhatsApp Dashboard'),
        h('div', { className: 'accent-line' }),
        h('p', { className: 'tagline' }, 'Professional Message Monitoring & Escalation System')
      ),

      h('form', {
        onSubmit: handleLogin,
        className: 'login-form'
      },
        h('div', { className: 'form-group' },
          h('label', null, 'Phone Number'),
          h('input', {
            type: 'tel',
            value: phoneNumber,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value),
            placeholder: '+44 7700 900000',
            required: true,
            className: 'form-input'
          })
        ),

        h('div', { className: 'form-group' },
          h('label', null, 'Password'),
          h('input', {
            type: 'password',
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
            placeholder: 'Enter your password',
            required: true,
            className: 'form-input'
          })
        ),

        h('button', {
          type: 'submit',
          className: 'btn-gold btn-large'
        }, 'Sign In')
      ),

      h('div', { className: 'login-features' },
        h('h3', null, 'Why Choose Our Dashboard?'),
        h('ul', null,
          h('li', null, '✓ Real-time message monitoring'),
          h('li', null, '✓ Intelligent keyword detection'),
          h('li', null, '✓ Instant SMS alerts'),
          h('li', null, '✓ Professional-grade security'),
          h('li', null, '✓ 24/7 monitoring capability')
        )
      )
    ),

    h('footer', { className: 'login-footer' },
      h('p', null, '© 2026 WhatsApp Monitoring Dashboard')
    )
  );
}
