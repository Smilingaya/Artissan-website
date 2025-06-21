import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Box
} from '@mui/material';
import EmailForm from '../components/common/EmailForm';
import VerificationForm from '../components/common/VerificationForm';
import ResetPasswordForm from '../components/common/ResetPasswordForm';
import StepHeader from '../components/common/StepHeader';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [splineLoaded, setSplineLoaded] = useState(false);
  
  // Handle email submission and move to verification step
  const handleEmailSubmit = (emailAddress) => {
    setEmail(emailAddress);
    setStep(2);
    // Here you would normally make an API call to send verification code
  };
  
  // Handle verification code submission and move to reset password step
  const handleVerificationSubmit = (code) => {
    setVerificationCode(code);
    setStep(3);
    // Here you would normally make an API call to verify the code
  };
  
  // Handle password reset completion
  const handleResetComplete = () => {
    // Here you would normally make an API call to update the password
    alert('Password successfully reset!');
    // Redirect to login page or show success message
  };
  
  // Handle going back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Define the title for each step
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Forgot Password';
      case 2:
        return 'Email Verification';
      case 3:
        return 'Reset Password';
      default:
        return 'Forgot Password';
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return <EmailForm onNext={handleEmailSubmit} />;
      case 2:
        return <VerificationForm email={email} onNext={handleVerificationSubmit} />;
      case 3:
        return <ResetPasswordForm onComplete={handleResetComplete} />;
      default:
        return <EmailForm onNext={handleEmailSubmit} />;
    }
  };

  useEffect(() => {
    // Load Spline script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@splinetool/viewer@1.9.98/build/spline-viewer.js';
    script.async = true;
    
    script.onload = () => {
      setSplineLoaded(true);
    };
    
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      document.head.appendChild(script);
    } else {
      setSplineLoaded(true);
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <Box sx={{ 
      height: '100vh', 
      background:  "linear-gradient(135deg,rgb(246, 255, 194) 0%,rgb(169, 171, 255) 100%)",
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Spline Background - Full Screen */}
      <Box sx={{ 
        position: 'absolute',
        width: '110%', 
        height: '110%',
        zIndex: 1
      }}>
        {splineLoaded && (
          <spline-viewer 
            url="https://prod.spline.design/qvG90DrXeuzBJpMf/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        )}
        {!splineLoaded && (
          <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: 'white', 
            fontSize: '18px'
          }}>
            Loading 3D Scene...
          </Box>
        )}
      </Box>

      {/* Form Overlay - Positioned to not block Spline interaction */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '22%',
        transform: 'translate(-50% , -50%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end', // Position form to the right
        zIndex: 10,
        padding: { xs: 2, sm: 4 },
        pointerEvents: 'none' // Allow clicks to pass through to Spline
      }}>
        <Container 
          maxWidth="xs"
          sx={{ 
            pointerEvents: 'auto', // Re-enable pointer events for the form itself
            marginRight: { xs: 0, md: 4 } // Add some margin on larger screens
          }}
        >
          <Card sx={{ 
            overflow: 'hidden',
            backdropFilter: 'blur(15px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            maxWidth: '400px'
        }}>
            <StepHeader 
              title={getStepTitle()} 
              onBack={handleBack}
            />
            {renderStep()}
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default ForgotPassword;