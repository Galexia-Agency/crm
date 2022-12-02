<template>
  <div class="board-container">
    <div class="board">
      <div class="lists-container">
        <Container
          lock-axis="x"
          orientation="horizontal"
          drag-handle-selector=".list-container:not(.archived) .list-drag-handle"
          @drop="onListDrop"
          @drag-start="$parent.$parent.dragging = true"
          @drag-end="$parent.$parent.dragging = false"
        >
          <template v-for="(list, listIndex) in lists">
            <Draggable v-show="list.archived !== true || ($parent.showArchived && list.archived)" :key="list.id">
              <section ref="list" class="list-container" :data-id="list.id" :class="{archived: list.archived}">
                <div v-if="$parent.project.admin.includes($parent.claims.email) || ($parent.project.contributor && $parent.project.contributor.includes($parent.claims.email))" class="list-header">
                  <font-awesome-icon :icon="['fa-solid', 'fa-grip']" class="list-drag-handle" />
                  <input class="list-title" :value="list.title" @blur="editList($event, list.id)">
                  <font-awesome-icon v-if="!list.archived" :icon="['fa-solid', 'fa-box-archive']" class="list-delete" @click="archiveList(list.id)" />
                  <template v-else>
                    <font-awesome-icon :icon="['fa-solid', 'fa-box-archive']" class="list-delete" @click="unarchiveList(list.id)" />
                    <font-awesome-icon v-if="$parent.project.admin.includes($parent.claims.email)" :icon="['fa-solid', 'fa-trash-can']" class="list-delete" @click="removeList(list.id)" />
                  </template>
                </div>
                <div v-else class="list-header">
                  <p class="list-title" v-text="list.title" />
                </div>
                <Container
                  v-if="$parent.project.admin.includes($parent.claims.email) || ($parent.project.contributor && $parent.project.contributor.includes($parent.claims.email))"
                  group-name="list"
                  drag-class="card-ghost"
                  drop-class="card-ghost-drop"
                  non-drag-area-selector=".icon, .archived"
                  :animation-duration="100"
                  @drag-start="vibrate(200), $parent.$parent.dragging = true"
                  @drag-end="vibrate(300), $parent.$parent.dragging = false"
                  @drop="e => onCardDrop(e, list, listIndex)"
                >
                  <Draggable v-for="item in list.items" :key="item.id + + item.title + item.description + item.date">
                    <Card
                      v-if="!item.archived || ($parent.showArchived && item.archived)"
                      :item="item"
                      :project="$parent.project"
                      @edit="editItem"
                      @archive="archiveItem"
                      @unarchive="unarchiveItem"
                      @remove="removeItem"
                    />
                  </Draggable>
                </Container>
                <template v-for="item in list.items" v-else>
                  <Card
                    v-if="!item.archived || ($parent.showArchived && item.archived)"
                    :key="item.id + + item.title + item.description + item.date"
                    :item="item"
                    :project="$parent.project"
                    @edit="editItem"
                  />
                </template>
                <div class="item-entry">
                  <UiItemEntry
                    v-if="$parent.project.admin.includes($parent.claims.email) || ($parent.project.contributor && $parent.project.contributor.includes($parent.claims.email))"
                    :list-id="list.id"
                    placeholder="Add an item"
                    icon="ellipsis-h"
                    @enter="onAddItem"
                  />
                </div>
              </section>
            </Draggable>
          </template>
        </Container>
        <div v-if="$parent.project.admin.includes($parent.claims.email) || ($parent.project.contributor && $parent.project.contributor.includes($parent.claims.email))" class="new-list">
          <UiItemEntry placeholder="Add a list" @enter="onAddList" />
        </div>
      </div>
    </div>
    <UiModal
      ref="modal"
      :active="modal"
      @close="hideModal"
    >
      <UiItemForm
        ref="form"
        @submit="onAddFullItem"
        @archive="archiveItem"
        @cancel="hideModal"
      />
    </UiModal>
    <UiConfirm ref="confirm" />
  </div>
</template>

<script>
import { Container, Draggable } from 'vue-smooth-dnd'

import { makeDropHandler } from '../utils/plugins'
import Card from './Card'
import UiItemForm from './ui/UiItemForm'
import UiItemEntry from './ui/UiItemEntry'
import UiConfirm from './ui/UiConfirm'

