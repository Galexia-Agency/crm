<style lang="scss">
/* Editor objects */
.editor_object_standard {
  background: var(--back);
  border: 3px solid var(--base);
  border-radius: 10px;
  transition: .6s border cubic-bezier(.165, .84, .44, 1);
  h3 {
    position: relative;
    left: 2rem;
    width: fit-content;
    padding: .6rem;
    color: var(--fore);
    background: var(--base);
    border-radius: 0 0 10px 10px
  }
  #wrapper--rich_editor {
    margin: 2rem;
    background: var(--back)
  }

  /* State */
  &.is-active {
    opacity: .4
  }
}
.editor_object_complex {
  display: grid;
  padding: 2rem;
  background: var(--back);
  border: 2px solid var(--base);
  border-radius: 10px;
  transition: .6s border cubic-bezier(.165, .84, .44, 1);

  /* State */
  &.is-active {
    opacity: .4
  }
}

/* Editor */
button.menu_button {
  display: inline-flex;
  border: 1px solid transparent;
  border-radius: .25em;
  &:focus {
    box-shadow: none
  }
  &.is-active {
    border: 1px solid black
  }
}
#wrapper--rich_editor .control {
  height: auto;
  min-height: calc(120px + 48px);
  padding: 0;
  &:focus-within {
    border-color: var(--primaryColor);
    box-shadow: 0 0 0 .125em rgb(50 115 220 / 25%)
  }
}
#wrapper--rich_editor[disabled] .control {
  min-height: 120px
}
div#rich_editor {
  padding: 0;
  ul[data-type='taskList'] {
    padding: 0;
    list-style: none;
    li {
      display: flex;
      align-items: center;
      label {
        flex: 0 0 auto;
        margin-right: .5rem
      }
    }
  }
  div[contenteditable] {
    height: 100%;
    min-height: 120px;
    max-height: 40vh;
    padding: .625em;
    overflow-y: auto;
    white-space: pre-wrap;
    outline: none;
    appearance: none;
    resize: vertical;
    scrollbar-gutter: stable;
    > div:not(:first-child),
    > p:not(:first-child) {
      margin: .6rem 0
    }
    ul {
      list-style: disc
    }
    ol {
      list-style: numeric
    }
    ol,
    ul {
      margin-left: 1.2em
    }
    hr {
      background-color: var(--thumbBG)
    }
    img {
      margin: 1rem 0
    }
    a {
      text-decoration: underline
    }
  }
}

/* Responsive */
@media (max-width: 768px) {
  div#rich_editor > div[contenteditable] img {
    max-width: 100%
  }
}
@media (max-width: 576px) {
  .editor_object_standard {
    h3 {
      left: 1rem
    }
    #wrapper--rich_editor {
      margin: 1rem
    }
  }
  .editor_object_complex {
    padding: 1rem
  }
}

// -----------------------------
// Menu
// -----------------------------

/* Outer container of menu */
.menu_bar_wrapper {
  border-bottom: 1px solid #DBDBDB;

  /* Inner container of menu */
  #menu_bar {
    padding: 0 1em;
    button {
      margin: .8rem 1rem .6rem 0;
      padding: 0;
      background-color: transparent
    }
    svg {
      width: 20px;
      height: 20px
    }
  }
}
#wrapper--rich_editor[disabled] {
  pointer-events: none;
  button svg * {
    fill: #7A7A7A
  }
  .textarea,
  .textarea:hover {
    color: #7A7A7A;
    border-color: #DBDBDB;
    box-shadow: none
  }
}
</style>

