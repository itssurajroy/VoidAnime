import { getHomeData } from './src/services/anime';

async function test() {
  const result = await getHomeData();
  console.log(JSON.stringify(Object.keys(result?.data || {}), null, 2));
  if (result?.data) {
    console.log("Spotlight 0:", result.data.spotlight?.[0]);
  }
}
test();
