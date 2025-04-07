
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { ShoppingBag, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginUser, registerUser } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Check for redirect path from previous location
  const from = location.state?.from?.pathname || '/profile';

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLoginData(prev => ({ ...prev, [id.replace('login-', '')]: value }));
    setLoginError(""); // Clear error when user changes input
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignupData(prev => ({ ...prev, [id.replace('signup-', '')]: value }));
    setSignupError(""); // Clear error when user changes input
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoading(true);
    
    if (!loginData.email || !loginData.password) {
      setLoginError("Please enter both email and password");
      setIsLoading(false);
      return;
    }
    
    try {
      await loginUser(loginData.email, loginData.password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to AuctionBliss!",
      });
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      setLoginError(error.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");
    setIsLoading(true);
    
    if (!signupData.name || !signupData.email || !signupData.password) {
      setSignupError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords don't match");
      setIsLoading(false);
      return;
    }
    
    if (signupData.password.length < 6) {
      setSignupError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }
    
    try {
      await registerUser(signupData.email, signupData.password, signupData.name);
      
      toast({
        title: "Account created",
        description: "Welcome to AuctionBliss! Your account has been created.",
      });
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Signup error:", error);
      
      if (error.code === 'auth/email-already-in-use') {
        setSignupError("This email is already registered. Please use a different email or login.");
      } else {
        setSignupError(error.message || "There was a problem creating your account.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="auction-container py-12 flex justify-center">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-auction-light p-3">
              <ShoppingBag className="h-8 w-8 text-auction-purple" />
            </div>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    {loginError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input 
                        id="login-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required
                        value={loginData.email}
                        onChange={handleLoginChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="login-password" 
                        type="password" 
                        required
                        value={loginData.password}
                        onChange={handleLoginChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Join AuctionBliss to start bidding on unique items
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    {signupError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{signupError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input 
                        id="signup-name" 
                        placeholder="John Smith" 
                        required
                        value={signupData.name}
                        onChange={handleSignupChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required
                        value={signupData.email}
                        onChange={handleSignupChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Create Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        required
                        value={signupData.password}
                        onChange={handleSignupChange}
                        minLength={6}
                      />
                      <p className="text-xs text-muted-foreground">Password must be at least 6 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirmPassword">Confirm Password</Label>
                      <Input 
                        id="signup-confirmPassword" 
                        type="password" 
                        required
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : "Create Account"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to AuctionBliss's{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
