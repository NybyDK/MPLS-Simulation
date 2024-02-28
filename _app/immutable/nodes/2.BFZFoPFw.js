var we=Object.defineProperty;var Ce=(n,e,o)=>e in n?we(n,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[e]=o;var D=(n,e,o)=>(Ce(n,typeof e!="symbol"?e+"":e,o),o);import{s as $,n as K,r as Ne,c as ke,o as Ee,x as ee,y as ve,e as De}from"../chunks/scheduler.DvP55YXn.js";import{S as te,i as ne,e as L,t as de,c as X,a as M,b as ge,d as C,l as _,q as W,g as B,h as I,z as O,j as _e,s as J,A,o as U,f as Q,B as G,C as Be,m as z,r as Pe,p as Ie,n as F,D as H,E as me,F as S,G as q,v as pe,w as be,x as ye,y as xe}from"../chunks/index.DHB2mq1_.js";import{w as Me}from"../chunks/index.CmtDd-Ac.js";function R(n){return(n==null?void 0:n.length)!==void 0?n:Array.from(n)}function oe(n,e){const o={},s={},i={$$scope:1};let l=n.length;for(;l--;){const r=n[l],f=e[l];if(f){for(const g in r)g in f||(s[g]=1);for(const g in f)i[g]||(o[g]=f[g],i[g]=1);n[l]=f}else for(const g in r)i[g]=1}for(const r in s)r in o||(o[r]=void 0);return o}function Re(n){return typeof n=="object"&&n!==null?n:{}}class Ye{constructor(){D(this,"store",Me({nodes:[],connections:[]}));D(this,"set",this.store.set);D(this,"update",this.store.update);D(this,"subscribe",this.store.subscribe);D(this,"_nodes",[]);D(this,"_connections",[]);D(this,"nodeMap",new Map);D(this,"counter",0)}get nodes(){return this._nodes}get connections(){return this._connections}get networkState(){return{nodes:this.nodes,connections:this.connections}}deleteConnection(e){this._connections=this._connections.filter(o=>o.source.id!==e.source.id||o.target.id!==e.target.id),this.fastUpdate()}deleteNode(e){this.getNode(e)&&(this._nodes=this._nodes.filter(s=>s.id!==e),this.nodeMap.delete(e)),this.fastUpdate()}addConnection(e){e.source!==e.target&&(this.doesConnectionExist(e.source,e.target)||this.doesConnectionExist(e.target,e.source)||(this._connections.push(e),this.fastUpdate()))}doesConnectionExist(e,o){return this._connections.some(s=>s.source===e&&s.target===o)}createNode(e){const o={id:this.counter++,...e};this.addNode(o)}addNode(e){this._nodes.push(e),this.nodeMap.set(e.id,e),this.fastUpdate()}getNode(e){return this.nodeMap.get(e)}getSureNode(e){const o=this.getNode(e);if(!o)throw new Error(`Node with id ${e} not found`);return o}fastUpdate(){this.store.set(this.networkState)}}const Oe=new Ye,Y=Oe;var k=(n=>(n[n.Customer=0]="Customer",n[n.Edge=1]="Edge",n[n.Core=2]="Core",n))(k||{});function je(n){return Object.values(k).includes(n)}function ze(n){let e,o,s,i;return{c(){e=L("div"),o=de(n[0]),this.h()},l(l){e=X(l,"DIV",{draggable:!0,role:!0,tabindex:!0,style:!0,class:!0});var r=M(e);o=ge(r,n[0]),r.forEach(C),this.h()},h(){_(e,"draggable","true"),_(e,"role","button"),_(e,"tabindex","-1"),W(e,"background-color",n[1]),_(e,"class","svelte-hr3g0j")},m(l,r){B(l,e,r),I(e,o),s||(i=O(e,"dragstart",n[2]),s=!0)},p(l,[r]){r&1&&_e(o,l[0]),r&2&&W(e,"background-color",l[1])},i:K,o:K,d(l){l&&C(e),s=!1,i()}}}function Le(n,e,o){let{text:s}=e,{type:i}=e,{color:l}=e;function r(f){var g;(g=f.dataTransfer)==null||g.setData("text/plain",i.toString())}return n.$$set=f=>{"text"in f&&o(0,s=f.text),"type"in f&&o(3,i=f.type),"color"in f&&o(1,l=f.color)},[s,l,r,i]}class Xe extends te{constructor(e){super(),ne(this,e,Le,ze,$,{text:0,type:3,color:1})}}function le(n,e,o){const s=n.slice();return s[20]=e[o],s}function se(n,e,o){const s=n.slice();return s[23]=e[o],s}function re(n,e,o){const s=n.slice();return s[26]=e[o],s}function ie(n){let e,o="Loading...";return{c(){e=L("h1"),e.textContent=o,this.h()},l(s){e=X(s,"H1",{style:!0,"data-svelte-h":!0}),me(e)!=="svelte-ncjhv1"&&(e.textContent=o),this.h()},h(){W(e,"font-size","200px")},m(s,i){B(s,e,i)},d(s){s&&C(e)}}}function ce(n){let e,o=[he(n[26]),{stroke:"black"}],s={};for(let i=0;i<o.length;i+=1)s=ee(s,o[i]);return{c(){e=A("line"),this.h()},l(i){e=G(i,"line",{stroke:!0}),M(e).forEach(C),this.h()},h(){S(e,s),q(e,"svelte-1o33erd",!0)},m(i,l){B(i,e,l)},p(i,l){S(e,s=oe(o,[l&64&&he(i[26]),{stroke:"black"}])),q(e,"svelte-1o33erd",!0)},d(i){i&&C(e)}}}function ue(n){let e,o=[V(n[3]),Z(n[14](n[1].x,n[1].y)),{stroke:"black"}],s={};for(let i=0;i<o.length;i+=1)s=ee(s,o[i]);return{c(){e=A("line"),this.h()},l(i){e=G(i,"line",{stroke:!0}),M(e).forEach(C),this.h()},h(){S(e,s),q(e,"svelte-1o33erd",!0)},m(i,l){B(i,e,l)},p(i,l){S(e,s=oe(o,[l&8&&V(i[3]),l&2&&Z(i[14](i[1].x,i[1].y)),{stroke:"black"}])),q(e,"svelte-1o33erd",!0)},d(i){i&&C(e)}}}function ae(n){let e,o,s,i,l,r,f=n[23].label+"",g,N,a;return{c(){e=A("circle"),r=A("text"),g=de(f),this.h()},l(d){e=G(d,"circle",{id:!0,cx:!0,cy:!0,r:!0,fill:!0,class:!0}),M(e).forEach(C),r=G(d,"text",{x:!0,y:!0,"text-anchor":!0,"alignment-baseline":!0,class:!0});var u=M(r);g=ge(u,f),u.forEach(C),this.h()},h(){_(e,"id",o=n[23].id.toString()),_(e,"cx",s=n[23].x),_(e,"cy",i=n[23].y),_(e,"r","20"),_(e,"fill",l=n[8][n[23].type]),_(e,"class","svelte-1o33erd"),_(r,"x",N=n[23].x),_(r,"y",a=n[23].y),_(r,"text-anchor","middle"),_(r,"alignment-baseline","middle"),_(r,"class","svelte-1o33erd")},m(d,u){B(d,e,u),B(d,r,u),I(r,g)},p(d,u){u&64&&o!==(o=d[23].id.toString())&&_(e,"id",o),u&64&&s!==(s=d[23].x)&&_(e,"cx",s),u&64&&i!==(i=d[23].y)&&_(e,"cy",i),u&64&&l!==(l=d[8][d[23].type])&&_(e,"fill",l),u&64&&f!==(f=d[23].label+"")&&_e(g,f),u&64&&N!==(N=d[23].x)&&_(r,"x",N),u&64&&a!==(a=d[23].y)&&_(r,"y",a)},d(d){d&&(C(e),C(r))}}}function fe(n){let e,o;const s=[n[20]];let i={};for(let l=0;l<s.length;l+=1)i=ee(i,s[l]);return e=new Xe({props:i}),{c(){pe(e.$$.fragment)},l(l){be(e.$$.fragment,l)},m(l,r){ye(e,l,r),o=!0},p(l,r){const f=r&512?oe(s,[Re(l[20])]):{};e.$set(f)},i(l){o||(z(e.$$.fragment,l),o=!0)},o(l){F(e.$$.fragment,l),o=!1},d(l){xe(e,l)}}}function Ae(n){let e,o,s,i,l,r,f,g,N,a,d,u=!n[5]&&ie(),E=R(n[6].connections),x=[];for(let c=0;c<E.length;c+=1)x[c]=ce(re(n,E,c));let w=n[4]===n[7].CONNECTING&&n[3]&&ue(n),P=R(n[6].nodes),y=[];for(let c=0;c<P.length;c+=1)y[c]=ae(se(n,P,c));let v=R(n[9]),p=[];for(let c=0;c<v.length;c+=1)p[c]=fe(le(n,v,c));const T=c=>F(p[c],1,1,()=>{p[c]=null});return{c(){e=L("div"),u&&u.c(),o=J(),s=A("svg");for(let c=0;c<x.length;c+=1)x[c].c();i=U(),w&&w.c(),l=U();for(let c=0;c<y.length;c+=1)y[c].c();f=J(),g=L("div");for(let c=0;c<p.length;c+=1)p[c].c();this.h()},l(c){e=X(c,"DIV",{id:!0,class:!0});var m=M(e);u&&u.l(m),o=Q(m),s=G(m,"svg",{viewBox:!0,role:!0,tabindex:!0,class:!0});var t=M(s);for(let b=0;b<x.length;b+=1)x[b].l(t);i=U(),w&&w.l(t),l=U();for(let b=0;b<y.length;b+=1)y[b].l(t);t.forEach(C),f=Q(m),g=X(m,"DIV",{id:!0,class:!0});var h=M(g);for(let b=0;b<p.length;b+=1)p[b].l(h);h.forEach(C),m.forEach(C),this.h()},h(){_(s,"viewBox",r=`${n[0].x} ${n[0].y} ${n[0].width} ${n[0].height}`),_(s,"role","button"),_(s,"tabindex","-1"),_(s,"class","svelte-1o33erd"),_(g,"id","drag-and-drop-container"),_(g,"class","svelte-1o33erd"),_(e,"id","svg-container"),_(e,"class","svelte-1o33erd")},m(c,m){B(c,e,m),u&&u.m(e,null),I(e,o),I(e,s);for(let t=0;t<x.length;t+=1)x[t]&&x[t].m(s,null);I(s,i),w&&w.m(s,null),I(s,l);for(let t=0;t<y.length;t+=1)y[t]&&y[t].m(s,null);n[16](s),I(e,f),I(e,g);for(let t=0;t<p.length;t+=1)p[t]&&p[t].m(g,null);N=!0,a||(d=[O(s,"wheel",n[12]),O(s,"pointerdown",n[10]),O(s,"pointerup",n[11]),O(s,"dragover",Be(n[15])),O(s,"drop",n[13])],a=!0)},p(c,[m]){if(c[5]?u&&(u.d(1),u=null):u||(u=ie(),u.c(),u.m(e,o)),m&64){E=R(c[6].connections);let t;for(t=0;t<E.length;t+=1){const h=re(c,E,t);x[t]?x[t].p(h,m):(x[t]=ce(h),x[t].c(),x[t].m(s,i))}for(;t<x.length;t+=1)x[t].d(1);x.length=E.length}if(c[4]===c[7].CONNECTING&&c[3]?w?w.p(c,m):(w=ue(c),w.c(),w.m(s,l)):w&&(w.d(1),w=null),m&320){P=R(c[6].nodes);let t;for(t=0;t<P.length;t+=1){const h=se(c,P,t);y[t]?y[t].p(h,m):(y[t]=ae(h),y[t].c(),y[t].m(s,null))}for(;t<y.length;t+=1)y[t].d(1);y.length=P.length}if((!N||m&1&&r!==(r=`${c[0].x} ${c[0].y} ${c[0].width} ${c[0].height}`))&&_(s,"viewBox",r),m&512){v=R(c[9]);let t;for(t=0;t<v.length;t+=1){const h=le(c,v,t);p[t]?(p[t].p(h,m),z(p[t],1)):(p[t]=fe(h),p[t].c(),z(p[t],1),p[t].m(g,null))}for(Pe(),t=v.length;t<p.length;t+=1)T(t);Ie()}},i(c){if(!N){for(let m=0;m<v.length;m+=1)z(p[m]);N=!0}},o(c){p=p.filter(Boolean);for(let m=0;m<p.length;m+=1)F(p[m]);N=!1},d(c){c&&C(e),u&&u.d(),H(x,c),w&&w.d(),H(y,c),n[16](null),H(p,c),a=!1,Ne(d)}}}function he(n){return{...V(n.source),...Z(n.target)}}function Z(n){return{x2:n.x,y2:n.y}}function V(n){return{x1:n.x,y1:n.y}}function Ge(n,e,o){let s;ke(n,Y,t=>o(6,s=t));var i=(t=>(t[t.NONE=0]="NONE",t[t.DRAGGING=1]="DRAGGING",t[t.PANNING=2]="PANNING",t[t.CONNECTING=3]="CONNECTING",t))(i||{});const l={x:0,y:0,width:0,height:0,get scale(){return a?this.width/a.getBoundingClientRect().width:1}},r={x:0,y:0},f={x:0,y:0},g={[k.Customer]:"lightgreen",[k.Edge]:"cyan",[k.Core]:"hotpink"},N=[{text:"+ Customer",type:k.Customer,color:g[k.Customer]},{text:"+ Edge",type:k.Edge,color:g[k.Edge]},{text:"+ Core",type:k.Core,color:g[k.Core]}];let a=null,d=null,u=0,E=!1;Ee(()=>{const t=new ResizeObserver(x);a&&(t.observe(a),o(5,E=!0))});function x(){if(!a)return;const t=l.scale||1;o(0,l.width=a.getBoundingClientRect().width*t,l),o(0,l.height=a.getBoundingClientRect().height*t,l)}function w(t){if(!(t.target instanceof Element))return;t.preventDefault(),a==null||a.addEventListener("pointermove",y),a==null||a.setPointerCapture(t.pointerId);const h=t.target.id;if(h){if(o(3,d=Y.getNode(parseInt(h))||null),!d)return;t.shiftKey?o(4,u=3):(f.x=d.x,f.y=d.y,o(4,u=1))}else o(4,u=2);o(1,r.x=t.clientX,r),o(1,r.y=t.clientY,r)}function P(t){if(t.target instanceof Element){if(t.preventDefault(),u===3&&d){const h=document.elementFromPoint(t.clientX,t.clientY),b=(h==null?void 0:h.tagName)==="circle"?h.id:null,j=Y.getNode(parseInt(b??""));j!==void 0&&Y.addConnection({source:d,target:j})}o(4,u=0),o(3,d=null),a==null||a.releasePointerCapture(t.pointerId),a==null||a.removeEventListener("pointermove",y)}}function y(t){t.preventDefault();const h={x:(t.clientX-r.x)*l.scale,y:(t.clientY-r.y)*l.scale};u===1&&d?(o(3,d.x=f.x+h.x,d),o(3,d.y=f.y+h.y,d),Y.set(s)):u===2?(o(1,r.x=t.clientX,r),o(1,r.y=t.clientY,r),o(0,l.x-=h.x,l),o(0,l.y-=h.y,l)):u===3&&(o(1,r.x=t.clientX,r),o(1,r.y=t.clientY,r))}function v(t){if(t.preventDefault(),!a||l.scale<.1&&t.deltaY<=0||l.scale>5&&t.deltaY>=0)return;o(1,r.x=t.clientX,r),o(1,r.y=t.clientY,r);const h=a.getBoundingClientRect(),b=t.deltaY>0?1+.025:1-.025,j={x:(r.x-h.left)/h.width,y:(r.y-h.top)/h.height};o(0,l.x-=l.width*(b-1)*j.x,l),o(0,l.y-=l.height*(b-1)*j.y,l),o(0,l.width*=b,l),o(0,l.height*=b,l)}function p(t){var b;t.preventDefault();const h=parseInt(((b=t.dataTransfer)==null?void 0:b.getData("text/plain"))??"0");je(h)&&a&&Y.createNode({label:"Node",...T(t.clientX,t.clientY),type:h})}function T(t,h){return a?{x:(t-a.getBoundingClientRect().left)*l.scale+l.x,y:(h-a.getBoundingClientRect().top)*l.scale+l.y}:{x:t,y:h}}function c(t){ve.call(this,n,t)}function m(t){De[t?"unshift":"push"](()=>{a=t,o(2,a)})}return[l,r,a,d,u,E,s,i,g,N,w,P,v,p,T,c,m]}class Te extends te{constructor(e){super(),ne(this,e,Ge,Ae,$,{})}}function Ue(n){let e,o="MPLS Simulation but without any Simulation and any MPLS so far",s,i,l;return i=new Te({}),{c(){e=L("h1"),e.textContent=o,s=J(),pe(i.$$.fragment)},l(r){e=X(r,"H1",{"data-svelte-h":!0}),me(e)!=="svelte-gjfrzx"&&(e.textContent=o),s=Q(r),be(i.$$.fragment,r)},m(r,f){B(r,e,f),B(r,s,f),ye(i,r,f),l=!0},p:K,i(r){l||(z(i.$$.fragment,r),l=!0)},o(r){F(i.$$.fragment,r),l=!1},d(r){r&&(C(e),C(s)),xe(i,r)}}}class Ke extends te{constructor(e){super(),ne(this,e,null,Ue,$,{})}}export{Ke as component};
