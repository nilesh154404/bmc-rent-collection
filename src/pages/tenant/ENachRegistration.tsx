import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Banknote, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building,
  Shield,
  Smartphone,
  Lock,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/contexts/AuthContext';
import { banks, getOccupantLabel } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type ENachStep = 'intro' | 'npci_redirect' | 'bank_selection' | 'netbanking_login' | 'otp_verification' | 'mandate_confirm' | 'success';

const ENachRegistration: React.FC = () => {
  const { currentTenant, updateTenantENachStatus } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<ENachStep>('intro');
  const [formData, setFormData] = useState({
    tenantName: currentTenant?.name || '',
    mobile: currentTenant?.phone || '',
    email: currentTenant?.email || '',
    propertyId: currentTenant?.propertyNo || '',
    mandateAmount: currentTenant?.rentAmount || 25000,
    frequency: 'monthly',
    bankName: '',
    agreedToTerms: false,
  });
  const [netbankingData, setNetbankingData] = useState({
    customerId: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mandateId, setMandateId] = useState('');

  if (!currentTenant) {
    return <div>Loading...</div>;
  }

  const occupantLabel = getOccupantLabel(currentTenant.occupantType);

  // If already registered and active
  if (currentTenant.eNachStatus === 'active') {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="e-NACH Mandate Status"
          subtitle={`Manage your e-NACH mandate for automatic ${currentTenant.occupantType === 'lessee' ? 'lease' : 'rent'} payment`}
          breadcrumbs={[
            { label: 'Home', href: '/tenant/dashboard' },
            { label: 'e-NACH Registration' },
          ]}
        />
        
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">e-NACH Mandate Active</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your e-NACH mandate is active and working. {currentTenant.occupantType === 'lessee' ? 'Lease amount' : 'Rent'} will be automatically debited from your bank account on the 5th of each month.
              </p>
              
              <div className="bg-muted rounded-lg p-6 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mandate ID (UMRN)</span>
                  <span className="font-medium font-mono">UMRN2024006003</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">State Bank of India</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account</span>
                  <span className="font-medium">XXXX9876</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₹{currentTenant.rentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frequency</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registration Date</span>
                  <span className="font-medium">10 Jun 2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid Until</span>
                  <span className="font-medium">31 May 2028</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" onClick={() => navigate('/tenant/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If pending
  if (currentTenant.eNachStatus === 'pending') {
    return (
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          title="e-NACH Mandate Status"
          subtitle="Your mandate registration is in progress"
          breadcrumbs={[
            { label: 'Home', href: '/tenant/dashboard' },
            { label: 'e-NACH Registration' },
          ]}
        />
        
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-10 h-10 text-warning" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">Pending Bank Approval</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your e-NACH mandate has been submitted and is awaiting approval from your bank. This usually takes 2-3 business days.
              </p>
              
              <div className="bg-muted rounded-lg p-6 max-w-md mx-auto text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submission Date</span>
                  <span className="font-medium">15 Oct 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">HDFC Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">₹{currentTenant.rentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="warning">Pending Approval</Badge>
                </div>
              </div>

              <div className="pt-4">
                <Button variant="outline" onClick={() => navigate('/tenant/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleProceedToNpci = () => {
    if (!formData.bankName || !formData.agreedToTerms) {
      toast.error('Please select a bank and agree to the terms');
      return;
    }
    setStep('npci_redirect');
  };

  const handleNpciRedirect = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep('bank_selection');
      setIsProcessing(false);
    }, 2000);
  };

  const handleBankSelection = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setStep('netbanking_login');
      setIsProcessing(false);
    }, 1500);
  };

  const handleNetbankingLogin = () => {
    if (!netbankingData.customerId || !netbankingData.password) {
      toast.error('Please enter customer ID and password');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setStep('otp_verification');
      setIsProcessing(false);
    }, 2000);
  };

  const handleOtpVerification = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setStep('mandate_confirm');
      setIsProcessing(false);
    }, 1500);
  };

  const handleMandateConfirm = () => {
    setIsProcessing(true);
    const newMandateId = `UMRN2024${Date.now().toString().slice(-6)}`;
    setMandateId(newMandateId);
    setTimeout(() => {
      updateTenantENachStatus('active');
      setStep('success');
      toast.success('e-NACH mandate registered successfully!');
      setIsProcessing(false);
    }, 2500);
  };

  const stepLabels = [
    { key: 'intro', label: 'Details' },
    { key: 'npci_redirect', label: 'NPCI' },
    { key: 'bank_selection', label: 'Bank' },
    { key: 'netbanking_login', label: 'Login' },
    { key: 'otp_verification', label: 'OTP' },
    { key: 'mandate_confirm', label: 'Confirm' },
    { key: 'success', label: 'Complete' },
  ];

  const currentStepIndex = stepLabels.findIndex(s => s.key === step);

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((s, idx) => (
          <React.Fragment key={s.key}>
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                idx < currentStepIndex ? "bg-success text-success-foreground" :
                idx === currentStepIndex ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              )}>
                {idx < currentStepIndex ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span className={cn(
                "text-xs mt-1 hidden sm:block",
                idx === currentStepIndex ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {s.label}
              </span>
            </div>
            {idx < stepLabels.length - 1 && (
              <div className={cn(
                "flex-1 h-1 mx-2 rounded",
                idx < currentStepIndex ? "bg-success" : "bg-muted"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  // Step 1: Introduction & Details
  const renderIntroStep = () => (
    <Card>
      <CardHeader className="card-header-gov">
        <CardTitle className="flex items-center gap-2">
          <Banknote className="w-5 h-5" />
          e-NACH Registration - {occupantLabel} Details
        </CardTitle>
        <Badge variant="pending">Step 1 of 7</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            <strong>What is e-NACH?</strong><br />
            e-NACH (Electronic National Automated Clearing House) enables automatic debit of your {currentTenant.occupantType === 'lessee' ? 'lease amount' : 'rent'} from your bank account on scheduled dates. This ensures timely payments and avoids late fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{occupantLabel} Name</Label>
            <Input value={formData.tenantName} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input value={formData.mobile} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={formData.email} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Property ID</Label>
            <Input value={formData.propertyId} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>{currentTenant.occupantType === 'lessee' ? 'Lease Amount' : 'Rent Amount'} to Mandate (₹)</Label>
            <Input 
              type="number" 
              value={formData.mandateAmount}
              onChange={(e) => setFormData({ ...formData, mandateAmount: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label>Debit Frequency</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value) => setFormData({ ...formData, frequency: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Select Your Bank</Label>
            <Select 
              value={formData.bankName} 
              onValueChange={(value) => setFormData({ ...formData, bankName: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select bank for e-NACH mandate" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
          <Checkbox 
            id="terms" 
            checked={formData.agreedToTerms}
            onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
          />
          <div className="space-y-1">
            <Label htmlFor="terms" className="cursor-pointer">
              I authorize Bhopal Municipal Corporation to debit my bank account
            </Label>
            <p className="text-xs text-muted-foreground">
              By checking this box, I authorize automatic debits from my bank account for the specified amount and frequency as per the e-NACH mandate terms and conditions.
            </p>
          </div>
        </div>

        <Button 
          variant="gov" 
          size="xl" 
          className="w-full" 
          onClick={handleProceedToNpci}
          disabled={!formData.bankName || !formData.agreedToTerms}
        >
          Proceed to NPCI e-Mandate
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );

  // Step 2: NPCI Redirect
  const renderNpciRedirect = () => (
    <Card className="border-2 border-accent">
      <CardHeader className="bg-accent text-accent-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <CardTitle>Redirecting to NPCI e-Mandate Gateway</CardTitle>
              <p className="text-sm opacity-80">Secure Payment Infrastructure</p>
            </div>
          </div>
          <Badge className="bg-accent-foreground/20 text-accent-foreground">Step 2</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <ExternalLink className="w-12 h-12 text-accent" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">NPCI e-Mandate Gateway</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You will be redirected to the National Payments Corporation of India (NPCI) secure gateway to complete your e-NACH mandate registration.
            </p>
          </div>

          <div className="bg-muted rounded-lg p-4 max-w-md mx-auto text-left space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>RBI Regulated Payment System</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Your bank credentials are never shared</span>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setStep('intro')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button variant="gov" size="lg" onClick={handleNpciRedirect} disabled={isProcessing}>
              {isProcessing ? 'Redirecting...' : 'Proceed to NPCI Gateway'}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 3: Bank Selection (NPCI Page Simulation)
  const renderBankSelection = () => (
    <Card className="border-2 border-accent">
      <CardHeader className="bg-gradient-to-r from-accent to-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <CardTitle className="text-lg">NPCI e-Mandate</CardTitle>
              <p className="text-sm opacity-80">National Payments Corporation of India</p>
            </div>
          </div>
          <Badge className="bg-primary-foreground/20 text-primary-foreground">Simulation</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Select Your Bank</h3>
            <p className="text-sm text-muted-foreground">Choose your bank to proceed with e-NACH mandate registration</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {banks.slice(0, 6).map((bank) => (
              <div 
                key={bank}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md",
                  formData.bankName === bank 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border hover:border-primary/50"
                )}
                onClick={() => setFormData({ ...formData, bankName: bank })}
              >
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-center">{bank}</p>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Your login credentials are entered directly on your bank's secure website
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setStep('npci_redirect')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="gov" 
              onClick={handleBankSelection} 
              disabled={isProcessing || !formData.bankName}
            >
              {isProcessing ? 'Connecting...' : 'Continue to Bank Login'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 4: Netbanking Login (Bank Page Simulation)
  const renderNetbankingLogin = () => (
    <Card className="border-2 border-primary">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Building className="w-7 h-7" />
            </div>
            <div>
              <CardTitle className="text-lg">{formData.bankName}</CardTitle>
              <p className="text-sm opacity-80">Internet Banking - e-Mandate Authentication</p>
            </div>
          </div>
          <Badge className="bg-primary-foreground/20 text-primary-foreground">Simulation</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-w-sm mx-auto space-y-6">
          <div className="text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold">Secure Login</h3>
            <p className="text-sm text-muted-foreground">Enter your netbanking credentials</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Customer ID / User ID</Label>
              <Input 
                placeholder="Enter your customer ID"
                value={netbankingData.customerId}
                onChange={(e) => setNetbankingData({ ...netbankingData, customerId: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Demo: Enter any value</p>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input 
                type="password" 
                placeholder="Enter your password"
                value={netbankingData.password}
                onChange={(e) => setNetbankingData({ ...netbankingData, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">Demo: Enter any value</p>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <p className="text-xs text-warning flex items-center gap-2">
              <Shield className="w-4 h-4" />
              This is a secure simulation. No real banking credentials are required.
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep('bank_selection')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="gov" 
              className="flex-1"
              onClick={handleNetbankingLogin} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Authenticating...' : 'Login'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 5: OTP Verification
  const renderOtpVerification = () => (
    <Card className="border-2 border-primary">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <CardTitle className="text-lg">{formData.bankName}</CardTitle>
              <p className="text-sm opacity-80">OTP Verification</p>
            </div>
          </div>
          <Badge className="bg-primary-foreground/20 text-primary-foreground">Step 5</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="max-w-sm mx-auto space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold">Enter OTP</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a 6-digit OTP to your registered mobile number<br />
              <span className="font-medium">XXXXXX{currentTenant.phone.slice(-4)}</span>
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Enter 6-digit OTP</Label>
              <Input 
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="text-center text-2xl tracking-[0.5em] font-mono"
              />
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Demo OTP: <span className="font-mono font-bold">123456</span>
            </p>
          </div>

          <div className="text-center">
            <button className="text-sm text-primary hover:underline">
              Didn't receive OTP? Resend
            </button>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep('netbanking_login')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="gov" 
              className="flex-1"
              onClick={handleOtpVerification} 
              disabled={isProcessing || otp.length !== 6}
            >
              {isProcessing ? 'Verifying...' : 'Verify OTP'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 6: Mandate Confirmation
  const renderMandateConfirm = () => (
    <Card className="border-2 border-success">
      <CardHeader className="bg-success text-success-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="w-6 h-6" />
            <div>
              <CardTitle>Confirm e-NACH Mandate</CardTitle>
              <p className="text-sm opacity-80">Review and authorize the mandate</p>
            </div>
          </div>
          <Badge className="bg-success-foreground/20 text-success-foreground">Step 6</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Authentication Successful</h3>
            <p className="text-sm text-muted-foreground">Please review the mandate details below</p>
          </div>

          <div className="bg-muted rounded-lg p-6 space-y-4">
            <h4 className="font-semibold text-foreground border-b border-border pb-2">Mandate Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Beneficiary</p>
                <p className="font-medium">Bhopal Municipal Corporation</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reference</p>
                <p className="font-medium">{currentTenant.propertyNo}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Debit Amount</p>
                <p className="font-medium text-lg">₹{formData.mandateAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Frequency</p>
                <p className="font-medium capitalize">{formData.frequency}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bank</p>
                <p className="font-medium">{formData.bankName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account</p>
                <p className="font-medium">XXXXXX5678</p>
              </div>
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{new Date().toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">End Date</p>
                <p className="font-medium">{currentTenant.contractEndDate}</p>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
            <p className="text-sm text-foreground">
              <strong>Important:</strong> By confirming, you authorize Bhopal Municipal Corporation to debit ₹{formData.mandateAmount.toLocaleString()} from your account on the 5th of every month until the contract end date.
            </p>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep('otp_verification')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button 
              variant="success" 
              className="flex-1"
              onClick={handleMandateConfirm} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm & Submit Mandate'}
              <CheckCircle2 className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Step 7: Success
  const renderSuccess = () => (
    <Card>
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-14 h-14 text-success" />
          </div>
          
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              e-NACH Registration Successful!
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your e-NACH mandate has been registered successfully. {currentTenant.occupantType === 'lessee' ? 'Lease amount' : 'Rent'} will be automatically debited from your bank account.
            </p>
          </div>

          <div className="bg-success/5 border border-success/20 rounded-lg p-6 max-w-md mx-auto text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mandate ID (UMRN)</span>
              <span className="font-medium font-mono">{mandateId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-medium">{formData.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">₹{formData.mandateAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frequency</span>
              <span className="font-medium capitalize">{formData.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registration Date</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="success">Active</Badge>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground">
              📧 A confirmation email has been sent to {currentTenant.email}
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/tenant/history')}>
              View Payment History
            </Button>
            <Button variant="gov" onClick={() => navigate('/tenant/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="e-NACH Registration"
        subtitle={`Setup automatic ${currentTenant.occupantType === 'lessee' ? 'lease' : 'rent'} payment through your bank`}
        breadcrumbs={[
          { label: 'Home', href: '/tenant/dashboard' },
          { label: 'e-NACH Registration' },
        ]}
      />

      {renderProgressBar()}

      {step === 'intro' && renderIntroStep()}
      {step === 'npci_redirect' && renderNpciRedirect()}
      {step === 'bank_selection' && renderBankSelection()}
      {step === 'netbanking_login' && renderNetbankingLogin()}
      {step === 'otp_verification' && renderOtpVerification()}
      {step === 'mandate_confirm' && renderMandateConfirm()}
      {step === 'success' && renderSuccess()}
    </div>
  );
};

export default ENachRegistration;
