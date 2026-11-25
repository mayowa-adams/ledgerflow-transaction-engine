import {createServer} from 'node:http';import {Ledger} from './ledger.ts';import {body,send} from './http.ts';
const l=new Ledger(process.env.DB_PATH||'ledger.db');setInterval(()=>{for(let i=0;i<100&&l.process();i++);},100).unref();
createServer(async(req,res)=>{try{const u=new URL(req.url||'/','http://localhost');const id=u.searchParams.get('id')||'';
if(u.pathname==='/health')return send(res,200,{ok:true});
if(req.method==='POST'&&u.pathname==='/transfers'){const b=await body(req);return send(res,202,l.submit(b.id,b.src,b.dst,b.amount));}
if(u.pathname==='/transfers'){const t=l.get(id);return send(res,t?200:404,t||{error:'not found'});}
if(u.pathname==='/balance'){const b=l.balance(id);return send(res,b===null?404:200,{balance:b,unit:'minor currency units'});}
if(u.pathname==='/reconcile')return send(res,200,{discrepancies:l.reconcile()});
if(req.method==='POST'&&u.pathname==='/replay')return send(res,200,{replayed:l.replay(id)});
if(u.pathname==='/metrics'){const counts=l.db.prepare('SELECT state,COUNT(*) AS n FROM outbox GROUP BY state').all();res.writeHead(200,{'content-type':'text/plain'});return res.end(counts.map(x=>`ledger_outbox{state="${x.state}"} ${x.n}`).join('\n')+'\n');}
send(res,404,{error:'not found'});}catch(e){send(res,e instanceof Error&&e.message==='idempotency conflict'?409:400,{error:e instanceof Error?e.message:'invalid request'});}}).listen(Number(process.env.PORT||8080),'0.0.0.0');
