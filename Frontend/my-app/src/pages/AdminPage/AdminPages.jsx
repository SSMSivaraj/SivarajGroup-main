import { navigationGroups, navigationLabel } from '../../config/navigation.js'
import { useEffect, useRef, useState } from 'react'
import { Alert, Col, Container, Form, Row, Spinner, Table } from 'react-bootstrap'
import { Navigate, Outlet, useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import { frameworkImageSections, imagePositionLabel } from '../Framework/frameworkImages.js'
import { primaryImagePositions, sectionPages } from '../KnowUsBetter/sectionConfig.js'
import { knowUsBetterImageSections } from '../KnowUsBetter/knowUsBetterImages.js'
import { pageSections, standardSections, position, positionLabel } from './imageConfiguration.js'

const API_URL = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '')
const api = path => `${API_URL}/api/website/${path}`
const button = { background: '#063F35', color: '#fff', borderRadius: 0, padding: '10px 20px' }
const titleStyle = { fontFamily: 'Georgia, serif', color: '#063F35' }
const pageGroup = code => sectionPages[code]?.category || (Object.hasOwn(knowUsBetterImageSections, code) ? 'Know Us Better' : code === 'SPINNING' || Object.hasOwn(frameworkImageSections, code) ? 'Framework' : 'Other Pages')
const pageLabel = code => sectionPages[code]?.title || (code === 'CSR' ? 'CSR' : imagePositionLabel('', code))
function PageOptions({ pages }) {
  const validPages = pages.filter(code => Object.hasOwn(pageSections, code))
  const groupOf = code => code === 'WELCOME_WAY' ? 'Welcome Way' : pageGroup(code)
  const groups = [...new Set(validPages.map(groupOf))]
  const order = group => navigationGroups.find(item => item.key === group)?.displayOrder ?? Infinity
  return groups.sort((a, b) => order(a) - order(b)).map(group => {
    const childOrder = code => {
      const index = navigationGroups.find(item => item.key === group)?.children.findIndex(child => child.label === pageLabel(code)) ?? -1
      return index < 0 ? Infinity : index
    }
    return <optgroup key={group} label={navigationLabel(group)}>{validPages.filter(code => groupOf(code) === group).sort((a, b) => childOrder(a) - childOrder(b)).map(code => <option key={code} value={code}>{pageLabel(code)}</option>)}</optgroup>
  })
}
async function request(path, options = {}) {
  const response = await fetch(api(path), { ...options, credentials: 'include' })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.success === false) {
    const error = new Error(result.message || (response.status === 401 ? 'Your session has expired. Please sign in.' : 'Unable to complete your request. Please try again.'))
    error.status = response.status
    throw error
  }
  return result
}
function Loading({ children = 'Checking your session…' }) {
  return <div role="status" className="d-flex align-items-center gap-3 py-4"><Spinner animation="border" size="sm" /><span>{children}</span></div>
}
function AdminShell({ children }) {
  return <main style={{ minHeight: '100vh', background: '#F6F2E9', color: '#1D2926' }}><Container className="py-5">{children}</Container></main>
}
export function RequireAdmin() {
  const [state, setState] = useState({ loading: true, user: null, error: '' })
  useEffect(() => {
    let active = true
    request('admin/me').then(result => {
      if (active) setState({ loading: false, user: result.data, error: '' })
    }).catch(error => {
      if (active) setState({ loading: false, user: null, error: error.status === 401 ? '' : error.message })
    })
    return () => { active = false }
  }, [])
  if (state.loading) return <AdminShell><Loading /></AdminShell>
  if (state.error) return <AdminShell><Alert variant="danger">{state.error}</Alert><button className="btn" style={button} onClick={() => window.location.reload()}>Try again</button></AdminShell>
  if (!state.user) return <Navigate to="/admin/login" replace />
  return <Outlet context={state.user} />
}
export function AdminLoginPage() {
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    request('admin/me').then(() => { if (active) navigate('/admin/website-images', { replace: true }) }).catch(error => {
      if (active) { setChecking(false); if (error.status !== 401) setError(error.message) }
    })
    return () => { active = false }
  }, [navigate])
  async function signIn(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setError(''); setBusy(true)
    try {
      await request('admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.get('username'), password: form.get('password') }) })
      navigate('/admin/website-images', { replace: true })
    } catch (error) { setError(error.message) }
    finally { setBusy(false) }
  }
  return <AdminShell><Row className="justify-content-center"><Col md={7} lg={5}><div className="bg-white border p-4 p-lg-5"><p className="small text-uppercase" style={{ color: '#806024' }}>Sivaraj Group Administration</p><h1 className="h2 mb-4" style={titleStyle}>Administrator Sign In</h1>{checking ? <Loading /> : <>
    {error && <Alert variant="danger" role="alert">{error}</Alert>}<Form onSubmit={signIn}><Form.Group className="mb-3" controlId="admin-username"><Form.Label>Username</Form.Label><Form.Control name="username" autoComplete="username" maxLength={100} required disabled={busy} /></Form.Group><Form.Group className="mb-4" controlId="admin-password"><Form.Label>Password</Form.Label><Form.Control name="password" type="password" autoComplete="current-password" required disabled={busy} /></Form.Group><button className="btn w-100" style={button} disabled={busy}>{busy ? <><Spinner size="sm" animation="border" /> Signing in…</> : 'Sign In'}</button></Form></>}
  </div></Col></Row></AdminShell>
}
function ImagePreview({ page, section, version, active = true, alt = 'Current website image' }) {
  const [failed, setFailed] = useState(false)
  return <div className="border d-flex align-items-center justify-content-center overflow-hidden" style={{ aspectRatio: '4 / 3', background: '#E6E2DA' }}>{active && !failed ? <img src={`${api(`page-images/${encodeURIComponent(page)}/${encodeURIComponent(section)}`)}?v=${encodeURIComponent(version || '')}`} alt={alt} loading="lazy" onError={() => setFailed(true)} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <span className="small text-center p-2">{active ? 'Image unavailable' : 'Inactive image'}</span>}</div>
}
export function WebsiteImagesAdminPage() {
  const user = useOutletContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialPage = Object.hasOwn(pageSections, searchParams.get('page')) ? searchParams.get('page') : 'SPINNING'
  const initialSection = pageSections[initialPage].includes(searchParams.get('section')) ? searchParams.get('section') : pageSections[initialPage][0]
  const editor = ['SUPER_ADMIN', 'CONTENT_ADMIN'].includes(user.role_code)
  const [rows, setRows] = useState([])
  const [pageFilter, setPageFilter] = useState(searchParams.has('page') ? initialPage : '')
  const [activeFilter, setActiveFilter] = useState('')
  const [revision, setRevision] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const mutationLock = useRef(false)
  const [notice, setNotice] = useState('')
  const [uploadNotice, setUploadNotice] = useState('')
  const [page, setPage] = useState(initialPage)
  const [section, setSection] = useState(initialSection)
  const graphicsClip = page === 'WELCOME_WAY' && section === 'HEADER_GRAPHICS'
  const [altText, setAltText] = useState('')
  const [order, setOrder] = useState(String(position(initialPage, initialSection)?.displayOrder || 0))
  const [selection, setSelection] = useState(null)
  const [replacement, setReplacement] = useState(null)
  const [fileKey, setFileKey] = useState(0)
  const [layout, setLayout] = useState({ key: '', rows: [], error: '' })
  const layoutKey = `${page}-${revision}`
  const layoutRows = layout.key === layoutKey ? layout.rows : []
  useEffect(() => {
    const controller = new AbortController()
    request(`admin/page-images?pageCode=${encodeURIComponent(page)}`, { signal: controller.signal }).then(result => {
      setLayout({ key: `${page}-${revision}`, rows: result.data, error: '' })
    }).catch(error => {
      if (!controller.signal.aborted) {
        if (error.status === 401) navigate('/admin/login', { replace: true })
        else setLayout({ key: `${page}-${revision}`, rows: [], error: error.message })
      }
    })
    return () => controller.abort()
  }, [page, revision, navigate])
  useEffect(() => () => { if (selection?.url) URL.revokeObjectURL(selection.url) }, [selection])
  useEffect(() => {
    const controller = new AbortController()
    const query = new URLSearchParams()
    if (pageFilter) query.set('pageCode', pageFilter)
    if (activeFilter) query.set('isActive', activeFilter)
    request(`admin/page-images?${query}`, { signal: controller.signal }).then(result => {
      setRows(result.data.filter(row => pageSections[row.page_code]?.includes(row.section_code))); setLoading(false)
    }).catch(error => {
      if (controller.signal.aborted) return
      if (error.status === 401) navigate('/admin/login', { replace: true })
      else { setError(error.message); setRows([]); setLoading(false) }
    })
    return () => controller.abort()
  }, [pageFilter, activeFilter, revision, navigate])
  function refresh() {
    setError(''); setLoading(true); setRevision(value => value + 1)
    window.dispatchEvent(new Event('website-images-changed'))
    try { localStorage.setItem('website-image-revision', String(Date.now())) } catch { /* Storage may be unavailable. */ }
  }
  function report(error) {
    if (error.status === 401) navigate('/admin/login', { replace: true })
    else setError(error.message)
  }
  function reset() {
    setPage('SPINNING'); setSection('PAGE_HERO_1')
    setSelection(null); setReplacement(null); setAltText(''); setOrder('1'); setFileKey(value => value + 1)
  }
  function selectFile(event) {
    const file = event.target.files?.[0]
    setSelection(null); setError(''); setNotice(''); setUploadNotice('')
    if (!file) return
    const validImage = /\.(webp|jpe?g|png)$/i.test(file.name) && ['image/webp', 'image/jpeg', 'image/png'].includes(file.type)
    const validAnimation = graphicsClip && /\.gif$/i.test(file.name) && file.type === 'image/gif'
    if (!validImage && !validAnimation) {
      setError(graphicsClip ? 'Choose an animated WebP or GIF, or a PNG/JPEG graphic.' : 'Choose a WebP, JPEG or PNG image.'); event.target.value = ''; return
    }
    if (!file.size || file.size > 614400) { setError('Choose a non-empty image no larger than 600 KB.'); event.target.value = ''; return }
    setSelection({ file, url: URL.createObjectURL(file) })
  }
  async function upload(event) {
    event.preventDefault(); if (mutationLock.current) return; setError(''); setNotice(''); setUploadNotice('')
    if (!selection) { setError('Select an image before uploading.'); return }
    mutationLock.current = true; setBusy(true)
    const body = new FormData()
    body.append('image', selection.file); body.append('altText', altText); body.append('displayOrder', order)
    try {
      const result = await request(`page-images/${page}/${section}`, { method: 'PUT', body })
      setUploadNotice(result.message || 'Image uploaded successfully.'); setSelection(null); setReplacement(null); setFileKey(value => value + 1); refresh()
    } catch (error) { report(error) }
    finally { mutationLock.current = false; setBusy(false) }
  }
  async function deleteImage(row) {
    if (mutationLock.current || !editor || !row) return
    const targetPage = row.page_code
    const targetSection = row.section_code
    if (!window.confirm(`Delete the image for '${pageLabel(targetPage)} → ${positionLabel(targetPage, targetSection)}'? This action will remove the stored database image.`)) return
    mutationLock.current = true; setBusy(true); setError(''); setNotice(''); setUploadNotice('')
    try {
      const result = await request(`page-images/${encodeURIComponent(targetPage)}/${encodeURIComponent(targetSection)}`, { method: 'DELETE' })
      if (targetPage === page && targetSection === section) {
        setLayout({ key: '', rows: [], error: '' }); setReplacement(null); setSelection(null); setAltText(''); setFileKey(value => value + 1)
      }
      setNotice(result.message); refresh()
    } catch (error) { report(error) }
    finally { mutationLock.current = false; setBusy(false) }
  }
  async function changeStatus(row) {
    setBusy(true); setError(''); setNotice(''); setUploadNotice('')
    try {
      await request(`admin/page-images/${row.image_id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !row.is_active }) })
      setNotice(row.is_active ? 'Image deactivated.' : 'Image activated.'); refresh()
    } catch (error) { report(error) }
    finally { setBusy(false) }
  }
  async function logout() {
    setBusy(true); setError('')
    try { await request('admin/logout', { method: 'POST' }); navigate('/admin/login', { replace: true }) }
    catch (error) { report(error) }
    finally { setBusy(false) }
  }
  function replace(row) {
    reset(); setError(''); setNotice(''); setUploadNotice(''); setReplacement(row); setPage(row.page_code); setSection(row.section_code); setAltText(row.alt_text || ''); setOrder(String(row.display_order))
    document.getElementById('image-upload-form')?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }
  const pages = [...new Set([...Object.keys(pageSections), ...rows.map(row => row.page_code), page])]
  const sections = [...new Set([...(pageSections[page] || standardSections), ...(replacement ? [replacement.section_code] : [])])]
  const current = replacement || layoutRows.find(row => row.section_code === section)
  return <AdminShell><header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><h1 className="h2" style={titleStyle}>Website Image Management</h1><p className="mb-0">{user.display_name || user.username} · {user.role_code}</p></div><button className="btn border" onClick={logout} disabled={busy}>Logout</button></header>
    {error && <Alert variant="danger" role="alert">{error}</Alert>}{notice && <Alert variant="success" role="status">{notice}</Alert>}
    <section aria-label="Image filters" className="border bg-white p-4 mb-4"><Row className="g-3 align-items-end"><Col md={5}><Form.Label htmlFor="page-filter">Page</Form.Label><Form.Select id="page-filter" value={pageFilter} onChange={event => { setLoading(true); setPageFilter(event.target.value) }}><option value="">All pages</option><PageOptions pages={pages} /></Form.Select></Col><Col md={4}><Form.Label htmlFor="active-filter">Status</Form.Label><Form.Select id="active-filter" value={activeFilter} onChange={event => { setLoading(true); setActiveFilter(event.target.value) }}><option value="">All statuses</option><option value="true">Active</option><option value="false">Inactive</option></Form.Select></Col><Col md={3}><button className="btn border" onClick={refresh} disabled={loading || busy}>Refresh</button></Col></Row></section>
    {editor ? <section id="image-upload-form" className="border bg-white p-4 mb-4"><h2 className="h4 mb-4" style={titleStyle}>{replacement ? 'Replace Website Image' : 'Upload or Replace Image'}</h2><Form onSubmit={upload}><fieldset disabled={busy}><Row className="g-3"><Col md={6}><Form.Label htmlFor="upload-page">Page</Form.Label><Form.Select id="upload-page" value={page} disabled={!!replacement} onChange={event => { setPage(event.target.value); setSection((pageSections[event.target.value] || standardSections)[0]); setSelection(null); setFileKey(value => value + 1); setAltText(''); setUploadNotice(''); setOrder('1') }}><PageOptions pages={pages} /></Form.Select></Col><Col md={6}><Form.Label htmlFor="upload-section">Section</Form.Label><Form.Select id="upload-section" value={section} disabled={!!replacement} onChange={event => { const code = event.target.value; setSection(code); setSelection(null); setFileKey(value => value + 1); setAltText(''); setUploadNotice(''); setOrder(String(position(page, code)?.displayOrder ?? Math.max(0, sections.indexOf(code)))) }}>{primaryImagePositions[page] ? <><optgroup label="Primary image positions">{Object.keys(primaryImagePositions[page]).map(code => <option key={code} value={code}>{positionLabel(page, code)}</option>)}</optgroup><optgroup label="Existing additional positions">{sections.filter(code => !primaryImagePositions[page][code]).map(code => <option key={code} value={code}>{positionLabel(page, code)}</option>)}</optgroup></> : sections.map(code => <option key={code} value={code}>{positionLabel(page, code)}</option>)}</Form.Select></Col><Col md={8}><Form.Label htmlFor="upload-file">{graphicsClip ? 'Graphics Clip (maximum 600 KB)' : 'Image (maximum 600 KB)'}</Form.Label>{graphicsClip && <p className="small text-secondary">Upload a wide animated WebP/GIF or a PNG/JPEG graphic. Shown above all Welcome Way slides between the logo and navigation on large screens. Recommended: 480 × 64 px with a transparent background. Hidden below 1400 px and when reduced motion is enabled. SVG and video uploads are not supported.</p>}<Form.Control key={fileKey} id="upload-file" type="file" accept={graphicsClip ? '.webp,.gif,.jpg,.jpeg,.png,image/webp,image/gif,image/jpeg,image/png' : '.webp,.jpg,.jpeg,.png,image/webp,image/jpeg,image/png'} onChange={selectFile} />{selection && <p className="small mt-2">{selection.file.name} · {(selection.file.size / 1024).toFixed(1)} KB</p>}</Col><Col md={4}><Form.Label htmlFor="upload-order">Display order</Form.Label><Form.Control id="upload-order" type="number" min="0" max="2147483647" step="1" required value={order} onChange={event => setOrder(event.target.value)} /></Col><Col xs={12}><Form.Label htmlFor="upload-alt">Alternative text</Form.Label><Form.Control id="upload-alt" placeholder={position(page, section)?.altPlaceholder} maxLength={500} value={altText} onChange={event => setAltText(event.target.value)} /></Col></Row><Row className="g-4 my-2"><Col md={6}><h3 className="h6">Current image</h3>{current ? <ImagePreview key={`${page}-${section}-${revision}`} page={page} section={section} version={current.updated_at || current.created_at || revision} active={!!current.is_active} alt={current.alt_text || 'Current website image'} /> : <p className="text-secondary">{layout.key !== layoutKey ? 'Checking current image…' : layout.error || 'No image is currently uploaded.'}</p>}</Col><Col md={6}><h3 className="h6">Selected image</h3>{selection ? <img src={selection.url} alt="Preview of the selected upload" className="border w-100" style={{ aspectRatio: '4 / 3', objectFit: 'contain', background: '#E6E2DA' }} /> : <p className="text-secondary">Select an image to preview it here.</p>}</Col></Row>{uploadNotice && <Alert variant="success" role="status" className="mt-3">{uploadNotice}</Alert>}<div className="d-flex flex-wrap gap-3"><button className="btn" style={button} type="submit">{busy ? 'Saving…' : 'Upload / Replace'}</button>{current && <button className="btn btn-danger" type="button" disabled={busy} onClick={() => deleteImage(current)}>Delete Image</button>}<button className="btn border" type="button" onClick={reset}>Cancel / Reset</button></div><p className="small text-secondary mt-3 mb-0">Uploading replaces the same page and section and activates the image.</p></fieldset></Form></section> : <Alert variant="light">Your account has view-only access.</Alert>}
    <section className="border bg-white p-4"><h2 className="h4 mb-4" style={titleStyle}>Existing Images</h2>{loading ? <Loading>Loading image metadata…</Loading> : rows.length ? <Table responsive striped className="align-middle"><thead><tr>{['Preview', 'Page / Section', 'File', 'Alternative text', 'Order', 'Status', 'Updated by / at', 'Actions'].map(label => <th key={label}>{label}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.image_id}><td><div style={{ width: 96 }}><ImagePreview key={`${row.image_id}-${revision}`} page={row.page_code} section={row.section_code} version={`${row.updated_at || row.created_at}-${revision}`} active={!!row.is_active} alt={row.alt_text || 'Website image'} /></div></td><td>{row.page_code}<br /><span className="small">{row.section_code}</span></td><td>{row.image_name}<br /><span className="small">{row.image_type} · {(row.image_size_bytes / 1024).toFixed(1)} KB</span></td><td>{row.alt_text || '—'}</td><td>{row.display_order}</td><td>{row.is_active ? 'Active' : 'Inactive'}</td><td>{row.updated_by || row.created_by}<br /><span className="small">{new Date(row.updated_at || row.created_at).toLocaleString()}</span></td><td>{editor ? <div className="d-flex flex-wrap gap-2"><button className="btn btn-sm border" disabled={busy} onClick={() => replace(row)}>Replace</button><button className="btn btn-sm btn-danger" type="button" disabled={busy} onClick={() => deleteImage(row)}>Delete Image</button><button className="btn btn-sm border" disabled={busy} onClick={() => changeStatus(row)}>{row.is_active ? 'Deactivate' : 'Activate'}</button></div> : 'View only'}</td></tr>)}</tbody></Table> : <p className="text-secondary">No images match these filters.</p>}</section>
  </AdminShell>
}
