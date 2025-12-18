import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Zap, ArrowRight } from "lucide-react";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen gradient-subtle flex flex-col">
      <header className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl gradient-warm shadow-soft">
            <CalendarDays className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Mini Event</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link to="/auth?mode=register">
            <Button className="gradient-warm shadow-soft">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Create & Discover
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Amazing Events
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The simplest way to organize events, manage RSVPs, and bring people together. 
            Start hosting in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth?mode=register">
              <Button size="lg" className="gradient-warm shadow-soft w-full sm:w-auto">
                Create Your First Event
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          {[
            {
              icon: CalendarDays,
              title: "Easy Event Creation",
              description: "Create events in seconds with all the details your guests need.",
            },
            {
              icon: Users,
              title: "Smart RSVPs",
              description: "Track attendance with capacity limits and prevent overbooking.",
            },
            {
              icon: Zap,
              title: "Real-time Updates",
              description: "See who's coming instantly and manage your events on the go.",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="bg-card rounded-2xl p-6 shadow-card animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-xl gradient-warm flex items-center justify-center mb-4 shadow-soft">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© 2024 Mini Event Platform. Built with ❤️</p>
      </footer>
    </div>
  );
}
