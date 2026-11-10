// Exercise actual component callbacks without a browser, network, or subprocess.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
const require = createRequire(new URL('../Frontend/my-app/package.json',import.meta.url))
const { transformSync } = await import(pathToFileURL(require.resolve('rolldown/utils')))
let slots=[], cursor=0, effects=[]
globalThis.componentState=initial=>{const i=cursor++;if(!(i in slots))slots[i]=initial;return [slots[i],value=>{slots[i]=value}]}
globalThis.componentEffect=callback=>effects.push(callback)
globalThis.componentRef=()=>({current:null})
async function load(file, replacements) {
  let source=fs.readFileSync(new URL(file,import.meta.url),'utf8')
  for(const [from,to] of replacements) source=source.replace(from,to)
  let compiled=transformSync('component.jsx',source,{lang:'jsx',jsx:{runtime:'automatic'}}).code
  compiled=compiled.replace(/from ["']react\/jsx-runtime["']/g,`from ${JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href)}`)
  return (await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'))).default
}
const styles="const styles=new Proxy({}, {get:(_,key)=>key})"
const Hero=await load('../Frontend/my-app/src/Components/PageHero/FrameworkSplitHero.jsx',[
  ["import { useState } from 'react'",'const useState=globalThis.componentState'],
  ["import { imageUrl } from '../../pages/KnowUsBetter/useWebsitePage.js'","const imageUrl=(page,code)=>page+'/'+code"],
  ["import styles from './FrameworkSplitHero.module.css'",styles],
])
const hero=Hero({pageCode:'SPINNING',alt:'Spinning',data:{images:{PAGE_HERO_1:{},PAGE_HERO:{},PAGE_HERO_2:{}}}})
const primary=hero.props.children[0].props.children[0]
const secondary=hero.props.children[1].props.children
function view(node){cursor=0;return node.type(node.props)}
assert.equal(view(primary).props.src,'SPINNING/PAGE_HERO_1')
view(primary).props.onError()
assert.equal(view(primary).props.src,'SPINNING/PAGE_HERO')
view(primary).props.onError()
assert.equal(view(primary).type,'div')
slots=[]
assert.equal(view(secondary).props.src,'SPINNING/PAGE_HERO_2')
view(secondary).props.onError()
assert.equal(view(secondary).type,'div')
assert.equal(view(secondary).props.role,'img')
const missing=Hero({pageCode:'SPINNING',alt:'Spinning',data:{images:{}}})
slots=[]
assert.equal(view(missing.props.children[1].props.children).type,'div')
console.log('PASS primary preference, legacy retry, independent secondary, missing and failed image fallbacks')

slots=[];cursor=0;effects=[]
const listeners={};let scroll,focus,observed,options,reduced=false,pushed=0,disconnected=false
const target={id:'CARDING',style:{},setAttribute(){},focus(value){focus=value},scrollIntoView(value){scroll=value}}
globalThis.document={getElementById:code=>code==='CARDING'?target:null,querySelector:()=>({getBoundingClientRect:()=>({height:112})})}
globalThis.window={location:{hash:''},history:{state:{idx:2},pushState(state,unused,hash){assert.equal(state.idx,2);window.location.hash=hash;pushed++}},matchMedia:()=>({matches:reduced}),addEventListener:(name,callback)=>{listeners[name]=callback},removeEventListener:name=>{delete listeners[name]}}
globalThis.IntersectionObserver=class {constructor(callback,config){observed=callback;options=config}observe(){}disconnect(){disconnected=true}}
const Navigator=await load('../Frontend/my-app/src/Components/Navigation/SectionNavigator.jsx',[
  ["import { useEffect, useRef, useState } from 'react'",'const useState=globalThis.componentState,useEffect=globalThis.componentEffect,useRef=globalThis.componentRef'],
  ["import styles from './Navigation.module.css'",styles],
])
const tree=Navigator({items:[{code:'CARDING',title:'Carding'}],label:'Spinning sections'})
const cleanups=effects.map(effect=>effect()).filter(Boolean)
assert.equal(options.rootMargin,'-128px 0px -45% 0px')
assert.equal(target.style.scrollMarginTop,'128px')
const link=tree.props.children.props.children[0].props.children
let prevented=false
link.props.onClick({preventDefault(){prevented=true}})
assert.ok(prevented);assert.deepEqual(focus,{preventScroll:true});assert.equal(scroll.behavior,'smooth');assert.equal(pushed,1)
reduced=true;link.props.onClick({preventDefault(){}})
assert.equal(scroll.behavior,'instant');assert.equal(pushed,1)
observed([{isIntersecting:true,target,boundingClientRect:{top:130}}])
assert.equal(slots[0],'CARDING')
listeners.popstate();assert.equal(scroll.behavior,'instant')
cleanups.forEach(cleanup=>cleanup());assert.ok(disconnected);assert.equal(Object.keys(listeners).length,0)
console.log('PASS sticky offset, native keyboard anchor, focus, smooth/reduced scrolling, active observer, history preservation and listener cleanup')
