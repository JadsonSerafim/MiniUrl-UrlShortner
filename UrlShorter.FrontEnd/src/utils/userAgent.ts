export function parseUserAgent(nav?: string): { browser: string; os: string } {
  if (!nav) return { browser: 'Desconhecido', os: 'Desconhecido' }

  let browser = 'Outro'
  let os = 'Outro'
  const navegador = nav.toLowerCase()

  switch (true) {
    case navegador.includes('firefox'):
      browser = 'Firefox'
      break
    case navegador.includes('edge'):
    case navegador.includes('edg'):
      browser = 'Edge'
      break
    case navegador.includes('opera'):
    case navegador.includes('opr'):
      browser = 'Opera'
      break
    case navegador.includes('chrome'):
      browser = 'Chrome'
      break
    case navegador.includes('safari'):
      browser = 'Safari'
      break
  }

  switch (true) {
    case navegador.includes('windows'):
      os = 'Windows'
      break
    case navegador.includes('macintosh'):
    case navegador.includes('mac os'):
      os = 'macOS'
      break
    case navegador.includes('linux'):
      os = 'Linux'
      break
    case navegador.includes('android'):
      os = 'Android'
      break
    case navegador.includes('iphone'):
    case navegador.includes('ipad'):
      os = 'iOS'
      break
  }

  return { browser, os }
}