export default {
  components: {
    Container,
    Draggable,
    UiItemEntry,
    UiItemForm,
    Card,
    UiConfirm
  },
  props: {
    projectId: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      modal: false,
      activeListId: null
    }
  },
  computed: {
    lists () {
      return this.$store.getters.getProjectById(this.projectId).lists
    }
  },
  methods: {
    vibrate (num) {
      if ('vibrate' in navigator) {
        window.navigator.vibrate(num)
      }
    },
    async onAddList ({ text }) {
      await this.$store.dispatch('addList', { projectId: this.projectId, title: text })
      this.$nextTick(() => {
        const lists = this.$refs.list
        lists[lists.length - 1]
          .querySelector('.item-entry input:last-of-type')
          .focus()
      })
    },

    async editList (event, id) {
      await this.$store.dispatch('editList', { projectId: this.projectId, title: event.target.value, id })
    },

    async archiveList (listId) {
      if (await this.$refs.confirm.show('Are you sure you want to archive this list?')) {
        await this.$store.dispatch('archiveList', { projectId: this.projectId, listId })
        this.$forceUpdate()
      }
    },

    async unarchiveList (listId) {
      if (await this.$refs.confirm.show('Are you sure you want to unarchive this list?')) {
        await this.$store.dispatch('unarchiveList', { projectId: this.projectId, listId })
        this.$forceUpdate()
      }
    },

    async removeList (listId) {
      if (await this.$refs.confirm.show('Are you sure you want to delete this list?')) {
        await this.$store.dispatch('removeList', { projectId: this.projectId, listId })
        this.$forceUpdate()
      }
    },

    async onAddItem ({ id, text, more }) {
      if (more) {
        this.activeListId = id
        this.modal = true
        this.showModal({ title: text, description: '' })
        return
      }
      await this.$store.dispatch('addItem', { projectId: this.projectId, listId: id, title: text })
    },

    async onAddFullItem (item) {
      this.hideModal()
      if (item.id) {
        return await this.$store.dispatch('updateItem', { projectId: this.projectId, itemId: item.id, ...item })
      } else {
        return await this.$store.dispatch('addItem', { projectId: this.projectId, listId: this.activeListId, title: item.title, description: item.description, date: item.date, assignee: item.assignee })
      }
    },

    editItem (item) {
      this.showModal(item)
    },

    async archiveItem (item) {
      // Confirm the user wants to archive this item
      if (await this.$refs.confirm.show('Are you sure you want to archive this item?')) {
        // Update item first as we may have archived it from the modal
        await this.onAddFullItem(item)
        await this.$store.dispatch('archiveItem', { projectId: this.projectId, itemId: item.id })
        this.hideModal()
        this.$forceUpdate()
      } else {
        await this.onAddFullItem(item)
      }
    },

    async unarchiveItem (item) {
      if (await this.$refs.confirm.show('Are you sure you want to unarchive this item?')) {
        await this.$store.dispatch('unarchiveItem', { projectId: this.projectId, itemId: item.id })
        this.$forceUpdate()
      }
    },

    async removeItem (item) {
      if (await this.$refs.confirm.show('Are you sure you want to delete this item?')) {
        await this.$store.dispatch('removeItem', { projectId: this.projectId, itemId: item.id })
        this.$forceUpdate()
      }
    },

    onListDrop: makeDropHandler('onListDropComplete'),

    async onListDropComplete (src, trg) {
      await this.$store.dispatch('moveList', [this.projectId, src.index, trg.index])
    },

    onCardDrop: makeDropHandler('onCardDropComplete'),

    async onCardDropComplete (src, trg, element, payload) {
      this.$parent.$parent.dragging = false
      await this.$store.dispatch('moveItem', [
        this.projectId,
        src.params[1],
        src.index,
        trg.params[1],
        trg.index
      ])
    },

    showModal (item) {
      this.$parent.$parent.dragging = true
      this.modal = true
      this.$nextTick(() => {
        this.$refs.form.show(item)
      })
    },

    hideModal () {
      this.$parent.$parent.dragging = false
      this.modal = false
    },

    focusInput (listId) {
      const index = this.lists.findIndex(list => list.id === listId)
      if (index > -1) {
        this.$refs.list[index].querySelector('input').focus()
      }
    }
  }
}
</script>
