import { useRouter } from 'next/navigation';

/**
 * Overriding default 'next-navigation-router' so that
 * it can push nested routes properly.
 * e.g. 'books/<id> and push to '/auth' will not result to
 * 'books/<id>/auth'.
 * 
 * It copies the default properties of router and overrides push.
 */
const useCustomRouter = () => {
  const defaultRouter = useRouter();
  const customRouter = Object.assign({}, useRouter());

  if (typeof (window) === 'undefined') {
    return customRouter;
  }

  customRouter.push = (path: string) => defaultRouter.push(window.location.origin + path);

  return customRouter;
}

export default useCustomRouter;
