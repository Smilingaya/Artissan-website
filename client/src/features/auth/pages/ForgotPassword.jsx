import React, { useState, useEffect } from 'react';
import { Box, Container, Card } from '@mui/material';
import EmailForm from '../components/common/EmailForm';
import VerificationForm from '../components/common/VerificationForm';
import ResetPasswordForm from '../components/common/ResetPasswordForm';
import StepHeader from '../components/common/StepHeader';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.98/build/spline-viewer.js';
    script.async = true;
    script.onload = () => setSplineLoaded(true);
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      document.head.appendChild(script);
    } else {
      setSplineLoaded(true);
    }
  }, []);

  const handleEmailSubmit = async (emailAddress) => {
    setEmail(emailAddress);
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/forgetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email: emailAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep(2);
    } catch (err) {
      console.error(err);
      // handle error in the form by passing it back via onNext callback or using context
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (enteredCode) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/verifyResetCode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ resetCode: enteredCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCode(enteredCode);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (newPassword) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/resetPassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Password reset successful!');
      navigate('/login');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (!loading && step > 1) setStep(step - 1);
  };

  return (
    <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', width: '110%', height: '110%', zIndex: 1 }}>
        {splineLoaded ? (
          <spline-viewer url="https://prod.spline.design/qvG90DrXeuzBJpMf/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', backgroundColor: '#000', color: '#fff' }}>
            Loading 3D…
          </Box>
        )}
      </Box>

      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, pointerEvents: 'none' }}>
        <Container maxWidth="xs" sx={{ pointerEvents: 'auto', marginRight: { md: 4 } }}>
          <Card sx={{ backdropFilter: 'blur(15px)', backgroundColor: 'rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <StepHeader
              title={
                step === 1 ? 'Forgot Password' :
                step === 2 ? 'Email Verification' :
                'Reset Password'
              }
              onBack={step > 1 ? handleBack : null}
            />

            {step === 1 && (
              <EmailForm onNext={handleEmailSubmit} loading={loading} />
            )}
            {step === 2 && (
              <VerificationForm email={email} onNext={handleVerifySubmit} loading={loading} />
            )}
            {step === 3 && (
              <ResetPasswordForm email={email} code={code} onComplete={handleResetSubmit} loading={loading} />
            )}
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
