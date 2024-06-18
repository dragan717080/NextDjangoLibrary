import { useParams } from "next/navigation"

const useGetSlug = (): string => {

  const params = useParams();
  return params.slug as string;
}

export default useGetSlug
