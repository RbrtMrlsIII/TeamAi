import {pool} from './pool.js'; import {readdir,readFile} from 'node:fs/promises'; import {join} from 'node:path';
const dir=join(process.cwd(),'migrations'); const files=(await readdir(dir)).filter(f=>f.endsWith('.sql')).sort();
for(const f of files){const sql=await readFile(join(dir,f),'utf8'); await pool.query(sql); console.log('applied',f)} await pool.end();
