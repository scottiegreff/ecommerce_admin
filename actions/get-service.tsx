import { Service } from "@/types";


const getService = async (id: string): Promise<Service> => {
  const res = await fetch(`${URL}/${id}`);

  return res.json();
};

export default getService;
