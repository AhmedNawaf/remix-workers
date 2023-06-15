import type {
  V2_MetaFunction,
  LoaderFunction,
  ActionFunction,
  redirect,
} from '@remix-run/cloudflare';
import { Form, useLoaderData } from '@remix-run/react';
import {
  createUserSession,
  destroyUserSession,
  getUserSession,
} from '~/sessions.server';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Login page' },
    { name: 'description', content: 'Testing cookies in serverless env' },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserSession(request);
  return userId ? userId : null;
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'DELETE') {
    return destroyUserSession(request, '/');
  }
  const body = Object.fromEntries(await request.formData());
  const { name, password } = body;
  if (typeof name !== 'string' || typeof password !== 'string') {
    return null;
  }
  return createUserSession(name, '/signedIn');
};

export default function Index() {
  const userId = useLoaderData<typeof loader>();
  return (
    <>
      {userId && (
        <Form method='DELETE'>
          <button type='submit'>Logout</button>
        </Form>
      )}

      <Form method='post'>
        <div>
          <label htmlFor='name'>Name</label>
          <input id='name' name='name' type='text' />
        </div>

        <label htmlFor='password'>Password</label>
        <input id='password' name='password' type='password' />
        <button type='submit'>Submit</button>
      </Form>
    </>
  );
}
