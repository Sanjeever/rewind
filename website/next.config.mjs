import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  flexsearch: {
    codeblocks: false
  },
  defaultShowCopyCode: true
})

export default withNextra({
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true }
})
