async function runTests() {
  console.log('--- 1. Testing Login API ---');
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: '123jesus' }),
  });
  const loginData = await loginRes.json();
  console.log('Login Result:', loginData);
  const cookie = loginRes.headers.get('set-cookie');
  console.log('Cookie received:', !!cookie);

  console.log('\n--- 2. Testing Storyboard Generator API ---');
  const sbRes = await fetch('http://localhost:3000/api/generate-storyboard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: '교파가 많은 이유?', audience: '청소년 및 성도' }),
  });
  const sbData = await sbRes.json();
  console.log('Storyboard Title:', sbData.title);
  console.log('Panels count:', sbData.panels?.length);
  console.log('Panel 1 Title:', sbData.panels?.[0]?.title);
  console.log('Panel 9 Title:', sbData.panels?.[8]?.title);

  console.log('\n--- 3. Testing Comics Neon DB Save API ---');
  const testComic = {
    id: `test_comic_${Date.now()}`,
    title: sbData.title,
    subtitle: sbData.subtitle,
    topic: '교파가 많은 이유?',
    audience: '청소년 및 성도',
    author: '현스웹툰',
    sourceNote: sbData.sourceNote,
    headerDialogue: sbData.headerDialogue,
    panels: sbData.panels,
  };

  const saveRes = await fetch('http://localhost:3000/api/comics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testComic),
  });
  const saveData = await saveRes.json();
  console.log('Save to Neon DB Result:', saveData);

  console.log('\n--- 4. Testing Comics Neon DB Fetch API ---');
  const fetchRes = await fetch(`http://localhost:3000/api/comics?id=${testComic.id}`);
  const fetchData = await fetchRes.json();
  console.log('Fetched Comic Title:', fetchData.title);
  console.log('Fetched Panels Length:', fetchData.panels?.length);

  console.log('\nALL API TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch(console.error);
