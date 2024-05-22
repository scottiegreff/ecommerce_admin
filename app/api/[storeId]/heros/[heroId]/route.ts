import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
/**
 * @param req The request object.
 * @param params The parameters object containing the store ID. 
 * @returns A JSON response with the list of heros.
 */
export async function GET(
  req: Request,
  { params }: { params: { heroId: string } }
) {
  try {
    if (!params.heroId) {
      return new NextResponse("hero id is required", { status: 400 });
    }

    const hero = await prismadb.hero.findUnique({
      where: {
        id: params.heroId
      }
    });
  
    return NextResponse.json(hero);
  } catch (error) {
    console.log('[HERO_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

/**
 * Deletes a hero with the specified ID.
 * @param req - The request object.
 * @param params - The parameters object containing the hero ID and store ID.
 * @returns A JSON response with the updated hero data.
 */
export async function DELETE(
  req: Request,
  { params }: { params: { heroId: string, storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.heroId) {
      return new NextResponse("Hero id is required", { status: 400 });
    }

    // Check if the store exists and belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    // Delete the hero
    const hero = await prismadb.hero.delete({
      where: {
        id: params.heroId,
      }
    });
  
    return NextResponse.json(hero);
  } catch (error) {
    console.log('[HERO_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


/**
 * Updates a hero with the specified ID.
 * @param req - The request object.
 * @param params - The parameters object containing the hero ID and store ID.
 * @returns A JSON response with the updated hero data.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { heroId: string, storeId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { label, imageUrl } = body;
    
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    if (!params.heroId) {
      return new NextResponse("Hero id is required", { status: 400 });
    }

    // Check if the store exists and belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const hero = await prismadb.hero.update({
      where: {
        id: params.heroId,
      },
      data: {
        label,
        imageUrl
      }
    });
  
    return NextResponse.json(hero);
  } catch (error) {
    console.log('[HERO_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
