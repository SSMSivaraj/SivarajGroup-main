// Exercise component callbacks without launching a browser or child process.
import fs from 'node:fs'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
const require=createRequire(new URL('../Frontend/my-app/package.json',import.meta.url))
const {transformSync}=await import(pathToFileURL(require.resolve('rolldown/utils')))
let status
globalThis.heroState=initial=>[status??initial,value=>{status=value}]
let source=fs.readFileSync(new URL('../Frontend/my-app/src/Components/PageHero/PageHero.jsx',import.meta.url),'utf8')
source=source.replace("import { useState } from 'react'",'const useState=globalThis.heroState').replace("import styles from './PageHero.module.css'","const styles=new Proxy({}, {get:(_,key)=>key})").replaceAll('import.meta.env','({})')
let compiled=transformSync('hero.jsx',source,{lang:'jsx',jsx:{runtime:'automatic'}}).code
compiled=compiled.replace(/from ["']react\/jsx-runtime["']/g,`from ${JSON.stringify(pathToFileURL(require.resolve('react/jsx-runtime')).href)}`)
const {default:Hero}=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'))
const props={pageCode:'TEST',src:'/api/website/page-images/TEST/PAGE_HERO',alt:'Test original photograph',children:'Headline'}
const view=()=>{const node=Hero(props);return node.type(node.props)}
let tree=view();assert.ok(tree.props.className.includes('loading'));assert.ok(!tree.props.className.includes('loaded'))
tree.props.children[0].props.onLoad();tree=view();assert.ok(tree.props.className.includes('loaded'));assert.equal(tree.props.children[0].props.src,props.src)
tree.props.children[0].props.onError();tree=view();assert.ok(!tree.props.className.includes('loaded'));assert.equal(tree.props.children[0],false)
status=undefined;const missing=Hero({...props,src:undefined});assert.ok(!missing.type(missing.props).props.className.includes('loaded'))
assert.equal(Hero({...props,src:'new.jpg'}).key,'new.jpg')
console.log('PASS hero loading, success, error, absent image and replacement state key')
let location={pathname:'/goods/cotton-yarn',hash:''},scrolls=[],anchors=0,observerDisconnected=false
globalThis.testLocation=()=>location
globalThis.effect=callback=>callback()
globalThis.window={history:{scrollRestoration:'auto'},scrollTo:value=>scrolls.push(value)}
globalThis.document={getElementById:id=>id==='QUALITY_SYSTEMS'?{scrollIntoView:()=>{anchors++}}:null,body:{}}
globalThis.MutationObserver=class {observe(){} disconnect(){observerDisconnected=true}}
source=fs.readFileSync(new URL('../Frontend/my-app/src/Components/ScrollToTop/ScrollToTop.jsx',import.meta.url),'utf8').replace("import { useEffect, useLayoutEffect } from 'react'",'const useEffect=globalThis.effect,useLayoutEffect=globalThis.effect').replace("import { useLocation } from 'react-router-dom'",'const useLocation=globalThis.testLocation')
const {default:Scroll}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'))
Scroll();assert.deepEqual(scrolls[0],{top:0,left:0,behavior:'instant'})
location={pathname:'/credentials/certifications',hash:'#QUALITY_SYSTEMS'};Scroll();assert.equal(anchors,1);assert.equal(scrolls.length,1)
location={pathname:'/goods/garments',hash:''};Scroll();assert.equal(scrolls.length,2)
assert.equal(window.history.scrollRestoration,'manual')
console.log('PASS navigation top reset and valid anchor preservation; history restoration controlled')
void observerDisconnected
