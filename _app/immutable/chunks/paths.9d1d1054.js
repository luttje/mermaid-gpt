import{D as b,s as p}from"./index.051308b9.js";const e=[];function d(n,a=b){let i;const o=new Set;function r(t){if(p(n,t)&&(n=t,i)){const c=!e.length;for(const s of o)s[1](),e.push(s,n);if(c){for(let s=0;s<e.length;s+=2)e[s][0](e[s+1]);e.length=0}}}function l(t){r(t(n))}function g(t,c=b){const s=[t,c];return o.add(s),o.size===1&&(i=a(r)||b),t(n),()=>{o.delete(s),o.size===0&&i&&(i(),i=null)}}return{set:r,update:l,subscribe:g}}var f;const _=((f=globalThis.__sveltekit_pcn0gg)==null?void 0:f.base)??"/mermaid-gpt";var u;const m=((u=globalThis.__sveltekit_pcn0gg)==null?void 0:u.assets)??_;export{m as a,_ as b,d as w};