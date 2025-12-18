import { CalendarDays, MapPin, Users, Clock } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface EventCardProps {
  id: string;
  title: string;
  description: string | null;
  dateTime: string;
  location: string;
  capacity: number;
  attendeesCount: number;
  isRsvped: boolean;
  isCreator: boolean;
  onRsvp: (eventId: string) => void;
  onLeave: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
  isLoading?: boolean;
}

export function EventCard({
  id,
  title,
  description,
  dateTime,
  location,
  capacity,
  attendeesCount,
  isRsvped,
  isCreator,
  onRsvp,
  onLeave,
  onEdit,
  onDelete,
  isLoading,
}: EventCardProps) {
  const isFull = attendeesCount >= capacity;
  const eventDate = new Date(dateTime);
  const isPast = eventDate < new Date();

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 border-0 overflow-hidden animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold line-clamp-2">{title}</CardTitle>
          <div className="flex gap-1 flex-shrink-0">
            {isPast && <Badge variant="secondary">Past</Badge>}
            {isFull && !isPast && <Badge variant="destructive">Full</Badge>}
            {isCreator && <Badge className="gradient-warm border-0">Your Event</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span>{format(eventDate, "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>{format(eventDate, "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {attendeesCount} / {capacity} attendees
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2 flex-wrap">
        {!isPast && (
          <>
            {isRsvped ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLeave(id)}
                disabled={isLoading}
                className="flex-1"
              >
                Leave Event
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => onRsvp(id)}
                disabled={isFull || isLoading}
                className="flex-1 gradient-warm shadow-soft"
              >
                {isFull ? "Event Full" : "RSVP"}
              </Button>
            )}
          </>
        )}
        {isCreator && (
          <>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
                Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
                Delete
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
