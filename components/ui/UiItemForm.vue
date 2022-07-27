<style scoped lang="scss">
  .card-modal-buttons-container {
    justify-content: space-between;
    > div {
      display: flex
    }
  }
</style>

<template>
  <form class="query-form card" @submit.prevent="submit">
    <div class="card-content">
      <ui-input
        v-model="title"
        name="title"
        label="Title"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
        :autofocus="true"
        :required="true"
      />
      <Editor
        v-if="title"
        v-model="description"
        label="Description"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
        @editorUpdateShim="editorUpdateShim"
      />
      <ui-input
        v-model="date"
        name="date"
        type="date"
        label="Date"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
        @resetDate="resetDate"
      />
      <ui-input
        v-model="assignee"
        name="assignee"
        type="text"
        label="Assignee"
        help="Email Address"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
      />
      <div v-if="id" class="field last-updated">
        Last updated by <strong>{{ updatedBy }}</strong> at <strong>{{ (new Date(updatedDate)).toLocaleTimeString("en-GB") }}</strong> on <strong>{{ (new Date(updatedDate)).toLocaleDateString("en-GB") }}</strong>
      </div>
      <div class="field is-grouped card-modal-buttons-container">
        <div>
          <ui-button type="submit" style-type="primary" :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))">
            {{ id ? 'Update' : 'Add' }}
          </ui-button>
          <ui-button style-type="text" @click="cancel">
            Cancel
          </ui-button>
        </div>
        <ui-button v-if="id" style-type="archive" @click="archive">
          Archive
        </ui-button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import Editor from '../editor/Editor'
function data () {
  return {
    id: null,
    title: '',
    description: ' ',
    date: null,
    dayNo: null,
    day: null,
    month: null,
    message: '',
    createdDate: null,
    updatedDate: null,
    clientName: null,
    clientShortName: null,
    updatedBy: null,
    assignee: 'joe@galexia.agency',

    // Images
    cloudinaryImages: {
      startingWith: [],
      endingWith: []
    }
  }
}
export default {
  components: {
    Editor
  },
  data () {
    return data()
  },
  computed: {
    ...mapState([
      'claims'
    ]),
    values () {
      return this.$data
    },
    baseURL () {
      if (process.env.NODE_ENV !== 'production') {
        return 'http://localhost:8888'
      } else {
        return null
      }
    }
  },
  methods: {
    editorUpdateShim (value) {
      this.description = value.getHTML()
    },
    async show (data) {
      this.reset()
      Object.assign(this, data)
      // Search for images in the editor
      const FOUND_IMGS = await this.imgFinder(this.description)
      this.cloudinaryImages.startingWith = FOUND_IMGS
      this.cloudinaryImages.endingWith = FOUND_IMGS
    },
    resetDate () {
      this.date = null
    },
    async submit () {
      this.cloudinaryImages.endingWith = await this.imgFinder(this.description)
      await this.deleteOldImgs()
      this.cloudinaryImages = {
        startingWith: [],
        endingWith: []
      }
      this.$emit('submit', this.values)
    },
    cancel () {
      this.$emit('cancel', this.values)
    },
    archive () {
      this.$emit('archive', this.values)
    },
    reset () {
      Object.assign(this, data())
    },
    /**
     * Finds all the images in the html.
     * @param {string} html - The html to search.
     * @returns An array of all the found ids of cloudinary images.
     */
    async imgFinder (html) {
      const IMG_REGEX = /<img.*?src="(.*?)".*?>/gi
      const RETURN_ARR = []
      let finder
      while ((finder = IMG_REGEX.exec(html)) !== null) {
        if (finder.index === IMG_REGEX.lastIndex) {
          IMG_REGEX.lastIndex++
        }
        for (const [groupIndex, match] of finder.entries()) {
          if (groupIndex === 1) {
            if (match.includes('base64')) {
              await this.$axios.post(`${this.baseURL}/.netlify/functions/upload-image`, { file: match }).then((response) => {
                RETURN_ARR.push(response.data.url)
                this.cloudinaryImages.startingWith.push(response.data.url)
                this.cloudinaryImages.endingWith.push(response.data.url)
                this.description = this.description.replace(`${match}"`, `${response.data.url}" loading="lazy"`)
              })
            } else {
              RETURN_ARR.push(match)
            }
          } else if (match.includes('base64')) {
            const WRAPPED_REGEX = /<p>(<img.*?">).*?<\/p>/gi
            let wrappedFinder
            while ((wrappedFinder = WRAPPED_REGEX.exec(this.description)) !== null) {
              if (wrappedFinder.index === WRAPPED_REGEX.lastIndex) {
                WRAPPED_REGEX.lastIndex++
              }
              this.description = this.description.replace(wrappedFinder[0], wrappedFinder[1])
            }
          }
        }
      }
      return RETURN_ARR
    },
    async deleteOldImgs () {
      for (const img of this.cloudinaryImages.startingWith) {
        if (!this.cloudinaryImages.endingWith.includes(img)) {
          await this.$axios.post(`${this.baseURL}/.netlify/functions/delete-image`, { file: img })
        }
      }
    }
  }
}

</script>
