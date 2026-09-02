import type {Pool} from 'pg';
import type {WorkflowState} from '../state-machine.js';
export class WorkflowRepository { constructor(private db:Pool){}
 async create(projectId:string,conversationId:string,state:WorkflowState='DISCUSSING'){const r=await this.db.query('insert into workflows(project_id,conversation_id,state) values($1,$2,$3) returning *',[projectId,conversationId,state]);return r.rows[0]}
 async get(id:string){const r=await this.db.query('select * from workflows where id=$1',[id]);return r.rows[0]}
 async update(id:string,state:WorkflowState){const r=await this.db.query('update workflows set state=$2,updated_at=now() where id=$1 returning *',[id,state]);return r.rows[0]}
}
export class PluginRepository { constructor(private db:Pool){} async list(){return (await this.db.query("select * from plugins where status='published' order by created_at desc")).rows} }
