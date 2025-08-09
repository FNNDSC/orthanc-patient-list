const findRes = await fetch('http://localhost:8042/tools/find', {
  method: 'POST',
  body: JSON.stringify({
    Query: { AccessionNumber: '' },
    Level: 'Study',
    Expand: true,
    ResponseContent: ['RequestedTags'],
    RequestedTags: ['StudyInstanceUID']
  })
});
const studies = await findRes.json();

const promises = studies.map(async (study) => {
  const res = await fetch(`http://localhost:8042/studies/${study.ID}/modify`, {
    method: 'POST',
    body: JSON.stringify({
      Asynchronous: true,
      Force: true,
      KeepSource: false,
      Replace: { AccessionNumber: hash(study.RequestedTags.StudyInstanceUID) }
    })
  });
  const body = await res.json();
  if (res.status !== 200) {
    throw new Error(`Failed to modify study ID ${study.ID}: ${JSON.stringify(body)}`);
  }
  console.log(body.ID);
});

await Promise.all(promises);

function hash(s: string): string {
  const hasher = new Bun.CryptoHasher('sha1');
  hasher.update(s);
  return hasher.digest('hex').substring(0, 12);
}
