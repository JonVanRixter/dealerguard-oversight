import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      navigate(result.redirect, { replace: true });
    } else {
      setError("error" in result ? result.error : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="w-full max-w-md mx-4">
        <div className="bg-card rounded-lg shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">DealerGuard</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-md">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition"
                placeholder="Enter your password"
                required
              />
            </div>
          <button
              type="submit"
              className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-semibold hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          {/* Demo Bypass — POC / Internal Testing Only */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Quick access — POC demo only</p>
            <button
              onClick={() => {
                const result = login("tcg@thecomplianceguys.co.uk", "TCGAdmin2026");
                if (result.success) navigate(result.redirect, { replace: true });
              }}
              className="w-full py-2 rounded-md bg-accent text-accent-foreground text-sm font-semibold hover:opacity-90 transition"
            >
              Enter as TCG Oversight
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
