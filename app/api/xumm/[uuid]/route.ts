import { xumm } from "../route";
import { NextResponse } from 'next/server';
import { UserService } from '@/services/user.service';

const userService = new UserService();

/**
 * 🔹 Endpoint pour vérifier si l'utilisateur a validé l'authentification Xumm si oui création user
*/
export async function generateStaticParams() {
  return [] // Retourne un tableau vide car les UUIDs sont dynamiques
}

export async function GET(request: Request, context: any) {
  try {
      const { params } = context;
      const uuid = params

      if (!uuid) {
          return NextResponse.json({ error: "UUID is required" }, { status: 400 });
      }

      // Récupérer les détails du payload avec l'UUID de la requête
      const payload = await xumm.payload.get(uuid);

      if (!payload) {
          return NextResponse.json({ error: "Invalid payload" }, { status: 404 });
      }

      // Vérifier si l'utilisateur a bien signé (authentifié)
      if (!payload?.response?.account) {
          return NextResponse.json({ status: "pending" }, { status: 200 });
      }

      // ✅ L'utilisateur est authentifié, récupérer son compte XRP Ledger
      const xrpAddress = payload.response.account;
      const user = await userService.createOrUpdateUser(xrpAddress);
      console.log("User authenticated:", user);
      return NextResponse.json({ 
        status: "authenticated", 
        account: xrpAddress,
        user: user
      }, { status: 200 });

  } catch (error) {
      console.error("Error checking Xumm login status:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
