import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Plus, LogOut, Loader2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date_time: string;
  location: string;
  capacity: number;
  attendees: string[];
  created_by: string;
}

export default function Dashboard() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date_time", new Date().toISOString())
      .order("date_time", { ascending: true });

    if (error) {
      toast({ title: "Error", description: "Failed to load events", variant: "destructive" });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  const handleRsvp = async (eventId: string) => {
    if (!user) return;
    setRsvpLoading(eventId);
    
    const { data, error } = await supabase.rpc("rsvp_to_event", {
      event_id: eventId,
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to RSVP", variant: "destructive" });
    } else if (data && typeof data === 'object' && 'success' in data) {
      const result = data as { success: boolean; message: string };
      if (result.success) {
        toast({ title: "Success!", description: result.message });
        fetchEvents();
      } else {
        toast({ title: "Cannot RSVP", description: result.message, variant: "destructive" });
      }
    }
    setRsvpLoading(null);
  };

  const handleLeave = async (eventId: string) => {
    if (!user) return;
    setRsvpLoading(eventId);
    
    const { data, error } = await supabase.rpc("leave_event", {
      event_id: eventId,
      user_id: user.id,
    });

    if (error) {
      toast({ title: "Error", description: "Failed to leave event", variant: "destructive" });
    } else if (data && typeof data === 'object' && 'success' in data) {
      const result = data as { success: boolean; message: string };
      if (result.success) {
        toast({ title: "Left event", description: result.message });
        fetchEvents();
      } else {
        toast({ title: "Error", description: result.message, variant: "destructive" });
      }
    }
    setRsvpLoading(null);
  };

  const handleDelete = async (eventId: string) => {
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Event has been deleted" });
      fetchEvents();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg gradient-warm">
              <CalendarDays className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Mini Event</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/create-event">
              <Button size="sm" className="gradient-warm shadow-soft">
                <Plus className="h-4 w-4 mr-1" />
                Create Event
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Upcoming Events</h1>
          <p className="text-muted-foreground">Discover and join events happening soon</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No upcoming events</h2>
            <p className="text-muted-foreground mb-4">Be the first to create an event!</p>
            <Link to="/create-event">
              <Button className="gradient-warm shadow-soft">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                dateTime={event.date_time}
                location={event.location}
                capacity={event.capacity}
                attendeesCount={event.attendees?.length || 0}
                isRsvped={user ? event.attendees?.includes(user.id) : false}
                isCreator={user?.id === event.created_by}
                onRsvp={handleRsvp}
                onLeave={handleLeave}
                onDelete={handleDelete}
                isLoading={rsvpLoading === event.id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
