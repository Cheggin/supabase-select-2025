import { createClient } from '@supabase/supabase-js';

// Define type directly to avoid import issues
interface EmailStyleJSON {
  email_container: string;
  sender_section: string;
  sender_avatar: string;
  sender_name: string;
  sender_email: string;
  timestamp: string;
  subject: string;
  paragraph: string;
  quote_block: string;
  table: string;
  table_header: string;
  table_cell: string;
  list: string;
  list_item: string;
  button: string;
  link: string;
  image: string;
  footer: string;
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Interface for email style record in database (matching new schema)
interface EmailStyleRecord {
  id?: string;
  user_prompt: string;
  styling_json: EmailStyleJSON;
  active?: boolean;
  created_at?: string;
}

// Save email styles to Supabase with prompt
export async function saveEmailStyle(styles: EmailStyleJSON, prompt: string = ''): Promise<{ id: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('email_styles')
      .insert([{
        styling_json: styles,
        user_prompt: prompt,
        active: false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving style:', error);
      return { id: '', error: error.message };
    }

    return { id: data.id };
  } catch (error) {
    console.error('Error saving style:', error);
    return { id: '', error: 'Failed to save style' };
  }
}

// Get all saved styles
export async function getSavedStyles(): Promise<EmailStyleRecord[]> {
  try {
    const { data, error } = await supabase
      .from('email_styles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching styles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching styles:', error);
    return [];
  }
}

// Get a single style by ID
export async function getStyleById(id: string): Promise<EmailStyleRecord | null> {
  try {
    const { data, error } = await supabase
      .from('email_styles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching style:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching style:', error);
    return null;
  }
}

// Delete a style by ID
export async function deleteStyle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('email_styles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting style:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting style:', error);
    return false;
  }
}