import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TestAPI: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      console.log('Testing login with:', { email, password });
      
      const result = await axios.post(
        'https://dev.authentication.payplatter.in/auth/sign-in',
        {
          username: email,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );

      console.log('Success:', result.data);
      setResponse(result.data);
    } catch (err: any) {
      console.error('Error:', err);
      const errorMsg = err.response?.data?.message || err.message;
      setError(`${err.response?.status || 'Error'}: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      
      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={testLogin} disabled={loading}>
          {loading ? 'Testing...' : 'Test Login'}
        </Button>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {response && (
          <div className="p-4 bg-green-100 text-green-700 rounded">
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestAPI;
