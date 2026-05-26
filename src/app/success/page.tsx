'use client';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f9f9f9',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '16px',
        textAlign: 'center',
        maxWidth: '500px',
        border: '1px solid #eee',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: '600', margin: '16px 0 8px', color: '#111' }}>
          Payment Successful!
        </h1>
        <p style={{ color: '#666', marginBottom: '32px', fontSize: '16px' }}>
          Welcome to VisaSeek AI Pro! You now have unlimited access.
        </p>
        <ul style={{ textAlign: 'left', marginBottom: '32px', listStyle: 'none', padding: 0 }}>
          {[
            'Unlimited AI messages',
            'File and image upload',
            'Refusal letter analysis',
            'Document generation',
            'Priority support'
          ].map(feature => (
            <li key={feature} style={{ 
              padding: '10px 0', 
              borderBottom: '1px solid #f0f0f0',
              fontSize: '15px',
              color: '#333'
            }}>
              ✅ {feature}
            </li>
          ))}
        </ul>
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'black',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            width: '100%',
            fontWeight: '500'
          }}
        >
          Start Chatting →
        </button>
      </div>
    </div>
  );
}
