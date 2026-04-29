const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const CSV_PATH = path.join(__dirname,'../../data/crime-stats-2020-25.csv');
const areaMeta = {
  DMP:{name:'Dhaka Metro', lat:23.7465, lng:90.3760, neighborhoods:['Dhanmondi','Mirpur 10','Gulshan','Motijheel','Uttara','Banani','New Market']},
  CMP:{name:'Chattogram Metro', lat:22.3569, lng:91.7832, neighborhoods:['Agrabad','Kotwali','Panchlaish','Halishahar']},
  KMP:{name:'Khulna Metro', lat:22.8456, lng:89.5403, neighborhoods:['Sonadanga','Khalishpur','Daulatpur']},
  RMP:{name:'Rajshahi Metro', lat:24.3745, lng:88.6042, neighborhoods:['Boalia','Motihar','Rajpara']},
  BMP:{name:'Barishal Metro', lat:22.7010, lng:90.3535, neighborhoods:['Kotwali','Nathullabad','Rupatali']},
  SMP:{name:'Sylhet Metro', lat:24.8949, lng:91.8687, neighborhoods:['Zindabazar','Ambarkhana','Shahporan']},
  RPMP:{name:'Rangpur Metro', lat:25.7439, lng:89.2752, neighborhoods:['Central Rangpur','Mahiganj','Modern Mor']},
  GMP:{name:'Gazipur Metro', lat:23.9999, lng:90.4203, neighborhoods:['Tongi','Gazipur Sadar','Board Bazar']},
};
const crimeTypes = ['Dacoity','Robbery','Murder','Riot','Woman & Child Repression','Kidnapping','Burglary','Theft','Arms Act','Explosive','Narcotics','Smuggling'];
function parseCSV(){
  const raw = fs.readFileSync(CSV_PATH,'utf8').trim().split(/\r?\n/); const headers = raw[0].split(',');
  return raw.slice(1).map(line=>{ const parts=line.split(','); const o={}; headers.forEach((h,i)=>o[h]=parts[i]); crimeTypes.concat(['Total Cases']).forEach(k=>o[k]=Number(o[k]||0)); o.Year=Number(o.Year); return o; });
}
const rows = parseCSV();
let reports=[]; let users=[{id:'1',name:'Admin',email:'admin@riskradar.com',password:'$2a$10$z6w99q4Wz6q1hi93L/2BDOyAEQ7Vd1YJoCJ8g.XOwCD.FShT3moxS',role:'admin'}]; let sos=[];
function scoreFromTotal(total){ return Math.max(5, Math.min(100, Math.round(total/35))); }
function riskLevel(score){ return score>=70?'High Risk':score>=40?'Medium Risk':'Low Risk'; }
function latestRows(){ const maxYear=Math.max(...rows.map(r=>r.Year)); return rows.filter(r=>r.Year===maxYear); }
function buildAreas(){
  const byUnit={}; latestRows().forEach(r=>{ byUnit[r['Unit Name']] ??={unit:r['Unit Name'], total:0, rows:[]}; byUnit[r['Unit Name']].total += r['Total Cases']; byUnit[r['Unit Name']].rows.push(r); });
  return Object.values(byUnit).map((x,idx)=>{ const meta=areaMeta[x.unit]||{name:x.unit,lat:23.7+idx*.04,lng:90.3+idx*.04,neighborhoods:[x.unit]}; const score=scoreFromTotal(x.total); return {...meta, unit:x.unit, total:x.total, riskScore:score, riskLevel:riskLevel(score), recentCrimes:topTypes(x.rows), updatedAt:new Date().toISOString()}; }).sort((a,b)=>b.riskScore-a.riskScore);
}
function topTypes(sourceRows){ const sums={}; crimeTypes.forEach(t=>sums[t]=sourceRows.reduce((a,r)=>a+(r[t]||0),0)); return Object.entries(sums).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([type,count],i)=>({id:String(i+1),type,count,severity:count>1500?'high':count>600?'medium':'low',time:['8:30 PM','10:15 PM','7:00 PM','4:20 PM','1:10 AM'][i]})); }
function monthTrend(unit){ return latestRows().filter(r=>!unit||r['Unit Name']===unit).map(r=>({month:r.Month,total:r['Total Cases'], theft:r.Theft, robbery:r.Robbery, narcotics:r.Narcotics})); }
function summary(){ const r=latestRows(); const total=r.reduce((a,x)=>a+x['Total Cases'],0); const areas=buildAreas(); return {totalCrimes:total, highRiskAreas:areas.filter(a=>a.riskScore>=70).length, safeAreas:areas.filter(a=>a.riskScore<40).length, topArea:areas[0], crimeBreakdown: topTypes(r), trend: monthTrend().slice(-12), areaRanking:areas.slice(0,10)}; }
function heatmap(){ return buildAreas().flatMap((a,i)=>a.neighborhoods.map((n,j)=>({id:`${a.unit}-${j}`, area:n, unit:a.unit, latitude:a.lat+(j-2)*0.011, longitude:a.lng+(j-2)*0.013, weight:a.riskScore, riskScore:Math.max(5,Math.min(100,a.riskScore-j*4)), riskLevel:riskLevel(Math.max(5,a.riskScore-j*4)) })) ); }
function areaDetails(name){ const point=heatmap().find(p=>p.area.toLowerCase()===String(name).toLowerCase())||heatmap()[0]; const unitRows=latestRows().filter(r=>r['Unit Name']===point.unit); const crimes=topTypes(unitRows).map(c=>({...c, description:`${c.type} incidents reported around ${point.area}`})); return {...point, totalCases:unitRows.reduce((a,r)=>a+r['Total Cases'],0), recentCrimes:crimes, trend:monthTrend(point.unit)}; }
function route(from='Dhanmondi', to='Uttara'){ const h=heatmap(); const start=h.find(x=>x.area===from)||h[0]; const end=h.find(x=>x.area===to)||h[4]||h[0]; return {from:start.area,to:end.area, estimatedTime:'24 mins', avoidedZones:3, normalTime:'18 mins', safestRoute:[{latitude:start.latitude,longitude:start.longitude},{latitude:(start.latitude+end.latitude)/2+.02, longitude:(start.longitude+end.longitude)/2-.02},{latitude:end.latitude,longitude:end.longitude}], normalRoute:[{latitude:start.latitude,longitude:start.longitude},{latitude:(start.latitude+end.latitude)/2, longitude:(start.longitude+end.longitude)/2},{latitude:end.latitude,longitude:end.longitude}]}; }
function addReport(body){ const report={id:uuid(), createdAt:new Date().toISOString(), status:'pending',...body}; reports.unshift(report); return report; }
module.exports={users,reports,sos,summary,buildAreas,heatmap,areaDetails,route,addReport,riskLevel};
