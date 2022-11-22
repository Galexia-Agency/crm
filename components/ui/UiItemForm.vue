<style scoped lang="scss">
  .card-modal-buttons-container {
    justify-content: space-between;
    flex-direction: initial;
    > div {
      display: flex;
      gap: .75rem
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
        <ui-button v-if="id" style-type="archive" @click="archive">
          Archive
        </ui-button>
        <div>
          <ui-button style-type="text" @click="cancel">
            Cancel
          </ui-button>
          <ui-button type="submit" style-type="primary" :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))">
            {{ id ? 'Update' : 'Add' }}
          </ui-button>
        </div>
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
    async archive () {
      this.cloudinaryImages.endingWith = await this.imgFinder(this.description)
      await this.deleteOldImgs()
      this.cloudinaryImages = {
        startingWith: [],
        endingWith: []
      }
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
      const imagesToUpload = []
      let finder
      while ((finder = IMG_REGEX.exec(html)) !== null) {
        if (finder.index === IMG_REGEX.lastIndex) {
          IMG_REGEX.lastIndex++
        }
        for (const [groupIndex, match] of finder.entries()) {
          if (groupIndex === 1) {
            if (match.includes('base64')) {
              imagesToUpload.push(match)
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
      const self = this
      function uploadImage (image) {
        return self.$axios.post(location.origin + '/.netlify/functions/upload-image', { file: image })
          .then((response) => {
            RETURN_ARR.push(response.data.url)
            self.cloudinaryImages.startingWith.push(response.data.url)
            self.cloudinaryImages.endingWith.push(response.data.url)
            self.description = self.description.replace(`${image}"`, `${response.data.url}" loading="lazy"`)
          })
          .catch(function (e) {
            const error = {}
            error.description = e.message
            self.$store.commit('error', error)
          })
      }
      await Promise.all(imagesToUpload.map(uploadImage))
      return RETURN_ARR
    },
    async deleteOldImgs () {
      const imagesToDelete = []
      for (const image of this.cloudinaryImages.startingWith) {
        if (!this.cloudinaryImages.endingWith.includes(image)) {
          imagesToDelete.push(image)
        }
      }
      const self = this
      function deleteImage (image) {
        return self.$axios.post(location.origin + '/.netlify/functions/delete-image', { file: image })
          .catch(function (e) {
            const error = {}
            error.description = e.message
            self.$store.commit('error', error)
          })
      }
      await Promise.all(imagesToDelete.map(deleteImage))
    }
  }
}

</script>
