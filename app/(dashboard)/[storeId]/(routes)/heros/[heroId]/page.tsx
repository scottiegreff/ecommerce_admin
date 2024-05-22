import prismadb from "@/lib/prismadb";

import { HeroForm } from "./components/hero-form";

const HeroPage = async ({
  params
}: {
  params: { heroId: string }
}) => {
  const hero = await prismadb.hero.findUnique({
    where: {
      id: params.heroId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HeroForm initialData={hero} />
      </div>
    </div>
  );
}

export default HeroPage;
