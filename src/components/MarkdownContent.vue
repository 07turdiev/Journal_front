<!--
  Markdown viewer powered by Toast UI Editor (Viewer mode).

  The admin uses Toast UI Editor to author content; this component uses the
  same library's Viewer to render it. Same parser → same output, so what an
  editor sees in the admin's WYSIWYG/preview pane is what the visitor sees.

  Falls back to `parseRichText` (Strapi blocks) or `parseMarkdown` (plain
  marked) if no markdown string is provided — useful while migrating older
  endpoints or block-typed fields that don't yet ship a `*_md` companion.
-->
<template>
  <div ref="hostEl" class="markdown-content"></div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import Editor from '@toast-ui/editor'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.js'
import Prism from 'prismjs'
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-python.js'

import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
import 'prismjs/themes/prism.css'

import { parseMarkdown, parseRichText } from '@/utils/richTextParser'

const props = defineProps({
  /**
   * Raw markdown string. This is the preferred input — when present we render
   * with Toast UI Viewer for byte-for-byte parity with the admin editor.
   */
  markdown: { type: String, default: '' },
  /**
   * Strapi blocks array (legacy / fallback). If `markdown` is empty and this
   * is provided, we'll convert blocks → markdown via the existing parser.
   */
  blocks: { type: Array, default: null },
  /** Additional CSS class to apply to the container. */
  contentClass: { type: String, default: '' },
})

const hostEl = ref(null)
let viewer = null

function currentMarkdown() {
  if (typeof props.markdown === 'string' && props.markdown.trim()) {
    return props.markdown
  }
  if (Array.isArray(props.blocks) && props.blocks.length) {
    // Render the blocks through the legacy parser into HTML, then dump as
    // raw HTML inside markdown — Toast UI keeps inline HTML verbatim.
    return parseRichText(props.blocks)
  }
  return ''
}

function mountViewer() {
  if (!hostEl.value) return
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
  viewer = Editor.factory({
    el: hostEl.value,
    viewer: true,
    initialValue: currentMarkdown(),
    plugins: [[codeSyntaxHighlight, { highlighter: Prism }]],
    usageStatistics: false,
  })
}

onMounted(mountViewer)
onBeforeUnmount(() => {
  try { viewer && viewer.destroy() } catch (_) { /* noop */ }
  viewer = null
})

watch(() => [props.markdown, props.blocks], () => {
  if (viewer) {
    viewer.setMarkdown(currentMarkdown())
  } else {
    mountViewer()
  }
}, { deep: true })
</script>

<style scoped>
.markdown-content {
  width: 100%;
}
/* Tighten Toast UI's default container so it fits typical article columns */
.markdown-content :deep(.toastui-editor-contents) {
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.7;
  color: inherit;
  padding: 0;
}
.markdown-content :deep(.toastui-editor-contents h1) { font-size: 2rem; }
.markdown-content :deep(.toastui-editor-contents h2) { font-size: 1.6rem; }
.markdown-content :deep(.toastui-editor-contents h3) { font-size: 1.3rem; }
.markdown-content :deep(.toastui-editor-contents img) {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
}
.markdown-content :deep(.toastui-editor-contents a) {
  color: #2563eb;
  text-decoration: underline;
}
.markdown-content :deep(.toastui-editor-contents blockquote) {
  border-left: 4px solid #cbd5e1;
  background: #f8fafc;
  padding: 12px 16px;
  color: #475569;
  margin: 1em 0;
}
.markdown-content :deep(.toastui-editor-contents pre) {
  background: #1e293b;
  color: #f1f5f9;
  padding: 14px;
  border-radius: 6px;
  overflow-x: auto;
}
.markdown-content :deep(.toastui-editor-contents pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}
.markdown-content :deep(.toastui-editor-contents table) {
  border-collapse: collapse;
}
.markdown-content :deep(.toastui-editor-contents th),
.markdown-content :deep(.toastui-editor-contents td) {
  border: 1px solid #cbd5e1;
  padding: 6px 10px;
}
.markdown-content :deep(.toastui-editor-contents th) {
  background: #f1f5f9;
}
</style>
