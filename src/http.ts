import type { IncomingMessage, ServerResponse } from 'node:http';
export function send(res: ServerResponse, status: number, value: unknown) {
  res.writeHead(status, {'content-type':'application/json'}); res.end(JSON.stringify(value));
}
export async function body(req: IncomingMessage): Promise<any> {
  let raw = ''; for await (const chunk of req) { raw += chunk; if (Buffer.byteLength(raw)>65536) throw new Error('body too large'); }
  return JSON.parse(raw);
}