<template>
  <div id="wrapper--rich_editor" class="field" :disabled="disabled">
    <label v-if="label" class="label">{{ label }}</label>
    <div class="control textarea">
      <div v-if="!disabled" class="menu_bar_wrapper">
        <div id="menu_bar" :class="{ editorFocused: caretInEditor }">
          <button
            type="button"
            class="fadeIn menu_button"
            :class="{ 'is-active': editor.isActive('bold') }"
            title="Bold"
            @click="editor.chain().focus().toggleBold().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/bold.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            :class="{ 'is-active': editor.isActive('italic') }"
            title="Italic"
            @click="editor.chain().focus().toggleItalic().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/italic.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            :class="{ 'is-active': editor.isActive('underline') }"
            title="Underline"
            @click="editor.chain().focus().toggleUnderline().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/underline.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            :class="{ 'is-active': editor.isActive('ordered_list') }"
            title="Ordered list"
            @click="editor.chain().focus().toggleOrderedList().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/ol.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            :class="{ 'is-active': editor.isActive('bullet_list') }"
            title="Bullet list"
            @click="editor.chain().focus().toggleBulletList().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/ul.svg')" />
          </button>
          <button
            type="button"
            class="menu_button"
            :class="{ 'is-active': editor.isActive('taskList') }"
            title="Checklist"
            @click="editor.chain().focus().toggleTaskList().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/checklist.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            :class="{ 'is-active': editor.isActive('horizontalRule') }"
            title="Horizontal line"
            @click="editor.chain().focus().setHorizontalRule().run()"
          >
            <InlineSvg
              :src="require('~/assets/svg/editor/horizontal-rule.svg')"
            />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            :class="{ 'is-active': editor.isActive('link') }"
            title="Hyperlink"
            @click="
              editor.isActive('link')
                ? editor.chain().focus().unsetLink().run()
                : setLinkUrl()
            "
          >
            <InlineSvg :src="require('~/assets/svg/editor/link.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            title="Image"
            @click="
              ;$refs.ui_editor_input.show(
                  'image',
                  'Select your image to upload',
                  'Make sure that it\'s less than 5MB'
                )
            "
          >
            <InlineSvg :src="require('~/assets/svg/editor/image.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            title="Undo"
            @click="editor.chain().focus().undo().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/undo.svg')" />
          </button>
          <button
            type="button"
            class="fadeIn menu_button"
            title="Redo"
            @click="editor.chain().focus().redo().run()"
          >
            <InlineSvg :src="require('~/assets/svg/editor/redo.svg')" />
          </button>
        </div>
        <UiEditorInput ref="ui_editor_input" />
      </div>
      <EditorContent
        id="rich_editor"
        :editor="editor"
        :class="{ editorFocused: caretInEditor }"
      />
    </div>
  </div>
</template>

<script>
import Compressor from 'compressorjs'
import { Editor, EditorContent } from '@tiptap/vue-2'
// eslint-disable-next-line import/no-named-as-default
import StarterKit from '@tiptap/starter-kit'
// eslint-disable-next-line import/no-named-as-default
import Underline from '@tiptap/extension-underline'
// eslint-disable-next-line import/no-named-as-default
import Link from '@tiptap/extension-link'
// eslint-disable-next-line import/no-named-as-default
import TaskList from '@tiptap/extension-task-list'
// eslint-disable-next-line import/no-named-as-default
import TaskItem from '@tiptap/extension-task-item'
import LazyImage from './LazyImage'

export default {
  components: {
    EditorContent
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    value: String,
    // eslint-disable-next-line vue/require-default-prop
    label: String,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // Editor
      initialValue: null,
      editor: null,
      editState: false,
      caretInEditor: false,
      saving: false,

      // Link
      linkUrl: null,
      linkMenuIsActive: false
    }
  },
  beforeMount () {
    this.initialValue = this.value
    this.editor = new Editor({
      content: this.value,
      extensions: [StarterKit, Underline, Link, TaskList, TaskItem, LazyImage],
      onUpdate: ({ editor }) => {
        this.$emit('editor-update-shim', editor)
      },
      onFocus: () => {
        this.caretInEditor = true
      },
      onBlur: () => {
        this.caretInEditor = false
      },
      onDestroy: () => {
        this.initialValue = null
      }
    })
  },
  beforeDestroy () {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  methods: {
    // -----------------------------
    // General
    // -----------------------------

    /**
     * Sets the link of the selected text.
     */
    async setLinkUrl () {
      const SRC = await this.$refs.ui_editor_input.show('link')
      if (!SRC) {
        return
      }
      this.editor.chain().focus().setLink({ href: SRC }).run()
    },

    /**
     * Adds an image.
     */
    addImg () {
      const FILE = document.getElementById('img_uploader').files[0]
      const READER = new FileReader()
      READER.addEventListener('load', () => {
        const base64Image = READER.result.toString()
        this.editor
          .chain()
          .focus()
          .setImage({ src: base64Image, loading: 'lazy' })
          .run()
      }, false)

      if (FILE) {
        if (FILE.size < 5100000) {
          // eslint-disable-next-line no-new
          new Compressor(FILE, {
            quality: 0.6,
            success (result) {
              READER.readAsDataURL(result)
            },
            error (err) {
              // eslint-disable-next-line no-console
              console.error(err)
            }
          })
        } else {
          this.$refs.ui_editor_input.show('File size is too big', 'Please compress it to 5MB or lower', true, true)
          document.getElementById('img_uploader').value = ''
        }
      }
    }
  }
}
</script>
