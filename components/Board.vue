<template>
  <div class="board-container">
    <div class="board">
      <div class="lists-container">
        <Container
          lock-axis="x"
          orientation="horizontal"
          drag-handle-selector=".list-drag-handle"
          @drop="onListDrop"
          @drag-start="$parent.$parent.dragging = true"
          @drag-end="$parent.$parent.dragging = false"
        >
          <template v-for="(list, listIndex) in lists">
            <Draggable v-show="list.archived !== true || ($parent.showArchived && list.archived)" :key="list.id">
              <section ref="list" class="list-container" :data-id="list.id" :class="{archived: list.archived}">
                <div class="list-header">
                  <span class="list-drag-handle">&#x2630;</span>
                  <input class="list-title" :value="list.title" @blur="editList($event, list.id)">
                  <span v-if="!list.archived" class="list-delete" @click="archiveList(list.id)">&#10006;</span>
                  <template v-else>
                    <i class="list-delete fas fa-edit" @click="unarchiveList(list.id)" />
                    <span class="list-delete" @click="removeList(list.id)">&#10006;</span>
                  </template>
                </div>
                <Container
                  group-name="list"
                  drag-class="card-ghost"
                  drop-class="card-ghost-drop"
                  non-drag-area-selector=".icon"
                  :animation-duration="100"
                  @drag-start="vibrate(200), $parent.$parent.dragging = true"
                  @drag-end="vibrate(300), $parent.$parent.dragging = false"
                  @drop="e => onCardDrop(e, list, listIndex)"
                >
                  <Draggable v-for="item in list.items" :key="item.id + + item.title + item.description + item.date">
                    <Card
                      v-if="!item.archived || ($parent.showArchived && item.archived)"
                      :item="item"
                      @edit="editItem"
                      @archive="archiveItem"
                      @unarchive="unarchiveItem"
                      @remove="removeItem"
                    />
                  </Draggable>
                </Container>
                <div class="item-entry">
                  <ui-item-entry
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
        <div class="new-list">
          <ui-item-entry placeholder="Add a list" @enter="onAddList" />
        </div>
      </div>
    </div>
    <ui-modal
      ref="modal"
      :active="modal"
      @close="hideModal"
    >
      <UiItemForm
        ref="form"
        @submit="onAddFullItem"
        @cancel="hideModal"
      />
    </ui-modal>
    <ui-confirm ref="confirm" />
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
      return this.$store.state.projects.find(project => project.id === this.projectId).lists
    }
  },
  methods: {
    vibrate (num) {
      if ('vibrate' in navigator) {
        window.navigator.vibrate(num)
      }
    },
    onAddList ({ text }) {
      this.$store.dispatch('addList', { projectId: this.projectId, title: text })
      this.$nextTick(() => {
        const lists = this.$refs.list
        lists[lists.length - 1]
          .querySelector('.item-entry input:last-of-type')
          .focus()
      })
    },

    editList (event, id) {
      this.$store.dispatch('editList', { projectId: this.projectId, title: event.target.value, id })
    },

    async archiveList (listId) {
      if (await this.$refs.confirm.show('Are you sure you want to archive this list?')) {
        this.$store.dispatch('archiveList', { projectId: this.projectId, listId })
        this.$forceUpdate()
      }
    },

    async unarchiveList (listId) {
      if (await this.$refs.confirm.show('Are you sure you want to unarchive this list?')) {
        this.$store.dispatch('unarchiveList', { projectId: this.projectId, listId })
        this.$forceUpdate()
      }
    },

    async removeList (listId) {
      if (await this.$refs.confirm.show('Are you sure you want to delete this list?')) {
        this.$store.dispatch('removeList', { projectId: this.projectId, listId })
        this.$forceUpdate()
      }
    },

    onAddItem ({ id, text, more }) {
      if (more) {
        this.activeListId = id
        this.modal = true
        this.showModal({ title: text, description: '' })
        return
      }
      this.addItem(id, text)
    },

    onAddFullItem (item) {
      this.hideModal()
      if (item.id) {
        this.$store.dispatch('updateItem', { projectId: this.projectId, itemId: item.id, ...item })
      } else {
        this.addItem(this.activeListId, item.title, item.description, item.date)
      }
    },

    addItem (listId, title, description, date) {
      this.$store.dispatch('addItem', { projectId: this.projectId, listId, title, description, date })
    },

    editItem (item) {
      this.showModal(item)
    },

    async archiveItem (item) {
      if (await this.$refs.confirm.show('Are you sure you want to archive this item?')) {
        this.$store.dispatch('archiveItem', { projectId: this.projectId, itemId: item.id })
        this.$forceUpdate()
      }
    },

    async unarchiveItem (item) {
      if (await this.$refs.confirm.show('Are you sure you want to unarchive this item?')) {
        this.$store.dispatch('unarchiveItem', { projectId: this.projectId, itemId: item.id })
        this.$forceUpdate()
      }
    },

    async removeItem (item) {
      if (await this.$refs.confirm.show('Are you sure you want to delete this item?')) {
        this.$store.dispatch('removeItem', { projectId: this.projectId, itemId: item.id })
        this.$forceUpdate()
      }
    },

    onListDrop: makeDropHandler('onListDropComplete'),

    onListDropComplete (src, trg) {
      this.$store.dispatch('moveList', [this.projectId, src.index, trg.index])
    },

    onCardDrop: makeDropHandler('onCardDropComplete'),

    onCardDropComplete (src, trg, element, payload) {
      this.$parent.$parent.dragging = false
      this.$store.dispatch('moveItem', [
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
