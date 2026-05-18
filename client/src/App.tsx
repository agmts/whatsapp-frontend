import { createElement as h } from 'react';

export default function App() {
  return h('div', {
    style: {
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#0F1419',
      color: '#E8E4DF',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  h('div', null,
    h('h1', null, 'WhatsApp Dashboard'),
    h('p', null, 'Login Form Coming Soon')
  ));
}
