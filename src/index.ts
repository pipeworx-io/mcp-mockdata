interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * Mock data generator MCP.
 *
 * Keyless, offline: generate realistic fake test data (people with name/email/
 * phone/address/company/job) and lorem-ipsum placeholder text, using the
 * platform CSPRNG. For seeding, testing and demos — all data is FICTIONAL. No
 * API, no key.
 */


const FIRST = 'James Mary John Patricia Robert Jennifer Michael Linda David Elizabeth Maria Susan Chen Wei Aisha Omar Sofia Liam Noah Emma Olivia Ava Ethan Mia Lucas Amara Kofi Yuki Hana Diego Elena Ravi Priya Fatima Igor Nadia Sven Ingrid'.split(' ');
const LAST = 'Smith Johnson Williams Brown Jones Garcia Miller Davis Rodriguez Martinez Hernandez Lopez Gonzalez Wilson Anderson Kim Nguyen Patel Singh Chen Wang Ali Khan Silva Santos Kowalski Novak Müller Rossi Dubois Andersson Okafor Mensah Tanaka Yamamoto Reyes Ivanov'.split(' ');
const DOMAINS = 'example.com mail.test demo.org sample.net inbox.io'.split(' ');
const CITIES = 'Springfield Riverside Franklin Greenville Bristol Clinton Fairview Salem Georgetown Madison Kingston Auburn Ashland Dover Milton'.split(' ');
const STREETS = 'Main Oak Pine Maple Cedar Elm Washington Lake Hill Park Sunset River Church High Market'.split(' ');
const COMPANIES = 'Acme Globex Initech Umbrella Soylent Hooli Vandelay Stark Wayne Wonka Cyberdyne Massive Pied Piper Nakatomi'.split(' ');
const SUFFIX = 'Inc LLC Corp Group Labs Systems Partners Holdings'.split(' ');
const JOBS = 'Engineer Designer Analyst Manager Consultant Developer Architect Specialist Coordinator Director Scientist Technician Strategist'.split(' ');
const DEPT = 'Software Product Data Marketing Sales Operations Finance Research Support Security'.split(' ');
const LOREM = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function rand(n: number): number { const b = new Uint32Array(1); const max = Math.floor(0xffffffff / n) * n; let x; do { crypto.getRandomValues(b); x = b[0]; } while (x >= max); return x % n; }
const pick = <T>(a: T[]): T => a[rand(a.length)];
const digits = (n: number) => Array.from({ length: n }, () => rand(10)).join('');

function person() {
  const first = pick(FIRST), last = pick(LAST);
  return {
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(DOMAINS)}`,
    phone: `+1 (${digits(3)}) ${digits(3)}-${digits(4)}`,
    address: `${1 + rand(9999)} ${pick(STREETS)} St, ${pick(CITIES)}`,
    company: `${pick(COMPANIES)} ${pick(SUFFIX)}`,
    job_title: `${pick(DEPT)} ${pick(JOBS)}`,
    birthdate: `${1950 + rand(56)}-${String(1 + rand(12)).padStart(2, '0')}-${String(1 + rand(28)).padStart(2, '0')}`,
    uuid: crypto.randomUUID(),
  };
}

function loremWords(n: number): string { return Array.from({ length: n }, () => pick(LOREM)).join(' '); }
function sentence(): string { const w = loremWords(6 + rand(10)); return w.charAt(0).toUpperCase() + w.slice(1) + '.'; }
function paragraph(): string { return Array.from({ length: 3 + rand(4) }, sentence).join(' '); }

const tools: McpToolExport['tools'] = [
  {
    name: 'generate_person',
    description: 'Generate fictional person record(s) — name, email, phone, address, company, job title, birthdate, uuid — for testing/seeding (keyless, offline). All data is FAKE.',
    inputSchema: { type: 'object', properties: { count: { type: 'number', description: 'How many (1-100, default 1).' } } },
  },
  {
    name: 'lorem',
    description: 'Generate lorem-ipsum placeholder text (keyless, offline). `unit` = words | sentences | paragraphs (default sentences); `count` = how many.',
    inputSchema: { type: 'object', properties: { unit: { type: 'string', description: 'words | sentences | paragraphs (default sentences).' }, count: { type: 'number', description: 'How many units (default 3).' } } },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'generate_person': {
      const count = Math.max(1, Math.min(100, typeof args.count === 'number' ? args.count : 1));
      const people = Array.from({ length: count }, person);
      return count === 1 ? { person: people[0], note: 'Fictional test data.' } : { count, people, note: 'Fictional test data.' };
    }
    case 'lorem': {
      const unit = (typeof args.unit === 'string' ? args.unit : 'sentences').toLowerCase();
      const count = Math.max(1, Math.min(100, typeof args.count === 'number' ? args.count : 3));
      let text: string;
      if (unit === 'words') text = loremWords(count);
      else if (unit === 'paragraphs') text = Array.from({ length: count }, paragraph).join('\n\n');
      else text = Array.from({ length: count }, sentence).join(' ');
      return { unit, count, text };
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
