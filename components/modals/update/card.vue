<style scoped lang="scss">
  .card-modal-buttons-container.field.is-grouped {
    flex-direction: initial;
    justify-content: space-between;
    > div {
      display: flex;
      gap: .75rem
    }
  }
</style>

<template>
  <UiModal
    :active="active"
    @close="cancel"
  >
    <form class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <UiInput
          v-model="updatedCard.title"
          name="title"
          label="Title"
          :disabled="!(project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email)))"
          :autofocus="true"
          :required="true"
        />
        <UiEditor
          v-if="updatedCard.title"
          v-model="updatedCard.description"
          label="Description"
          :disabled="!(project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email)))"
          @editorUpdateShim="editorUpdateShim"
        />
        <UiInput
          v-model="updatedCard.date"
          name="date"
          type="date"
          label="Date"
          :disabled="!(project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email)))"
        />
        <UiInput
          v-model="updatedCard.assignee"
          name="assignee"
          type="text"
          label="Assignee"
          help="Email Address"
          :disabled="!(project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email)))"
        />
        <div v-if="updatedCard.id" class="field last-updated">
          Last updated by <strong>{{ updatedCard.updatedBy }}</strong> at <strong>{{ (new Date(updatedCard.updatedDate)).toLocaleTimeString("en-GB") }}</strong> on <strong>{{ (new Date(updatedCard.updatedDate)).toLocaleDateString("en-GB") }}</strong>
        </div>
        <div class="field is-grouped card-modal-buttons-container">
          <UiButton v-if="updatedCard.id" style-type="archive" @click="archive">
            Archive
          </UiButton>
          <div>
            <UiButton style-type="text" @click="cancel">
              Cancel
            </UiButton>
            <UiButton type="submit" style-type="primary" :disabled="!(project.admin.includes(userInfo.email) || (project.contributor && project.contributor.includes(userInfo.email)))">
              {{ updatedCard.id ? 'Update' : 'Add' }}
            </UiButton>
          </div>
        </div>
      </div>
    </form>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

const cardDefault = {
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
  assignee: 'joe@galexia.agency'
}

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    card: {
      type: Object,
      default () {
        return cardDefault
      }
    },
    project: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      updatedCard: { ...cardDefault, ...this.card },
      cloudinaryImages: {
        startingWith: [],
        endingWith: []
      }
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  watch: {
    // Watch when the modal is opened so we can update the admins
    'card.description': {
      handler (value) {
        if (value) {
          this.findImages()
        }
      },
      immediate: true
    }
  },
  methods: {
    editorUpdateShim (value) {
      this.updatedCard.description = value.getHTML()
    },
    async findImages () {
      // Search for images in the editor
      const FOUND_IMGS = await this.imgFinder(this.updatedCard.description)
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
      this.$emit('submit', { card: this.updatedCard })
    },
    cancel () {
      this.$emit('cancel')
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
            error.description = e
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
            error.description = e
            self.$store.commit('error', error)
          })
      }
      await Promise.all(imagesToDelete.map(deleteImage))
    }
  }
}

</script>
