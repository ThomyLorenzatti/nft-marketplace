import { supabase } from '@/lib/supabase';

export class UserService {
  async createOrUpdateUser(xrpAddress: string) {
    try {
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select()
        .eq('xrp_address', xrpAddress)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingUser) {
        const { data, error } = await supabase
          .from('users')
          .update({ last_connected: new Date().toISOString() })
          .eq('xrp_address', xrpAddress)
          .select()
          .single();

        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ xrp_address: xrpAddress }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in createOrUpdateUser:', error);
      throw error;
    }
  }

  async getUser(xrpAddress: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select()
        .eq('xrp_address', xrpAddress)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error in getUser:', error);
      throw error;
    }
  }
}