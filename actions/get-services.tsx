import { Service } from "@/types";
import qs from "query-string";

const URL="api/services";

interface Query {
  categoryId?: string;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
  isFeatured?: boolean;
}

const getServices = async (query: Query): Promise<Service[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: { 
      categoryId: query.categoryId,
      isFeatured: query.isFeatured,
    },
    
  });

  const res = await fetch(url);

  return res.json();
};

export default getServices;
