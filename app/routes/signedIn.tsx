import { getUserSession } from '~/sessions.server';
import { LoaderFunction, redirect } from '@remix-run/cloudflare';
export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserSession(request);
  if (!userId) {
    return redirect('/');
  }
  return null;
};

export default function SignedIn() {
  return <div>Congrats</div>;
}
