import { createClient } from '@supabase/supabase-js';

// Define type for styleable email content only (matches Gmail sections)
interface EmailStyleJSON {
  email_body: string;
  background_color: string;
  header_section: string;
  header_title: string;
  header_subtitle: string;
  text_section: string;
  paragraph: string;
  bold_text: string;
  italic_text: string;
  links_section: string;
  link: string;
  link_button: string;
  list_section: string;
  unordered_list: string;
  ordered_list: string;
  list_item: string;
  table_section: string;
  table: string;
  table_header: string;
  table_cell: string;
  signature_section: string;
  signature_text: string;
  divider: string;
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
export async function saveEmailStyle(styles: EmailStyleJSON, prompt: string = ''): Promise<{ id?: string; error?: string }> {
  try {
    console.log('Saving style with active: false explicitly');
    const { data, error } = await supabase
      .from('email_styles')
      .insert([{
        styling_json: styles,
        user_prompt: prompt,
        active: false  // EXPLICITLY set to false
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving style:', error);
      return { error: error.message };
    }

    console.log('Style saved with ID:', data.id, 'Active status:', data.active);
    return { id: data.id };
  } catch (error) {
    console.error('Error saving style:', error);
    return { error: 'Failed to save style' };
  }
}

// Get all saved styles
export async function getSavedStyles(): Promise<EmailStyleRecord[]> {
  try {
    const { data, error } = await supabase
      .from('email_styles')
      .select('*')
      .order('created_at', { ascending: true }); // Order oldest first to maintain consistent order

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

// Activate a style by ID (deactivates all others)
export async function activateStyle(id: string): Promise<boolean> {
  try {
    // First deactivate all styles
    const { error: deactivateError } = await supabase
      .from('email_styles')
      .update({ active: false })
      .eq('active', true);

    if (deactivateError) {
      console.error('Error deactivating styles:', deactivateError);
      return false;
    }

    // Then activate the selected style
    const { error: activateError } = await supabase
      .from('email_styles')
      .update({ active: true })
      .eq('id', id);

    if (activateError) {
      console.error('Error activating style:', activateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error activating style:', error);
    return false;
  }
}

// Get the active style
export async function getActiveStyle(): Promise<EmailStyleRecord | null> {
  try {
    const { data, error } = await supabase
      .from('email_styles')
      .select('*')
      .eq('active', true)
      .single();

    if (error) {
      console.error('Error fetching active style:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching active style:', error);
    return null;
  }
}