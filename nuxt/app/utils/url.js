// utils/url.js

export function splitPathAndQuery(input) {
  const u = new URL(input, 'http://_dummy.base');
  const path = u.pathname || '/';

  const query = {};
  for (const [k, v] of u.searchParams.entries()) {
    if (Object.prototype.hasOwnProperty.call(query, k)) {
      const cur = query[k];
      query[k] = Array.isArray(cur) ? [...cur, v] : [cur, v];
    } else {
      query[k] = v;
    }
  }

  const hash = u.hash ? u.hash.slice(1) : '';
  const search = u.search || '';

  return { path, query, hash, search };
}

export function buildPath({ path = '/', query = {}, hash = '' } = {}) {
  const u = new URL('http://_dummy.base');
  u.pathname = path;
  Object.entries(query).forEach(([k, v]) => {
    if (v == null) return;
    if (Array.isArray(v)) {
      v.forEach(x => u.searchParams.append(k, String(x)));
    } else {
      u.searchParams.set(k, String(v));
    }
  });

  if (hash) u.hash = `#${hash}`;
  return `${u.pathname}${u.search}${u.hash}`;
}

export function countUrl(v) {
     if(v?.img.indexOf('http') == -1){
    return `${v?.source}${v?.img}`
  }
  return detail?.img
}

export function uuidv4() {
  if (window.crypto && window.crypto.getRandomValues) {
    const buf = new Uint8Array(16)
    window.crypto.getRandomValues(buf)

    // 按 RFC 4122 调整部分位
    buf[6] = (buf[6] & 0x0f) | 0x40
    buf[8] = (buf[8] & 0x3f) | 0x80

    const hex = [...buf].map(b => b.toString(16).padStart(2, '0')).join('')
    return (
      hex.slice(0, 8) + '-' +
      hex.slice(8, 12) + '-' +
      hex.slice(12, 16) + '-' +
      hex.slice(16, 20) + '-' +
      hex.slice(20)
    )
  } else {
    // 老到不行的浏览器：用 Math.random 简易版
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }
}

