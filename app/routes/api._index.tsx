import { json } from '@remix-run/node';

export async function loader() {
  return json({
    message: 'Welcome API Base Route3',
  });
}
