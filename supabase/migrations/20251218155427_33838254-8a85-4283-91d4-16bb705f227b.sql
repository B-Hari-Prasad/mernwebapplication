-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  attendees UUID[] DEFAULT '{}',
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update own events" ON public.events FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete own events" ON public.events FOR DELETE USING (auth.uid() = created_by);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'name', 'User'), new.email);
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function for atomic RSVP operation
CREATE OR REPLACE FUNCTION public.rsvp_to_event(event_id UUID, user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  event_record RECORD;
  result JSON;
BEGIN
  -- Lock the row and get current state
  SELECT * INTO event_record FROM public.events WHERE id = event_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Event not found');
  END IF;
  
  -- Check if user already RSVPd
  IF user_id = ANY(event_record.attendees) THEN
    RETURN json_build_object('success', false, 'message', 'Already RSVPd to this event');
  END IF;
  
  -- Check capacity
  IF array_length(event_record.attendees, 1) >= event_record.capacity THEN
    RETURN json_build_object('success', false, 'message', 'Event is at full capacity');
  END IF;
  
  -- Add user to attendees
  UPDATE public.events 
  SET attendees = array_append(attendees, user_id), updated_at = now()
  WHERE id = event_id;
  
  RETURN json_build_object('success', true, 'message', 'Successfully RSVPd');
END;
$$;

-- Function for atomic leave RSVP operation
CREATE OR REPLACE FUNCTION public.leave_event(event_id UUID, user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  event_record RECORD;
BEGIN
  SELECT * INTO event_record FROM public.events WHERE id = event_id FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Event not found');
  END IF;
  
  IF NOT (user_id = ANY(event_record.attendees)) THEN
    RETURN json_build_object('success', false, 'message', 'Not RSVPd to this event');
  END IF;
  
  UPDATE public.events 
  SET attendees = array_remove(attendees, user_id), updated_at = now()
  WHERE id = event_id;
  
  RETURN json_build_object('success', true, 'message', 'Successfully left event');
END;
$$;