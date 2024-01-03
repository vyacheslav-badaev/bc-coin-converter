import { LoaderFunctionArgs, json } from '@remix-run/node';
import { useFetcher, useLoaderData } from '@remix-run/react';
import { useEffect } from 'react';
import { getCookies, getSession } from '~/lib/auth.server';
import createError from 'http-errors';
import { Text, Panel, Grid, GridItem } from '@bigcommerce/big-design';

export async function loader({ request }: LoaderFunctionArgs) {
  const cookies = await getCookies(request.headers.get('Cookie'));
  if (!cookies.get('context')) {
    throw createError.Forbidden('No session found');
  }
  const session = await getSession(cookies.get('context'));
  console.log('session', session);
  const storeData = await prisma.store.findFirstOrThrow({
    where: {
      storeHash: session?.storeHash,
    },
  });
  //TODO implement script tag enable/disable app logic
  return json({
    scriptTagId: storeData?.scriptTagId || null,
  });
}

export default function Index() {
  const { scriptTagId } = useLoaderData<typeof loader>();
  console.log('scriptTagId', scriptTagId);
  const fetcher = useFetcher();

  return (
    <div className="page">
      <Grid gridGap="1rem">
        <GridItem>
          <Panel header="Main settings">
            <Text>
              Lorem ipsum dolor amet officia humblebrag selvage, subway tile
              vexillologist id pickled adaptogen fashion axe. Ennui meh
              pitchfork banh mi. Keffiyeh PBRB echo park gastropub. Pop-up
              neutra brunch ullamco affogato shaman vexillologist quinoa
              post-ironic locavore. Retro selfies proident synth ethical quinoa
              marfa chartreuse dolor vexillologist gochujang. Tempor poke
              unicorn, readymade crucifix fugiat culpa. Kinfolk hella
              asymmetrical, meggings et consectetur lomo farm-to-table
              exercitation DIY.
            </Text>
          </Panel>
        </GridItem>
      </Grid>
    </div>
  );
}
