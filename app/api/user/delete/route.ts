import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function DELETE(request: Request) {
  try {
    const { account } = await request.json();

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Account address is required" },
        { status: 400 }
      );
    }

    // Supprimer l'utilisateur de la base de données
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('xrp_address', account);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { success: false, error: "Failed to delete user" },
        { status: 500 }
      );
    }

    // Supprimer les cookies
    cookies().delete('xrp_address');
    cookies().delete('session_id');
    // Ajoutez ici d'autres cookies à supprimer si nécessaire

    return NextResponse.json({ 
      success: true,
      message: "User deleted and cookies cleared"
    });

  } catch (error) {
    console.error('Error in delete user:', error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}